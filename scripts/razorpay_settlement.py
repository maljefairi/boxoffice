# -*- coding: utf-8 -*-

import requests
import csv
from decimal import Decimal
from baseframe import localize_timezone
from boxoffice import app
from boxoffice.models import OnlinePayment, LINE_ITEM_STATUS, LineItem, PaymentTransaction, TRANSACTION_TYPE
from boxoffice.extapi.razorpay import base_url, RAZORPAY_PAYMENT_STATUS


def line_item_is_cancelled(line_item):
    return line_item.status == LINE_ITEM_STATUS.CANCELLED


def order_net_amount(order):
    return order.get_amounts(LINE_ITEM_STATUS.CONFIRMED).final_amount

def format_row(row):
    fields = ['settlement_id', 'item_collection', 'order_id', 'payment_id', 'line_item_id', 'item_title', 'base_amount', 'discounted_amount', 'final_amount', 'transaction_date', 'payment_status', 'settled_at', 'razorpay_fees', 'order_amount', 'credit', 'debit', 'receivable_amount', 'settlement_amount', 'buyer_fullname']
    for field in fields:
        if not row.get(field):
            row[field] = '-'
    return row


def format_line_item(settlement_id, payment_id, line_item, payment_status):
    transaction_date = line_item.ordered_at if line_item.is_confirmed else line_item.cancelled_at
    return {
        'settlement_id': settlement_id,
        'order_id': line_item.order.id,
        'item_collection': line_item.item.item_collection.title,
        'payment_id': payment_id,
        'line_item_id': line_item.id,
        'item_title': line_item.item.title,
        'base_amount': line_item.base_amount,
        'discounted_amount': line_item.discounted_amount,
        'final_amount': line_item.final_amount,
        'payment_status': payment_status,
        'transaction_date': localize_timezone(transaction_date, 'Asia/Kolkata')
    }

def format_refund_transaction(settlement_id, payment_id, transaction, payment_status):
    transaction_date = transaction.created_at
    return {
        'settlement_id': settlement_id,
        'order_id': transaction.order.id,
        'item_collection': transaction.order.item_collection.title,
        'payment_id': payment_id,
        'item_title': transaction.refund_description,
        'final_amount': transaction.amount,
        'payment_status': payment_status,
        'transaction_date': localize_timezone(transaction_date, 'Asia/Kolkata')
    }


def get_settled_orders(date_ranges=[], filenames=[]):
    entity_dict = {}
    entities = []
    settlements_url = 'https://api.razorpay.com/v1/settlements/report/combined'

    if date_ranges:
        for date_range in date_ranges:
            settlement_resp = requests.get(settlements_url, params={'year': date_range['year'], 'month': date_range['month']}, auth=(app.config['RAZORPAY_KEY_ID'], app.config['RAZORPAY_KEY_SECRET']))
            entities = settlement_resp.json()
    elif filenames:
        for filename in filenames:
            with open(filename) as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    entities.append(row)

    for entity in [entity for entity in entities if entity is not None]:
        if not entity_dict.get(entity['entity_id']):
            entity_dict[entity['entity_id']] = entity

    settlement_ids = [entity['entity_id'] for entity in entity_dict.values() if entity['type'] == 'settlement']
    settled_orders = []
    for settlement_id in settlement_ids:
        settled_orders.append(format_row({
            'settlement_id': settlement_id,
            'settlement_amount': entity_dict[settlement_id]['amount'],
            'settled_at': entity_dict[settlement_id]['settled_at']
        }))
        settlement_payment_ids = [entity['entity_id'] for entity in entity_dict.values() if entity['type'] == 'payment' and entity['settlement_id'] == settlement_id]
        for settlement_payment_id in settlement_payment_ids:
            try:
                payment = OnlinePayment.query.filter(OnlinePayment.pg_paymentid == settlement_payment_id, OnlinePayment.pg_payment_status == RAZORPAY_PAYMENT_STATUS.CAPTURED).one()
                order = payment.order
                settled_orders.append(format_row({
                    'settlement_id': settlement_id,
                    'order_id': order.id,
                    'order_amount': order.get_amounts(LINE_ITEM_STATUS.CONFIRMED).final_amount,
                    'buyer_fullname': order.buyer_fullname,
                    'payment_id': payment.pg_paymentid,
                    'razorpay_fees': entity_dict[payment.pg_paymentid]['fee'],
                    'credit': Decimal(entity_dict[settlement_refund_id]['credit']),
                    'receivable_amount': order.get_amounts(LINE_ITEM_STATUS.CONFIRMED).final_amount - Decimal(entity_dict[payment.pg_paymentid]['fee'])
                }))

                for line_item in order.line_items:
                    settled_orders.append(format_row(format_line_item(settlement_id, settlement_payment_id, line_item, 'payment')))
                    # if line_item_is_cancelled(line_item):
                    #     settled_orders.append(format_row(format_line_item(settlement_id, settlement_payment_id, line_item, 'refund')))

            except Exception as error_msg:
                print error_msg
                pass

        settlement_refund_ids = [entity['entity_id'] for entity in entity_dict.values() if entity['type'] == 'refund' and entity['settlement_id'] == settlement_id]
        for settlement_refund_id in settlement_refund_ids:
            payment = OnlinePayment.query.filter(OnlinePayment.pg_paymentid == entity_dict[settlement_refund_id]['payment_id'], OnlinePayment.pg_payment_status == RAZORPAY_PAYMENT_STATUS.CAPTURED).one()
            order = payment.order
            settled_orders.append(format_row({
                'settlement_id': settlement_id,
                'order_id': order.id,
                'order_amount': order.get_amounts(LINE_ITEM_STATUS.CONFIRMED).final_amount,
                'buyer_fullname': order.buyer_fullname,
                'payment_id': payment.pg_paymentid,
                'razorpay_fees': Decimal('0'),
                'receivable_amount': Decimal('0') - Decimal(entity_dict[settlement_refund_id]['debit'])
            }))
            # HACK, fetching by amount in an order
            try:
                cancelled_line_item = LineItem.query.filter(LineItem.order == order, LineItem.final_amount == Decimal(entity_dict[settlement_refund_id]['debit']), LineItem.status == LINE_ITEM_STATUS.CANCELLED).first()
                settled_orders.append(format_row(format_line_item(settlement_id, settlement_payment_id, cancelled_line_item, 'refund')))
            except:
                cancelled_line_item = LineItem.query.filter(LineItem.order == order, LineItem.final_amount == Decimal(entity_dict[settlement_refund_id]['debit']), LineItem.status == LINE_ITEM_STATUS.CANCELLED).first()
                if cancelled_line_item:
                    settled_orders.append(format_row(format_line_item(settlement_id, settlement_payment_id, cancelled_line_item, 'refund')))
                else:
                    print "no line item found"
                    print payment.pg_paymentid

    return settled_orders


def write_settled_orders(filename, rows):
    with open(filename, 'w') as csvfile:
        fieldnames = ['settlement_id', 'item_collection', 'order_id', 'payment_id', 'line_item_id', 'item_title', 'base_amount', 'discounted_amount', 'final_amount', 'transaction_date', 'payment_status', 'settled_at', 'razorpay_fees', 'order_amount', 'receivable_amount', 'settlement_amount', 'buyer_fullname']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def get_settled_order_transactions(date_ranges=[], filenames=[]):
    entity_dict = {}
    entities = []
    settlements_url = 'https://api.razorpay.com/v1/settlements/report/combined'

    if date_ranges:
        for date_range in date_ranges:
            settlement_resp = requests.get(settlements_url, params={'year': date_range['year'], 'month': date_range['month']}, auth=(app.config['RAZORPAY_KEY_ID'], app.config['RAZORPAY_KEY_SECRET']))
            entities = settlement_resp.json()
    elif filenames:
        for filename in filenames:
            with open(filename) as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    entities.append(row)

    for entity in [entity for entity in entities if entity is not None]:
        if not entity_dict.get(entity['entity_id']):
            entity_dict[entity['entity_id']] = entity

    settlement_ids = [entity['entity_id'] for entity in entity_dict.values() if entity['type'] == 'settlement']
    settled_orders = []
    # line item ids already accounted for
    refunded_line_item_ids = []
    # transaction ids already accounted for
    refunded_transaction_ids = []
    for settlement_id in settlement_ids:
        settled_orders.append(format_row({
            'settlement_id': settlement_id,
            'settlement_amount': entity_dict[settlement_id]['amount'],
            'settled_at': entity_dict[settlement_id]['settled_at']
        }))
        settlement_payment_ids = [entity['entity_id'] for entity in entity_dict.values() if entity['type'] == 'payment' and entity['settlement_id'] == settlement_id]
        for settlement_payment_id in settlement_payment_ids:
            try:
                payment = OnlinePayment.query.filter(OnlinePayment.pg_paymentid == settlement_payment_id, OnlinePayment.pg_payment_status == RAZORPAY_PAYMENT_STATUS.CAPTURED).one()
                order = payment.order
                settled_orders.append(format_row({
                    'settlement_id': settlement_id,
                    'order_id': order.id,
                    'order_amount': order.get_amounts(LINE_ITEM_STATUS.CONFIRMED).final_amount,
                    'buyer_fullname': order.buyer_fullname,
                    'payment_id': payment.pg_paymentid,
                    'razorpay_fees': entity_dict[payment.pg_paymentid]['fee'],
                    'receivable_amount': order.get_amounts(LINE_ITEM_STATUS.CONFIRMED).final_amount - Decimal(entity_dict[payment.pg_paymentid]['fee'])
                }))

                for line_item in order.line_items:
                    settled_orders.append(format_row(format_line_item(settlement_id, settlement_payment_id, line_item, 'payment')))
                    # if line_item_is_cancelled(line_item):
                    #     settled_orders.append(format_row(format_line_item(settlement_id, settlement_payment_id, line_item, 'refund')))

            except Exception as error_msg:
                print error_msg
                pass

        settlement_refund_ids = [entity['entity_id'] for entity in entity_dict.values() if entity['type'] == 'refund' and entity['settlement_id'] == settlement_id]
        for settlement_refund_id in settlement_refund_ids:
            payment = OnlinePayment.query.filter(OnlinePayment.pg_paymentid == entity_dict[settlement_refund_id]['payment_id'], OnlinePayment.pg_payment_status == RAZORPAY_PAYMENT_STATUS.CAPTURED).one()
            order = payment.order
            settled_orders.append(format_row({
                'settlement_id': settlement_id,
                'order_id': order.id,
                'order_amount': order.get_amounts(LINE_ITEM_STATUS.CONFIRMED).final_amount,
                'buyer_fullname': order.buyer_fullname,
                'payment_id': payment.pg_paymentid,
                'razorpay_fees': Decimal('0'),
                'receivable_amount': Decimal('0') - Decimal(entity_dict[settlement_refund_id]['debit'])
            }))
            # HACK, fetching by amount in an order
            try:
                cancelled_line_item = LineItem.query.filter(~LineItem.id.in_(refunded_line_item_ids), LineItem.order == order, LineItem.final_amount == Decimal(entity_dict[settlement_refund_id]['debit']), LineItem.status == LINE_ITEM_STATUS.CANCELLED).first()
                settled_orders.append(format_row(format_line_item(settlement_id, settlement_payment_id, cancelled_line_item, 'refund')))
                refunded_line_item_ids.append(cancelled_line_item.id)
            except:
                cancelled_line_item = LineItem.query.filter(~LineItem.id.in_(refunded_line_item_ids), LineItem.order == order, LineItem.final_amount == Decimal(entity_dict[settlement_refund_id]['debit']), LineItem.status == LINE_ITEM_STATUS.CANCELLED).first()
                if cancelled_line_item:
                    settled_orders.append(format_row(format_line_item(settlement_id, settlement_payment_id, cancelled_line_item, 'refund')))
                    refunded_line_item_ids.append(cancelled_line_item.id)
                else:
                    refund_transaction = PaymentTransaction.query.filter(~PaymentTransaction.id.in_(refunded_transaction_ids), PaymentTransaction.online_payment == payment, PaymentTransaction.amount == Decimal(entity_dict[settlement_refund_id]['debit']), PaymentTransaction.transaction_type == TRANSACTION_TYPE.REFUND).first()
                    if refund_transaction:
                        settled_orders.append(format_row(format_refund_transaction(settlement_id, settlement_payment_id, refund_transaction, 'refund')))
                        refunded_transaction_ids.append(refund_transaction.id)

    return settled_orders



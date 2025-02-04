import datetime
import decimal
import json

from mock import MagicMock
import pytest

from boxoffice import app
from boxoffice.extapi import razorpay
from boxoffice.forms import OrderRefundForm
from boxoffice.models import (
    CURRENCY,
    LINE_ITEM_STATUS,
    ORDER_STATUS,
    DiscountCoupon,
    DiscountPolicy,
    Item,
    ItemCollection,
    LineItem,
    OnlinePayment,
    Order,
    PaymentTransaction,
)
from boxoffice.models.payment import TRANSACTION_TYPE
from boxoffice.views.custom_exceptions import PaymentGatewayError
from boxoffice.views.order import (
    process_line_item_cancellation,
    process_partial_refund_for_order,
)
from coaster.utils import buid


class MockResponse(object):
    def __init__(self, response_data, status_code=200):
        self.response_data = response_data
        self.status_code = status_code

    def json(self):
        return self.response_data


def test_basic(client, all_data):
    item = Item.query.filter_by(name='conference-ticket').first()
    data = {
        'line_items': [{'item_id': str(item.id), 'quantity': 2}],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
    }
    ic = ItemCollection.query.first()
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 201
    resp_data = json.loads(resp.data)['result']
    order = Order.query.get(resp_data.get('order_id'))
    assert order.status == ORDER_STATUS.PURCHASE_ORDER
    # 3500*2 = 7000
    assert resp_data['final_amount'] == 7000


def test_basic_with_utm_headers(client, all_data):
    item = Item.query.filter_by(name='conference-ticket').first()
    utm_campaign = 'campaign'
    utm_medium = 'medium'
    utm_source = 'source'
    utm_term = 'term'
    utm_content = 'content'
    utm_id = 'id'
    gclid = 'gclid'
    data = {
        'line_items': [{'item_id': str(item.id), 'quantity': 2}],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
        'order_session': {
            'utm_campaign': utm_campaign,
            'utm_medium': utm_medium,
            'utm_source': utm_source,
            'utm_term': utm_term,
            'utm_content': utm_content,
            'utm_id': utm_id,
            'gclid': gclid,
        },
    }
    ic = ItemCollection.query.first()
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 201
    resp_data = json.loads(resp.data)['result']
    order = Order.query.get(resp_data.get('order_id'))
    order_session = order.session
    assert order_session.utm_campaign == utm_campaign
    assert order_session.utm_medium == utm_medium
    assert order_session.utm_source == utm_source
    assert order_session.utm_term == utm_term
    assert order_session.utm_content == utm_content
    assert order_session.utm_id == utm_id
    assert order_session.gclid == gclid


def test_order_with_invalid_quantity(client, all_data):
    item = Item.query.filter_by(name='conference-ticket').first()
    data = {
        'line_items': [{'item_id': str(item.id), 'quantity': 1001}],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
    }
    ic = ItemCollection.query.first()
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 400


def test_simple_discounted_item(client, all_data):
    discounted_item = Item.query.filter_by(name='t-shirt').first()
    data = {
        'line_items': [{'item_id': str(discounted_item.id), 'quantity': 5}],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
    }
    ic = ItemCollection.query.first()
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 201
    resp_data = json.loads(resp.data)['result']
    assert resp_data['final_amount'] == 2375


def test_expired_item_order(client, all_data):
    expired_ticket = Item.query.filter_by(name='expired-ticket').first()
    quantity = 2
    data = {
        'line_items': [{'item_id': str(expired_ticket.id), 'quantity': quantity}],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
    }
    ic = ItemCollection.query.first()
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 400


def test_signed_discounted_coupon_order(client, all_data):
    first_item = Item.query.filter_by(name='conference-ticket').first()
    signed_policy = DiscountPolicy.query.filter_by(name='signed').first()
    signed_code = signed_policy.gen_signed_code()
    discounted_quantity = 1
    data = {
        'line_items': [
            {'item_id': str(first_item.id), 'quantity': discounted_quantity}
        ],
        'discount_coupons': [signed_code],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
    }
    ic = ItemCollection.query.first()
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 201
    resp_data = json.loads(resp.data)['result']
    assert resp_data['final_amount'] == first_item.current_price().amount - (
        signed_policy.percentage * first_item.current_price().amount
    ) / decimal.Decimal(100.0)
    line_item = LineItem.query.filter_by(
        customer_order_id=resp_data['order_id']
    ).first()
    assert line_item.discount_coupon.code == signed_code


def test_complex_discounted_item(client, all_data):
    discounted_item1 = Item.query.filter_by(name='t-shirt').first()
    discounted_item2 = Item.query.filter_by(name='conference-ticket').first()
    data = {
        'line_items': [
            {'item_id': str(discounted_item1.id), 'quantity': 5},
            {'item_id': str(discounted_item2.id), 'quantity': 10},
        ],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
    }
    ic = ItemCollection.query.first()
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 201
    # 10*3500@90% + 5*500*@95 = 33875
    resp_data = json.loads(resp.data)['result']
    assert resp_data['final_amount'] == 33875


def test_discounted_complex_order(client, all_data):
    conf = Item.query.filter_by(name='conference-ticket').first()
    tshirt = Item.query.filter_by(name='t-shirt').first()
    conf_price = conf.current_price().amount
    tshirt_price = tshirt.current_price().amount
    conf_quantity = 12
    tshirt_quantity = 5
    coupon2 = DiscountCoupon.query.filter_by(code='coupon2').first()
    coupon3 = DiscountCoupon.query.filter_by(code='coupon3').first()
    data = {
        'line_items': [
            {'item_id': str(tshirt.id), 'quantity': tshirt_quantity},
            {'item_id': str(conf.id), 'quantity': conf_quantity},
        ],
        'discount_coupons': [coupon2.code, coupon3.code],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
    }
    ic = ItemCollection.query.first()
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 201
    resp_json = json.loads(resp.data)['result']
    order = Order.query.get(resp_json.get('order_id'))
    tshirt_policy = DiscountPolicy.query.filter_by(
        title='5% discount on 5 t-shirts'
    ).first()
    tshirt_final_amount = (tshirt_price * tshirt_quantity) - (
        tshirt_quantity
        * (tshirt_policy.percentage * tshirt_price)
        / decimal.Decimal(100)
    )
    conf_policy = DiscountPolicy.query.filter_by(
        title='10% discount on rootconf'
    ).first()
    conf_final_amount = (conf_price * (conf_quantity - 2)) - (
        (conf_quantity - 2)
        * (conf_policy.percentage * conf_price)
        / decimal.Decimal(100)
    )
    assert (
        tshirt_final_amount + conf_final_amount
        == order.get_amounts(LINE_ITEM_STATUS.PURCHASE_ORDER).final_amount
    )


def make_free_order(client):
    item = Item.query.filter_by(name='conference-ticket').first()
    data = {
        'line_items': [{'item_id': str(item.id), 'quantity': 1}],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
        'discount_coupons': ['coupon2'],
    }
    ic = ItemCollection.query.first()
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    return resp


def test_free_order(client, all_data):
    resp = make_free_order(client)
    assert resp.status_code == 201
    resp_json = json.loads(resp.data)['result']
    order = Order.query.get(resp_json.get('order_id'))
    assert order.status == ORDER_STATUS.PURCHASE_ORDER
    assert order.line_items[0].status == LINE_ITEM_STATUS.PURCHASE_ORDER
    assert resp_json['final_amount'] == 0
    resp = client.post(
        '/order/{order_id}/free'.format(order_id=order.id),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 201
    coupon = DiscountCoupon.query.filter_by(code='coupon2').first()
    assert coupon.used_count == 1
    assert order.status == ORDER_STATUS.SALES_ORDER
    assert order.line_items[0].status == LINE_ITEM_STATUS.CONFIRMED


def test_cancel_line_item_in_order(db_session, client, all_data, post_env):
    original_quantity = 2
    order_item = Item.query.filter_by(name='t-shirt').first()
    total_amount = order_item.current_price().amount * original_quantity
    data = {
        'line_items': [{'item_id': str(order_item.id), 'quantity': original_quantity}],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
    }
    ic = ItemCollection.query.first()
    # make a purchase order
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 201
    resp_json = json.loads(resp.data)['result']
    assert resp_json['final_amount'] == total_amount

    order = Order.query.get(resp_json['order_id'])
    # Create fake payment and transaction objects
    online_payment = OnlinePayment(pg_paymentid='pg_testpayment', order=order)
    online_payment.confirm()
    order_amounts = order.get_amounts(LINE_ITEM_STATUS.PURCHASE_ORDER)
    transaction = PaymentTransaction(
        order=order,
        online_payment=online_payment,
        amount=order_amounts.final_amount,
        currency=CURRENCY.INR,
    )
    db_session.add(transaction)
    order.confirm_sale()
    db_session.commit()

    refund_amount = total_amount - 1
    razorpay.refund_payment = MagicMock(
        return_value=MockResponse(response_data={'id': buid()})
    )
    pre_refund_transactions_count = order.refund_transactions.count()
    formdata = {
        'amount': refund_amount,
        'internal_note': 'internal reference',
        'refund_description': 'receipt description',
        'note_to_user': 'price has been halved',
    }
    refund_form = OrderRefundForm(data=formdata, parent=order, meta={'csrf': False})
    partial_refund_args = {
        'order': order,
        'form': refund_form,
        'request_method': 'POST',
    }
    with app.request_context(post_env):
        process_partial_refund_for_order(partial_refund_args)
    assert pre_refund_transactions_count + 1 == order.refund_transactions.count()

    first_line_item = order.line_items[0]
    # Mock Razorpay's API
    razorpay.refund_payment = MagicMock(
        return_value=MockResponse(response_data={'id': buid()})
    )
    process_line_item_cancellation(first_line_item)
    assert first_line_item.status == LINE_ITEM_STATUS.CANCELLED
    expected_refund_amount = total_amount - refund_amount
    refund_transaction1 = (
        PaymentTransaction.query.filter_by(
            order=order, transaction_type=TRANSACTION_TYPE.REFUND
        )
        .order_by(PaymentTransaction.created_at.desc())
        .first()
    )
    assert refund_transaction1.amount == expected_refund_amount


def test_cancel_line_item_in_bulk_order(db_session, client, all_data, post_env):
    original_quantity = 5
    discounted_item = Item.query.filter_by(name='t-shirt').first()
    total_amount = discounted_item.current_price().amount * original_quantity
    data = {
        'line_items': [
            {'item_id': str(discounted_item.id), 'quantity': original_quantity}
        ],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
    }
    ic = ItemCollection.query.first()
    # make a purchase order
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 201
    resp_json = json.loads(resp.data)['result']
    assert resp_json['final_amount'] == (
        total_amount - 5 * total_amount / decimal.Decimal(100)
    )

    order = Order.query.get(resp_json['order_id'])
    # Create fake payment and transaction objects
    online_payment = OnlinePayment(pg_paymentid='pg_testpayment', order=order)
    online_payment.confirm()
    order_amounts = order.get_amounts(LINE_ITEM_STATUS.PURCHASE_ORDER)
    transaction = PaymentTransaction(
        order=order,
        online_payment=online_payment,
        amount=order_amounts.final_amount,
        currency=CURRENCY.INR,
    )
    db_session.add(transaction)
    order.confirm_sale()
    db_session.commit()

    first_line_item = order.line_items[0]
    to_be_void_line_items = order.line_items[1:]
    precancellation_order_amount = order.net_amount
    # Mock Razorpay's API
    razorpay.refund_payment = MagicMock(
        return_value=MockResponse(response_data={'id': buid()})
    )
    process_line_item_cancellation(first_line_item)
    assert first_line_item.status == LINE_ITEM_STATUS.CANCELLED
    for void_line_item in to_be_void_line_items:
        assert void_line_item.status == LINE_ITEM_STATUS.VOID
    expected_refund_amount = (
        precancellation_order_amount
        - order.get_amounts(LINE_ITEM_STATUS.CONFIRMED).final_amount
    )
    refund_transaction1 = PaymentTransaction.query.filter_by(
        order=order, transaction_type=TRANSACTION_TYPE.REFUND
    ).first()
    assert refund_transaction1.amount == expected_refund_amount

    second_line_item = order.confirmed_line_items[0]
    razorpay.refund_payment = MagicMock(
        return_value=MockResponse(response_data={'id': buid()})
    )
    process_line_item_cancellation(second_line_item)
    assert second_line_item.status == LINE_ITEM_STATUS.CANCELLED
    refund_transaction2 = (
        PaymentTransaction.query.filter_by(
            order=order, transaction_type=TRANSACTION_TYPE.REFUND
        )
        .order_by(PaymentTransaction.created_at.desc())
        .first()
    )
    assert refund_transaction2.amount == second_line_item.final_amount

    # test failed cancellation
    third_line_item = order.confirmed_line_items[0]
    razorpay.refund_payment = MagicMock(
        return_value=MockResponse(
            response_data={
                'error': {
                    'code': 'BAD_REQUEST_ERROR',
                    'description': "The amount is invalid",
                    'field': 'amount',
                }
            },
            status_code=400,
        )
    )
    with pytest.raises(PaymentGatewayError):
        process_line_item_cancellation(third_line_item)

    # refund the remaining amount paid, and attempt to cancel a line item
    # this should cancel the line item without resulting in a new refund transaction
    refund_amount = order.net_amount
    refund_dict = {
        'id': buid(),
        'amount': refund_amount,
        'internal_note': 'internal reference',
        'note_to_user': 'you get a refund!',
    }
    razorpay.refund_payment = MagicMock(
        return_value=MockResponse(response_data=refund_dict)
    )

    formdata = {
        'amount': refund_amount,
        'internal_note': 'internal reference',
        'refund_description': 'receipt description',
        'note_to_user': 'price has been halved',
    }
    refund_form = OrderRefundForm(data=formdata, parent=order, meta={'csrf': False})
    partial_refund_args = {
        'order': order,
        'form': refund_form,
        'request_method': 'POST',
    }
    with app.request_context(post_env):
        process_partial_refund_for_order(partial_refund_args)

    third_line_item = order.confirmed_line_items[0]
    pre_cancellation_transactions_count = order.refund_transactions.count()
    cancelled_refund_amount = process_line_item_cancellation(third_line_item)
    assert cancelled_refund_amount == decimal.Decimal(0)
    assert pre_cancellation_transactions_count == order.refund_transactions.count()

    # test free line item cancellation
    free_order_resp = make_free_order(client)
    free_order_resp_data = json.loads(free_order_resp.data)['result']
    free_order = Order.query.get(free_order_resp_data.get('order_id'))
    free_line_item = free_order.line_items[0]
    process_line_item_cancellation(free_line_item)
    assert free_line_item.status == LINE_ITEM_STATUS.CANCELLED
    assert free_order.transactions.count() == 0


def test_partial_refund_in_order(db_session, client, all_data, post_env):
    original_quantity = 5
    discounted_item = Item.query.filter_by(name='t-shirt').first()
    total_amount = discounted_item.current_price().amount * original_quantity
    data = {
        'line_items': [
            {'item_id': str(discounted_item.id), 'quantity': original_quantity}
        ],
        'buyer': {
            'fullname': 'Testing',
            'phone': '9814141414',
            'email': 'test@hasgeek.com',
        },
    }
    ic = ItemCollection.query.first()
    # make a purchase order
    resp = client.post(
        '/ic/{ic}/order'.format(ic=ic.id),
        data=json.dumps(data),
        content_type='application/json',
        headers=[
            ('X-Requested-With', 'XMLHttpRequest'),
            ('Origin', app.config['BASE_URL']),
        ],
    )
    assert resp.status_code == 201
    resp_data = json.loads(resp.data)['result']
    assert resp_data['final_amount'] == (
        total_amount - 5 * total_amount / decimal.Decimal(100)
    )

    order = Order.query.get(resp_data['order_id'])
    # Create fake payment and transaction objects
    online_payment = OnlinePayment(pg_paymentid='pg_testpayment', order=order)
    online_payment.confirm()
    order_amounts = order.get_amounts(LINE_ITEM_STATUS.PURCHASE_ORDER)
    transaction = PaymentTransaction(
        order=order,
        online_payment=online_payment,
        amount=order_amounts.final_amount,
        currency=CURRENCY.INR,
    )
    db_session.add(transaction)
    order.confirm_sale()
    db_session.commit()

    # Mock Razorpay's API
    razorpay.refund_payment = MagicMock(
        return_value=MockResponse(response_data={'id': buid()})
    )
    valid_refund_amount = 500

    formdata = {
        'amount': valid_refund_amount,
        'internal_note': 'internal reference',
        'note_to_user': 'you get a refund!',
        'refund_description': 'test refund',
    }
    refund_form = OrderRefundForm(data=formdata, parent=order, meta={'csrf': False})
    partial_refund_args = {
        'order': order,
        'form': refund_form,
        'request_method': 'POST',
    }
    with app.request_context(post_env):
        process_partial_refund_for_order(partial_refund_args)

    refund_transactions = order.transactions.filter_by(
        transaction_type=TRANSACTION_TYPE.REFUND
    ).all()
    assert isinstance(refund_transactions[0].refunded_at, datetime.datetime)
    assert refund_transactions[0].amount == decimal.Decimal(valid_refund_amount)
    assert refund_transactions[0].internal_note == formdata['internal_note']
    assert str(refund_transactions[0].note_to_user) == formdata['note_to_user']
    assert refund_transactions[0].refund_description == formdata['refund_description']

    invalid_refund_amount = 100000000
    formdata = {
        'amount': invalid_refund_amount,
    }
    refund_form = OrderRefundForm(data=formdata, parent=order, meta={'csrf': False})
    partial_refund_args = {
        'order': order,
        'form': refund_form,
        'request_method': 'POST',
    }
    with app.request_context(post_env):
        resp = process_partial_refund_for_order(partial_refund_args)

    assert resp.status_code == 403
    refund_transactions = order.transactions.filter_by(
        transaction_type=TRANSACTION_TYPE.REFUND
    ).all()
    assert refund_transactions[0].amount == decimal.Decimal(valid_refund_amount)

    resp = make_free_order(client)
    assert resp.status_code == 201
    resp_data = json.loads(resp.data)['result']
    order = Order.query.get(resp_data.get('order_id'))
    invalid_refund_amount = 100000000

    formdata = {
        'amount': invalid_refund_amount,
    }
    refund_form = OrderRefundForm(data=formdata, parent=order, meta={'csrf': False})
    partial_refund_args = {
        'order': order,
        'form': refund_form,
        'request_method': 'POST',
    }
    with app.request_context(post_env):
        refund_resp = process_partial_refund_for_order(partial_refund_args)

    assert refund_resp.status_code == 403

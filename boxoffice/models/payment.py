from __future__ import annotations

from collections import OrderedDict
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from isoweek import Week
from sqlalchemy.sql import func

from coaster.utils import isoweek_datetime

from . import (
    BaseMixin,
    Mapped,
    MarkdownColumn,
    Model,
    db,
    relationship,
    sa,
    timestamptz,
)
from .enums import (
    ORDER_STATUS,
    RAZORPAY_PAYMENT_STATUS,
    TRANSACTION_METHOD,
    TRANSACTION_TYPE,
)

__all__ = ['OnlinePayment', 'PaymentTransaction']


class OnlinePayment(BaseMixin, Model):
    """Represents payments made through a payment gateway. Supports Razorpay only."""

    __tablename__ = 'online_payment'
    __uuid_primary_key__ = True
    customer_order_id: Mapped[UUID] = sa.orm.mapped_column(
        sa.ForeignKey('customer_order.id')
    )
    order: Mapped[Order] = relationship(back_populates='online_payments')

    # Payment id issued by the payment gateway
    pg_paymentid: Mapped[str] = sa.orm.mapped_column(sa.Unicode(80), unique=True)
    # Payment status issued by the payment gateway
    pg_payment_status: Mapped[int]
    confirmed_at: Mapped[Optional[timestamptz]]
    failed_at: Mapped[Optional[timestamptz]]
    transactions: Mapped[List[PaymentTransaction]] = relationship(
        cascade='all, delete-orphan', back_populates='online_payment'
    )

    def confirm(self) -> None:
        """Confirm a payment, sets confirmed_at and pg_payment_status."""
        self.confirmed_at = func.utcnow()
        self.pg_payment_status = RAZORPAY_PAYMENT_STATUS.CAPTURED

    def fail(self) -> None:
        """Fails a payment, sets failed_at."""
        self.pg_payment_status = RAZORPAY_PAYMENT_STATUS.FAILED
        self.failed_at = func.utcnow()


class PaymentTransaction(BaseMixin, Model):
    """
    Models transactions made by a customer.

    A transaction can be one of type 'Payment', 'Refund', 'Credit'.
    """

    __tablename__ = 'payment_transaction'
    __uuid_primary_key__ = True

    customer_order_id: Mapped[UUID] = sa.orm.mapped_column(
        sa.ForeignKey('customer_order.id')
    )
    order: Mapped[Order] = relationship(back_populates='transactions')
    online_payment_id: Mapped[Optional[UUID]] = sa.orm.mapped_column(
        sa.ForeignKey('online_payment.id')
    )
    online_payment: Mapped[Optional[OnlinePayment]] = relationship(
        back_populates='transactions'
    )
    amount: Mapped[Decimal]
    currency: Mapped[str] = sa.orm.mapped_column(sa.Unicode(3))
    transaction_type: Mapped[int] = sa.orm.mapped_column(
        default=TRANSACTION_TYPE.PAYMENT
    )
    transaction_method: Mapped[int] = sa.orm.mapped_column(
        default=TRANSACTION_METHOD.ONLINE
    )
    # Eg: reference number for a bank transfer
    transaction_ref: Mapped[Optional[str]] = sa.orm.mapped_column(sa.Unicode(80))
    refunded_at: Mapped[Optional[timestamptz]]
    internal_note: Mapped[Optional[str]] = sa.orm.mapped_column(sa.Unicode(250))
    refund_description: Mapped[Optional[str]] = sa.orm.mapped_column(sa.Unicode(250))
    note_to_user = MarkdownColumn('note_to_user', nullable=True)
    # Refund id issued by the payment gateway
    pg_refundid: Mapped[Optional[str]] = sa.orm.mapped_column(
        sa.Unicode(80), unique=True
    )


def calculate_weekly_refunds(menu_ids, user_tz, year):
    """Calculate refunds per week of the year for given menu_ids."""
    ordered_week_refunds = OrderedDict()
    for year_week in Week.weeks_of_year(year):
        ordered_week_refunds[year_week.week] = 0
    start_at = isoweek_datetime(year, 1, user_tz)
    end_at = isoweek_datetime(year + 1, 1, user_tz)

    week_refunds = db.session.execute(
        sa.select(
            sa.func.extract(
                'WEEK',
                sa.func.timezone(
                    user_tz, sa.func.timezone('UTC', PaymentTransaction.created_at)
                ),
            ).label('sales_week'),
            sa.func.sum(PaymentTransaction.amount).label('sum'),
        )
        .select_from(PaymentTransaction, Order)
        .where(
            PaymentTransaction.customer_order_id == Order.id,
            Order.status.in_(tuple(ORDER_STATUS.TRANSACTION)),
            Order.menu_id.in_(menu_ids),
            PaymentTransaction.transaction_type == TRANSACTION_TYPE.REFUND,
            sa.func.timezone(
                user_tz, sa.func.timezone('UTC', PaymentTransaction.created_at)
            )
            >= start_at,
            sa.func.timezone(
                user_tz, sa.func.timezone('UTC', PaymentTransaction.created_at)
            )
            < end_at,
        )
        .group_by('sales_week')
        .order_by('sales_week')
    ).all()

    for week_refund in week_refunds:
        ordered_week_refunds[int(week_refund.sales_week)] = week_refund.sum

    return ordered_week_refunds


if TYPE_CHECKING:
    from .order import Order

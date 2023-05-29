from __future__ import annotations

from uuid import UUID

from baseframe import _, __
from coaster.utils import LabeledEnum, utcnow

from . import BaseMixin, Mapped, Model, UuidMixin, db, relationship, sa
from .user import Organization, get_fiscal_year
from .utils import HeadersAndDataTuple

__all__ = ['Invoice', 'INVOICE_STATUS']


class INVOICE_STATUS(LabeledEnum):  # noqa: N801
    DRAFT = (0, __("Draft"))
    FINAL = (1, __("Final"))


def gen_invoice_no(organization, jurisdiction, invoice_dt):
    """Generate a sequential invoice number for the organization and financial year."""
    fy_start_at, fy_end_at = get_fiscal_year(jurisdiction, invoice_dt)
    return (
        sa.select(sa.func.coalesce(sa.func.max(Invoice.invoice_no + 1), 1))
        .where(Invoice.organization == organization)
        .where(Invoice.invoiced_at >= fy_start_at)
        .where(Invoice.invoiced_at < fy_end_at)
        .scalar_subquery()
    )


class Invoice(UuidMixin, BaseMixin, Model):  # type: ignore[name-defined]
    __tablename__ = 'invoice'
    __uuid_primary_key__ = True
    __table_args__ = (
        sa.UniqueConstraint(
            'organization_id', 'fy_start_at', 'fy_end_at', 'invoice_no'
        ),
    )

    status = sa.Column(sa.SmallInteger, default=INVOICE_STATUS.DRAFT, nullable=False)
    invoicee_name = sa.Column(sa.Unicode(255), nullable=True)
    invoicee_company = sa.Column(sa.Unicode(255), nullable=True)
    invoicee_email = sa.Column(sa.Unicode(254), nullable=True)
    invoice_no = sa.Column(sa.Integer(), nullable=True)
    fy_start_at = sa.Column(sa.TIMESTAMP(timezone=True), nullable=False)
    fy_end_at = sa.Column(sa.TIMESTAMP(timezone=True), nullable=False)
    invoiced_at = sa.Column(sa.TIMESTAMP(timezone=True), nullable=True)
    street_address_1 = sa.Column(sa.Unicode(255), nullable=True)
    street_address_2 = sa.Column(sa.Unicode(255), nullable=True)
    city = sa.Column(sa.Unicode(255), nullable=True)
    state = sa.Column(sa.Unicode(255), nullable=True)
    # ISO 3166-2 code. Eg: KA for Karnataka
    state_code = sa.Column(sa.Unicode(3), nullable=True)
    # ISO country code
    country_code = sa.Column(sa.Unicode(2), nullable=True)
    postcode = sa.Column(sa.Unicode(8), nullable=True)
    # GSTIN in the case of India
    buyer_taxid = sa.Column(sa.Unicode(255), nullable=True)
    seller_taxid = sa.Column(sa.Unicode(255), nullable=True)

    customer_order_id: Mapped[UUID] = sa.orm.mapped_column(
        None, sa.ForeignKey('customer_order.id'), nullable=False, index=True
    )
    order = relationship(
        'Order', backref=sa.orm.backref('invoices', cascade='all, delete-orphan')
    )

    # An invoice may be associated with a different organization as compared to its
    # order to allow for the following use case. An invoice may be issued by a parent
    # entity, while the order is booked through the child entity.
    organization_id: Mapped[int] = sa.orm.mapped_column(
        sa.ForeignKey('organization.id'), nullable=False
    )
    organization = relationship(
        'Organization',
        backref=sa.orm.backref(
            'invoices', cascade='all, delete-orphan', lazy='dynamic'
        ),
    )

    __roles__ = {
        'invoicer': {
            'read': {
                'status',
                'invoicee_company',
                'invoicee_email',
                'invoice_no',
                'invoiced_at',
                'street_address_1',
                'street_address_2',
                'city',
                'state',
                'country_code',
                'postcode',
                'buyer_taxid',
                'seller_taxid',
            }
        }
    }

    def roles_for(self, actor=None, anchors=()):
        roles = super().roles_for(actor, anchors)
        if self.organization.userid in actor.organizations_owned_ids():
            roles.add('invoicer')
        return roles

    def __init__(self, *args, **kwargs):
        organization = kwargs.get('organization')
        country_code = kwargs.get('country_code')
        if not country_code:
            # Default to India
            country_code = 'IN'
        if not organization:
            raise ValueError("Invoice MUST be initialized with an organization")
        self.invoiced_at = utcnow()
        self.fy_start_at, self.fy_end_at = get_fiscal_year(
            country_code, self.invoiced_at
        )
        self.invoice_no = gen_invoice_no(organization, country_code, self.invoiced_at)
        super().__init__(*args, **kwargs)

    @property
    def is_final(self):
        return self.status == INVOICE_STATUS.FINAL

    @sa.orm.validates(
        'invoicee_name',
        'invoicee_company',
        'invoicee_email',
        'invoice_no',
        'invoiced_at',
        'street_address_1',
        'street_address_2',
        'city',
        'state',
        'state_code',
        'country_code',
        'postcode',
        'buyer_taxid',
        'seller_taxid',
        'customer_order_id',
        'organization_id',
    )
    def validate_immutable_final_invoice(self, key, val):
        if self.status == INVOICE_STATUS.FINAL:
            raise ValueError(
                _("`{attr}` cannot be modified in a finalized invoice").format(attr=key)
            )
        return val


def fetch_invoices(self):
    """Return invoices for an organization as a tuple of (row_headers, rows)."""
    headers = [
        "order_id",
        "receipt_no",
        "invoice_no",
        "status",
        "buyer_taxid",
        "seller_taxid",
        "invoicee_name",
        "invoicee_company",
        "invoicee_email",
        "street_address_1",
        "street_address_2",
        "city",
        "state",
        "state_code",
        "country_code",
        "postcode",
        "invoiced_at",
    ]
    invoices_query = (
        sa.select(
            Order.id,
            Order.invoice_no,
            Invoice.invoice_no,
            Invoice.status,
            Invoice.buyer_taxid,
            Invoice.seller_taxid,
            Invoice.invoicee_name,
            Invoice.invoicee_company,
            Invoice.invoicee_email,
            Invoice.street_address_1,
            Invoice.street_address_2,
            Invoice.city,
            Invoice.state,
            Invoice.state_code,
            Invoice.country_code,
            Invoice.postcode,
            Invoice.invoiced_at,
        )
        .where(Invoice.organization == self)
        .select_from(Invoice)
        .join(Order)
        .order_by(Invoice.invoice_no)
    )
    return HeadersAndDataTuple(headers, db.session.execute(invoices_query).fetchall())


Organization.fetch_invoices = fetch_invoices

# Tail imports
from .order import Order  # isort:skip

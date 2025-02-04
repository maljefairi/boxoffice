import secrets
import string

from sqlalchemy.orm.exc import MultipleResultsFound
import sqlalchemy as sa

from itsdangerous import BadSignature, Signer
from werkzeug.utils import cached_property

from baseframe import __
from coaster.sqlalchemy import cached
from coaster.utils import LabeledEnum, buid, uuid1mc

from . import BaseScopedNameMixin, IdMixin, db
from .user import Organization

__all__ = ['DiscountPolicy', 'DiscountCoupon', 'item_discount_policy', 'DISCOUNT_TYPE']


class DISCOUNT_TYPE(LabeledEnum):  # NOQA: N801
    AUTOMATIC = (0, __("Automatic"))
    COUPON = (1, __("Coupon"))


item_discount_policy = sa.Table(
    'item_discount_policy',
    db.Model.metadata,
    db.Column('item_id', None, db.ForeignKey('item.id'), primary_key=True),
    db.Column(
        'discount_policy_id',
        None,
        db.ForeignKey('discount_policy.id'),
        primary_key=True,
    ),
    db.Column(
        'created_at',
        db.TIMESTAMP(timezone=True),
        default=db.func.utcnow(),
        nullable=False,
    ),
)


class DiscountPolicy(BaseScopedNameMixin, db.Model):
    """
    Consists of the discount rules applicable on items.

    `title` has a GIN index to enable trigram matching.
    """

    __tablename__ = 'discount_policy'
    __uuid_primary_key__ = True
    __table_args__ = (
        db.UniqueConstraint('organization_id', 'name'),
        db.UniqueConstraint('organization_id', 'discount_code_base'),
        db.CheckConstraint(
            'percentage > 0 and percentage <= 100', 'discount_policy_percentage_check'
        ),
        db.CheckConstraint(
            'discount_type = 0 or (discount_type = 1 and bulk_coupon_usage_limit IS NOT NULL)',
            'discount_policy_bulk_coupon_usage_limit_check',
        ),
    )

    organization_id = db.Column(None, db.ForeignKey('organization.id'), nullable=False)
    organization = db.relationship(
        Organization,
        backref=db.backref(
            'discount_policies',
            order_by='DiscountPolicy.created_at.desc()',
            lazy='dynamic',
            cascade='all, delete-orphan',
        ),
    )
    parent = db.synonym('organization')

    discount_type = db.Column(
        db.Integer, default=DISCOUNT_TYPE.AUTOMATIC, nullable=False
    )

    # Minimum number of a particular item that needs to be bought for this discount to apply
    item_quantity_min = db.Column(db.Integer, default=1, nullable=False)
    percentage = db.Column(db.Integer, nullable=True)
    # price-based discount
    is_price_based = db.Column(db.Boolean, default=False, nullable=False)

    discount_code_base = db.Column(db.Unicode(20), nullable=True)
    secret = db.Column(db.Unicode(50), nullable=True)

    # Coupons generated in bulk are not stored in the database during generation.
    # This field allows specifying the number of times a coupon, generated in bulk, can be used
    # This is particularly useful for generating referral discount coupons. For instance, one could generate
    # a signed coupon and provide it to a user such that the user can share the coupon `n` times
    # `n` here is essentially bulk_coupon_usage_limit.
    bulk_coupon_usage_limit = db.Column(db.Integer, nullable=True, default=1)

    __roles__ = {
        'dp_owner': {
            'read': {
                'id',
                'name',
                'title',
                'is_automatic',
                'is_coupon',
                'item_quantity_min',
                'percentage',
                'is_price_based',
                'discount_code_base',
                'bulk_coupon_usage_limit',
                'line_items_count',
            }
        }
    }

    def roles_for(self, actor=None, anchors=()):
        roles = super().roles_for(actor, anchors)
        if self.organization.userid in actor.organizations_owned_ids():
            roles.add('dp_owner')
        return roles

    def __init__(self, *args, **kwargs):
        self.secret = kwargs.get('secret') if kwargs.get('secret') else buid()
        super().__init__(*args, **kwargs)

    @cached_property
    def is_automatic(self):
        return self.discount_type == DISCOUNT_TYPE.AUTOMATIC

    @cached_property
    def is_coupon(self):
        return self.discount_type == DISCOUNT_TYPE.COUPON

    def gen_signed_code(self, identifier=None):
        """
        Generate a signed code.

        Format: ``discount_code_base.randint.signature``
        """
        if not identifier:
            identifier = buid()
        signer = Signer(self.secret)
        key = f'{self.discount_code_base}.{identifier}'
        return signer.sign(key).decode('utf-8')

    @staticmethod
    def is_signed_code_format(code):
        """Check if the code is in the {x.y.z} format."""
        return len(code.split('.')) == 3 if code else False

    @classmethod
    def get_from_signed_code(cls, code, organization_id):
        """Return a discount policy given a valid signed code, None otherwise."""
        if not cls.is_signed_code_format(code):
            return None
        discount_code_base = code.split('.')[0]
        policy = cls.query.filter_by(
            discount_code_base=discount_code_base, organization_id=organization_id
        ).one_or_none()
        if not policy:
            return None
        signer = Signer(policy.secret)
        try:
            signer.unsign(code)
            return policy
        except BadSignature:
            return None

    @classmethod
    def make_bulk(cls, discount_code_base, **kwargs):
        """Return a discount policy for bulk discount coupons."""
        return cls(
            discount_type=DISCOUNT_TYPE.COUPON,
            discount_code_base=discount_code_base,
            secret=buid(),
            **kwargs,
        )

    @classmethod
    def get_from_item(cls, item, qty, coupon_codes=[]):
        """
        Return a list of (discount_policy, discount_coupon) tuples.

        Applicable for an item, given the quantity of line items and coupons if any.
        """
        automatic_discounts = item.discount_policies.filter(
            cls.discount_type == DISCOUNT_TYPE.AUTOMATIC, cls.item_quantity_min <= qty
        ).all()
        policies = [(discount, None) for discount in automatic_discounts]
        if not coupon_codes:
            return policies
        else:
            coupon_policies = item.discount_policies.filter(
                cls.discount_type == DISCOUNT_TYPE.COUPON
            ).all()
            coupon_policy_ids = [cp.id for cp in coupon_policies]
            for coupon_code in coupon_codes:
                coupons = []
                if cls.is_signed_code_format(coupon_code):
                    policy = cls.get_from_signed_code(
                        coupon_code, item.item_collection.organization_id
                    )
                    if policy and policy.id in coupon_policy_ids:
                        coupon = DiscountCoupon.query.filter_by(
                            discount_policy=policy, code=coupon_code
                        ).one_or_none()
                        if not coupon:
                            coupon = DiscountCoupon(
                                discount_policy=policy,
                                code=coupon_code,
                                usage_limit=policy.bulk_coupon_usage_limit,
                                used_count=0,
                            )
                            db.session.add(coupon)
                        coupons.append(coupon)
                else:
                    coupons = DiscountCoupon.query.filter(
                        DiscountCoupon.discount_policy_id.in_(coupon_policy_ids),
                        DiscountCoupon.code == coupon_code,
                    ).all()

                for coupon in coupons:
                    if coupon.usage_limit > coupon.used_count:
                        policies.append((coupon.discount_policy, coupon))
        return policies

    @property
    def line_items_count(self):
        return self.line_items.filter(
            LineItem.status == LINE_ITEM_STATUS.CONFIRMED
        ).count()

    @classmethod
    def is_valid_access_coupon(cls, item, code_list):
        """
        Check if any of code_list is a valid access code for the specified item.

        A supplied coupon code can be either a signed coupon code or a custom code.
        Both cases are checked for. Used signed coupon codes are stored and rejected for
        reuse.
        """
        for code in code_list:
            if cls.is_signed_code_format(code):
                policy = cls.get_from_signed_code(
                    code, item.item_collection.organization_id
                )
                if policy and not DiscountCoupon.is_signed_code_usable(policy, code):
                    break
            else:
                try:
                    policy = (
                        cls.query.join(
                            DiscountCoupon,
                            DiscountCoupon.discount_policy_id == DiscountPolicy.id,
                        )
                        .filter(
                            DiscountCoupon.code == code,
                            DiscountCoupon.used_count < DiscountCoupon.usage_limit,
                        )
                        .one_or_none()
                    )
                except MultipleResultsFound:
                    # ref: https://github.com/hasgeek/boxoffice/issues/290
                    policy = None
            if bool(policy) and policy in item.discount_policies:
                return True
        return False


@sa.event.listens_for(DiscountPolicy, 'before_update')
@sa.event.listens_for(DiscountPolicy, 'before_insert')
def validate_price_based_discount(mapper, connection, target):
    if target.is_price_based and len(target.items) > 1:
        raise ValueError("Price-based discounts MUST have only one associated item")


def generate_coupon_code(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(secrets.choice(chars) for _ in range(size))


class DiscountCoupon(IdMixin, db.Model):
    __tablename__ = 'discount_coupon'
    __uuid_primary_key__ = True
    __table_args__ = (db.UniqueConstraint('discount_policy_id', 'code'),)

    def __init__(self, *args, **kwargs):
        self.id = uuid1mc()
        super().__init__(*args, **kwargs)

    code = db.Column(db.Unicode(100), nullable=False, default=generate_coupon_code)
    usage_limit = db.Column(db.Integer, nullable=False, default=1)

    used_count = cached(db.Column(db.Integer, nullable=False, default=0))

    discount_policy_id = db.Column(
        None, db.ForeignKey('discount_policy.id'), nullable=False
    )
    discount_policy = db.relationship(
        DiscountPolicy,
        backref=db.backref('discount_coupons', cascade='all, delete-orphan'),
    )

    @classmethod
    def is_signed_code_usable(cls, policy, code):
        obj = cls.query.filter(
            cls.discount_policy == policy,
            cls.code == code,
            cls.used_count == cls.usage_limit,
        ).one_or_none()
        if obj:
            return False
        return True

    def update_used_count(self):
        self.used_count = (
            db.select(db.func.count())
            .where(LineItem.discount_coupon == self)
            .where(LineItem.status == LINE_ITEM_STATUS.CONFIRMED)
            .as_scalar()
        )


create_title_trgm_trigger = sa.DDL(
    '''
    CREATE INDEX idx_discount_policy_title_trgm on discount_policy USING gin (title gin_trgm_ops);
    '''
)

sa.event.listen(
    DiscountPolicy.__table__,
    'after_create',
    create_title_trgm_trigger.execute_if(dialect='postgresql'),
)

# Tail imports
from .line_item import LINE_ITEM_STATUS, LineItem  # isort:skip

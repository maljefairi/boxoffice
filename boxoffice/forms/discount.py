from baseframe import __
from coaster.utils import getbool
import baseframe.forms as forms

from ..models import (
    CURRENCY,
    DISCOUNT_TYPE,
    DiscountCoupon,
    DiscountPolicy,
    Item,
    ItemCollection,
    db,
)

__all__ = [
    'DiscountPolicyForm',
    'PriceBasedDiscountPolicyForm',
    'DiscountPriceForm',
    'DiscountCouponForm',
    'AutomaticDiscountPolicyForm',
    'CouponBasedDiscountPolicyForm',
]


class DiscountPolicyForm(forms.Form):
    title = forms.StringField(
        __("Discount title"),
        validators=[
            forms.validators.DataRequired(__("Please specify a discount title")),
            forms.validators.Length(max=250),
        ],
        filters=[forms.filters.strip()],
    )
    discount_type = forms.RadioField(
        __("Discount type"),
        choices=list(DISCOUNT_TYPE.items()),
        coerce=int,
        default=DISCOUNT_TYPE.COUPON,
    )
    is_price_based = forms.RadioField(
        __("Price based discount"),
        coerce=getbool,
        default=1,
        choices=[
            (1, __("Special price discount")),
            (0, __("Percentage based discount")),
        ],
    )


class AutomaticDiscountPolicyForm(DiscountPolicyForm):
    item_quantity_min = forms.IntegerField(__("Minimum number of tickets"), default=1)
    percentage = forms.IntegerField(
        __("Percentage"),
        validators=[
            forms.validators.DataRequired(__("Please specify a discount percentage"))
        ],
    )
    items = forms.QuerySelectMultipleField(
        __("Items"),
        get_label='title',
        validators=[
            forms.validators.DataRequired(
                __(
                    "Please select at least one item for which the discount is applicable"
                )
            )
        ],
    )

    def set_queries(self):
        self.items.query = (
            Item.query.join(
                ItemCollection, Item.item_collection_id == ItemCollection.id
            )
            .filter(ItemCollection.organization == self.edit_parent)
            .options(db.load_only(Item.id, Item.title))
        )


class CouponBasedDiscountPolicyForm(DiscountPolicyForm):
    items = forms.QuerySelectMultipleField(
        __("Items"),
        get_label='title',
        validators=[
            forms.validators.DataRequired(
                __(
                    "Please select at least one item for which the discount is applicable"
                )
            )
        ],
    )
    percentage = forms.IntegerField(
        __("Percentage"),
        validators=[
            forms.validators.DataRequired(__("Please specify a discount percentage")),
            forms.validators.NumberRange(
                min=1,
                max=100,
                message=__("Percentage should be between >= 1 and <= 100"),
            ),
        ],
    )
    discount_code_base = forms.StringField(
        __("Discount title"),
        validators=[
            forms.validators.DataRequired(__("Please specify a discount code base")),
            forms.validators.Length(max=20),
            forms.AvailableAttr(
                'discount_code_base',
                message='This discount code base is already in use. Please pick a different code base.',
            ),
        ],
        filters=[forms.filters.strip(), forms.filters.none_if_empty()],
    )
    bulk_coupon_usage_limit = forms.IntegerField(
        __("Bulk coupon usage limit"), default=1
    )

    def set_queries(self):
        self.items.query = (
            Item.query.join(
                ItemCollection, Item.item_collection_id == ItemCollection.id
            )
            .filter(ItemCollection.organization == self.edit_parent)
            .options(db.load_only(Item.id, Item.title))
        )


class PriceBasedDiscountPolicyForm(DiscountPolicyForm):
    discount_code_base = forms.StringField(
        __("Discount prefix"),
        validators=[
            forms.validators.DataRequired(__("Please specify a discount code base")),
            forms.validators.Length(max=20),
            forms.AvailableAttr(
                'discount_code_base',
                message='This discount code base is already in use. Please pick a different code base.',
            ),
        ],
        filters=[forms.filters.strip(), forms.filters.none_if_empty()],
    )


class DiscountPriceForm(forms.Form):
    title = forms.StringField(
        __("Discount price title"),
        validators=[
            forms.validators.DataRequired(
                __("Please specify a title for the discount price")
            ),
            forms.validators.Length(max=250),
        ],
        filters=[forms.filters.strip()],
    )
    amount = forms.IntegerField(
        __("Amount"),
        validators=[forms.validators.DataRequired(__("Please specify an amount"))],
    )
    currency = forms.RadioField(
        __("Currency"),
        validators=[forms.validators.DataRequired(__("Please select the currency"))],
        choices=list(CURRENCY.items()),
        default=CURRENCY.INR,
    )
    start_at = forms.DateTimeField(
        __("Price start date"),
        validators=[
            forms.validators.DataRequired(__("Please specify a start date and time"))
        ],
        naive=False,
    )
    end_at = forms.DateTimeField(
        __("Price end date"),
        validators=[
            forms.validators.DataRequired(__("Please specify an end date and time")),
            forms.validators.GreaterThan(
                'start_at',
                __(
                    "Please specify an end date for the price that is greater than the start date"
                ),
            ),
        ],
        naive=False,
    )
    item = forms.QuerySelectField(
        __("Item"),
        get_label='title',
        validators=[
            forms.validators.DataRequired(
                __("Please select a item for which the discount is to be applied")
            )
        ],
    )

    def set_queries(self):
        self.item.query = (
            Item.query.join(
                ItemCollection, Item.item_collection_id == ItemCollection.id
            )
            .filter(ItemCollection.organization == self.edit_parent.organization)
            .options(db.load_only(Item.id, Item.title))
        )


def validate_unique_discount_coupon_code(form, field):
    if (
        DiscountCoupon.query.join(
            DiscountPolicy, DiscountCoupon.discount_policy_id == DiscountPolicy.id
        )
        .filter(
            DiscountPolicy.organization == form.edit_parent.organization,
            DiscountCoupon.code == field.data,
        )
        .notempty()
    ):
        raise forms.StopValidation(
            __(
                "This discount coupon code already exists. Please enter a different coupon code"
            )
        )


class DiscountCouponForm(forms.Form):
    count = forms.IntegerField(__("Number of coupons to be generated"), default=1)
    usage_limit = forms.IntegerField(
        __("Number of times each coupon can be used"), default=1
    )
    code = forms.StringField(
        __("Discount coupon code"),
        validators=[
            forms.validators.Optional(),
            forms.validators.Length(max=100),
            validate_unique_discount_coupon_code,
        ],
        filters=[forms.filters.strip(), forms.filters.none_if_empty()],
    )

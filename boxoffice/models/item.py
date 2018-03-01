# -*- coding: utf-8 -*-

from flask import url_for
from datetime import datetime
from decimal import Decimal
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.orderinglist import ordering_list
from sqlalchemy.sql import func
from baseframe import __, localize_timezone
from coaster.utils import LabeledEnum
from . import db, JsonDict, BaseScopedNameMixin, MarkdownColumn
from . import ItemCollection, Category
from .discount_policy import item_discount_policy

__all__ = ['Item', 'Price']


class GST_TYPE(LabeledEnum):
    GOOD = (0, __("Good"))
    SERVICE = (1, __("Service"))


class Item(BaseScopedNameMixin, db.Model):
    __tablename__ = 'item'
    __uuid_primary_key__ = True
    __table_args__ = (db.UniqueConstraint('item_collection_id', 'name'),)

    description = MarkdownColumn('description', default=u'', nullable=False)
    seq = db.Column(db.Integer, nullable=False)

    item_collection_id = db.Column(None, db.ForeignKey('item_collection.id'), nullable=False)
    item_collection = db.relationship(ItemCollection,
        backref=db.backref('items', cascade='all, delete-orphan', order_by=seq,
            collection_class=ordering_list('seq', count_from=1)))

    parent = db.synonym('item_collection')

    category_id = db.Column(None, db.ForeignKey('category.id'), nullable=False)
    category = db.relationship(Category, backref=db.backref('items', cascade='all, delete-orphan'))

    quantity_total = db.Column(db.Integer, default=0, nullable=False)

    discount_policies = db.relationship('DiscountPolicy', secondary=item_discount_policy, lazy='dynamic')

    assignee_details = db.Column(JsonDict, default={}, nullable=False)

    cancellable_until = db.Column(db.DateTime, nullable=True)

    __roles__ = {
        'item_owner': {
            'write': {},
            'read': {'id', 'title', 'url_for_view', 'description_html', 'quantity_total', 'quantity_available', 'active_price',
                    'sold', 'free', 'cancelled', 'net_sales'}
        }
    }

    def roles_for(self, actor=None, anchors=()):
        roles = super(Item, self).roles_for(actor, anchors)
        if self.item_collection.organization.userid in actor.organizations_owned_ids():
            roles.add('item_owner')
        return roles

    def current_price(self):
        """
        Returns the current price object for an item
        """
        return self.price_at(datetime.utcnow())

    def has_higher_price(self, current_price):
        """
        Checks if item has a higher price than the given current price
        """
        return Price.query.filter(Price.end_at > current_price.end_at,
            Price.item == self, Price.discount_policy == None).notempty()

    def discounted_price(self, discount_policy):
        """Return the discounted price for an item."""
        return Price.query.filter(Price.item == self, Price.discount_policy == discount_policy).one_or_none()

    def price_at(self, timestamp):
        """Return the price object for an item at a given time."""
        return Price.query.filter(Price.item == self, Price.start_at <= timestamp,
            Price.end_at > timestamp, Price.discount_policy == None).order_by('created_at desc').first()  # NOQA

    @classmethod
    def get_by_category(cls, category):
        return cls.query.filter(Item.category == category).order_by('seq')

    @hybrid_property
    def quantity_available(self):
        return self.quantity_total - self.get_confirmed_line_items.count()

    @property
    def is_available(self):
        """Check if an item has a current price object and has a positive quantity_available"""
        return bool(self.current_price() and self.quantity_available > 0)

    def is_cancellable(self):
        return datetime.utcnow() < self.cancellable_until if self.cancellable_until else True

    def url_for(self, action='view', _external=False, **kwargs):
        if action == 'view':
            return url_for('admin_item', item_id=self.id, _external=_external, **kwargs)

    @property
    def url_for_view(self):
        return self.url_for('view')

    @property
    def active_price(self):
        return self.current_price().amount if self.current_price() else None

    @property
    def get_confirmed_line_items(self):
        """Returns a SQLAlchemy query object preset with an item's confirmed line items"""
        from ..models import LineItem, LINE_ITEM_STATUS

        return LineItem.query.filter(LineItem.item == self, LineItem.status == LINE_ITEM_STATUS.CONFIRMED)

    @property
    def sold(self):
        from ..models import LineItem, LINE_ITEM_STATUS

        return LineItem.query.filter(LineItem.item == self, LineItem.final_amount > 0, LineItem.status == LINE_ITEM_STATUS.CONFIRMED).count()

    @property
    def free(self):
        from ..models import LineItem, LINE_ITEM_STATUS

        return LineItem.query.filter(LineItem.item == self, LineItem.final_amount == 0, LineItem.status == LINE_ITEM_STATUS.CONFIRMED).count()

    @property
    def cancelled(self):
        from ..models import LineItem, LINE_ITEM_STATUS

        return LineItem.query.filter(LineItem.item == self, LineItem.status == LINE_ITEM_STATUS.CANCELLED).count()

    @property
    def net_sales(self):
        from ..models import LineItem, LINE_ITEM_STATUS

        return db.session.query(func.sum(LineItem.final_amount)).filter(LineItem.item == self,
            LineItem.status == LINE_ITEM_STATUS.CONFIRMED).first()[0]

    @classmethod
    def get_availability(cls, item_ids):
        """Returns a dict -> {'item_id': ('item title', 'quantity_total', 'line_item_count')}"""
        from ..models import LineItem, LINE_ITEM_STATUS

        items_dict = {}
        item_tups = db.session.query(cls.id, cls.title, cls.quantity_total, func.count(cls.id)).join(LineItem).filter(
            LineItem.item_id.in_(item_ids), LineItem.status == LINE_ITEM_STATUS.CONFIRMED).group_by(cls.id).all()
        for item_tup in item_tups:
            items_dict[unicode(item_tup[0])] = item_tup[1:]
        return items_dict

    def demand_curve(self):
        query = db.session.query('final_amount', 'count').from_statement(db.text('''
            SELECT final_amount, count(*)
            FROM line_item
            WHERE item_id = :item_id
            AND final_amount > 0
            GROUP BY final_amount
            ORDER BY final_amount;
        ''')).params(item_id=self.id)
        return db.session.execute(query).fetchall()


class Price(BaseScopedNameMixin, db.Model):
    __tablename__ = 'price'
    __uuid_primary_key__ = True
    __table_args__ = (db.UniqueConstraint('item_id', 'name'),
        db.CheckConstraint('start_at < end_at', 'price_start_at_lt_end_at_check'),
        db.UniqueConstraint('item_id', 'discount_policy_id'))

    item_id = db.Column(None, db.ForeignKey('item.id'), nullable=False)
    item = db.relationship(Item, backref=db.backref('prices', cascade='all, delete-orphan'))

    discount_policy_id = db.Column(None, db.ForeignKey('discount_policy.id'), nullable=True)
    discount_policy = db.relationship('DiscountPolicy', backref=db.backref('price', cascade='all, delete-orphan'))

    parent = db.synonym('item')
    start_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    end_at = db.Column(db.DateTime, nullable=False)

    amount = db.Column(db.Numeric, default=Decimal(0), nullable=False)
    currency = db.Column(db.Unicode(3), nullable=False, default=u'INR')

    __roles__ = {
        'price_owner': {
            'write': {},
            'read': {'id', 'item_id', 'json_start_at', 'json_end_at', 'amount', 'currency', 'discount_policy_title', 'tense'}
        }
    }

    def roles_for(self, actor=None, anchors=()):
        roles = super(Price, self).roles_for(actor, anchors)
        if self.item.item_collection.organization.userid in actor.organizations_owned_ids():
            roles.add('price_owner')
        return roles

    @property
    def discount_policy_title(self):
        return self.discount_policy.title if self.discount_policy else None

    @property
    def json_start_at(self):
        return localize_timezone(self.start_at).isoformat()

    @property
    def json_end_at(self):
        return localize_timezone(self.end_at).isoformat()

    @property
    def tense(self):
        now = datetime.utcnow()
        if self.end_at < now:
            return u"past"
        elif self.start_at > now:
            return u"upcoming"
        else:
            return u"current"

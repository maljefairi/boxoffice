# -*- coding: utf-8 -*-

from pytz import timezone
from flask import Flask
from flask.ext.rq import RQ
from flask.ext.mail import Mail
from flask.ext.lastuser import Lastuser
from flask.ext.lastuser.sqlalchemy import UserManager
from flask_admin import Admin
from flask.json import JSONEncoder as BaseEncoder
from speaklater import _LazyString
import wtforms_json
from baseframe import baseframe, assets, Version
from ._version import __version__
import coaster.app


app = Flask(__name__, instance_relative_config=True)
lastuser = Lastuser()

mail = Mail()

# --- Assets ------------------------------------------------------------------

version = Version(__version__)
assets['boxoffice.css'][version] = 'css/app.css'
assets['boxoffice.js'][version] = 'js/scripts.js'


from . import extapi, views  # NOQA
from boxoffice.models import db, User, Item, Price, DiscountPolicy, DiscountCoupon, ItemCollection, Organization, Category  # noqa
from siteadmin import ItemCollectionModelView, ItemModelView, PriceModelView, DiscountPolicyModelView, DiscountCouponModelView, OrganizationModelView, CategoryModelView  # noqa


class JSONEncoder(BaseEncoder):
    def default(self, obj):
        if isinstance(obj, _LazyString):
            return str(obj)
        return BaseEncoder.default(self, obj)


# Configure the app
def init_for(env):
    coaster.app.init_app(app, env)
    db.init_app(app)
    db.app = app
    app.json_encoder = JSONEncoder

    RQ(app)

    lastuser.init_app(app)
    lastuser.init_usermanager(UserManager(db, User))
    app.config['tz'] = timezone(app.config['TIMEZONE'])
    baseframe.init_app(app, requires=['boxoffice'], ext_requires=['baseframe-bs3', 'fontawesome>=4.0.0', 'ractive', 'ractive-transitions-fly', 'validate', 'nprogress', 'baseframe-footable'])

    mail.init_app(app)
    wtforms_json.init()

    # This is a temporary solution for an admin interface, only
    # to be used until the native admin interface is ready.
    try:
        admin = Admin(app, name=u"Boxoffice Admin", template_mode='bootstrap3', url='/siteadmin')
        admin.add_view(OrganizationModelView(Organization, db.session))
        admin.add_view(ItemCollectionModelView(ItemCollection, db.session))
        admin.add_view(CategoryModelView(Category, db.session))
        admin.add_view(ItemModelView(Item, db.session))
        admin.add_view(PriceModelView(Price, db.session))
        admin.add_view(DiscountPolicyModelView(DiscountPolicy, db.session))
        admin.add_view(DiscountCouponModelView(DiscountCoupon, db.session))
    except AssertionError:
        pass

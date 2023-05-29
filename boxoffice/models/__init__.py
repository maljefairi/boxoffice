# flake8: noqa

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import DeclarativeBase, Mapped
import sqlalchemy as sa

from sqlalchemy_json import mutable_json_type
from typing_extensions import Annotated, TypeAlias

from coaster.sqlalchemy import (
    BaseMixin,
    BaseNameMixin,
    BaseScopedIdMixin,
    BaseScopedIdNameMixin,
    BaseScopedNameMixin,
    IdMixin,
    MarkdownColumn,
    ModelBase,
    Query,
    TimestampMixin,
    UuidMixin,
    backref,
    relationship,
)


class Model(ModelBase, DeclarativeBase):
    """Base for all models."""

    __with_timezone__ = True


jsonb: TypeAlias = Annotated[
    dict,
    sa.orm.mapped_column(
        # FIXME: mutable_json_type assumes `dict|list`, not just `dict`
        mutable_json_type(
            dbtype=sa.JSON().with_variant(postgresql.JSONB, 'postgresql'), nested=True
        )
    ),
]
jsonb_dict: TypeAlias = Annotated[
    dict,
    sa.orm.mapped_column(
        # FIXME: mutable_json_type assumes `dict|list`, not just `dict`
        mutable_json_type(
            dbtype=sa.JSON().with_variant(postgresql.JSONB, 'postgresql'), nested=True
        ),
        nullable=False,
        server_default=sa.text("'{}'::jsonb"),
    ),
]


TimestampMixin.__with_timezone__ = True
db = SQLAlchemy(metadata=Model.metadata, query_class=Query)  # type: ignore[arg-type]
Model.init_flask_sqlalchemy(db)

from .category import *  # isort:skip
from .discount_policy import *  # isort:skip
from .invoice import *  # isort:skip
from .item import *  # isort:skip
from .item_collection import *  # isort:skip
from .line_item import *  # isort:skip
from .line_item_discounter import *  # isort:skip
from .order import *  # isort:skip
from .payment import *  # isort:skip
from .user import *  # isort:skip
from .utils import *  # isort:skip

"""simplify_discounts

Revision ID: 32abb3608d9a
Revises: 4f3fe36e0880
Create Date: 2016-04-04 15:44:09.872938

"""

# revision identifiers, used by Alembic.
revision = '32abb3608d9a'
down_revision = '4f3fe36e0880'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql import table, column


def upgrade():
    discount_coupon = table('discount_coupon',
        column('quantity_available', sa.Integer()),
        column('used', sa.Boolean()))

    op.drop_constraint('discount_policy_item_quantity_check', 'discount_policy')
    op.drop_constraint('discount_coupon_quantity_check', 'discount_coupon')
    op.drop_column('discount_coupon', 'used_at')
    op.execute(discount_coupon.update().where(discount_coupon.c.quantity_available == 0).values({'used': True}))
    op.execute(discount_coupon.update().where(discount_coupon.c.quantity_available == 1).values({'used': False}))
    op.drop_column('discount_coupon', 'quantity_available')
    op.drop_column('discount_coupon', 'quantity_total')
    op.drop_column('discount_policy', 'item_quantity_max')


def downgrade():
    op.add_column('discount_policy', sa.Column('item_quantity_max', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('discount_coupon', sa.Column('quantity_total', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('discount_coupon', sa.Column('quantity_available', sa.INTEGER(), autoincrement=False, nullable=False))
    op.create_check_constraint('discount_coupon_quantity_check', 'discount_coupon', u'quantity_available <= quantity_total')
    op.create_check_constraint('discount_policy_item_quantity_check', 'discount_policy', u'item_quantity_min <= item_quantity_max')

"""add join_code to accounts and status to memberships

Revision ID: a1b2c3d4e5f6
Revises: 5f860f8285ca
Create Date: 2025-08-21 21:20:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '5f860f8285ca'
branch_labels = None
depends_on = None


def upgrade():
    # create membership_status enum type
    membership_status = sa.Enum('pending', 'active', 'denied', name='membership_status')
    membership_status.create(op.get_bind(), checkfirst=True)

    # add join_code to accounts
    op.add_column('accounts', sa.Column('join_code', sa.String(length=6), nullable=True))
    op.create_unique_constraint('uq_accounts_join_code', 'accounts', ['join_code'])

    # add status to memberships with default 'active'
    op.add_column('memberships', sa.Column('status', sa.Enum('pending', 'active', 'denied', name='membership_status'), nullable=False, server_default='active'))


def downgrade():
    op.drop_column('memberships', 'status')
    op.drop_constraint('uq_accounts_join_code', 'accounts', type_='unique')
    op.drop_column('accounts', 'join_code')
    membership_status = sa.Enum(name='membership_status')
    membership_status.drop(op.get_bind(), checkfirst=True)

"""follow table and relationships

Revision ID: 41857d48073d
Revises: ae0db9aa8a4a
Create Date: 2024-06-16 11:44:28.787420

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '41857d48073d'
down_revision = 'ae0db9aa8a4a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('follows', schema=None) as batch_op:
        batch_op.add_column(sa.Column('following_user_id', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('follower_user_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(batch_op.f('fk_follows_following_user_id_users'), 'users', ['following_user_id'], ['id'])
        batch_op.create_foreign_key(batch_op.f('fk_follows_follower_user_id_users'), 'users', ['follower_user_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('follows', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_follows_follower_user_id_users'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_follows_following_user_id_users'), type_='foreignkey')
        batch_op.drop_column('follower_user_id')
        batch_op.drop_column('following_user_id')

    # ### end Alembic commands ###

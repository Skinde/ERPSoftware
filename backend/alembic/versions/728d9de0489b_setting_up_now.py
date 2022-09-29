"""setting up now

Revision ID: 728d9de0489b
Revises: 2b2ab7bfe71a
Create Date: 2022-09-29 17:26:29.814208

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '728d9de0489b'
down_revision = '2b2ab7bfe71a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('elemento', sa.Column('sede', sa.Float(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('elemento', 'sede')
    # ### end Alembic commands ###

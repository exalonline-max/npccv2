from .app import app
from .extensions import db
from .models.user import User
from .models.account import Account
from .models.membership import Membership


def run():
    with app.app_context():
        # ensure tables exist
        db.create_all()

        # create users first
        dm = User.query.filter_by(email='dm@npx.test').first()
        if not dm:
            dm = User(email='dm@npx.test', display_name='DM Test')
            dm.set_password('Password123!')
            db.session.add(dm)

        player = User.query.filter_by(email='player@npx.test').first()
        if not player:
            player = User(email='player@npx.test', display_name='Player Test')
            player.set_password('Password123!')
            db.session.add(player)

        db.session.commit()

        # create account
        acc = Account.query.filter_by(slug='admintest1').first()
        if not acc:
            acc = Account(slug='admintest1', display_name='Admin Test 1')
            db.session.add(acc)
            db.session.commit()

        # create memberships
        if not Membership.query.filter_by(user_id=dm.id, account_id=acc.id).first():
            db.session.add(Membership(user_id=dm.id, account_id=acc.id, role='DM'))
        if not Membership.query.filter_by(user_id=player.id, account_id=acc.id).first():
            db.session.add(Membership(user_id=player.id, account_id=acc.id, role='Player'))

        db.session.commit()


if __name__ == '__main__':
    run()

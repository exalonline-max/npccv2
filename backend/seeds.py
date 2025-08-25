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
            dm = User()
            dm.email = 'dm@npx.test'
            dm.display_name = 'DM Test'
            dm.set_password('Password123!')
            db.session.add(dm)

        player = User.query.filter_by(email='player@npx.test').first()
        if not player:
            player = User()
            player.email = 'player@npx.test'
            player.display_name = 'Player Test'
            player.set_password('Password123!')
            db.session.add(player)

        db.session.commit()

        # create account
        acc = Account.query.filter_by(slug='admintest1').first()
        if not acc:
            acc = Account()
            acc.slug = 'admintest1'
            acc.display_name = 'Admin Test 1'
            db.session.add(acc)
            db.session.commit()

        # create memberships
        if not Membership.query.filter_by(user_id=dm.id, account_id=acc.id).first():
            m = Membership()
            m.user_id = dm.id
            m.account_id = acc.id
            m.role = 'DM'
            db.session.add(m)
        if not Membership.query.filter_by(user_id=player.id, account_id=acc.id).first():
            m2 = Membership()
            m2.user_id = player.id
            m2.account_id = acc.id
            m2.role = 'Player'
            db.session.add(m2)

        db.session.commit()


if __name__ == '__main__':
    run()
 
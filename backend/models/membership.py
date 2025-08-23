from ..extensions import db
from datetime import datetime
import uuid


class Membership(db.Model):
    __tablename__ = 'memberships'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    account_id = db.Column(db.String(36), db.ForeignKey('accounts.id'), nullable=False)
    role = db.Column(db.Enum('DM', 'Player', name='role_enum'), nullable=False)
    # status: pending (requested), active (member), denied
    status = db.Column(db.Enum('pending', 'active', 'denied', name='membership_status'), nullable=False, default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='memberships')
    account = db.relationship('Account', back_populates='memberships')

    __table_args__ = (db.UniqueConstraint('user_id', 'account_id', name='_user_account_uc'),)

    def to_dict(self):
        user_summary = None
        if self.user:
            user_summary = {'id': self.user.id, 'display_name': self.user.display_name, 'email': self.user.email}
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user': user_summary,
            'account': self.account.to_dict(),
            'role': self.role,
            'status': self.status,
        }

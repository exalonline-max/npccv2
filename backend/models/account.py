from ..extensions import db
from datetime import datetime
import uuid


class Account(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(255), nullable=True)
    # 6-character join code used for players to request to join
    join_code = db.Column(db.String(6), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    memberships = db.relationship('Membership', back_populates='account')

    def to_dict(self):
        return {
            'id': self.id,
            'slug': self.slug,
            'display_name': self.display_name,
            'join_code': self.join_code,
        }

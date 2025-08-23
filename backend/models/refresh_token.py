from ..extensions import db
from datetime import datetime
import uuid


class RefreshToken(db.Model):
    __tablename__ = 'refresh_tokens'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    token_jti = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    revoked = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {'id': self.id, 'user_id': self.user_id, 'token_jti': self.token_jti, 'revoked': self.revoked}

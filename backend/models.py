from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    display_name = db.Column(db.String(120))
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @classmethod
    def create(cls, email, password, display_name=None):
        u = cls(email=email, display_name=display_name or email, password_hash=generate_password_hash(password))
        db.session.add(u)
        db.session.commit()
        return u

    @classmethod
    def authenticate(cls, email, password):
        u = cls.query.filter_by(email=email).first()
        if not u:
            return None
        if not check_password_hash(u.password_hash, password):
            return None
        return u

    @classmethod
    def get(cls, uid):
        return cls.query.get(uid)

    def to_dict(self):
        return {'id': self.id, 'email': self.email, 'display_name': self.display_name}

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200))
    dm_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @classmethod
    def create(cls, name, dm_id):
        c = cls(name=name, dm_id=dm_id)
        db.session.add(c)
        db.session.commit()
        return c

    @classmethod
    def for_user(cls, uid):
        # simple: return campaigns where user is DM; players not implemented for scaffold
        return cls.query.filter_by(dm_id=uid).all()

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'dm_id': self.dm_id}

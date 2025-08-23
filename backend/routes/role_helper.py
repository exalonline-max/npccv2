from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..models.membership import Membership


def require_role(role):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            user_id = get_jwt_identity()
            if not user_id:
                return jsonify({'error': 'unauthenticated'}), 401
            host = request.host.split(':')[0]
            sub = None
            if host.endswith('.lvh.me') or host.endswith('.npcchatter.com'):
                parts = host.split('.')
                if len(parts) >= 3:
                    sub = parts[0]
            if not sub:
                return jsonify({'error': 'no tenant in host'}), 400
            membership = Membership.query.join(Membership.account).filter(Membership.user_id==user_id, Membership.account.has(slug=sub)).first()
            if not membership or membership.role != role:
                return jsonify({'error': 'forbidden'}), 403
            return f(*args, **kwargs)
        return wrapped
    return decorator

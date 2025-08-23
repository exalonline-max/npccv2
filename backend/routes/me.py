from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User

me_bp = Blueprint('me', __name__)


@me_bp.route('/me', methods=['GET'])
@jwt_required(optional=True)
def me():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({'user': None, 'memberships': []})
    user = User.query.get(user_id)
    if not user:
        return jsonify({'user': None, 'memberships': []})
    memberships = [m.to_dict() for m in user.memberships]
    return jsonify({'user': user.to_dict(), 'memberships': memberships})

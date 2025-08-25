from flask import Blueprint, request, jsonify, current_app
from ..extensions import db
from ..models.user import User
from ..models.refresh_token import RefreshToken
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies, get_jwt
from flask_jwt_extended.exceptions import JWTExtendedException
from flask import current_app
from sqlalchemy.exc import OperationalError

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    display_name = data.get('display_name')
    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'email exists'}), 400
    user = User(email=email.lower(), display_name=display_name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return jsonify({'error': 'email and password required'}), 400
        # Attempt user lookup with a single retry on OperationalError (DB connection closed)
        user = None
        for attempt in (1, 2):
            try:
                user = User.query.filter_by(email=email.lower()).first()
                break
            except OperationalError as oe:
                current_app.logger.exception('DB OperationalError during user lookup (attempt %s)', attempt)
                # Try to dispose the engine to force new connections on next attempt
                try:
                    db.engine.dispose()
                except Exception:
                    current_app.logger.exception('Failed to dispose DB engine')
                if attempt == 2:
                    # After retrying, surface a 503 so the frontend can show a friendly error
                    return jsonify({'error': 'service unavailable', 'details': 'database connection error'}), 503
        if not user or not user.check_password(password):
            return jsonify({'error': 'invalid credentials'}), 401

        access = create_access_token(identity=user.id)
        refresh = create_refresh_token(identity=user.id)
        resp = jsonify({'user': user.to_dict()})
        # set cookies
        set_access_cookies(resp, access)
        set_refresh_cookies(resp, refresh)
        return resp
    except Exception as e:
        current_app.logger.exception('login error')
        # Return a safe error message for debugging. The full traceback is logged server-side.
        return jsonify({'error': 'internal server error', 'details': str(e)}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    # This endpoint requires a valid refresh token cookie (handled by flask-jwt-extended)
    identity = get_jwt_identity()
    if not identity:
        return jsonify({'error': 'invalid refresh token'}), 401
    access = create_access_token(identity=identity)
    resp = jsonify({'access': True})
    set_access_cookies(resp, access)
    return resp


@auth_bp.route('/logout', methods=['POST'])
def logout():
    resp = jsonify({'msg': 'logged out'})
    unset_jwt_cookies(resp)
    return resp

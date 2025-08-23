from flask import Blueprint, request, jsonify, current_app
from ..extensions import db
from ..models.account import Account
from ..models.membership import Membership
from ..models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
import re

campaigns_bp = Blueprint('campaigns', __name__)


@campaigns_bp.route('', methods=['GET'])
@jwt_required(optional=True)
def list_accounts():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({'campaigns': []})
    user = User.query.get(user_id)
    if not user:
        return jsonify({'campaigns': []})
    memberships = [m.to_dict() for m in user.memberships]
    return jsonify({'memberships': memberships})


@campaigns_bp.route('', methods=['POST'])
@jwt_required()
def create_account():
    data = request.get_json() or {}
    slug = (data.get('slug') or '').lower()
    display_name = data.get('display_name')
    if not re.match(r'^[a-z0-9-]{3,50}$', slug):
        return jsonify({'error': 'invalid slug'}), 400
    if Account.query.filter_by(slug=slug).first():
        return jsonify({'error': 'slug exists'}), 400
    acc = Account(slug=slug, display_name=display_name)
    db.session.add(acc)
    db.session.flush()
    # create membership DM
    member = Membership(user_id=get_jwt_identity(), account_id=acc.id, role='DM')
    db.session.add(member)
    db.session.commit()
    return jsonify({'campaign': acc.to_dict()}), 201


@campaigns_bp.route('/join', methods=['POST'])
@jwt_required()
def request_join():
    data = request.get_json() or {}
    code = (data.get('code') or '').strip()
    if not code or len(code) != 6:
        return jsonify({'error': 'invalid code'}), 400
    acc = Account.query.filter_by(join_code=code).first()
    if not acc:
        return jsonify({'error': 'campaign not found'}), 404
    # create pending membership
    user_id = get_jwt_identity()
    if Membership.query.filter_by(user_id=user_id, account_id=acc.id).first():
        return jsonify({'error': 'already requested or member'}), 400
    member = Membership(user_id=user_id, account_id=acc.id, role='Player', status='pending')
    db.session.add(member)
    db.session.commit()
    return jsonify({'msg': 'request submitted', 'campaign': acc.to_dict()}), 202


@campaigns_bp.route('/requests', methods=['GET'])
@jwt_required()
def list_requests():
    # list pending join requests for campaigns where current user is DM
    user_id = get_jwt_identity()
    # find DM memberships
    dm_memberships = Membership.query.filter_by(user_id=user_id, role='DM').all()
    campaign_ids = [m.account_id for m in dm_memberships]
    if not campaign_ids:
        return jsonify({'requests': []})
    requests = Membership.query.filter(Membership.account_id.in_(campaign_ids), Membership.status=='pending').all()
    return jsonify({'requests': [r.to_dict() for r in requests]})


@campaigns_bp.route('/requests/<req_id>/approve', methods=['POST'])
@jwt_required()
def approve_request(req_id):
    user_id = get_jwt_identity()
    req = Membership.query.get(req_id)
    if not req:
        return jsonify({'error': 'request not found'}), 404
    # ensure current user is DM of the campaign
    dm = Membership.query.filter_by(user_id=user_id, account_id=req.account_id, role='DM').first()
    if not dm:
        return jsonify({'error': 'forbidden'}), 403
    req.status = 'active'
    db.session.commit()
    return jsonify({'msg': 'approved', 'membership': req.to_dict()})


@campaigns_bp.route('/requests/<req_id>/deny', methods=['POST'])
@jwt_required()
def deny_request(req_id):
    user_id = get_jwt_identity()
    req = Membership.query.get(req_id)
    if not req:
        return jsonify({'error': 'request not found'}), 404
    dm = Membership.query.filter_by(user_id=user_id, account_id=req.account_id, role='DM').first()
    if not dm:
        return jsonify({'error': 'forbidden'}), 403
    req.status = 'denied'
    db.session.commit()
    return jsonify({'msg': 'denied', 'membership': req.to_dict()})



@campaigns_bp.route('/<int:campaign_id>/members', methods=['GET'])
@jwt_required()
def campaign_members(campaign_id):
    """Return memberships for a campaign. Only available to DMs of that campaign."""
    user_id = get_jwt_identity()
    # ensure current user is DM of the campaign
    dm = Membership.query.filter_by(user_id=user_id, account_id=campaign_id, role='DM').first()
    if not dm:
        return jsonify({'error': 'forbidden'}), 403
    members = Membership.query.filter_by(account_id=campaign_id).all()
    return jsonify({'members': [m.to_dict() for m in members]})

from flask import Blueprint, request, jsonify, current_app
from ..models.account import Account

tenant_bp = Blueprint('tenant', __name__)


def extract_subdomain(hostname: str):
    # handle lvh.me and npcchatter.com
    if hostname.endswith('.lvh.me'):
        parts = hostname.split('.')
        if len(parts) >= 3:
            return parts[0]
        return None
    if hostname.endswith('.npcchatter.com'):
        parts = hostname.split('.')
        if len(parts) >= 3:
            return parts[0]
        return None
    return None


@tenant_bp.route('/current', methods=['GET'])
def current_tenant():
    host = request.host.split(':')[0]
    sub = extract_subdomain(host)
    if not sub:
        return jsonify({'account': None})
    acc = Account.query.filter_by(slug=sub).first()
    if not acc:
        return jsonify({'account': None})
    return jsonify({'account': acc.to_dict()})

from flask import Blueprint, request, jsonify, current_app
from ..models.account import Account

tenant_bp = Blueprint('tenant', __name__)


def extract_subdomain(hostname: str):
    # Try to extract the left-most label if the hostname ends with a known public domain.
    # The public domain may be configured via an environment variable for flexibility.
    public_domain = None
    try:
        public_domain = current_app.config.get('PUBLIC_DOMAIN', 'npcchatter.com')
    except Exception:
        public_domain = 'npcchatter.com'

    # normalize
    hostname = (hostname or '').lower()
    pd = public_domain.lower()

    # support lvh.me in development
    if hostname.endswith('.lvh.me'):
        parts = hostname.split('.')
        if len(parts) >= 3:
            return parts[0]
        return None

    # support configured public domain (e.g., npcchatter.com)
    if hostname == pd:
        return None
    if hostname.endswith('.' + pd):
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

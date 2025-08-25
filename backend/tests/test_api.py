import json

from backend.app import create_app


def test_health_endpoint():
    app = create_app()
    app.config['TESTING'] = True
    client = app.test_client()

    resp = client.get('/api/health')
    assert resp.status_code == 200
    assert resp.get_json() == {'status': 'ok'}


def test_me_anonymous_returns_none():
    app = create_app()
    app.config['TESTING'] = True
    client = app.test_client()

    # No cookies / auth provided — @jwt_required(optional=True) should result in
    # a neutral anonymous response rather than a 401.
    resp = client.get('/api/me')
    assert resp.status_code == 200
    body = resp.get_json()
    assert isinstance(body, dict)
    assert body.get('user') is None
    assert isinstance(body.get('memberships'), list)
    assert body.get('memberships') == []

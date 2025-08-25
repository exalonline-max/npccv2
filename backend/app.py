from flask import Flask, jsonify, request, redirect
import re
from .config import Config
from .extensions import db, migrate, jwt, cors
from .routes.auth import auth_bp
from .routes.accounts import campaigns_bp
from .routes.me import me_bp
from .routes.tenant import tenant_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    # JWT error handlers: for optional endpoints like GET /api/me we prefer returning
    # a neutral anonymous response instead of a 401 when the cookie is expired/invalid.
    # This avoids noisy 401s in the browser when a stale cookie exists.
    def _neutral_me_response():
        return jsonify({'user': None, 'memberships': []}), 200

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        # If the request is for /api/me (optional jwt), return neutral response.
        if request.path == '/api/me' or request.path.startswith('/api'):
            return _neutral_me_response()
        return jsonify({'msg': 'token expired'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(err_str):
        if request.path == '/api/me' or request.path.startswith('/api'):
            return _neutral_me_response()
        return jsonify({'msg': 'invalid token'}), 422

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        if request.path == '/api/me' or request.path.startswith('/api'):
            return _neutral_me_response()
        return jsonify({'msg': 'token revoked'}), 401

    # Allow CORS for lvh.me and any subdomain (e.g. admintest1.lvh.me:5173)
    allowed_origin_re = re.compile(r'^https?://(.+\.)?lvh\.me(:\d+)?$')

    # Also allow localhost dev origin when running in development so Vite (https://localhost:5173)
    # can call the API without CORS errors. This keeps production restricted to lvh.me.
    additional_origins = []
    if app.config.get('ENV') == 'development' or app.config.get('DEBUG'):
        additional_origins.append('https://localhost:5173')

    # Compose origins: a regex for lvh.me plus explicit localhost (in dev).
    # In development, allow all origins to avoid CORS troubleshooting during iteration.
    if app.config.get('ENV') == 'development' or app.config.get('DEBUG'):
        cors.init_app(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    else:
        # Allow production domains: lvh.me and the Vercel deployment host for the frontend.
        # Add additional production hosts here as needed.
        origins = [
            r'^https?://(.+\.)?lvh\.me(:\d+)?$',
            r'^https?://(.+\.)?npccv2\.vercel\.app(:\d+)?$',
            # Allow Vercel preview and project subdomains (example: <slug>.alex-larentes-projects.vercel.app)
            r'^https?://(.+\.)?vercel\.app(:\d+)?$',
            # Allow your production custom domain and any subdomain (e.g., admintest1.npcchatter.com)
            r'^https?://(.+\.)?npcchatter\.com(:\d+)?$'
        ]
        cors.init_app(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(campaigns_bp, url_prefix="/api/campaigns")
    app.register_blueprint(me_bp, url_prefix="/api")
    app.register_blueprint(tenant_bp, url_prefix="/api/tenant")

    @app.get('/api/health')
    def health():
        return jsonify({"status": "ok"})

    @app.get('/')
    def index():
        # Redirect base URL to the API health endpoint so the root doesn't return a 404
        return redirect('/api/health')

    return app


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

from flask import Flask, jsonify, request
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
        origins = [r'^https?://(.+\.)?lvh\.me(:\d+)?$']
        cors.init_app(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(campaigns_bp, url_prefix="/api/campaigns")
    app.register_blueprint(me_bp, url_prefix="/api")
    app.register_blueprint(tenant_bp, url_prefix="/api/tenant")

    @app.get('/api/health')
    def health():
        return jsonify({"status": "ok"})

    return app


app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

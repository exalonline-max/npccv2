from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()

# Import models so that flask-migrate / alembic can detect them
from .models import user, account, membership, refresh_token  # noqa: F401

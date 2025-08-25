import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql+psycopg2://postgres:postgres@localhost:5432/npcchatter')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Engine options help with unstable or pooled connections in hosted Postgres
    # pool_pre_ping will check connections before use and recycle broken ones.
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_size': int(os.getenv('SQLALCHEMY_POOL_SIZE', '5')),
        'max_overflow': int(os.getenv('SQLALCHEMY_MAX_OVERFLOW', '10')),
        'pool_recycle': int(os.getenv('SQLALCHEMY_POOL_RECYCLE', '1800')),
    }
    ACCESS_EXPIRES = timedelta(minutes=15)
    REFRESH_EXPIRES = timedelta(days=30)
    # Default frontend / cookie settings. These can be overridden using env vars.
    # In local dev we use lvh.me; in production you should use your custom domain npcchatter.com
    FRONTEND_ORIGIN = os.getenv('FRONTEND_ORIGIN', 'http://lvh.me:5173')
    COOKIE_DOMAIN = os.getenv('COOKIE_DOMAIN', '.npcchatter.com')
    API_HOST = os.getenv('API_HOST', 'api.lvh.me')
    # Allow the configured frontend origin plus the canonical production host
    CORS_ORIGINS = [FRONTEND_ORIGIN, 'https://npcchatter.com', 'https://www.npcchatter.com']
    # JWT cookie settings for cookie-based auth
    JWT_TOKEN_LOCATION = ['cookies']
    # Ensure cookies are sent to subdomains by setting JWT_COOKIE_DOMAIN to the configured cookie domain
    JWT_COOKIE_DOMAIN = COOKIE_DOMAIN
    # In development we allow non-secure cookies; in production require Secure and SameSite=None
    ENV = os.getenv('FLASK_ENV') or os.getenv('ENV') or os.getenv('APP_ENV') or os.getenv('ENVIRONMENT')
    if ENV and ENV.lower() == 'production':
        JWT_COOKIE_SECURE = True
        JWT_COOKIE_SAMESITE = 'None'
    else:
        JWT_COOKIE_SECURE = False
        JWT_COOKIE_SAMESITE = 'Lax'
    JWT_ACCESS_COOKIE_NAME = 'access_token'
    JWT_REFRESH_COOKIE_NAME = 'refresh_token'

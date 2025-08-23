import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql+psycopg2://postgres:postgres@localhost:5432/npcchatter')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ACCESS_EXPIRES = timedelta(minutes=15)
    REFRESH_EXPIRES = timedelta(days=30)
    FRONTEND_ORIGIN = os.getenv('FRONTEND_ORIGIN', 'http://lvh.me:5173')
    COOKIE_DOMAIN = os.getenv('COOKIE_DOMAIN', '.lvh.me')
    API_HOST = os.getenv('API_HOST', 'api.lvh.me')
    CORS_ORIGINS = [FRONTEND_ORIGIN]
    # JWT cookie settings for cookie-based auth
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_SAMESITE = 'Lax'
    JWT_ACCESS_COOKIE_NAME = 'access_token'
    JWT_REFRESH_COOKIE_NAME = 'refresh_token'

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os

from models import db, User, Campaign


def create_app():
	app = Flask(__name__)
	app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///dev.db')
	app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
	app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET', 'dev-secret')

	CORS(app)
	jwt = JWTManager(app)

	db.init_app(app)

	@app.route('/')
	def index():
		return jsonify({'message': 'NPCChatter backend up'})

	@app.route('/auth/register', methods=['POST'])
	def register():
		data = request.get_json() or {}
		email = data.get('email')
		password = data.get('password')
		display = data.get('display_name') or email
		if not email or not password:
			return jsonify({'error': 'email and password required'}), 400
		user = User.create(email, password, display)
		token = create_access_token(identity=user.id)
		return jsonify({'token': token, 'user': user.to_dict()}), 201

	@app.route('/auth/login', methods=['POST'])
	def login():
		data = request.get_json() or {}
		email = data.get('email')
		password = data.get('password')
		user = User.authenticate(email, password)
		if not user:
			return jsonify({'error': 'invalid credentials'}), 401
		token = create_access_token(identity=user.id)
		return jsonify({'token': token, 'user': user.to_dict()})

	@app.route('/me')
	@jwt_required()
	def me():
		uid = get_jwt_identity()
		user = User.get(uid)
		if not user:
			return jsonify({'error': 'not found'}), 404
		campaigns = Campaign.for_user(uid)
		return jsonify({'user': user.to_dict(), 'campaigns': [c.to_dict() for c in campaigns]})

	@app.route('/campaigns', methods=['POST'])
	@jwt_required()
	def create_campaign():
		data = request.get_json() or {}
		name = data.get('name') or 'New Campaign'
		uid = get_jwt_identity()
		campaign = Campaign.create(name, uid)
		return jsonify({'campaign': campaign.to_dict()}), 201

	@app.route('/campaigns')
	@jwt_required()
	def list_campaigns():
		uid = get_jwt_identity()
		campaigns = Campaign.for_user(uid)
		return jsonify({'campaigns': [c.to_dict() for c in campaigns]})

	return app


if __name__ == '__main__':
	app = create_app()
	app.run(debug=True)

import datetime

from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_raw_jwt, get_jwt_claims
from flask_restful import Resource, reqparse

from helpers.string_helper import get_hash
from services.session_service import SessionService
from services.user_service import UserService


class UserRegister(Resource):
    def __init__(self):
        self.user_service = UserService()

        self.parser = reqparse.RequestParser()
        self.parser.add_argument('login',
                                 type=str,
                                 required=True,
                                 help='Login cannot be en empty string.')
        self.parser.add_argument('password',
                                 type=str,
                                 required=True,
                                 help='Password cannot be en empty string.')
        self.parser.add_argument('confirm',
                                 type=str,
                                 required=True,
                                 help='Confirm Password cannot be en empty string.')
        self.parser.add_argument('full_name',
                                 type=str,
                                 required=True,
                                 help='Confirm Password cannot be en empty string.')
        self.parser.add_argument('email',
                                 type=str,
                                 required=True,
                                 help='Confirm Password cannot be en empty string.')

    def post(self):
        data = self.parser.parse_args()
        user_by_login = self.user_service.get_user_by_login(data['login'])
        user_by_email = self.user_service.get_user_by_email(data['email'])
        if user_by_email:
            return {'message': 'User with this email was already registered'}, 400
        if user_by_login:
            return {'message': 'User with this login was already registered'}, 400
        if data['password'] != data['confirm']:
            return {'message': 'Passwords do not match'}, 400
        new_user = {
            'login': data['login'],
            'password': get_hash(data['password']),
            'name': data['full_name'],
            'email': data['email'],
            'registered_on': datetime.datetime.now(),
            'activated': False,
            'roles': ['user']
        }
        created_user_id = self.user_service.new_user(new_user)
        return {'message': 'User was created', 'user_id': created_user_id}, 201


class CurrentUserInfo(Resource):
    def __init__(self):
        self.user_service = UserService()

    @jwt_required
    def get(self):
        claims = get_jwt_claims()
        user = self.user_service.get_user_by_login(claims['login'])
        user_info = {
            'login': user['login'],
            'name': user['name'],
            'email': user['email']
        }
        return user_info, 200


class UserLogout(Resource):
    def __init__(self):
        self.session_service = SessionService()

    @jwt_required
    def get(self):
        jti = get_raw_jwt()['jti']
        self.session_service.add_to_blacklist(jti, True)
        return {'message': 'Logged out'}, 200


class UserLogin(Resource):
    def __init__(self):
        self.user_service = UserService()

        self.parser = reqparse.RequestParser()
        self.parser.add_argument('login',
                                 type=str,
                                 required=True,
                                 help='Login cannot be en empty string.')
        self.parser.add_argument('password',
                                 type=str,
                                 required=True,
                                 help='Password cannot be en empty string.')

    def post(self):
        data = self.parser.parse_args()
        hashed_password = get_hash(data['password'])
        user = self.user_service.get_user_by_login(data['login'])
        if user and user['password'] == hashed_password:
            user_id = str(user['_id'])
            expires = datetime.timedelta(days=365)
            access_token = create_access_token(identity=user_id, fresh=True, expires_delta=expires)
            refresh_token = create_refresh_token(user_id)
            return {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'name': user['name']
            }, 200
        else:
            return {'message': 'Invalid credentials'}, 401


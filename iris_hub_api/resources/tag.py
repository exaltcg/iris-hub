import datetime
import json
import time

from bson import json_util
from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource, reqparse

from services.tag_service import TagService
from services.user_service import UserService


class Tags(Resource):
    def __init__(self):
        self.tag_service = TagService()

    def get(self):
        all_tags = self.tag_service.get_all_tags()
        return json.loads(json.dumps(all_tags, default=json_util.default)), 200


class GetTag(Resource):
    def __init__(self):
        self.tag_service = TagService()

    def get(self, tag_id):
        tag = self.tag_service.get_tag_by_id(tag_id)
        tag['_id'] = str(tag['_id'])
        return json.loads(json.dumps(tag, default=json_util.default)), 200


class Tag(Resource):
    def __init__(self):
        self.tag_service = TagService()
        self.user_service = UserService()
        self.parser = reqparse.RequestParser()

    @jwt_required
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('_id',
                            type=str,
                            required=True,
                            help='Id cannot be en empty string.')
        parser.add_argument('name',
                            type=str,
                            required=True,
                            help='Tag name cannot be en empty string.')
        parser.add_argument('description', type=str)
        parser.add_argument('color', type=str)
        data = parser.parse_args()
        tag = self.tag_service.get_tag_by_id(data['_id'])
        if tag:
            tag['name'] = data['name']
            tag['description'] = data['description']
            tag['color'] = data['color']
            self.tag_service.update_tag(tag)
            return {'message': 'Tag updated'}, 200
        else:
            return {'message': 'Tag was not found'}, 404

    @jwt_required
    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name',
                            type=str,
                            required=True,
                            help='Tag name cannot be en empty string.')
        data = parser.parse_args()
        tag = self.tag_service.get_tag_by_name(data['name'])
        if not tag:
            return {'message': 'Requested tag was not found'}, 400
        self.tag_service.delete(tag)
        return {'message': 'Tag was deleted'}, 200

    @jwt_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name',
                            type=str,
                            required=True,
                            help='Tag name cannot be en empty string.')
        parser.add_argument('description', type=str)
        parser.add_argument('color', type=str)
        data = parser.parse_args()
        existing_tag = self.tag_service.get_tag_by_name(data['name'])
        if existing_tag:
            return {'message': 'Tag with this name was already added'}, 400
        claims = get_jwt_claims()
        user = self.user_service.get_user_by_login(claims['login'])
        new_tag = {
            'added_by': user['login'],
            'added_on': datetime.datetime.now(),
            'name': data['name'],
            'description': data['description'],
            'color': data['color']
        }
        self.tag_service.add_new_tag(new_tag)
        return {'message': 'Tag created'}, 201

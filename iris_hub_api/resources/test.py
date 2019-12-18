import datetime
import json

from operator import itemgetter

from bson import json_util, ObjectId
from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource, reqparse

from services.tag_service import TagService
from services.test_service import TestService


class AssignUserToTest(Resource):
    def __init__(self):
        self.test_service = TestService()

    @jwt_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('test',
                            type=str,
                            required=True,
                            help='Test name cannot be en empty string.')
        parser.add_argument('suite',
                            type=str,
                            required=True,
                            help='Suite name cannot be en empty string.')
        data = parser.parse_args()

        current_user = get_jwt_claims()['login']
        existing_test = self.test_service.get_test(data['suite'], data['test'])
        if existing_test:
            if existing_test['assignee'] != current_user:
                return {'message': 'This test was already taken by another user'}, 400
            existing_test['assignee'] = current_user
            existing_test['updated_on'] = datetime.datetime.now()
            self.test_service.update_test(existing_test)
            return {'message': 'Updated'}, 200
        else:
            new_test = {
                'suite': data['suite'],
                'added_on': datetime.datetime.now(),
                'updated_on': datetime.datetime.now(),
                'test': data['test'],
                'assignee': current_user
            }
            self.test_service.add_new_test(new_test)
            return {'message': 'The test is created with assignee'}, 200


class GetTest(Resource):
    def __init__(self):
        self.test_service = TestService()
        self.tag_service = TagService()

    def get(self, suite, test):
        test = self.test_service.get_test(suite, test)
        if not test:
            return {'message': 'requested test was not found'}, 404
        all_tags = self.tag_service.get_all_tags()
        result = {
            'id': str(test['_id']),
            'test': test['test'],
            'suite': test['suite'],
            'messages': []
        }

        for message in test['messages']:
            new_message = {
                'message': message['message'],
                'tags': []
            }
            for item_tag in message['tags']:
                modified_tag = {
                    'id': str(item_tag),
                    'name': next(tag for tag in all_tags if tag['_id'] == item_tag)['name']
                }
                new_message['tags'].append(modified_tag)
            result['messages'].append(new_message)

        return json.loads(json.dumps(result, default=json_util.default)), 200


class Test(Resource):
    def __init__(self):
        self.test_service = TestService()

    @jwt_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('test',
                            type=str,
                            required=True,
                            help='Test name cannot be en empty string.')
        parser.add_argument('suite',
                            type=str,
                            required=True,
                            help='Suite name cannot be en empty string.')
        parser.add_argument('message',
                            required=True,
                            help='Tag Id cannot be en empty string.'
                            )
        parser.add_argument('tag_id',
                            required=True,
                            help='Tag Id cannot be en empty string.'
                            )

        data = parser.parse_args()
        test = self.test_service.get_test(data['suite'], data['test'])
        if not test:
            new_test = {
                'test': data['test'],
                'suite': data['suite'],
                'messages': []
            }
            new_message = {
                'message': data['message'],
                'tags': [ObjectId(data['tag_id'])]
            }
            new_test['messages'].append(new_message)
            self.test_service.add_new_test(new_test)
        else:
            existing_message = [message for message in test['messages'] if message['message'] == data['message']]
            if len(existing_message) == 0:
                new_message = {
                    'message': data['message'],
                    'tags': [ObjectId(data['tag_id'])]
                }
                test['messages'].append(new_message)
            else:
                existing_message = existing_message[0]
                existing_tag = [tag for tag in existing_message['tags'] if tag == ObjectId(data['tag_id'])]
                if len(existing_tag) > 0:
                    existing_tag = existing_tag[0]
                    list_tag = existing_message['tags']
                    existing_message['tags'].remove(existing_tag)
                else:
                    existing_message['tags'].append(ObjectId(data['tag_id']))
            self.test_service.update_test(test)
            return {'message': 'Updated'}, 200


class Tests(Resource):
    def __init__(self):
        self.tag_service = TestService()

    def get(self):
        all_tags = self.tag_service.get_all_tests()
        return json.loads(json.dumps(all_tags, default=json_util.default)), 200

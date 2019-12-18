from bson import ObjectId

from repositories import Repository
from repositories.test_repository import TestRepository


class TestService:
    def __init__(self, repo_client=Repository(adapter=TestRepository)):
        self.repo_client = repo_client

    def add_new_test(self, test):
        self.repo_client.create(test)

    def get_test(self, suite, test):
        return self.repo_client.find({'suite': suite, 'test': test})

    def get_all_tests(self):
        return list(self.repo_client.find_all({}))

    def update_test(self, existing_test):
        return self.repo_client.update({'_id': existing_test['_id']}, existing_test)




from pymongo import MongoClient

from init import app


class TestRepository:
    def __init__(self):
        mongo_url = app.config['MONGO_URI']
        self.db = MongoClient(mongo_url).iris_hub

    def find_all(self, selector, excluding):
        return self.db.tests.find(selector, excluding)

    def find(self, selector, excluding):
        return self.db.tests.find_one(selector, excluding)

    def create(self, test):
        return self.db.tests.insert_one(test)

    def update(self, selector, test):
        return self.db.tests.replace_one(selector, test).modified_count



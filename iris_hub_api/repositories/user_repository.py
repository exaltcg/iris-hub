from pymongo import MongoClient

from init import app


class UserRepository:
    def __init__(self):
        mongo_url = app.config['MONGO_URI']
        self.db = MongoClient(mongo_url).iris_hub

    def find_all(self, selector, excluding):
        return self.db.users.find(selector, excluding)

    def find(self, selector, excluding):
        return self.db.users.find_one(selector, excluding)

    def create(self, user):
        return self.db.users.insert_one(user)


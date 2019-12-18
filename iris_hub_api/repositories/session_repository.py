from pymongo import MongoClient

from init import app


class SessionRepository:
    def __init__(self):
        mongo_url = app.config['MONGO_URI']
        self.db = MongoClient(mongo_url).iris_hub

    def find_all(self, selector, excluding):
        return self.db.sessions.find(selector, excluding)

    def find(self, selector, excluding):
        return self.db.sessions.find_one(selector, excluding)

    def create(self, session):
        return self.db.sessions.insert_one(session)


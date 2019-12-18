from pymongo import MongoClient

from init import app


class TagsRepository:
    def __init__(self):
        mongo_url = app.config['MONGO_URI']
        self.db = MongoClient(mongo_url).iris_hub

    def find_all(self, selector, excluding):
        return self.db.tags.find(selector, excluding)

    def find(self, selector, excluding):
        return self.db.tags.find_one(selector, excluding)

    def create(self, session):
        return self.db.tags.insert_one(session)

    def delete(self, selector):
        return self.db.tags.delete_one(selector).deleted_count

    def update(self, selector, tag):
        return self.db.tags.replace_one(selector, tag).modified_count



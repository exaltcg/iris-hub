from pymongo import MongoClient

from init import app


class ReportRepository:
    def __init__(self):
        mongo_url = app.config['MONGO_URI']
        self.db = MongoClient(mongo_url).iris_hub

    def find_all(self, selector, excluding):
        return self.db.reports.find(selector, excluding)

    def find_with_sort_limit(self, selector, excluding, sort, limit):
        return self.db.reports.find(selector, excluding).sort(sort).limit(limit)

    def get_count(self, selector):
        return self.db.reports.find(selector).count()

    def find(self, selector, excluding):
        return self.db.reports.find_one(selector, excluding)

    def create(self, report):
        return self.db.reports.insert_one(report)

    def update(self, selector, report):
        return self.db.reports.replace_one(selector, report).modified_count

    def delete(self, selector):
        return self.db.reports.delete_one(selector).deleted_count

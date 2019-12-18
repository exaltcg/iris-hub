from bson import ObjectId

from repositories import Repository
from repositories.tags_repository import TagsRepository


class TagService:
    def __init__(self, repo_client=Repository(adapter=TagsRepository)):
        self.repo_client = repo_client

    def add_new_tag(self, tag):
        self.repo_client.create(tag)

    def get_all_tags(self):
        return list(self.repo_client.find_all({}))

    def get_tag_by_name(self, tag_name):
        return self.repo_client.find({'name': tag_name})

    def delete(self, tag):
        self.repo_client.delete({'_id': tag['_id']})

    def get_tag_by_id(self, tag_id):
        return self.repo_client.find({'_id': ObjectId(tag_id)})

    def update_tag(self, tag):
        return self.repo_client.update({'_id': ObjectId(tag['_id'])}, tag)




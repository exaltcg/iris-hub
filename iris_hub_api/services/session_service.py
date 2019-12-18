from bson import ObjectId

from repositories import Repository
from repositories.session_repository import SessionRepository


class SessionService:
    def __init__(self, repo_client=Repository(adapter=SessionRepository)):
        self.repo_client = repo_client

    def add_to_blacklist(self, identifier, is_session_id):
        blacklist_item = {
            'identifier': identifier,
            'is_session_id': is_session_id
        }
        return self.repo_client.create(blacklist_item)

    def get_black_list(self):
        return list(self.repo_client.find_all({}))



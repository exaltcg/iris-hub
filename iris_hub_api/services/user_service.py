from bson import ObjectId

from repositories import Repository

from repositories.user_repository import UserRepository


class UserService:
    def __init__(self, repo_client=Repository(adapter=UserRepository)):
        self.repo_client = repo_client

    def get_user_by_login(self, login):
        return self.repo_client.find({'login': login})

    def new_user(self, user):
        added_user = self.repo_client.create(user)
        return str(added_user.inserted_id)

    def get_user_by_email(self, email):
        return self.repo_client.find({'email': email})

    def get_user_by_id(self, user_id):
        return self.repo_client.find({'_id': ObjectId(user_id)})




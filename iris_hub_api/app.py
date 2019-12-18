from init import app, api, jwt
from resources.report import TestInfoFromReport, ReportForDate
from resources.reports.failed_tests import FailedTests
from resources.reports.hisoric_data import HistoricData
from resources.reports.hisotric_data_per_platform import HistoricDataPerPlatform
from resources.reports.report import Report
from resources.reports.report_uploader import ReportUploader
from resources.reports.reports import Reports
from resources.tag import Tag, Tags, GetTag
from resources.test import AssignUserToTest, Test, GetTest
from resources.user import UserLogin, UserRegister, UserLogout, CurrentUserInfo
from services.session_service import SessionService
from services.user_service import UserService
from operator import itemgetter

api.add_resource(Reports, '/reports/<string:target>')
api.add_resource(Report, '/report/<string:report_id>')
api.add_resource(TestInfoFromReport, '/report/get-tests-info/<string:platform>/<string:suite>/<string:test>')
api.add_resource(ReportUploader, '/report/upload')
api.add_resource(HistoricData, '/report/history')
api.add_resource(HistoricDataPerPlatform, '/report/history/<string:platform>')
api.add_resource(FailedTests, '/report/failed-tests')
api.add_resource(ReportForDate, '/report/<string:platform>/<string:date>')


api.add_resource(UserLogin, '/user/login')
api.add_resource(UserRegister, '/user/register')
api.add_resource(UserLogout, '/user/logout')
api.add_resource(CurrentUserInfo, '/user/info')

api.add_resource(Tag, '/tag')
api.add_resource(GetTag, '/tag/<string:tag_id>')
api.add_resource(Tags, '/tags')

api.add_resource(AssignUserToTest, '/tests/assign-user')
api.add_resource(Test, '/test')
api.add_resource(GetTest, '/test/<string:suite>/<string:test>')


@jwt.user_claims_loader
def add_claims(identity):
    service = UserService()
    user = service.get_user_by_id(identity)
    return {'login': user['login'], 'roles': user['roles']}


@jwt.expired_token_loader
def expired_token():
    return {
        'message': 'The token has expired'
    }, 401


@jwt.token_in_blacklist_loader
def check_token(decrypted_token):
    service = SessionService()
    base_list = service.get_black_list()
    black_list = list(map(itemgetter('identifier'), base_list))
    return decrypted_token['jti'] in black_list


if __name__ == '__main__':
    app.run(port=8080, debug=True)

import json
from bson import json_util
from flask_restful import Resource


from services.report_service import ReportService


class FailedTests(Resource):
    def __init__(self):
        self.report_service = ReportService()

    def get(self):
        data = self.report_service.get_failed_tests_comparison()
        return json.loads(json.dumps(data, default=json_util.default)), 200

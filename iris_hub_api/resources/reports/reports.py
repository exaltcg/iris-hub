import json
from bson import json_util
from bson.errors import InvalidId
from flask_restful import Resource

from services.report_service import ReportService


class Reports(Resource):
    def __init__(self):
        self.report_service = ReportService()

    def get(self, target: str):
        try:
            result = list(self.report_service.find_all_reports({'target': target}, {'suits': 0}))
        except InvalidId:
            return {'message': 'Invalid report id is provided.'}, 400
        if result:
            return json.loads(json.dumps(result, default=json_util.default)), 200
        return {'Message': "Requested report was not found!"}, 404


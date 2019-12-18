import json
from bson import ObjectId, json_util
from bson.errors import InvalidId
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from services.report_service import ReportService


class Report(Resource):
    def __init__(self):
        self.report_service = ReportService()

    @jwt_required
    def get(self, report_id: str):
        try:
            result = self.report_service.find_report({'_id': ObjectId(report_id)}, {'suits': 0})
        except InvalidId:
            return {'message': 'Invalid report id is provided.'}, 400
        if result:
            return json.loads(json.dumps(result, default=json_util.default)), 200
        return {'message': "Requested report was not found!"}, 404

    @jwt_required
    def delete(self, report_id):
        count = self.report_service.delete(report_id)
        if count == 0:
            return {'message': 'report was not deleted'}
        return {'message': 'report was deleted'}, 200

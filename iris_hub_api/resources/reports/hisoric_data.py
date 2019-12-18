import json
from bson import json_util
from bson.errors import InvalidId
from flask_restful import Resource

from services.report_service import ReportService


class HistoricData(Resource):
    def __init__(self):
        self.report_service = ReportService()

    def get(self):
        try:
            result = self.report_service.get_historic_data()
        except InvalidId:
            return {'message': 'Invalid platform is provided.'}, 400
        if result:
            return json.loads(json.dumps(result, default=json_util.default)), 200
        return {'Message': "Requested platform was not found!"}, 404


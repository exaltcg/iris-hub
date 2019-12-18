import json
import time

from bson import json_util
from bson.errors import InvalidId
from flask_restful import Resource, reqparse

from services.report_service import ReportService


class HistoricDataPerPlatform(Resource):
    def __init__(self):
        self.report_service = ReportService()

    def get(self, platform):
        try:
            parse = reqparse.RequestParser()
            parse.add_argument('period', type=int)

            args = parse.parse_args()

            result = self.report_service.get_historic_data(platform, args['period'])
        except InvalidId:
            return {'message': 'Invalid platform is provided.'}, 400
        if result:
            return json.loads(json.dumps(result, default=json_util.default)), 200
        return {'Message': 'Selected time rage does not contain any data'}, 404

import json
from operator import itemgetter

from bson import json_util
from flask_restful import Resource
from services.report_service import ReportService


class ReportForDate(Resource):
    def __init__(self):
        self.report_service = ReportService()

    def get(self, platform, date):
        result = self.report_service.get_report_for_date(platform, date)
        if len(result) > 0:
            return json.loads(json.dumps(result[0], default=json_util.default)), 200
        else:
            return {'message': 'Report was not found'}, 404


class TestInfoFromReport(Resource):
    def __init__(self):
        self.report_service = ReportService()

    def get(self, platform, suite, test):
        result = []
        reports = list(
            self.report_service.find_all_reports({'platform': platform, 'suits.name': suite, 'suits.tests.name': test}))
        test_info = self.report_service.get_test_info(suite, test)
        for report in reports:
            target_suite = [test_suite for test_suite in report['suits'] if test_suite['name'] == suite][0]
            target_test = [selected_test for selected_test in target_suite['tests'] if selected_test['name'] == test][0]
            new_item = {
                'date': report['start_time'],
                'status': target_test['result'],
                'report_id': str(report['_id'])
            }
            if 'message' in target_test:
                new_item['message'] = target_test['message']
                new_item['stack_trace'] = target_test['stack_trace']
            result.append(new_item)

        result = sorted(result, reverse=True, key=itemgetter('date'))
        for item in result:
            item['date'] = item['date'].strftime("%Y-%m-%d %H:%M:%S").__str__()

        return result, 200

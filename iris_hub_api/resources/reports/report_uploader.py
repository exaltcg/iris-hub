import json
import datetime
from json import JSONDecodeError
import hashlib
from flask_restful import Resource, reqparse, request
import werkzeug

from services.report_service import ReportService


class ReportUploader(Resource):
    def __init__(self):
        self.report_service = ReportService()

    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('file',
                           type=werkzeug.datastructures.FileStorage,
                           location='files',
                           required=True,
                           help='Parameter file is required.'
                           )
        args = parse.parse_args()

        try:
            file_content = args['file'].stream.read().decode('utf-8')
            report_hash = hashlib.md5(file_content.encode('utf-8')).hexdigest()
            existing_report = self.report_service.find_report_by_hash(report_hash)
            if existing_report:
                return {"message": 'This report was already submitted on {0}'.format(existing_report['added_on'])}, 400
            json_report = json.loads(file_content)
            platform = json_report['meta']['platform']
            if platform == 'win' and ('win7' in json_report['meta']['config']):
                platform = 'win7'

            new_report = {
                'hash': report_hash,
                'client_ip': request.remote_addr,
                'added_on': datetime.datetime.now(),
                'start_time': datetime.datetime.utcfromtimestamp(json_report['meta']['start_time']),
                'end_time': datetime.datetime.utcfromtimestamp(json_report['meta']['end_time']),
                'platform': platform,
                'target': json_report['meta']['params']['target'],
                'errors': json_report['meta']['errors'],
                'failed': json_report['meta']['failed'],
                'passed': json_report['meta']['passed'],
                'skipped': json_report['meta']['skipped'],
                'total': json_report['meta']['total'],
                'branch': json_report['meta']['iris_branch'],
                'suits': []
            }
            for suite in json_report['tests']['all_tests']:
                new_suite = {
                    'name': suite['name'],
                    'tests': []
                }
                for test in suite['children']:
                    new_test = {
                        'name': test['name'],
                        'description': test['description'],
                        'result': test['result'],
                        'time': test['time']
                    }
                    if 'assert' in test:
                        if 'message' in test['assert']:
                            new_test['message'] = test['assert']['message']
                        if 'call_stack' in test['assert']:
                            new_test['stack_trace'] = test['assert']['call_stack']
                    new_suite['tests'].append(new_test)

                new_report['suits'].append(new_suite)

            report_id = self.report_service.create_report(new_report)
            return {'message': 'The report is delivered.', 'report_id': report_id}, 201

        except UnicodeDecodeError:
            return {'message': 'Unsupported report format detected.'}, 400
        except JSONDecodeError:
            return {'message': 'Invalid JSON report format detected.'}, 400
        except KeyError:
            return {'message': 'Invalid Iris report format detected.'}, 400

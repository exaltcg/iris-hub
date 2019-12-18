import itertools
import datetime
from dateutil import parser

from bson import ObjectId
from dateutil.relativedelta import relativedelta
from operator import itemgetter

import humanize
from pymongo import DESCENDING

from helpers.string_helper import platforms
from repositories import Repository
from repositories.report_repository import ReportRepository
from services.tag_service import TagService
from services.test_service import TestService


class ReportService:
    def __init__(self, repo_client=Repository(adapter=ReportRepository)):
        self.repo_client = repo_client
        self.platforms = ['osx', 'linux', 'win', 'win7']

    def find_all_reports(self, criteria, excluding=None):
        return self.repo_client.find_all(criteria, excluding)

    def find_report(self, criteria, excluding=None):
        report = self.repo_client.find(criteria, excluding)
        return report

    def delete(self, report_id):
        return self.repo_client.delete({'_id': ObjectId(report_id)})

    def get_historic_data(self, requested_platform=None, period=None):

        output = []
        platforms = self.platforms
        if requested_platform:
            platforms = [requested_platform]
        for platform in platforms:
            new_platform = {
                'platform': platform,
                'result': []
            }

            data = []

            if period:
                start_date = datetime.datetime.now().date()
                if period == 1:
                    start_date = start_date - relativedelta(weeks=+1)
                if period == 2:
                    start_date = start_date - relativedelta(months=+1)
                if period == 3:
                    start_date = start_date - relativedelta(years=+1)
                if period == 4:
                    start_date = datetime.date.min

                start_date = datetime.datetime.combine(start_date, datetime.datetime.min.time())
                data = list(self.repo_client.find_all({'platform': platform, 'start_time': {'$gte': start_date}},
                                                      {'start_time': 1,
                                                       'errors': 1,
                                                       'failed': 1,
                                                       'passed': 1,
                                                       'skipped': 1,
                                                       'total': 1,
                                                       '_id': 0}))
            else:
                data = list(self.repo_client.find_all({'platform': platform},
                                                      {'start_time': 1,
                                                       'errors': 1,
                                                       'failed': 1,
                                                       'passed': 1,
                                                       'skipped': 1,
                                                       'total': 1,
                                                       '_id': 0}))

            if len(data) == 0:
                continue

            data = sorted(data, key=itemgetter('start_time'))
            grouped_item = []
            for key, value in itertools.groupby(data, lambda x: str(x['start_time'].date())):
                new_key = {
                    'date': key
                }
                item = sorted(list(value), reverse=True, key=itemgetter('total'))
                new_key['item'] = item[0]
                new_key['humanize'] = humanize.naturaltime(item[0]['start_time'])
                grouped_item.append(new_key)
            new_platform['result'] = grouped_item
            output.append(new_platform)
        if requested_platform and output:
            return output[0]
        else:
            return output

    def find_report_by_hash(self, report_hash):
        report = self.repo_client.find({'hash': report_hash})
        return report

    def create_report(self, report):
        created_report = self.repo_client.create(report)
        return str(created_report.inserted_id)

    def get_failed_tests_comparison(self):
        test_service = TestService()
        tag_service = TagService()
        all_tags = tag_service.get_all_tags()
        result = {'platforms': [],
                  'merged': []
                  }
        merged_list = []
        for platform in self.platforms:
            platform_result = list(self.repo_client.find_with_sort_limit({'platform': platform}, {'suits': 1},
                                                                         [('start_time', DESCENDING),
                                                                          ('total', DESCENDING)], 1))
            if len(platform_result) != 0:
                platform_result = platform_result[0]
                new_platform = {'platform': platform,
                                'failed': [],
                                }
                for suit in platform_result['suits']:
                    failed_tests = [test for test in suit['tests'] if
                                    (test['result'] == 'FAILED' or test['result'] == 'ERROR')]
                    for failed_test in failed_tests:
                        merged_list.append(suit['name'] + ':' + failed_test['name'])
                        new_platform['failed'].append({'suite': suit['name'], 'test': failed_test['name']})
                result['platforms'].append(new_platform)

        merged_list = list(set(merged_list))
        for test in merged_list:
            added_tags = []
            test_name = test.split(':')[1]
            suite_name = test.split(':')[0]
            tags = test_service.get_test(suite_name, test_name)
            report_messages = self.get_latest_failed_message(suite_name, test_name)

            if tags:
                messages = [message for message in tags['messages'] if message['message'] in report_messages]
                if len(messages) > 0:
                    for message in messages:
                        tags = [tag for tag in message['tags']]
                        for tag in tags:
                            selected_tag = next(t for t in all_tags if t['_id'] == tag)
                            added_tags.append({'name': selected_tag['name'],
                                               'color': selected_tag['color']
                                               })
            failed_for = {'suite': suite_name,
                          'test': test_name,
                          'tags': added_tags,
                          'failed_for': [],
                          'fail_rate': self.repo_client.get_count(
                              {
                                  'suits.tests': {'$elemMatch': {'name': test_name,
                                                                 '$or': [{'result': 'FAILED'}, {'result': 'ERROR'}]}}
                              }
                          )}

            for platform in result['platforms']:
                for failed_test_in_platform in platform['failed']:
                    if test_name == failed_test_in_platform['test']:
                        failed_for['failed_for'].append(platform['platform'])
                        continue

            result['merged'].append(failed_for)

        result['merged'] = list(sorted(result['merged'], reverse=True, key=lambda x: (len(x['failed_for']),
                                                                                      x['failed_for'])))
        return result

    def get_test_info(self, suite, test):
        return self.repo_client.find({'suite': suite, 'test': test})

    def get_latest_failed_message(self, suite, test):
        result = []
        for platform in platforms:
            report = list(self.repo_client.find_with_sort_limit({'platform': platform}, {'suits': 1},
                                                                [('start_time', DESCENDING),
                                                                 ('total', DESCENDING)], 1))
            if len(report) > 0:
                report = report[0]
                target_suite = [suite_item for suite_item in report['suits'] if suite_item['name'] == suite]
                if len(target_suite) > 0:
                    target_suite = target_suite[0]
                    target_test = [test_item for test_item in target_suite['tests'] if test_item['name'] == test]
                    if len(target_test) > 0:
                        target_test = target_test[0]
                        if 'message' in target_test:
                            result.append(target_test['message'])
        return list(set(result))

    def get_report_for_date(self, platform, date):
        start_date = parser.parse(date)
        end_date = start_date + relativedelta(days=+1)

        report = list(self.repo_client.find_with_sort_limit({'platform': platform, 'start_time': {
            '$lt': end_date,
            '$gte': start_date
        }}, excluding=None, sort=
                                                            [('start_time', DESCENDING),
                                                             ('total', DESCENDING)], limit=1))
        return report

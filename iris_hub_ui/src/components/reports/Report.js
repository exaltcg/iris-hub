import React from 'react';
import { connect } from 'react-redux';
import { Table, Breadcrumb } from 'semantic-ui-react';
import { Doughnut } from 'react-chartjs-2';

import { fetchReportForDate } from '../../actions';
import history from '../../history';
import LoadingBar from '../layout/LoadingBar';

class Report extends React.Component {

    state = { isLoading: false, filter: null }

    componentDidMount() {
        const { platform } = this.props.match.params;
        const { date } = this.props.match.params;
        this.props.fetchReportForDate(platform, date, null);
    }

    renderChart() {
        const data = {
            labels: [
                'Passed',
                'Failed',
                'Error',
                'Skipped'
            ],
            datasets: [{
                data: [
                    this.props.report.passed,
                    this.props.report.failed,
                    this.props.report.errors,
                    this.props.report.skipped
                ],
                backgroundColor: [
                    '#21ba45',
                    '#db2828',
                    '#f2711c',
                    '#2185d0'
                ]
            }]
        }
        const legenopts = {
            display: true
        }
        return (
            <Doughnut getElementAtEvent={dataset => this.applyFilter(dataset)} legend={legenopts} height={100} data={data} />
        );
    }

    async applyFilter(dataset) {
        if (dataset[0]) {
            this.setState({
                isLoading: true
            });
            const { platform } = this.props.match.params;
            const { date } = this.props.match.params;

            const filterValue = dataset[0]._model.label.toUpperCase();
            await this.props.fetchReportForDate(platform, date, filterValue);
            this.setState({
                isLoading: false,
                filter: dataset[0]._model.label
            });

        }
    }

    renderBreadcrumb() {
        const { platform } = this.props.match.params;
        const { date } = this.props.match.params;

        return (<Breadcrumb size="massive">
            <Breadcrumb.Section link onClick={() => { history.push('/') }}>Dashboard</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section active>Report for {platform} on {date} {this.state.filter ? `(${this.state.filter.toLowerCase()} only)` : ''}</Breadcrumb.Section>
        </Breadcrumb>);
    }

    renderInnerTable() {
        if (this.state.isLoading) {
            return <LoadingBar />
        } else {
            return (
                <Table celled selectable stlyle={{ cursor: 'pointer' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Suite</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Message</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.props.report.suits.map(suite => {
                            return suite.tests.map(test => {
                                return (
                                    <Table.Row
                                        positive={test.result === 'PASSED'}
                                        negative={test.result === 'FAILED'}
                                        warning={test.result === 'ERROR'}
                                    >
                                        <Table.Cell>{suite.name}</Table.Cell>
                                        <Table.Cell>{test.name}</Table.Cell>
                                        <Table.Cell>{test.result}</Table.Cell>
                                        <Table.Cell>{test.message ? test.message : ''}</Table.Cell>
                                    </Table.Row>
                                );
                            })
                        })}
                    </Table.Body>
                </Table>


            );
        }
    }

    renderTable() {
        if (this.props.report) {
            return (
                <div>
                    {this.renderChart()}
                    <br />
                    {this.renderInnerTable()}
                </div>
            );

        } else {
            return <LoadingBar />
        }
    }

    render() {
        return (
            <div>
                {this.renderBreadcrumb()}
                {this.renderTable()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        report: state.reports.report
    }
}

export default connect(mapStateToProps, { fetchReportForDate })(Report);
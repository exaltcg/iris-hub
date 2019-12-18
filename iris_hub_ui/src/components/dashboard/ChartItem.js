import React, { Component } from 'react';
import { Message, Progress, Card, Label, Dropdown, Icon, Menu } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';

import client from '../../api/client';
import LoadingBar from '../layout/LoadingBar';
import history from '../../history';



class ChartItem extends Component {
    state = {
        percentage_passed: 0,
        data: null,
        date_range: 'This week',
        error_message: null,
        icon: null
    }

    async componentDidMount() {
        this.updateChart(1);
    }

    getIcon() {
        switch (this.props.platform) {
            case 'linux':
                return <Icon name='linux' />
            case 'osx':
                return <Icon name='apple' />
            default:
                return <Icon name='windows' />
        }
    }

    async updateChart(variant) {
        const response = await client.get(`/report/history/${this.props.platform}?period=${variant}`);
        if (response.status !== 200) {
            console.log(response);
            this.setState({ 'error_message': response.response.data.Message })
            return;
        }
        this.setState({ data: response.data });

        const last_result = response.data.result.slice(-1).pop();
        const percetage = ((last_result.item.passed + last_result.item.skipped) / last_result.item.total) * 100
        this.setState({ percentage_passed: Math.round(percetage) })
        this.setState({ 'error_message': null })

    }

    renderChart() {
        if (this.state.data) {
            return (
                this.state.error_message ? this.showErrorMessage(this.state.error_message) : this.renderLineChart()
            );
        } else {
            return <LoadingBar />
        }

    }
    showErrorMessage(message) {
        return (<Message negative>
            {message}
        </Message>);
    }
    renderLineChart() {
        const labels = []
        const passed = []
        const failed = []
        const errors = []
        const skipped = []
        for (var report of this.state.data.result) {
            labels.push(report.date)
            passed.push(report.item.passed)
            failed.push(report.item.failed)
            errors.push(report.item.errors)
            skipped.push(report.item.skipped)
        }

        const data = {
            labels: labels,
            datasets: [{
                label: 'Passed',
                data: passed,
                borderWidth: 1,
                backgroundColor: 'rgba(38, 180, 255, 0.1)',
                borderColor: '#4CAF50'
            }, {
                label: 'Failed',
                data: failed,
                borderWidth: 1,
                backgroundColor: 'rgba(136, 151, 170, 0.1)',
                borderColor: '#f12f2f'
            },
            {
                label: 'Errors',
                data: errors,
                borderWidth: 1,
                backgroundColor: 'rgba(136, 151, 170, 0.1)',
                borderColor: '#f28430'
            },
            {
                label: 'Skipped',
                data: skipped,
                borderWidth: 1,
                backgroundColor: 'rgba(136, 151, 170, 0.1)',
                borderColor: '#26B4FF'
            }
            ]
        };
        const legenopts = {
            display: true
        }

        return (
            <div>
                <Line options={legenopts} getElementAtEvent={dataset => this.navigateToDate(dataset)} data={data} />
                <Progress percent={this.state.percentage_passed} progress success />
            </div >
        );
    }

    navigateToDate(dataset) {
        if (dataset[0]) {
            history.push(`/reports/report/${this.props.platform}/${this.state.data.result[dataset[0]._index].date}`)
        }
    }

    async updateChartPeriod(variant) {
        switch (variant) {
            case 1:
                this.setState({ 'date_range': 'This week' });
                break;
            case 2:
                this.setState({ 'date_range': 'This month' });
                break;
            case 3:
                this.setState({ 'date_range': 'This year' });
                break;
            case 4:
                this.setState({ 'date_range': 'All time' });
                break;

            default:
                this.setState({ 'date_range': 'Unknown' });
        }
        this.updateChart(variant);
    }

    render() {
        return (
            <div className="eight wide column">
                <Card fluid>
                    <Card.Content>
                        <Card.Header>
                            {this.getIcon()} {this.props.platform} &nbsp;
                            <Label as='a'>
                                <Icon name='download' />{this.state.data ? this.state.data.result.slice(-1).pop().humanize : ''}
                            </Label>
                            <Menu compact className="right mini floated">
                                <Dropdown text={this.state.date_range} pointing className='link item ui'>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => { this.updateChartPeriod(1) }}>This week</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { this.updateChartPeriod(2) }}>This month</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { this.updateChartPeriod(3) }}>This year</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { this.updateChartPeriod(4) }}>All time</Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu>
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        {this.state.error_message ? this.showErrorMessage(this.state.error_message) : this.renderChart()}
                    </Card.Content>
                </Card>
            </div >
        );


    }
}



export default ChartItem;
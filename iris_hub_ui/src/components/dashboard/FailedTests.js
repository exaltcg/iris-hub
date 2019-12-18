import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';

import LoadingBar from '../layout/LoadingBar';
import FailedTest from './FailedTest';
import { fetchTags, fetchFailedTests, resetFailedTests } from '../../actions';



class FailedTests extends React.Component {
    state = { max_fail_rate: 0 }

    async componentDidMount() {
        this.props.resetFailedTests();
        await this.props.fetchTags();
        await this.props.fetchFailedTests();
        const max_val = []
        this.props.failed_tests.merged.forEach(element => {
            max_val.push(element.fail_rate);
        });
        this.setState({ max_fail_rate: Math.max.apply(Math, max_val) });
    }

    renderCount() {
        if (this.props.failed_tests == null) {
            return 0;
        } else {
            return this.props.failed_tests.merged.length
        }
    }

    renderTable() {
        if (this.props.failed_tests == null)
            return <LoadingBar />
        else
            return (
                <Table celled selectable stlyle={{ cursor: 'pointer' }}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='6'>Failed tests summary ({this.props.failed_tests ? this.props.failed_tests.merged.length : 0})</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>Suite</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Failed for</Table.HeaderCell>
                            <Table.HeaderCell>Tags</Table.HeaderCell>
                            <Table.HeaderCell>Fail rate</Table.HeaderCell>
                            <Table.HeaderCell>Assignee</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.props.failed_tests.merged.map(item => {
                            return (<FailedTest max_fail_rate={this.state.max_fail_rate} data={item} />)
                        })}

                    </Table.Body>
                </Table>

            );
    }

    render() {
        return (
            <div>
                {this.renderTable()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        failed_tests: state.dashboard.failed_tests
    }
}

export default connect(mapStateToProps, { fetchTags, fetchFailedTests, resetFailedTests })(FailedTests);
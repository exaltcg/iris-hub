import React from 'react';
import { connect } from 'react-redux';
import { Table, Label, Progress } from 'semantic-ui-react';

import history from '../../history';

class FailedTest extends React.Component {
    state = { tag_edit_mode: false }

    assignToMe() {

    }

    renderProgress(count) {
        const percentage = Math.round(count / this.props.max_fail_rate * 100)
        return (<Progress size="small" percent={percentage} progress error />
        );
    }

    render() {
        const { suite } = this.props.data;
        const { test } = this.props.data;

        return (<Table.Row onClick={() => { history.push(`/test/details/${suite}/${test}`) }} key={this.props.data.test}>
            <Table.Cell>{suite}</Table.Cell>
            <Table.Cell>{this.props.data.test}</Table.Cell>
            <Table.Cell>{this.props.data.failed_for.map(platform => {
                return <Label size='mini' color='red' key={platform}>{platform} </Label>
            })}</Table.Cell>
            <Table.Cell>{this.props.data.tags.length !== 0 ? this.props.data.tags.map(tag => {
                return (<Label color={tag.color} size="mini">#{tag.name}</Label>)
            }) : '[N/A]'}
                {this.props.data.assignee ? this.props.data.assignee === this.props.login ? '[EDIT]' : '' : ''}
            </Table.Cell>
            <Table.Cell>{this.renderProgress(this.props.data.fail_rate)}</Table.Cell>
            <Table.Cell>{this.props.data.assignee ? this.props.data.assignee : '[N/A]'}</Table.Cell>
        </Table.Row>);
    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        login: state.auth.login,
        tags: state.tags.loaded_tags
    }
}

export default connect(mapStateToProps, null)(FailedTest);
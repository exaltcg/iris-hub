import React from 'react';
import { connect } from 'react-redux';

import { fetchTags, resetTag } from '../../actions';

import { Button, Icon, Breadcrumb, Table } from 'semantic-ui-react';

import history from '../../history';

class Tags extends React.Component {
    componentDidMount() {
        this.props.fetchTags();
        this.props.resetTag();
        if (!this.props.isSignedIn) {
            history.push('/');
        }
    }
    renderBreadcrumb() {
        return (
            <Breadcrumb size="massive">
                <Breadcrumb.Section active>Tags</Breadcrumb.Section>
            </Breadcrumb>);
    }


    renderTags() {
        if (this.props.tags != null) {
            return (
                <Table selectable celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='3'>
                                Active tags {this.props.tags == null ? <Icon name="spinner" loading /> : ''}
                                <Button onClick={() => { this.navigate('/tags/new') }} className="right floated" primary icon>
                                    <Icon name='plus' />
                                    Add new tag</Button>

                            </Table.HeaderCell>
                        </Table.Row>

                        <Table.Row>
                            <Table.HeaderCell>Tag</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Color</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.props.tags.map(tag => {
                            console.log(tag._id);
                            return (
                                <Table.Row onClick={() => { history.push(`/tags/edit/${tag._id.$oid}`) }} key={tag._id.$oid}>
                                    <Table.Cell>{tag.name}</Table.Cell>
                                    <Table.Cell>{tag.description}</Table.Cell>
                                    <Table.Cell style={{ backgroundColor: tag.color }}>{tag.color}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>

            );
        }
    }
    navigate(path) {
        history.push(path);
    }
    render() {
        return (
            <div>
                {this.renderBreadcrumb()}
                {this.renderTags()}

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        tags: state.tags.loaded_tags
    }
}

export default connect(mapStateToProps, { fetchTags, resetTag })(Tags);
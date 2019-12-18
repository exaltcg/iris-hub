import React from 'react';
import { TimelineEvent } from 'react-event-timeline';
import { Checkbox, Icon, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { postTests, fetchMessages } from '../../actions';

class TestDetailTimelineEvent extends React.Component {

    state = {
        tags_expanded: false,
        loading: false
    }

    async componentDidMount() {
        await this.updateState();
    }

    async updateState() {
        if (this.props.messages) {
            const msg = this.props.messages.find(msg => msg.message === this.props.item.message);
            if (msg) {
                this.setState({ message: msg });
            }
        }
    }

    async switchTag(e, data) {
        this.setState({ loading: true });
        const post_data = {
            test: this.props.test,
            suite: this.props.suite,
            message: this.props.item.message,
            tag_id: data.tag
        }

        await this.props.postTests(post_data);
        await this.props.fetchMessages(this.props.suite, this.props.test);
        await this.updateState();
        this.setState({ loading: false });
    }

    renderTagsSwitcher() {
        if (this.state.tags_expanded) {
            if (this.state.loading) {
                return (
                    
                        <Loader active inline="centered" />
                    
                );
            } else {
                return (
                    this.props.tags.map(tag => {
                        let selected = false;
                        if (this.state.message) {
                            selected = this.state.message.tags.find(find_tag => find_tag.id === tag._id.$oid) != null
                        }
                        return (
                            <div>
                                <Checkbox
                                    key={tag._id.$oid}
                                    checked={selected}
                                    tag={tag._id.$oid}
                                    onChange={(e, data) => { this.switchTag(e, data) }}
                                    toggle
                                    label={tag.name} />
                            </div>
                        );
                    })
                );

            }
        }

    }

    async expandTags() {
        this.setState({ tags_expanded: !this.state.tags_expanded })
    }
    renderStatus(status, message) {
        if (!this.props.isSignedIn) {
            return status;
        } else {
            if (status !== 'PASSED' && message) {
                return (
                    <div>
                        <div style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => { this.expandTags() }}>{status}</div>
                        {this.renderTagsSwitcher()}
                    </div>
                )
            } else
                return (
                    status
                );
        }
    }

    render() {
        return (
            <TimelineEvent title={this.props.item.message ? this.props.item.message : ''}
                createdAt={this.props.item.date}
                icon={<Icon size="big" name="flask" className={this.props.item.status === 'PASSED' ? 'green' : 'red'} />}
                iconColor={this.props.item.status === 'PASSED' ? 'green' : 'red'}>
                {this.renderStatus(this.props.item.status, this.props.item.message)}
            </TimelineEvent>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.tests.loaded_messages
    }
}

export default connect(mapStateToProps, { postTests, fetchMessages })(TestDetailTimelineEvent);
import React from 'react';
import { Timeline } from 'react-event-timeline';
import { Card } from 'semantic-ui-react';
import { connect } from 'react-redux';
import swal from 'sweetalert';

import { fetchMessages } from '../../actions'
import client from '../../api/client';

import TestDetailsTimelineEvent from './TestDetailsTimelineEvent';


class TestDetailsTimeline extends React.Component {
    state = {
        timeline_data: null
    }

    async componentDidMount() {
        await this.props.fetchMessages(this.props.suite, this.props.test);
        const response = await client.get(`/report/get-tests-info/${this.props.platform}/${this.props.suite}/${this.props.test}`)
        if (response.status !== 200) {
            swal({
                title: "Error",
                text: response.response.data.message,
                icon: "error",
            })
        } else {

            this.setState({ timeline_data: response.data });
        }
    }



    renderTimeline() {
        if (this.state.timeline_data) {
            return (
                <Timeline>
                    {this.state.timeline_data.map(item => {
                        return (
                            <div key={item.report_id}>
                                <TestDetailsTimelineEvent
                                    suite={this.props.suite}
                                    test={this.props.test}
                                    tags={this.props.tags}
                                    isSignedIn={this.props.isSignedIn}
                                    item={item} />
                            </div>

                        );
                    })
                    }
                </Timeline>
            );


        } else {
            return <div>Loading...</div>
        }
    }

    render() {
        return (
            <div className="four wide column">
                <br />
                <Card fluid>
                    <Card.Content>
                        <Card.Header>{this.props.platform}</Card.Header>
                    </Card.Content>
                    <Card.Content>
                        {this.renderTimeline()}
                    </Card.Content>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        tags: state.tags.loaded_tags,
        messages: state.tests.loaded_messages

    }
}

export default connect(mapStateToProps, { fetchMessages })(TestDetailsTimeline);
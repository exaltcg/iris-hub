import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'semantic-ui-react';

import history from '../../history';
import { fetchTags } from '../../actions';
import TestDetailsTimeline from './TestDetailTimeline';

class TestDetail extends React.Component {

    componentDidMount(){
        this.props.fetchTags();
    }

    renderBreadcrumb(suite, test) {
        return (<Breadcrumb size="massive">
            <Breadcrumb.Section link onClick={() => { history.push('/') }}>Dashboard</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section active>Test history timeline - {suite} : {test}</Breadcrumb.Section>
        </Breadcrumb>);
    }

    render() {
        const { suite } = this.props.match.params;
        const { test } = this.props.match.params;

        return (
            <div>
                {this.renderBreadcrumb(suite, test)}


                <div className="ui stackable grid">
                    <TestDetailsTimeline suite={suite} test={test} platform="osx" />
                    <TestDetailsTimeline suite={suite} test={test} platform="linux" />
                    <TestDetailsTimeline suite={suite} test={test} platform="win" />
                    <TestDetailsTimeline suite={suite} test={test} platform="win7" />
                </div>


            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
    }
}


export default connect(mapStateToProps, { fetchTags })(TestDetail);
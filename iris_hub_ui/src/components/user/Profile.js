import React from 'react';
import { connect } from 'react-redux';
import history from '../../history';

class Profile extends React.Component {
    componentDidMount() {
        if (!this.props.isSignedIn) {
            history.push('/');
        }
    }

    render() {
        return (
            <div>
                <h1>Profile</h1>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { isSignedIn: state.auth.isSignedIn }
}

export default connect(mapStateToProps, null)(Profile);
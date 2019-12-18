import React from 'react';
import { connect } from 'react-redux';
import { signOut } from '../../actions'
import history from '../../history';

class Logout extends React.Component {
    async componentDidMount() {
        this.props.signOut();
        history.push('/');
    }

    render(){
        return(<div>Signing out...</div>);
    }
}

export default connect(null, { signOut })(Logout);
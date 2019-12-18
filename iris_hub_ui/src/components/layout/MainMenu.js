import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import history from '../../history';
import { connect } from 'react-redux';



class MainMenu extends React.Component {
    navigate(path) {
        history.push(path);
    }

    renderSignIn() {
        return (
            <Menu.Item onClick={() => { this.navigate('/auth/login'); }} active={this.props.location.pathname.includes('/auth')} as='a'>
                <Icon name='sign-in' />
                Sign In
        </Menu.Item>
        );
    }

    renderSignedIn() {
        return (
            <div>

                <Menu.Item onClick={() => { this.navigate('/tags'); }} active={this.props.location.pathname.includes('/tags')} as='a'>
                    <Icon name='hashtag' />
                    Tags
                </Menu.Item>

                <Menu.Item onClick={() => { this.navigate('/profile'); }} active={this.props.location.pathname.includes('/auth/profile')} as='a'>
                    <Icon name='user circle' />
                    {this.props.user_name}
                </Menu.Item>

                <Menu.Item onClick={() => { this.navigate('/auth/logout'); }} active={false} as='a'>
                    <Icon name='sign-out' />
                    Logout
            </Menu.Item>
            </div>
        );


    }
    render() {
        return (
            <div>
                <Menu.Item onClick={() => { this.navigate('/'); }} active={this.props.location.pathname === '/' || this.props.location.pathname.includes('/test/details')} as='a'>
                    <Icon name='dashboard' />
                    Dashboard
                </Menu.Item>
                {this.props.isSignedIn ? this.renderSignedIn() : this.renderSignIn()}
            </div>
        );

    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn,
        user_name: state.auth.name
    }
}

export default connect(mapStateToProps, null)(withRouter(MainMenu));
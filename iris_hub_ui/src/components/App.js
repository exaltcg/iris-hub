import React from 'react';
import { Router, Route } from 'react-router-dom';
import { Menu, Segment, Sidebar } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { collapse } from '../actions';

import MainMenu from './layout/MainMenu';

import AppHeader from './layout/AppHeader';
import Dashboard from './dashboard/Dashboard';
import Register from './auth/Register';
import LogIn from './auth/LogIn';
import TestDetail from './dashboard/TestDetail';
import history from '../history';
import Tags from './tags/Tags';
import Profile from './user/Profile';
import NewTag from './tags/NewTag';
import Logout from './auth/Logout';
import ConnectionError from './errors/ConnectionError';
import EditTag from './tags/EditTag';
import Report from './reports/Report';

class App extends React.Component {
    render() {
        return (
            <Router history={history}>

                <AppHeader />

                <Sidebar.Pushable style={{ margin: '0', minHeight: '100vh', display: 'flex', flexFlow: 'column nowrap' }} as={Segment}>
                    <Sidebar
                        as={Menu}
                        animation='slide out'
                        icon='labeled'
                        vertical
                        visible={!this.props.collapsed}
                        width='thin'
                    >
                        <MainMenu />
                    </Sidebar>

                    <Sidebar.Pusher>
                        <Segment basic>
                            <Route path="/" exact component={Dashboard}></Route>
                            <Route path="/auth/register" component={Register}></Route>
                            <Route path="/auth/login" component={LogIn}></Route>
                            <Route path="/auth/logout" component={Logout}></Route>
                            <Route path="/tags" exact component={Tags}></Route>
                            <Route path="/tags/edit/:id" component={EditTag}></Route>
                            <Route path="/tags/new" exact component={NewTag}></Route>
                            <Route path="/profile" component={Profile}></Route>
                            <Route path="/errors/connection" component={ConnectionError}></Route>
                            <Route path="/test/details/:suite/:test" component={TestDetail}></Route>
                            <Route path="/reports/report/:platform/:date" component={Report}></Route>
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </Router>
        );
    }
}


const mapStateToProps = (state) => {
    return { collapsed: state.menu.collapsed }
}

export default connect(mapStateToProps, { collapse })(App);


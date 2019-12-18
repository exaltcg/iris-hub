import React from 'react';
import { Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ConnectionError = () => {
    return (
        <Message negative>
            <Message.Header>We're sorry API server connection lost</Message.Header>
            <p>Try to click <Link to="/">HERE</Link> to refresh the page in a few minutes</p>
        </Message>
    );

}

export default ConnectionError;
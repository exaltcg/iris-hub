import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions';

import { Button, Form, Container, Label } from 'semantic-ui-react'

class Register extends React.Component {

    onSubmit = formValues => {
        console.log(formValues);
        this.props.registerUser(formValues);

    }

    renderError({ error, touched }) {
        if (touched && error) {
            return (
                <Label basic color='red' pointing>
                    {error}
                </Label>

            );
        }
    }

    renderInput = ({ input, type, placeholder, meta }) => {
        const inputClass = `form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`
        return (
            <Form.Field>
                <label>{placeholder}</label>
                <input
                    className={inputClass}
                    id={placeholder.replace(' ', '').toLowerCase()}
                    {...input}
                    type={type}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                {this.renderError(meta)}

            </Form.Field>
        );
    }


    render() {
        return (
            <Container>
                <h1>Register new IRIS HUB account</h1>
                <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                    <Form.Group widths='equal'>
                        <Field name="login" component={this.renderInput} type="text" placeholder="Login" />
                        <Field name="full_name" component={this.renderInput} type="text" placeholder="Full Name" />
                        <Field name="email" component={this.renderInput} type="email" placeholder="Email" />
                    </Form.Group>
                    <Field name="password" component={this.renderInput} type="password" placeholder="Password" />
                    <Field name="confirm" component={this.renderInput} type="password" placeholder="Confirm password" />
                    <Button primary type="submit" variant="primary">Submit</Button>
                </Form>
                <br />
                Already registered? <Link to="/auth/login">Sign In</Link>

            </Container>

        );
    }
}

const validate = (formValues) => {
    const errors = {};

    if (!formValues.login) {
        errors.login = 'Login is required';
    }
    if (!formValues.full_name) {
        errors.full_name = 'Name is required';
    }
    if (!formValues.password) {
        errors.password = 'Password is required';
    }

    if (!formValues.confirm) {
        errors.confirm = 'Confirm is required';
    }

    if (!formValues.email) {
        errors.email = 'Email is required';
    }




    return errors;
};

const mapStateToProps = (state) => {
    return { registerError: state.auth.registerError }
}

const formWrapped = reduxForm({
    form: 'register',
    validate: validate
})(Register);

export default connect(mapStateToProps, { registerUser })(formWrapped);
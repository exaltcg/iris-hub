import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signIn } from '../../actions';
import { Button, Form, Container, Label } from 'semantic-ui-react'

class LogIn extends React.Component {

    onSubmit = formValues => {
        this.props.signIn(formValues);

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
                <h1>Sign in to IRIS HUB</h1>
                <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                    <Field name="login" component={this.renderInput} type="text" placeholder="Login" />
                    <Field name="password" component={this.renderInput} type="password" placeholder="Password" />
                    <Button type="submit" primary>Submit</Button>
                </Form>
                <br />
                Don't have an account? <Link to="/auth/register">Register</Link>
            </Container>    
        );
    }
}

const validate = (formValues) => {
    const errors = {};

    if (!formValues.login) {
        errors.login = 'Login is required';
    }
    if (!formValues.password) {
        errors.password = 'Password is required';
    }

    return errors;
};

const formWrapped = reduxForm({
    form: 'signin',
    validate: validate
})(LogIn);

export default connect(null, { signIn })(formWrapped);
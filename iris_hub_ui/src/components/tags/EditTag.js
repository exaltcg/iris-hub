import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { fetchTag, updateTag } from '../../actions';
import { Button, Form, Container, Label, Breadcrumb } from 'semantic-ui-react'
import history from '../../history';

class EditTag extends React.Component {


    async componentDidMount() {
        const { id } = this.props.match.params;
        await this.props.fetchTag(id);
    }

    renderBreadcrumb() {
        return (<Breadcrumb size="massive">
            <Breadcrumb.Section link onClick={() => { history.push('/tags') }}>Tags</Breadcrumb.Section>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section active>Edit Tag</Breadcrumb.Section>
        </Breadcrumb>);
    }

    onSubmit = formValues => {
        this.props.updateTag(formValues);
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
        let color = null;
        if (input.name === 'color') {
            color = input.value;
        }
        const inputClass = `form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`
        return (
            <Form.Field>
                <label>{placeholder}</label>
                <input
                    className={inputClass}
                    id={placeholder.replace(' ', '').toLowerCase()}
                    {...input}
                    type={type}
                    style={{ backgroundColor: color }}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                {this.renderError(meta)}

            </Form.Field>
        );
    }


    render() {
        return (<div>
            {this.renderBreadcrumb()}
            <Container>
                <Form loading={this.props.tag == null}
                    onSubmit={this.props.handleSubmit(this.onSubmit)}>
                    <Form.Group widths='equal'>
                        <Field value="test" name="name" component={this.renderInput} type="text" placeholder="Name" />
                        <Field name="color" component={this.renderInput} type="text" placeholder="HTML Color (e.g. red or #FF0000)" />
                    </Form.Group>
                    <Field name="description" component={this.renderInput} type="text" placeholder="Description" />
                    <Button type="submit" primary>Submit</Button>
                </Form>
            </Container>

        </div>);
    }
}

const validate = (formValues) => {
    const errors = {};

    if (!formValues.name) {
        errors.name = 'Name is required';
    }

    return errors;
};

const mapStateToProps = (state) => {
    return {
        initialValues: state.tags.loaded_tag,
        tag: state.tags.loaded_tag
    }
}

const formWrapped = reduxForm({
    form: 'newtag',
    validate: validate,
    enableReinitialize: true
})(EditTag);

export default connect(mapStateToProps, { fetchTag, updateTag })(formWrapped);
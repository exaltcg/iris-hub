import client from '../api/client';
import history from '../history'
import {
    SIGN_IN,
    SIGN_OUT,
    COLLAPSED_MENU,
    FETCH_TAGS,
    FETCH_FAILED_TESTS,
    FETCH_TAG,
    UPDATE_TAG,
    RESET_TAG,
    FETCH_MESSAGES,
    RESET_FAILED_TESTS,
    FETCH_REPORT_FOR_DATE
} from './types';
import swal from 'sweetalert';

export const fetchTag = (id) => async dispatch => {
    const response = await client.get(`/tag/${id}`)
    if (response.status === 200) {
        dispatch({
            type: FETCH_TAG,
            payload: response.data
        })
    }

}

export const resetTag = () => {
    return {
        type: RESET_TAG
    }
}

export const resetFailedTests = () => {
    return {
        type: RESET_FAILED_TESTS
    }
}

export const fetchReportForDate = (platform, date, filter) => async dispatch => {
    const response = await client.get(`/report/${platform}/${date}`);
    if (response.status === 200) {
        const data = response.data;
        if (filter) {
            for (var suite of data.suits) {
                suite.tests = suite.tests.filter(test => test.result === filter);
            }
        }
        dispatch({
            type: FETCH_REPORT_FOR_DATE,
            payload: data
        })
    }

}

export const fetchMessages = (suite, test) => async dispatch => {
    const response = await client.get(`/test/${suite}/${test}`);
    if (response.status === 200) {
        dispatch({
            type: FETCH_MESSAGES,
            payload: response.data.messages
        })
    }

}

export const postTests = (postData) => async dispatch => {
    await client.post('/test', postData);
}

export const updateTag = (formValues) => async dispatch => {
    const response = await client.put(`/tag`, formValues)
    if (response.status === 200) {
        dispatch({
            type: UPDATE_TAG,
            payload: response.data
        })
        history.push('/tags');
    }

}


export const signIn = (formValues) => async dispatch => {

    const response = await client.post('/user/login', formValues)
    if (response.status === 200) {
        const sessionInfo = {
            name: response.data.name,
            token: response.data.access_token,
            login: formValues['login']
        }
        dispatch({
            type: SIGN_IN,
            payload: sessionInfo
        }
        )
        history.push('/');
    } else {
        console.log(response.response);
        swal({
            title: "Error",
            text: response.response.data.message,
            icon: "error",
        })
    }


    return {
        type: SIGN_IN
    }
}

export const signOut = () => async dispatch => {

    await client.get('/user/logout');

    dispatch({
        type: SIGN_OUT,
        payload: { 'message': 'ok' }
    });
}

export const collapse = (isCollapsed) => {
    return {
        type: COLLAPSED_MENU,
        payload: isCollapsed
    }
}

export const addTag = (formValues) => async dispatch => {

    const response = await client.post('/tag', formValues);
    if (response.status !== 201) {
        swal({
            title: "Error",
            text: response.response.data.message,
            icon: "error",
        })

    } else {
        history.push('/tags')
    }




}

export const fetchFailedTests = () => async dispatch => {
    const response = await client.get(`/report/failed-tests`);
    if (response.status !== 200) {
        swal({
            title: "Error",
            text: response.response.data.message,
            icon: "error",
        })

    } else {
        dispatch({
            type: FETCH_FAILED_TESTS,
            payload: response.data
        })
    }

}

export const fetchTags = () => async dispatch => {
    const response = await client.get('/tags');
    dispatch({
        type: FETCH_TAGS,
        payload: response.data
    })
}

export const assignTestToCurrentUser = (data) => async dispatch => {
    const response = await client.post('/tests/assign-user', data)
    if (response.status !== 201) {
        swal({
            title: "Error",
            text: response.response.data.message,
            icon: "error",
        })

    } else {
        history.push('/auth/login');
    }
}

export const registerUser = (formValues) => async dispatch => {
    const response = await client.post('/user/register', formValues)
    if (response.status !== 201) {
        swal({
            title: "Error",
            text: response.response.data.message,
            icon: "error",
        })

    } else {
        history.push('/auth/login');
    }
}
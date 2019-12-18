import axios from 'axios';
import history from '../history';



const instance = axios.create({
    baseURL: `${window.location.protocol}//${window.location.hostname}:8080`
})

instance.interceptors.request.use(config => {
    let token = localStorage.getItem("jwt_token")
    config.headers = Object.assign({
        Authorization: `Bearer ${token}`
    }, config.headers)
    return config
});

instance.interceptors.response.use(response => {
    return response;
}, error => {
    if (!error.response) {
        history.push('/errors/connection');
        return Promise.reject(error);
    }

    if (error.response.status === 401 && !error.request.responseURL.includes('user/login')) {
        history.push('/auth/logout');
    }
    return error;
    
});

export default instance;


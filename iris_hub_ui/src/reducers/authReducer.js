import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
    isSignedIn: localStorage.getItem('isSignedIn') ? true : localStorage.getItem('isSignedIn') === 'true',
    jwt_token: localStorage.getItem('jwt_token'),
    name: localStorage.getItem('name'),
    login: localStorage.getItem('login')
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGN_IN:
            localStorage.setItem('isSignedIn', true);
            localStorage.setItem('jwt_token', action.payload.token);
            localStorage.setItem('name', action.payload.name);
            localStorage.setItem('login', action.payload.login);
            return { ...state, isSignedIn: true, jwt_token: action.payload.token, name: action.payload.name, login: action.payload.login }
        case SIGN_OUT:
                localStorage.removeItem('isSignedIn')
                localStorage.removeItem('name')
                localStorage.removeItem('jwt_token');    
                localStorage.removeItem('login');    
            return { ...state, isSignedIn: false, jwt_token: null, name: null, login: null }
        default:
            return state;
    }
}
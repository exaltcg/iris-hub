import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './authReducer';
import mainMenuReducer from './mainMenuReducer';
import tagsReducer from './tagsReducer';
import dashboardReducer from './dashboardReducer';
import testsReducer from './testsReducer';
import reportReducer from './reportReducer';

export default combineReducers({
    form: formReducer,
    auth: authReducer,
    menu: mainMenuReducer,
    tags: tagsReducer,
    dashboard: dashboardReducer,
    tests: testsReducer,
    reports: reportReducer
})
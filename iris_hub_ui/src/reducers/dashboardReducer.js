import { FETCH_FAILED_TESTS, RESET_FAILED_TESTS } from '../actions/types';

const INITIAL_STATE = {
    failed_tests: null
}


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_FAILED_TESTS:
            return { ...state, failed_tests: action.payload }
        case RESET_FAILED_TESTS:
            return { ...state, failed_tests: null }
        default:
            return state;
    }
}


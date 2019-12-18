import { FETCH_REPORT_FOR_DATE } from '../actions/types';

const INITIAL_STATE = {
    report: null,
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_REPORT_FOR_DATE:
            return { ...state, report: action.payload }
        default:
            return state;
    }
}

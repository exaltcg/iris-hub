import { FETCH_MESSAGES } from '../actions/types';

const INITIAL_STATE = {
    loaded_messages: null
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_MESSAGES:
            return { ...state, loaded_messages: action.payload }
        default:
            return state;
    }
}

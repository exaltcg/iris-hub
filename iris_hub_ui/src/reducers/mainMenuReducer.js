import { COLLAPSED_MENU } from '../actions/types';

const INITIAL_STATE = {
    collapsed: false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COLLAPSED_MENU:
            return { ...state, collapsed: action.payload }
        default:
            return state;
    }
}
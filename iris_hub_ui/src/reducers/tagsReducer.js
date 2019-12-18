import { FETCH_TAGS, FETCH_TAG, RESET_TAG } from '../actions/types';

const INITIAL_STATE = {
    loaded_tags: null,
    loaded_tag: null
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_TAGS:
            return { ...state, loaded_tags: action.payload }
        case FETCH_TAG:
            return { ...state, loaded_tag: action.payload }
        case RESET_TAG:
            return { ...state, loaded_tag: null }
        default:
            return state;
    }
}

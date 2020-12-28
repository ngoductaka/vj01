import { LOG_OUT_SUCCESS, GET_LIST_SUBJECTS } from '../constants';

const INITIAL_STATE = {
    subjects: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_LIST_SUBJECTS:
            return {
                ...state,
                subjects: action.data,
            };
        case LOG_OUT_SUCCESS:
            return INITIAL_STATE;
        default:
            return state;
    }
};

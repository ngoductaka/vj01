import { STARTING_APP_TIME, RESET_TIME, RATING_STATUS, LOG_OUT_SUCCESS, SET_LEARNING_TIMES, RESET_LEARNING_TIMES } from '../constants';

const INITIAL_STATE = {
    time: 0,
    rated: 0,
    learning_times: 0
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RATING_STATUS:
            return {
                ...state,
                rated: action.status
            };
        case SET_LEARNING_TIMES:
            return {
                ...state,
                learning_times: state.learning_times + 1
            };
        case RESET_LEARNING_TIMES:
            return {
                ...state,
                learning_times: 0
            };
        case STARTING_APP_TIME:
            return {
                ...state,
                time: action.time,
            };
        case RESET_TIME:
            return {
                ...INITIAL_STATE,
            };
        case LOG_OUT_SUCCESS:
            return INITIAL_STATE;
        default:
            return state;
    }
};

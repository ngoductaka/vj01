import { get } from 'lodash';
import { LOG_OUT_SUCCESS, GET_LIST_SUBJECTS, GET_ALL_SCREENS_FOR_ADS } from '../constants';

const INITIAL_STATE = {
    subjects: [],
    screens: [],
    frequency: 8
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_LIST_SUBJECTS:
            return {
                ...state,
                subjects: action.data,
            };
        case GET_ALL_SCREENS_FOR_ADS:
            // console.log('a,snalslansas', action.data);
            return {
                ...state,
                screens: get(action, 'data[0].screens', {
                    "overview_test": "1",
                    "lesson": "1",
                    "lesson_overview": "0",
                    "analyse_test": "0",
                    "practice_exam": "0",
                    "view_answer": "1",
                }),
                frequency: get(action, 'data[0].frequency', 6),
            };
        case LOG_OUT_SUCCESS:
            return INITIAL_STATE;
        default:
            return state;
    }
};

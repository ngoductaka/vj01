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
            return {
                ...state,
                screens: get(action.data, 'data[0].screens', {
                    "overview_test": "1",
                    "lesson": "1",
                    "lesson_overview": "1",
                    "analyse_test": "0",
                    "practice_exam": "1",
                    "view_answer": "1",
                    "list_test": "0"
                }),
                frequency: get(action.data, 'data[0].frequency', 6),
            };
        case LOG_OUT_SUCCESS:
            return INITIAL_STATE;
        default:
            return state;
    }
};

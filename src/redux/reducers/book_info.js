import { SET_BOOK_INFO, LOG_OUT_SUCCESS } from '../constants';

const INITIAL_STATE = {
  relatedBook: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_BOOK_INFO:
      return {
        ...state,
        ...action.bookInfo,
      };
    case LOG_OUT_SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};

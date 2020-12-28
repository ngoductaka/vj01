import { SET_USER_INFO, LOGIN_WITH_GOOGLE_SUCCESS, SET_LOW_DEVICE, LOGIN_WITH_GOOGLE_FAIL, LOGIN_WITH_FACEBOOK_SUCCESS, LOGIN_WITH_FACEBOOK_FAIL, LOG_OUT, LOG_OUT_SUCCESS, GET_SAVED_USER_SUCCESS, NEVER_SHOW_LOGIN_AGAIN, LOGIN_WITH_APPLE_FAIL, LOGIN_WITH_APPLE_SUCCESS, UPDATE_AVATAR } from '../constants';
import { get } from 'lodash';

const INITIAL_STATE = {
  user: {},
  error: null,
  never_popup: false,
  logged_in: false,
  low_device: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        ...action.userInfo,
      };
    case UPDATE_AVATAR:
      return {
        ...state,
        user: { ...state.user, avatar_id: action.data }
      };
    case NEVER_SHOW_LOGIN_AGAIN: {
      return {
        ...state,
        never_popup: true
      };
    }
    case SET_LOW_DEVICE: {
      return {
        ...state,
        low_device: action.data
      };
    }
    case LOGIN_WITH_APPLE_SUCCESS: {
      return {
        ...state,
        user: action.payload,
        logged_in: true
      }
    }
    case LOGIN_WITH_APPLE_FAIL: {
      return {
        ...state
      }
    }
    case LOGIN_WITH_GOOGLE_SUCCESS: {
      return {
        ...state,
        user: action.payload,
        logged_in: true,
        class: get(action, 'payload.grade_id', '')
      }
    }
    case LOGIN_WITH_GOOGLE_FAIL: {
      return {
        ...state,
        // error: action.payload
      }
    }
    case LOGIN_WITH_FACEBOOK_SUCCESS: {
      return {
        ...state,
        user: action.payload,
        logged_in: true,
        class: get(action, 'payload.grade_id', '')
      }
    }
    case LOGIN_WITH_FACEBOOK_FAIL: {
      return {
        ...state,
        // error: action.payload
      }
    }
    case GET_SAVED_USER_SUCCESS: {
      return {
        ...state,
        user: action.userInfo,
        logged_in: true
      }
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        user: {},
        error: null,
        logged_in: false
      }
    }
    default:
      return state;
  }
};

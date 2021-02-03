import { SET_USER_INFO, REQUEST_LOGIN_WITH_GOOGLE, REQUEST_LOGIN_WITH_FACEBOOK, REQUEST_LOG_OUT, SET_LOW_DEVICE, GET_SAVED_USER_SUCCESS, RATING_STATUS, STARTING_APP_TIME, NEVER_SHOW_LOGIN_AGAIN, REQUEST_LOGIN_WITH_APPLE, SET_LEARNING_TIMES, RESET_LEARNING_TIMES, UPDATE_AVATAR, SET_ARTICLE_LEARNING_TIMES } from '../constants';

/**
 * Changes the input field of the form
 *
 * @param  {string} userInfo The new text of the input field
 *
 * @return {object} An action object with a type of SET_USER_INFO
 */

export const actLoginWithApple = (data) => {
  return ({
    type: REQUEST_LOGIN_WITH_APPLE,
    data
  });
}

export const actLoginWithFacebook = () => {
  return ({
    type: REQUEST_LOGIN_WITH_FACEBOOK
  });
}

export const actionLoginWithGoogle = () => {
  return ({
    type: REQUEST_LOGIN_WITH_GOOGLE
  });
}

export const actLogout = () => {
  return ({
    type: REQUEST_LOG_OUT
  });
}


export function setUserInfo(userInfo) {
  return {
    type: SET_USER_INFO,
    userInfo,
  };
}

export function setSavedUser(userInfo) {
  return {
    type: GET_SAVED_USER_SUCCESS,
    userInfo,
  };
}

export function setDeviceInfo(data) {
  return {
    type: SET_LOW_DEVICE,
    data,
  };
}

export function setRatingStatus(status) {
  return {
    type: RATING_STATUS,
    status
  }
}

export function setCurrentTime(time) {
  return {
    type: STARTING_APP_TIME,
    time
  }
}

export function setLearningTimes() {
  return {
    type: SET_LEARNING_TIMES
  }
}

export function setArticleLearningTimes() {
  return {
    type: SET_ARTICLE_LEARNING_TIMES
  }
}

export function resetLearningTimes() {
  return {
    type: RESET_LEARNING_TIMES
  }
}

export function neverShowLogin() {
  return {
    type: NEVER_SHOW_LOGIN_AGAIN
  }
} 

export function updateAvatar(data) {
  return {
    type: UPDATE_AVATAR,
    data
  }
} 


export default { setUserInfo };

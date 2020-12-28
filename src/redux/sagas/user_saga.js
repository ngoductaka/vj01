import { takeLatest, put } from 'redux-saga/effects';
import { GoogleSignin } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import appleAuth, {
    AppleAuthError,
    AppleAuthRequestScope,
    AppleAuthRealUserStatus,
    AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import { LoginManager } from 'react-native-fbsdk';

import { REQUEST_LOGIN_WITH_GOOGLE, REQUEST_LOGIN_WITH_FACEBOOK, LOGIN_WITH_GOOGLE_SUCCESS, LOGIN_WITH_GOOGLE_FAIL, LOG_OUT_SUCCESS, LOG_OUT_FAIL, LOGIN_WITH_FACEBOOK_SUCCESS, LOGIN_WITH_FACEBOOK_FAIL, REQUEST_LOGIN_WITH_APPLE, LOGIN_WITH_APPLE_SUCCESS, LOGIN_WITH_APPLE_FAIL, LOG_OUT, REQUEST_LOG_OUT } from '../constants';
import { KEY, saveItem } from '../../handle/handleStorage';
import { user_services } from '../services';
import api from '../../handle/api';
import { endpoints } from '../../constant/endpoints';
import NavigationService from '../../Router/NavigationService';
import { Constants, FIRST_TIME } from '../../handle/Constant';
import { helpers } from '../../utils/helpers';

function* loginWithApple(action) {
    const updateCredentialStateForUser = action.data;
    // start a login request
    try {
        const appleAuthRequestResponse = yield appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        });

        // console.log('appleAuthRequestResponse', appleAuthRequestResponse);

        const {
            fullName,
            email,
            nonce,
            identityToken,
            realUserStatus
        } = appleAuthRequestResponse;

        console.log('asas.a.a.s.as', appleAuthRequestResponse);

        user_services.fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
            updateCredentialStateForUser(`Error: ${error.code}`),
        );

        if (identityToken) {
            // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
            // console.log(appleAuthRequestResponse);
        } else {
            // no token - failed sign-in?
        }

        if (realUserStatus === AppleAuthRealUserStatus.LIKELY_REAL) {
            // console.log("I'm a real person!");
        }

        const name = (fullName.givenName ? fullName.givenName : '') + ' ' + (fullName.familyName ? fullName.familyName : '');

        const payload = {
            token: identityToken,
            type: 2,
            provider_id: nonce,
            name: name.trim().length > 0 ? name : helpers.randomName(),
            email: email ? email : `${nonce}@gmail.com`,
            avatar: null,
        }

        const result = yield api.post(endpoints.SOCIAL_LOGIN, { ...payload });
        // console.log('asasasas', result);

        if (result.access_token) {
            const temp = {
                ...result.user,
                token: result.access_token,
                device: result.device ? result.device : null
            }
            saveItem(KEY.saved_user, temp);
            saveItem(Constants.ACCESS_TOKEN, result.access_token);
            saveItem(Constants.APPLE_PAYLOAD, payload);
            saveItem(Constants.TYPE_LOGIN, 2);
            yield put({
                type: LOGIN_WITH_APPLE_SUCCESS,
                payload: temp
            });
            NavigationService.navigate('InAppStack');
        } else {
            yield put({
                type: LOGIN_WITH_APPLE_FAIL,
            });
            alert('Đã có lỗi xảy ra');
        }
    } catch (error) {
        yield put({
            type: LOGIN_WITH_APPLE_FAIL
        });
        if (error.code === AppleAuthError.CANCELED) {
            console.warn('User canceled Apple Sign in.');
        } else {
            console.error(error);
        }
    }
}

function* loginWithFacebook() {
    try {
        const data = yield user_services.onLoginFbPress();
        const result = yield api.post(endpoints.SOCIAL_LOGIN, {
            "token": data.token,
            "type": 0,
        });

        if (result.access_token) {
            const payload = {
                ...result.user,
                token: result.access_token,
                device: result.device
            }
            saveItem(KEY.saved_user, payload);
            saveItem(Constants.ACCESS_TOKEN, result.access_token);
            saveItem(Constants.SOCIAL_TOKEN, data.token);
            saveItem(Constants.TYPE_LOGIN, 0);
            yield put({
                type: LOGIN_WITH_FACEBOOK_SUCCESS,
                payload
            });
            NavigationService.navigate('InAppStack');
        } else {
            yield put({
                type: LOGIN_WITH_FACEBOOK_FAIL,
            });
            alert('Đã có lỗi xảy ra');
        }

    } catch (error) {
        // console.log('111111', error);
        yield put({
            type: LOGIN_WITH_FACEBOOK_FAIL,
        });
    }
};


function* loginWithGoogle() {
    try {
        yield GoogleSignin.hasPlayServices();
        const userInfo = yield GoogleSignin.signIn();
        // console.log('---------', userInfo);
        const result = yield api.post(endpoints.SOCIAL_LOGIN, {
            "token": userInfo.idToken,
            "type": 1,
        });
        if (result.access_token) {
            const payload = {
                ...result.user,
                token: result.access_token,
                // token: result.data.device,
            }
            saveItem(KEY.saved_user, payload);
            saveItem(Constants.ACCESS_TOKEN, result.access_token);
            saveItem(Constants.SOCIAL_TOKEN, userInfo.idToken);
            saveItem(Constants.TYPE_LOGIN, 1);
            yield put({
                type: LOGIN_WITH_GOOGLE_SUCCESS,
                payload
            });
            NavigationService.navigate('InAppStack');
        } else {
            yield put({
                type: LOGIN_WITH_GOOGLE_FAIL,
            });
            alert('Đã có lỗi xảy ra');
        }

    } catch (error) {
        // console.log('error gg login', error)
        yield put({
            type: LOGIN_WITH_GOOGLE_FAIL,
            payload: error.code
        });
    }
}

function* handleLogout(action) {
    try {
        AsyncStorage.clear();
        AsyncStorage.setItem(FIRST_TIME, "1");
        saveItem(KEY.firebase_token, null);
        const result = yield user_services.fetchLogout();
        // console.log('handleLogout-ok', result);
    } catch (error) {
        // console.log('handleLogout-fail', error);
    }
    yield put({
        type: LOG_OUT_SUCCESS
    });
    saveItem(KEY.saved_user, null);
    if (GoogleSignin.isSignedIn) {
        GoogleSignin.signOut()
            .then(() => {
                // console.log('user signed out. do your job!')
            })
            .catch(err => {
                // console.error('sum tim wong', err)
            });
    }
    LoginManager.logOut();
}

export function* watchLoginWithApple() {
    yield takeLatest(REQUEST_LOGIN_WITH_APPLE, loginWithApple);
}

export function* watchLoginWithFacebook() {
    yield takeLatest(REQUEST_LOGIN_WITH_FACEBOOK, loginWithFacebook);
}

export function* watchLoginWithGoogle() {
    yield takeLatest(REQUEST_LOGIN_WITH_GOOGLE, loginWithGoogle);
}

export function* watchLogout() {
    yield takeLatest(REQUEST_LOG_OUT, handleLogout);
}

import { takeLatest, put } from 'redux-saga/effects';
import { GoogleSignin } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import appleAuth, {
    AppleAuthError,
    AppleAuthRealUserStatus,
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
import { get } from 'lodash';

function* loginWithApple(action) {
    const updateCredentialStateForUser = action.data;
    // start a login request
    try {
        const appleAuthRequestResponse = yield appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // console.log('appleAuthRequestResponse', appleAuthRequestResponse);

        const credentialState = yield appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        // use credentialState response to ensure the user is authenticated
        if (credentialState === appleAuth.State.AUTHORIZED) {
            // user is authenticated
            // console.log('-------', appleAuthRequestResponse);


            user_services.fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
                updateCredentialStateForUser(`Error: ${error.code}`),
            );

            const name = get(appleAuthRequestResponse, 'fullName.givenName', '') + get(appleAuthRequestResponse, 'fullName.familyName', '');

            // console.log('asbdkjabdkjasd', name);
            const payload = {
                token_social: get(appleAuthRequestResponse, 'identityToken', ''),
                token: get(appleAuthRequestResponse, 'identityToken', ''),
                type: 2,
                provider_id: get(appleAuthRequestResponse, 'nonce', ''),
                name: name && name.trim().length > 0 ? name : helpers.randomName(),
                email: get(appleAuthRequestResponse, 'email', null) ? get(appleAuthRequestResponse, 'email', null) : `${get(appleAuthRequestResponse, 'nonce', '')}@gmail.com`,
                avatar: null,
            }

            const result = yield api.post(endpoints.SOCIAL_LOGIN, { ...payload });

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
        } else {

        }
    } catch (error) {
        console.log('--------', error);
        yield put({
            type: LOGIN_WITH_APPLE_FAIL
        });
        if (error.code === appleAuth.Error.CANCELED) {
            console.warn('User canceled Apple Sign in.');
        } else {
            console.error(error);
        }
    }
}

function* loginWithFacebook() {
    try {
        console.log('====login facebook')
        const data = yield user_services.onLoginFbPress();
        const result = yield api.post(endpoints.SOCIAL_LOGIN, {
            "token_social": data.token,
            "token": data.token,
            "type": 0,
        });

        if (result.access_token) {
            const payload = {
                ...result.user,
                token: result.access_token,
                device: result.device,
                photo: get(data, 'avatar', '')
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
        console.log('LOGIN_WITH_FACEBOOKfail', error);
        yield put({
            type: LOGIN_WITH_FACEBOOK_FAIL,
        });
    }
};


function* loginWithGoogle() {
    try {
        yield GoogleSignin.hasPlayServices();
        const userInfo = yield GoogleSignin.signIn();
        // console.log('-----userInfouserInfouserInfo23----', userInfo.idToken);
        const result = yield api.post(endpoints.SOCIAL_LOGIN, {
            "token_social": userInfo.idToken,
            "token": userInfo.idToken,
            "type": 1,
        });
        if (result.access_token) {
            const payload = {
                ...result.user,
                token: result.access_token,
                photo: get(userInfo, 'user.photo', ''),
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

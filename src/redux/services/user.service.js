import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import appleAuth, {
    AppleAuthCredentialState
} from '@invertase/react-native-apple-authentication';
import axios from 'axios';
import api from '../../handle/api';
import { endpoints } from '../../constant/endpoints';

export const user_services = {
    onLoginFbPress,
    fetchAndUpdateCredentialState,
    fetchLogout,
    sendFeedback,
    updateAvatar,
    getConsulting,
    bookmarkLesson,
    updateProfile,
    savePracticeScore,
    getCurrentRaking,
    postUserClickNoti
}

async function savePracticeScore(body) {
    return api.post(`/practice/score`, body);
}

async function getCurrentRaking(params) {
    return api.get(`/practice/score?exam_id=${params}`);
}

async function sendFeedback(body) {
    return api.post(`/send-feedback`, body);
}

async function getConsulting(body) {
    return api.post(`/users/advisory-register`, body);
}

async function updateProfile(userId, body) {
    return api.post(`/users/${userId}/update`, body);
}

async function updateAvatar(body) {
    return api.post(`/users/save-avatar`, body);
}

async function bookmarkLesson(body) {
    return api.post(`/users/bookmarks`, body);
}

async function postUserClickNoti(body) {
    return api.post('/admin/notification/user-click', body, {}, 'https://apps.vietjack.com:8081');
}

async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
    if (user === null) {
        updateCredentialStateForUser('N/A');
    } else {
        const credentialState = await appleAuth.getCredentialStateForUser(user);
        if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
            updateCredentialStateForUser('AUTHORIZED');
        } else {
            updateCredentialStateForUser(credentialState);
        }
    }
}

async function fetchLogout() {
    try {
        return await api.post(`${endpoints.LOG_OUT}`, {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }, {});
    } catch (error) {
        return error;
    }
}

async function onLoginFbPress() {
    return await new Promise(function (resolve, reject) {
        LoginManager.logInWithPermissions(['public_profile']).then(
            (result) => {
                if (!result.isCancelled) {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            let accessToken = data.accessToken;

                            const responseInfoCallback = (error, result) => {
                                if (error) {
                                    reject(null);
                                } else {
                                    const payload = {
                                        name: result.name,
                                        avatar: result.picture.data.url,
                                        email: result.email ? result.email : null,
                                        id: result.id,
                                        token: accessToken
                                    };
                                    resolve(payload);
                                }
                            }

                            const infoRequest = new GraphRequest(
                                '/me',
                                {
                                    accessToken: accessToken,
                                    parameters: {
                                        fields: {
                                            string: 'email,name,middle_name,picture'
                                        }
                                    }
                                },
                                responseInfoCallback
                            );

                            // Start the graph request.
                            new GraphRequestManager().addRequest(infoRequest).start()

                        }
                    )
                } else {
                    reject(null);
                }
            },
            (error) => {
                reject(error);
            }
        );
    });
}
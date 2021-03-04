import React, { useEffect, useState } from 'react';
import { View, Platform, Image, Linking, LogBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { GoogleSignin } from '@react-native-community/google-signin';
import LottieView from 'lottie-react-native';
import { getVersion } from 'react-native-device-info';
import AwesomeAlert from 'react-native-awesome-alerts';
import Orientation from 'react-native-orientation-locker';

import { FIRST_TIME, COLOR } from '../../handle/Constant';
import { handleUserID } from '../../handle/api';
import { KEY } from '../../handle/handleStorage';
import { setUserInfo, setSavedUser } from '../../redux/action/user_info';
import { images } from '../../utils/images';
import { common_services } from '../../redux/services';
import { helpers } from '../../utils/helpers';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { get } from 'lodash';
import KochavaTracker from 'react-native-kochava-tracker';

// Configure
var configMapObject = {}
configMapObject[KochavaTracker.PARAM_ANDROID_APP_GUID_STRING_KEY] = "kovietjack-qy08u";
configMapObject[KochavaTracker.PARAM_IOS_APP_GUID_STRING_KEY] = "kovietjackios-3wqjwujza";
KochavaTracker.configure(configMapObject);

const Auth = (props) => {

    const [update, showUpdate] = useState(false);
    const [critical, setCritical] = useState(false);

    useEffect(() => {
        Orientation.lockToPortrait();
        SplashScreen.hide();
        try {
            GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            GoogleSignin.configure({
                forceConsentPrompt: true
            });
        } catch (err) {
            console.error('play services are not available');
        }
        GoogleSignin.configure({
            iosClientId: '62511586249-smvk8q5m9cciq1754rsnlnam4eja4u9n.apps.googleusercontent.com',
            webClientId: '62511586249-ok3i79o64lm29jnd5hne8aftfpunc183.apps.googleusercontent.com'
        });
        handleUserID();
        _checkAppVersion();

    }, []);

    const _navigateTo = (screen) => {
        setTimeout(() => {
            props.navigation.navigate(screen);
        }, 1500);
    };

    const _checkAppVersion = async () => {
        try {
            const appInfo = await common_services.getAppVersion();
            // console.log('---------', appInfo.version);
            if (appInfo && appInfo.version && appInfo.version.need_update == 1) {
                if (appInfo.version) {
                    const currentVersion = await getVersion();
                    const base_version_ios = get(appInfo.version, 'base_version_ios', currentVersion);
                    const base_version_android = get(appInfo.version, 'base_version_android', currentVersion);
                    const regex = /\./ig;
                    if (helpers.isIOS) {
                        const iosVer = parseInt(base_version_ios.replace(regex, ''));
                        if (parseInt(currentVersion.replace(regex, '')) < iosVer) {
                            setCritical(appInfo.version.critical == 1);
                            showUpdate(true);
                            return;
                        } else {
                            _fetchFirstTime();
                        }
                    } else {
                        const androidVer = parseInt(base_version_android.replace(regex, ''));
                        if (parseInt(currentVersion.replace(regex, '')) < androidVer) {
                            setCritical(appInfo.version.critical == 1);
                            showUpdate(true);
                            return;
                        } else {
                            _fetchFirstTime();
                        }
                    }
                } else {
                    _fetchFirstTime();
                }
            } else {
                _fetchFirstTime();
            }
        } catch (error) {
            console.log('------error', error);
            _fetchFirstTime();
        }
    }

    const _fetchFirstTime = async () => {
        try {
            const status = await AsyncStorage.getItem(FIRST_TIME);
            if (status !== "1") {
                _navigateTo('Intro');
            } else {
                AsyncStorage.getItem('class')
                    .then(className => {
                        if (className) {
                            props.setUserInfo({ class: className });
                        }
                    })
                    .catch(err => {

                    });
                AsyncStorage.getItem(KEY.saved_user)
                    .then(user => {
                        const userData = JSON.parse(user);
                        if (userData) {
                            console.log('use232ruseruseruser', userData.grade_id)
                            if (userData.grade_id) {
                                props.setUserInfo({ class: userData.grade_id });
                            }
                            props.setSavedUser(userData);
                            _navigateTo('InAppStack');
                        } else {
                            _navigateTo('Login');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        _navigateTo('Login');
                    });

            }
        } catch (error) {
            console.log(error, 'error_first');
            _navigateTo('Intro');
        }
    }

    const _handleLink = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            alert(`Địa chỉ này không đúng: ${url}`);
        }
    };

    // console.disableYellowBox = true;
    LogBox.ignoreAllLogs(true);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
            {Platform.OS === 'ios' ?
                <Image
                    source={images.logo_ios}
                    style={{ width: 300, resizeMode: 'contain' }}
                />
                :
                <Image
                    source={images.logo}
                    style={{ width: 200, resizeMode: 'contain' }}
                />
            }
            <LottieView
                autoPlay
                loop
                style={{
                    width: 225,
                    height: 225,
                }}
                duration={3000}
                source={require('../../public/anim.json')}
            />
            <AwesomeAlert
                show={update}
                showProgress={false}
                contentContainerStyle={{ padding: 20 }}
                title="Cập nhật!"
                titleStyle={{ fontSize: 18, marginBottom: 20, color: COLOR.MAIN, ...fontMaker({ weight: fontStyles.Bold }) }}
                message={`Đã có bản cập nhật mới trên\n${Platform.OS === 'ios' ? 'App Store' : 'Google Play'}.`}
                messageStyle={{ fontSize: 16, textAlign: 'center', lineHeight: 26, ...fontMaker({ weight: fontStyles.Regular }) }}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={!critical}
                showConfirmButton={true}
                confirmText="Cập nhật"
                cancelText="Bỏ qua"
                confirmButtonTextStyle={{ fontSize: 16, ...fontMaker({ weight: fontStyles.Regular }) }}
                cancelButtonTextStyle={{ fontSize: 16, ...fontMaker({ weight: fontStyles.Regular }) }}
                confirmButtonStyle={{ width: 120, alignItems: 'center', paddingVertical: 8, backgroundColor: COLOR.MAIN }}
                cancelButtonStyle={{ width: 120, alignItems: 'center', paddingVertical: 8 }}
                onConfirmPressed={() => {
                    _handleLink(Platform.OS === 'ios' ? 'https://apps.apple.com/us/app/vietjack/id1490262941' : 'https://play.google.com/store/apps/details?id=com.jsmile.android.vietjack');
                }}
                onCancelPressed={() => {
                    showUpdate(false);
                    _fetchFirstTime();
                }}
            />
        </View>
    )
}

const mapStateToProps = state => {
    return {
        userInfo: state.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setUserInfo: userInfo => dispatch(setUserInfo(userInfo)),
        setSavedUser: userInfo => dispatch(setSavedUser(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);


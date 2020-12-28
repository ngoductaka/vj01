import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { useNetInfo } from "@react-native-community/netinfo";
import appleAuth, {
    AppleButton
} from '@invertase/react-native-apple-authentication';
import * as Animatable from 'react-native-animatable';

import { actLoginWithFacebook, actionLoginWithGoogle, actLoginWithApple } from '../../redux/action/user_info';
import { user_services } from '../../redux/services';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { helpers } from '../../utils/helpers';
import { images } from '../../utils/images';
import { COLOR } from '../../handle/Constant';

const isSupported = appleAuth.isSupported;

const Login = (props) => {

    const { navigation } = props;

    const dispatch = useDispatch();
    const [show, setShow] = useState(false);

    const netInfo = useNetInfo();

    /**---------------------------apple sign in------------------------------ */
    const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);

    useEffect(() => {
        if (isSupported) {
            user_services.fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
                updateCredentialStateForUser(`Error: ${error.code}`),
            );
        }
        return () => { };
    }, []);

    useEffect(() => {
        if (isSupported) {
            return appleAuth.onCredentialRevoked(async () => {
                user_services.fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
                    updateCredentialStateForUser(`Error: ${error.code}`),
                );
            });
        }
    }, []);

    const _loginWithGoogle = () => {
        if (!netInfo.isConnected) {
            setShow(true);
        } else dispatch(actionLoginWithGoogle());
    }

    const _loginWithFacebook = () => {
        if (!netInfo.isConnected) {
            setShow(true);
        } else dispatch(actLoginWithFacebook());
    }

    const _signinWithApple = () => {
        if (!netInfo.isConnected) {
            setShow(true);
        } else dispatch(actLoginWithApple(updateCredentialStateForUser));
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20 }}>
                    <Animatable.View duration={2000} animation='bounceIn' style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={images.login_img}
                            style={{ width: helpers.isTablet ? 400 : 3 * Dimensions.get('window').width / 4, height: Dimensions.get('window').height / 2.5, resizeMode: 'contain', alignSelf: 'center' }}
                        />
                        <Text style={{ marginTop: 15, color: '#f27e8b', ...fontMaker({ weight: fontStyles.Bold }), fontSize: 30, textAlign: 'center' }}>Học cùng VietJack</Text>
                        <Text style={{ marginTop: 15, color: COLOR.black(.4), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 16, textAlign: 'center', lineHeight: 24, paddingHorizontal: 25 }}>Đăng nhập để có thể truy cập được quá trình học tập của bạn từ mọi nơi!</Text>
                    </Animatable.View>
                    <View style={{ width: Dimensions.get('window').width - 50 }}>
                        <View style={{ padding: 10 }}>
                            <Animatable.View animation='slideInRight'>
                                <TouchableOpacity onPress={_loginWithFacebook} style={{ ...styles.loginBtn, ...styles.shadow, backgroundColor: '#5972FB' }}>
                                    <Icon name='logo-facebook' style={{ color: 'white', fontSize: 18, }} />
                                    <Text style={styles.txtBtn}>FACEBOOK</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                            <Animatable.View delay={200} animation='slideInRight'>
                                <TouchableOpacity onPress={_loginWithGoogle} style={{ ...styles.loginBtn, ...styles.shadow, backgroundColor: '#E7727F' }}>
                                    <Icon type="EvilIcons" name='sc-google-plus' style={{ color: 'white', fontSize: 20, }} />
                                    <Text style={styles.txtBtn}>GOOGLE</Text>
                                </TouchableOpacity>
                            </Animatable.View>

                            {isSupported &&
                                <Animatable.View delay={400} animation='slideInRight' style={styles.shadow}>
                                    <View style={{ borderRadius: 24, overflow: 'hidden', marginTop: 20, }}>
                                        <AppleButton
                                            style={styles.appleButton}
                                            cornerRadius={5}
                                            buttonStyle={AppleButton.Style.BLACK}
                                            buttonType={AppleButton.Type.SIGN_IN}
                                            onPress={_signinWithApple}
                                        />
                                    </View>
                                </Animatable.View>
                            }
                        </View>
                    </View>
                </View>

            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    loginBtn: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: helpers.isTablet ? 380 : '100%',
        paddingVertical: 14,
        borderRadius: 24, marginTop: 20
    },
    appleButton: {
        width: helpers.isTablet ? 380 : '100%',
        alignSelf: 'center',
        paddingVertical: 25
    },
    shadow: {
        shadowColor: 'rgba(0, 0, 0, 0.12)',
        shadowOpacity: 0.8,
        elevation: 3,
        shadowRadius: 2,
        shadowOffset: { width: 1, height: 7 },
    },
    txtBtn: { color: 'white', fontWeight: '500', marginLeft: 10, fontSize: 16, ...fontMaker({ weight: fontStyles.SemiBold }) },
    shadowStyle: { shadowColor: 'black', shadowOffset: { width: -2, height: 2 }, shadowOpacity: 0.6, elevation: 2 },
    textBtn: { color: 'white', marginLeft: 8, ...fontMaker({ weight: 'Regular' }) },
    socialBtn: { justifyContent: 'center', flexDirection: 'row', alignItems: 'center', width: 140, height: 40, borderRadius: 5 },
    name: { alignItems: 'center', marginTop: 15, fontSize: 16, ...fontMaker({ weight: 'Bold' }), alignSelf: 'center', textAlign: 'center', paddingHorizontal: 20, lineHeight: 30 }
});

export default Login;

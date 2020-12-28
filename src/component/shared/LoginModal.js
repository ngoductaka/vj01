import React from 'react';
import {
    Text,
    Image,
    View,
    Platform,
    TouchableOpacity
} from 'react-native';
import ModalBox from 'react-native-modalbox';
import appleAuth, {
    AppleButton
} from '@invertase/react-native-apple-authentication';
import { Icon } from 'native-base';
const isSupported = appleAuth.isSupported;

export const LoginModal = ({ show, loginWithFacebook, loginWithGoogle, onCancel = () => { } }) => {
    return (
        <ModalBox
            isOpen={show}
            backdropPressToClose={false}
            swipeToClose={false}
            style={{ width: 320, height: null, borderRadius: 8, overflow: 'hidden', padding: 15 }}
            position='center'
        >
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: '700' }}>VietJack</Text>
                <Text style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.5)', marginTop: 6 }}>Học cùng bạn!</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <TouchableOpacity onPress={loginWithFacebook} style={{ backgroundColor: '#4368ad', ...styles.socialBtn }}>
                    <Icon name='logo-facebook' style={{ fontSize: 23, color: 'white' }} />
                    <Text style={styles.textBtn}>Đăng nhập với Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={loginWithGoogle} style={{ backgroundColor: '#d34e38', marginTop: 10, ...styles.socialBtn }}>
                    <Icon name='logo-google' style={{ fontSize: 23, color: 'white' }} />
                    <Text style={styles.textBtn}>Đăng nhập với Google</Text>
                </TouchableOpacity>
                {isSupported &&
                    <AppleButton
                        style={styles.appleButton}
                        cornerRadius={5}
                        buttonStyle={AppleButton.Style.BLACK}
                        buttonType={AppleButton.Type.SIGN_IN}
                    // onPress={_signinWithApple}
                    />
                }
                <TouchableOpacity onPress={onCancel} style={{ flexWrap: 'wrap', borderBottomWidth: 1, alignSelf: 'center', borderBottomColor: 'rgba(0, 0, 0, 0.2)', paddingHorizontal: 4, marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.6)' }}>Để sau</Text>
                </TouchableOpacity>
            </View>

        </ModalBox>
    );
}

const styles = {
    appleButton: {
        width: '100%',
        paddingVertical: 20,
        marginTop: 10, marginBottom: 20,
    },
    socialBtn: {
        borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 7,
    },
    textBtn: { fontSize: 15, color: 'white', marginLeft: 7, fontWeight: '500' },

}
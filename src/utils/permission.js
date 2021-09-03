
import {
    Platform
} from 'react-native';
import { check, PERMISSIONS, RESULTS, openSettings, request } from 'react-native-permissions';



const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const _handleOpenSetting = () => {
    Alert.alert(
        "Mở cài đặt",
        "Vui lòng cấp quyền để upload ảnh",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "OK", onPress: openSettings }
        ],
        { cancelable: true }
    );

}

export const cameraPermission = async ({ next = () => { } }) => {
    // 
    if (isIOS) {
        const result = await check(PERMISSIONS.IOS.CAMERA);
        if (result == RESULTS.GRANTED) {
            next()
        } else if (result === RESULTS.DENIED) {
            const resultRequest = await request(PERMISSIONS.IOS.CAMERA);
            if (resultRequest === RESULTS.GRANTED) {
                next()
            } else {
                _handleOpenSetting()
            }

        } else {
            next()
        }
    } else {
        const result = await check(PERMISSIONS.ANDROID.CAMERA);
        if (result === RESULTS.GRANTED) {
            next();
        } else if (result === RESULTS.DENIED) {
            const resultRequest = await request(PERMISSIONS.ANDROID.CAMERA);
            if (resultRequest === RESULTS.GRANTED) {
                next()
            } else {
                _handleOpenSetting()
            }
        } else {
            next()
        }
    }
}



export const photoPermission = async ({ next = () => { }}) => {
    // 
    if (helpers.isIOS) {
        const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (result == RESULTS.GRANTED) {
            next()
        } else if (result === RESULTS.DENIED) {
            const resultRequest = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
            if (resultRequest === RESULTS.GRANTED) {
                next()
            } else {
                _handleOpenSetting()
            }
        } else {
            next()
        }
    } else {
        const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        if (result === RESULTS.GRANTED) {
            next();
        } else if (result === RESULTS.DENIED) {
            const resultRequest = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            if (resultRequest === RESULTS.GRANTED) {
                next()
            } else {
                _handleOpenSetting()
            }
        } else {
            next()
        }
    }
};
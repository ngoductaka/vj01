import React from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import ModalBox from 'react-native-modalbox';
import { blackColor } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';

export const ExitModal = ({ show, onCancel = () => { }, onConfirm = () => { } }) => {
    return (
        <ModalBox
            isOpen={show}
            onClosed={onConfirm}
            backdropPressToClose={true}
            coverScreen={true}
            swipeToClose={true}
            style={{ width: 320, height: null, borderRadius: 8, overflow: 'hidden' }}
            position='center'
        >
            <View style={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 18, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: 15, textAlign: 'center', ...fontMaker({ weight: fontStyles.Regular }) }}>Bạn có muốn đăng xuất ứng dụng </Text>
                    <Text style={{ marginTop: 5, fontSize: 15, textAlign: 'center', ...fontMaker({ weight: fontStyles.Black }) }}>VietJack?</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderTopColor: blackColor(0.1), borderTopWidth: 1 }}>
                <TouchableOpacity onPress={onConfirm} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 14 }}>
                    <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), color: '#ff7620', fontSize: 16 }}>Học tiếp</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onCancel} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRightColor: blackColor(0.1), borderRightWidth: 1 }}>
                    <Text style={{ color: blackColor(0.6), fontSize: 16, ...fontMaker({ weight: fontStyles.Regular }) }}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>

        </ModalBox>
    );
}
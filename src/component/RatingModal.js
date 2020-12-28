import React from 'react';
import {
    Text,
    Image,
    View,
    Platform,
    TouchableOpacity
} from 'react-native';
import ModalBox from 'react-native-modalbox';

import { images } from '../utils/images';
import { blackColor } from '../handle/Constant';
import { fontMaker, fontStyles } from '../utils/fonts';

export const RatingModal = ({ show, onCancel = () => { }, onConfirm = () => { } }) => {
    return (
        <ModalBox
            isOpen={show}
            backdropPressToClose={false}
            swipeToClose={false}
            coverScreen
            style={{ width: 320, height: null, borderRadius: 8, overflow: 'hidden' }}
            position='center'
        >
            <View style={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 18, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={images.img1}
                    style={{ alignSelf: 'center', width: 90, height: 90 }}
                />
                <Text style={{ textAlign: 'center', marginTop: 16, fontSize: 15 }}>
                    <Text style={{ ...fontMaker({ weight: fontStyles.Regular }) }}>Mong rằng bạn hài lòng với </Text>
                    <Text style={{ ...fontMaker({ weight: fontStyles.Bold }) }}>VietJack.</Text>
                </Text>
                <Text style={{ textAlign: 'center', marginTop: 8, fontSize: 15, ...fontMaker({ weight: fontStyles.Regular }) }}>Bạn có thể dành vài phút đánh giá chúng tôi trên {Platform.OS === 'ios' ? 'App Store' : 'Google Play'}?</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderTopColor: blackColor(0.1), borderTopWidth: 1 }}>
                <TouchableOpacity onPress={onCancel} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRightColor: blackColor(0.1), borderRightWidth: 1 }}>
                    <Text style={{ color: blackColor(0.6), fontSize: 17, ...fontMaker({ weight: fontStyles.Regular }) }}>Để sau</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onConfirm} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 14 }}>
                    <Text style={{ fontWeight: '700', color: '#ff7620', fontSize: 17, ...fontMaker({ weight: fontStyles.Regular }) }}>Đến {Platform.OS === 'ios' ? 'App Store' : 'Google Play'}</Text>
                </TouchableOpacity>
            </View>

        </ModalBox>
    );
}
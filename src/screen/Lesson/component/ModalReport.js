import React, { useState } from 'react';
import {
    Text,
    Alert,
    View,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import ModalBox from 'react-native-modalbox';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

import { Icon } from 'native-base';
import { helpers } from '../../../utils/helpers';
import { COLOR } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { user_services } from '../../../redux/services';

export const FeedbackModal = (props) => {
    const {
        show = false,
        onClose = () => { },
        watchLater = () => { },
        _handleShare = () => { },
        data
    } = props;

    // console.log('dataaaaaaaaa', data);

    const handleBookmark = async () => {
        const result = await user_services.bookmarkLesson({
            'bookmark_id': data.id,
            'bookmark_type': data.type,
        });
        // console.log('handleBookmark', result);
        if (typeof (result.status) === 'undefined') {
            watchLater();
        } else {
            setTimeout(() => {
                Alert.alert(
                    "Oops!",
                    `Đã có lỗi xảy ra khi bookmark bài học`,
                    [
                        { text: "OK" }
                    ],
                    { cancelable: false }
                );
            }, 351);
        }
    }

    return (
        <ModalBox
            onClosed={() => onClose(false)}
            isOpen={show}
            animationDuration={300}
            coverScreen
            backdropColor='rgba(0, 0, 0, .7)'
            style={{ width: helpers.isTablet ? width * 4 / 5 : width, height: null, borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden' }}
            position='bottom'
        >
            <View style={{ paddingTop: 30, paddingHorizontal: 20, paddingBottom: 10, marginBottom: getBottomSpace() }}>
                <View style={{ paddingHorizontal: 10 }}>
                    <FeedbackOption
                        onPress={() => {
                            onClose(false);
                            handleBookmark();
                        }}
                        icon="back-in-time"
                        text={'Lưu vào danh sách "Bookmarks"'}
                        type="Entypo"
                    />
                    <FeedbackOption
                        type="AntDesign"
                        onPress={() => {
                            onClose(false);
                            _handleShare();
                        }}
                        icon="sharealt" text='Chia sẻ' />
                    <FeedbackOption
                        type="AntDesign"
                        onPress={() => { onClose(false) }}
                        icon="close" text='Huỷ' />
                </View>
                <TouchableOpacity onPress={() => onClose(false)} style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}>
                    <Icon name='ios-close' style={{ fontSize: 32, color: COLOR.black(.6) }} />
                </TouchableOpacity>
            </View>
        </ModalBox>
    );
}

const FeedbackOption = ({ icon = '', onPress = () => { }, text = '', type }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingVertical: 12 }}>
            {type ? <Icon type={type} name={icon} style={{ fontSize: 15 }} /> :
                <Icon name={icon} style={{ fontSize: 15 }} />
            }
            <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), fontSize: 15 }}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
}


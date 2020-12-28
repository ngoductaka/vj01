import React from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import FastImage from 'react-native-fast-image';
import { fontMaker } from '../../../utils/fonts';
import { blackColor } from '../../../handle/Constant';

export const BookmarkItem = (props) => {

    const {
        item = {},
        onPress = () => { },
        style = {},
    } = props;

    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', marginTop: 10, ...style }}>
            <Image
                resizeMode="contain"
                style={{ width: 72, height: 72, borderRadius: 8, }}
                source={{
                    uri: item?.url || 'https://www.autocar.co.uk/sites/autocar.co.uk/files/1-porsche-911-2019-rt-hero-front.jpg',
                    // priority: FastImage.priority.normal,
                }}
            // resizeMode={FastImage.resizeMode.cover}
            />
            <View style={{ flex: 1, justifyContent: 'space-between', height: 72, paddingVertical: 2, paddingLeft: 10 }}>
                <View style={{}}>
                    <Text style={{ ...fontMaker({ weight: 'Regular' }) }}>{item?.title || 'Tên bài học'}</Text>
                    <Text style={{ ...fontMaker({ weight: 'Regular' }), marginTop: 2, fontSize: 12, color: blackColor(0.6) }} numberOfLines={1}>{item?.quote || 'Mô tả ngắn gọn'}</Text>
                </View>
                <Text style={{ textAlign: 'right', justifyContent: 'flex-end', fontSize: 12, ...fontMaker({ weight: 'Light' }) }}>{item?.class || 'Môn Toán - Lớp 12'}</Text>
            </View>
        </TouchableOpacity>
    );
}
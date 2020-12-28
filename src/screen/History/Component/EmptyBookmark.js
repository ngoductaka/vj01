import React, { useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { Icon } from 'native-base';
import { images } from '../../../utils/images';
import { COLOR } from '../../../handle/Constant';

export const EmptyBookmark = (props) => {

    const {
        navigation,
    } = props;

    return (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: 50 }}>
            <Image
                style={{ width: 180, height: 180 }}
                source={images.no_bookmark}
            />
            <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18, alignSelf: 'center' }}>Không có Bookmarks</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, flexWrap: 'wrap', marginTop: 15 }}>
                <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: COLOR.black(.6) }}>Chạm vào </Text>
                <Icon type='Entypo' name='bookmark' style={{ fontSize: 20, color: COLOR.MAIN }} />
                <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: COLOR.black(.6) }}> để bookmark lại những bài học bạn muốn xem sau</Text>
            </View>

        </View>
    );
}
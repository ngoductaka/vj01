import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { fontMaker } from '../../../utils/fonts';
import { Colors } from '../../../utils/colors';
import { Icon } from 'native-base';

export const SeeMoreButton = (props) => {

    const {
        onPress = () => { },
        status = 'Nan',
        style = {},
    } = props;

    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 5, padding: 15, ...style }}>
            <Text style={{ color: Colors.pri, marginRight: 4, ...fontMaker({ weight: 'Regular' }) }} >{typeof (status) == 'boolean' ? (status ? 'Thu gọn' : 'Xem thêm') : 'Xem thêm'}</Text>
            <Icon name={typeof (status) == 'boolean' ? (!status ? 'arrow-down' : 'arrow-up') : 'arrow-forward'} style={{ fontSize: 16, color: Colors.pri, marginTop: 4 }} />
        </TouchableOpacity>
    );
}
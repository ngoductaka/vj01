import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { fontMaker } from '../../../utils/fonts';
import { Colors } from '../../../utils/colors';
import { Icon } from 'native-base';

export const SeeMoreButton = (props) => {

    const {
        onPress = () => { },
        style = {},
    } = props;

    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 10, padding: 8, ...style }}>
            <Text style={{ color: Colors.pri, marginRight: 4, ...fontMaker({ weight: 'Regular' }) }} >Xem thêm</Text>
            <Icon name='arrow-forward' style={{ fontSize: 16, color: Colors.pri, marginTop: 4 }} />
        </TouchableOpacity>
    );
}
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Icon } from 'native-base';
import { fontMaker } from '../utils/fonts';
import { blackColor } from '../handle/Constant';

const HistoryItem = (props) => {
    const {
        title = '',
        onPressItem = () => { },
    } = props;
    return (
        <TouchableOpacity style={styles.container} onPress={onPressItem}>
            <Text style={{ ...fontMaker({ weight: 'Regular' }) }}>{title}</Text>
        </TouchableOpacity>
    );
}

export default HistoryItem;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1, borderRadius: 20, borderColor: blackColor(0.1), paddingVertical: 7, paddingHorizontal: 20, marginBottom: 10, marginRight: 10
    },
});

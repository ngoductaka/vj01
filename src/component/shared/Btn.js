import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { COLOR, fontSize } from '../../handle/Constant';

export const BtnGradient = (props) => {
    const {
        onPress,
        style = {},
        colors = ['#ff7e5f', '#feb47b'],
        text = '',
        textStyle = {},
        loading = false,
    } = props;
    return (
        <TouchableOpacity disabled={loading} onPress={onPress}>
            <LinearGradient
                style={[BtnStyle.container, style]}
                colors={colors}
                start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}
            >
                {loading ? <ActivityIndicator /> : null}
                <Text style={[BtnStyle.text, textStyle]}> {text} </Text>
            </LinearGradient>
        </TouchableOpacity>
    )
};

const BtnStyle = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        paddingVertical: 11,
        paddingHorizontal: 22,
        flexDirection: 'row'
    },
    text: { color: '#fff', fontSize: 16 }
})

export const BtnFullColor = ({
    colors = ['#FD5667', '#FE8E40'],
    styles = {},
    text = ""
}) => {
    return (

        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingHorizontal: 30, paddingVertical: 7, alignSelf: 'center', borderRadius: 24, ...styles }} colors={colors}>
            <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: 'white', fontSize: fontSize.h3 }}>{text}</Text>
        </LinearGradient>
    )
}
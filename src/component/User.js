import React from 'react';
import { View, Image, StyleSheet, Text } from "react-native";
import { Icon } from 'native-base';

const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";


export const User = ({ src = { uri: userImg } }) => (
    <View style={styles.largeImgWapper} >
        <Image style={styles.img} source={src} />
        <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
            <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
        </View>
    </View>
)

export const UserLive = ({ src = { uri: userImg } }) => (
    <View style={{ alignItems: 'center' }}>
        <View style={[styles.imgLive, {borderWidth: 2, borderColor: '#F5576F'}]} >
            <Image style={styles.img} source={src} />
        </View>
        <View style={styles.liveView}>
            <Text style={styles.liveText}>Live</Text>
        </View>
    </View>
)


const styles = StyleSheet.create({
    liveView: {backgroundColor: "#F5576F", paddingHorizontal: 3, paddingVertical: 1, marginTop: -8},
    liveText: {fontSize: 12, fontWeight: 'bold', color: '#fff'},
    imgLive: {
        height: 45, width: 45,
        borderRadius: 45,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },

    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    largeImgWapper: {
        height: 35, width: 35,
        borderRadius: 35,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },

    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    userCount: {
        height: 25,
        // width: 25,
        paddingHorizontal: 5,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    img: { flex: 1, borderRadius: 25 },

    userComment: {
        flexDirection: 'row',
        // marginTop: 7,
    }
})
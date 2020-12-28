import React, { useState } from 'react';
import {
    View, FlatList, Text, StyleSheet, Platform,
    TouchableOpacity, Dimensions, Image, ScrollView,
    SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { isEmpty } from 'lodash';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";
import { withNavigationFocus } from 'react-navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fontSize, COLOR } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { GradientText } from '../../component/shared/GradientText';
// 
import { FilterModal, mapTypeQestion } from './com/FilterModal';

const { width, height } = Dimensions.get('window');
const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";


const QnA = (props) => {

    const title = props.navigation.getParam('title', '');
    const content = props.navigation.getParam('content', '');
    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* head */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        style={{ marginLeft: 10 }}
                    // style={[styles.searchHeader, showHeader ? {} : styles.shadow, { shadowColor: 'rgba(0, 0, 0, 0.08)', marginLeft: -10, marginTop: helpers.isIOS ? 2 : 0 }]}>
                    >
                        <Icon type='MaterialCommunityIcons' name={'arrow-left'} style={{ fontSize: 26, color: '#836AEE' }} />
                    </TouchableOpacity>
                    <Text
                        style={styles.headerText}
                    >
                        Bình luận
                    </Text>
                </View>
                {/* question */}
                <View style={{ flex: 1, backgroundColor: '#dedede', paddingHorizontal: 10 }}>

                </View>
            </SafeAreaView>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingHorizontal: 10
    },
    headerText: {
        paddingVertical: 5,
        paddingLeft: 10,
        // textAlign: 'center',
        fontSize: 20,
        marginTop: 4,
        ...fontMaker({ weight: fontStyles.Bold })
    },
    head: {

    },
    filter: {
        flexDirection: 'row',
        paddingVertical: 10
        // padding
    },
    iconFilter: {
        fontSize: 17
    },
    h2: {
        fontSize: 18,
        color: '#555',
        ...fontMaker({ weight: fontStyles.Bold })
    },
    itemQ: {
        backgroundColor: '#fefefe',
        paddingVertical: 10,
        padding: 10,
        borderRadius: 10,
        marginVertical: 10
    },
    itemHead: {
        fontSize: 17,
        color: '#555',
        marginBottom: 5,
        marginVertical: 10,
        ...fontMaker({ weight: fontStyles.Bold }),

    },
    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    userComment: {
        flexDirection: 'row',
        marginTop: 7,
    },
    headerTag: {
        alignItems: 'center', flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'baseline', backgroundColor: '#ffa154', borderRadius: 20
    },
    contentTag: {
        color: COLOR.white(1),
        ...fontMaker({ weight: fontStyles.SemiBold })
    },
    btnComment: {
        paddingVertical: 10,
        backgroundColor: '#C8EDF9',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    tinybtnComment: {
        paddingVertical: 10,
        backgroundColor: '#C8EDF9',
        borderRadius: 20,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
    }

})


export default QnA;

const renderQ = (n) => {
    return new Array(n).fill(0).map((_, i) => {
        return {
            id: i,
            title: 'Tiêng anh - Lớp 9 - 10 phút trước',
            content: 'tại sao === a + b = c c c c c c c c c c c c c c c c c c c c c c c c c c c c c c c c c',
            user: 'dddnd'
        }
    })
}


const ListUser = () => {
    return (
        <View style={userStyle.userComment}>
            <View style={userStyle.imgWapper} >
                <Image style={userStyle.img} source={{ uri: userImg }} />
                <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                    <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
                </View>
            </View>
            <View style={userStyle.imgWapper} >
                <Image style={userStyle.img} source={{ uri: userImg }} />
            </View>
            <View style={[userStyle.userCount, { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }]} >
                <Text>+3</Text>
            </View>
        </View>
    )
}

const userStyle = StyleSheet.create({
    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    imgLargeWapper: {
        height: 35, width: 35,
        borderRadius: 35,
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
        marginTop: 7,
    }
})


const User = () => {
    return (
        <View style={userStyle.imgLargeWapper} >
            <Image style={[userStyle.img, {}]} source={{ uri: userImg }} />
            <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
            </View>
        </View>
    )
}

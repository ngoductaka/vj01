import React, { userEffect, userState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, ImageBackground } from 'react-native';
import { Icon } from 'native-base';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';

import { images } from '../../utils/images';
import { whiteColor, FIRST_TIME, COLOR, blackColor } from '../../handle/Constant';

const slides = [
    {
        key: 'intro1',
        title: 'GIẢI BÀI TẬP',
        text: 'Dạy học online miễn phí cho người Việt',
        image: images.intro1,
        backgroundColor: COLOR.MAIN,
    },
    {
        key: 'intro2',
        title: 'CẬP NHẬT',
        text: 'Các bài học mới được cập nhật hàng tuần và được thông báo tức thì',
        image: images.intro2,
        backgroundColor: COLOR.white,
    },
    {
        key: 'intro3',
        title: 'TÌM KIẾM',
        text: 'Trong hàng trăm ngàn bài học được soạn bởi các giáo viên giỏi',
        image: images.intro3,
        backgroundColor: COLOR.white,
    },
    {
        key: 'intro4',
        title: 'HỆ THỐNG',
        text: 'Tất cả nội dung trong chương trình SGK & SBT của Bộ GD & ĐT từ lớp 3 đến lớp 12',
        image: images.intro4,
        backgroundColor: COLOR.white,
    }
];

const Intro = (props) => {

    const _finishIntro = async () => {
        try {
            AsyncStorage.setItem(FIRST_TIME, "1");
        } catch (error) {
            // console.log("Intro", error);
        }
        props.navigation.navigate("Login");
    }

    const _renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Icon
                    name="right"
                    type="AntDesign"
                    style={{ backgroundColor: 'transparent', fontSize: 24, color: whiteColor(0.9) }}
                />
            </View>
        );
    };

    const _renderDoneButton = () => {
        return (
            <TouchableOpacity onPress={_finishIntro} style={{ ...styles.buttonCircle, backgroundColor: '#8cbb46' }}>
                <Icon
                    name="md-checkmark"
                    style={{ fontSize: 24, color: 'white' }}
                />
            </TouchableOpacity>
        );
    };

    const _renderItem = ({ item, dimensions }) => (
        <ImageBackground
            source={item.image}
            style={[
                styles.mainContent,
                dimensions,
            ]}
            resizeMode='stretch'
        >
            <View style={{ flex: 2 }} />
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.text}>{item.text}</Text>
            </View>
        </ImageBackground>
    );

    const skipBtn = () => {
        return (
            <View style={{}}>
                <Text style={{color: '#fff', fontSize: 20}}>Skip</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <AppIntroSlider
                slides={slides}
                activeDotStyle={styles.activeDotStyle}
                renderItem={_renderItem}
                renderDoneButton={_renderDoneButton}
                renderNextButton={_renderNextButton}
                renderSkipButton={skipBtn}
                showSkipButton
            />
        </View>
    )
}

const styles = StyleSheet.create({
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    image: {
        width: 260,
        height: 260,
    },
    text: {
        color: 'rgba(0, 0, 0, .6)',
        fontSize: 18,
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 26,
    },
    title: {
        fontSize: 26,
        color: 'black',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 26,
    },
    activeDotStyle: {
        backgroundColor: '#8cbb46'
    }
});

export default Intro;

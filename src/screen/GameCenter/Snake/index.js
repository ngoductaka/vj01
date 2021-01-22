import React, { Component } from "react";
import { StyleSheet, StatusBar, Text, Dimensions, View, Alert, Button, TouchableOpacity, ImageBackground, Pressable, Image, SafeAreaView } from "react-native";
import ModalBox from 'react-native-modalbox';
import Constants from './Constants';
import { images } from "../../../utils/images";
import { fontMaker, fontStyles } from "../../../utils/fonts";
import { COLOR, fontSize } from "../../../handle/Constant";
import AsyncStorage from "@react-native-community/async-storage";

const { width, height } = Dimensions.get('window');

export default class SnakeApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showGuide: false,
            showSettings: false
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#56BCE8' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 90 }}>
                    <Text style={{ fontSize: 50, textAlign: 'center', ...fontMaker({ weight: fontStyles.SemiBold }), color: '#fff', letterSpacing: 10 }}>SNAKE</Text>
                    <Pressable onPress={() => this.props.navigation.navigate('SnakeApp')} style={{ backgroundColor: '#2a9d8f', padding: 12, width: 180, borderRadius: 30, alignItems: 'center', marginTop: 30 }}>
                        <Text style={{ color: COLOR.white(1), fontSize: 18, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Bắt đầu</Text>
                    </Pressable>
                    <Pressable onPress={() => this.setState({ showGuide: true })} style={{ backgroundColor: '#e9c46a', padding: 12, width: 180, borderRadius: 30, alignItems: 'center', marginTop: 30 }}>
                        <Text style={{ color: COLOR.white(1), fontSize: 18, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Hướng dẫn</Text>
                    </Pressable>
                    <Pressable onPress={() => this.setState({ showSettings: true })} style={{ backgroundColor: '#f4a261', padding: 12, width: 180, borderRadius: 30, alignItems: 'center', marginTop: 30 }}>
                        <Text style={{ color: COLOR.white(1), fontSize: 18, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Cài đặt</Text>
                    </Pressable>
                    <Pressable onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: '#e76f51', padding: 12, width: 180, borderRadius: 30, alignItems: 'center', marginTop: 30 }}>
                        <Text style={{ color: COLOR.white(1), fontSize: 18, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Thoát trò chơi</Text>
                    </Pressable>
                </View>
                <Image source={images.trainbg} style={{ width: height > width ? width : height, height: height > width ? width * 3.6 / 4 : height * 3.6 / 4, resizeMode: 'stretch', alignSelf: 'center' }} />
                <ModalBox
                    isOpen={this.state.showGuide}
                    backdropPressToClose={true}
                    swipeToClose={true}
                    style={{ width: 320, height: null, borderRadius: 8, overflow: 'hidden', padding: 30 }}
                    onClosed={() => this.setState({ showGuide: false })}
                    position='center'
                >
                    <Text style={{ textAlign: 'center', fontSize: 20, color: COLOR.MAIN, ...fontMaker({ weight: fontStyles.Bold }) }}>Hướng dẫn</Text>
                    <Text style={{ fontSize: 16, textAlign: 'center', lineHeight: 24, marginTop: 10, ...fontMaker({ weight: fontStyles.Regular }) }}>Hãy cố gắng dùng những phím di chuyển để có thể điều hướng đoàn tàu của bạn có thể thu hoạch được nhiều chiến lợi phẩm tốt nhất nhé</Text>
                    <Pressable onPress={() => this.setState({ showGuide: false })} style={{ alignSelf: 'center', marginTop: 20, paddingHorizontal: 40, paddingVertical: 12, backgroundColor: COLOR.MAIN_GREEN, borderRadius: 30 }}>
                        <Text style={{ color: COLOR.white(1), fontSize: 17, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Đã hiểu</Text>
                    </Pressable>
                </ModalBox>
                <ModalBox
                    isOpen={this.state.showSettings}
                    backdropPressToClose={true}
                    swipeToClose={true}
                    style={{ width: 320, height: null, borderRadius: 8, overflow: 'hidden', padding: 30 }}
                    onClosed={() => this.setState({ showSettings: false })}
                    position='center'
                >
                    <Text style={{ textAlign: 'center', fontSize: 20, color: COLOR.black(1), ...fontMaker({ weight: fontStyles.Bold }) }}>Chọn mức độ</Text>
                    <Pressable onPress={async () => {
                        await AsyncStorage.setItem(Constants.SNAKE_LEVEL, '1');
                        this.setState({ showSettings: false })
                    }} style={{ alignSelf: 'center', marginTop: 20, paddingVertical: 12, backgroundColor: '#06d6a0', borderRadius: 30, width: 160, alignItems: 'center' }}>
                        <Text style={{ color: COLOR.white(1), fontSize: 17, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Dễ</Text>
                    </Pressable>
                    <Pressable onPress={async () => {
                        await AsyncStorage.setItem(Constants.SNAKE_LEVEL, '2');
                        this.setState({ showSettings: false });
                    }} style={{ alignSelf: 'center', marginTop: 20, paddingVertical: 12, backgroundColor: '#f8961e', borderRadius: 30, width: 160, alignItems: 'center' }}>
                        <Text style={{ color: COLOR.white(1), fontSize: 17, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Trung bình</Text>
                    </Pressable>
                    <Pressable onPress={async () => {
                        await AsyncStorage.setItem(Constants.SNAKE_LEVEL, '3');
                        this.setState({ showSettings: false });
                    }} style={{ alignSelf: 'center', marginTop: 20, paddingVertical: 12, backgroundColor: '#d62828', borderRadius: 30, width: 160, alignItems: 'center' }}>
                        <Text style={{ color: COLOR.white(1), fontSize: 17, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Khó</Text>
                    </Pressable>
                </ModalBox>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    controls: {
        width: 300,
        height: 300,
        flexDirection: 'column',
    },
    controlRow: {
        height: 100,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    control: {
        width: 100,
        height: 100,
        backgroundColor: 'blue'
    }
});
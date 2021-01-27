import React, { Component } from "react";
import { StyleSheet, StatusBar, View, Alert, Dimensions, TouchableOpacity, Text, Pressable, ImageBackground, SafeAreaView } from "react-native";
import { GameEngine, dispatch } from "react-native-game-engine";
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import numeral from 'numeral';
import { Head } from "./head";
import { Food } from "./food";
import { Tail } from "./tail";
import { GameLoop } from "./systems";
import Constants from './Constants';
import { Header, Icon } from "native-base";
import { COLOR, fontSize } from "../../../handle/Constant";
import { fontMaker, fontStyles } from "../../../utils/fonts";
import { images } from "../../../utils/images";
import AsyncStorage from "@react-native-community/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { getItem, saveItem } from "../../../handle/handleStorage";
import { Colors } from "../../../utils/colors";

const { width, height } = Dimensions.get('window');

const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
};

export default class SnakeApp extends Component {
    constructor(props) {
        super(props);
        this.boardHorizontalSize = Constants.GRID_HORIZONTAL_SIZE * Constants.CELL_SIZE;
        this.boardVerticalSize = Constants.GRID_VERTICAL_SIZE * Constants.CELL_SIZE;
        this.engine = null;
        this.state = {
            running: true,
            point: 0,
            // level: 2,
            // highScore: 0,
            gestureName: 'none',
        }
    }

    async componentDidMount() {
        // const temp = await AsyncStorage.getItem(Constants.SNAKE_LEVEL);
        // // console.log('-------', temp);
        // if (temp) {
        //     this.setState({ level: temp });
        // }
        // const currentHighScore = await getItem(Constants.SNAKE_HIGHSCORE);
        // console.log('a-s-as-a-s-as-as', currentHighScore);
        // if (currentHighScore) this.setState({ highScore: currentHighScore });
    }

    // async componentWillUnmount() {
    //     await saveItem(Constants.SNAKE_HIGHSCORE, null);
    // }

    randomBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    onEvent = async (e) => {
        if (e.type === "game-over") {
            // const currentHighScore = await getItem(Constants.SNAKE_HIGHSCORE);
            // console.log('-------', this.state.point, currentHighScore);
            // if (currentHighScore == null || (this.state.point && this.state.point > currentHighScore)) {
            //     saveItem(Constants.SNAKE_HIGHSCORE, this.state.point);
            // }
            this.setState({
                running: false
            });
            Alert.alert(
                "",
                "Bạn có muốn chơi lại?",
                [
                    {
                        text: "Huỷ bỏ",
                        onPress: () => { this.props.navigation.goBack() },
                        style: "cancel"
                    },
                    { text: "Tiếp tục", onPress: () => this.reset() }
                ],
                { cancelable: false }
            );
        }

        if (e.type === "achieve-bonus") {
            this.setState(prev => {
                return { point: prev.point + 1 };
            });
        }
    }

    reset = () => {
        this.engine.swap({
            head: { position: [0, 0], xspeed: 1, yspeed: 0, nextMove: 10, updateFrequency: 30, size: Constants.CELL_SIZE, renderer: <Head /> },
            food: { position: [this.randomBetween(0, Constants.GRID_HORIZONTAL_SIZE - 1), this.randomBetween(0, Constants.GRID_VERTICAL_SIZE - 1)], size: Constants.CELL_SIZE, renderer: <Food /> },
            tail: { size: Constants.CELL_SIZE, elements: [], renderer: <Tail /> }
        });
        this.setState({
            running: true,
            point: 0
        });
    }

    onSwipe(gestureName, gestureState) {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
                this.engine.dispatch({ type: "move-up" })
                break;
            case SWIPE_DOWN:
                this.engine.dispatch({ type: "move-down" })
                break;
            case SWIPE_LEFT:
                this.engine.dispatch({ type: "move-left" })
                break;
            case SWIPE_RIGHT:
                this.engine.dispatch({ type: "move-right" })
                break;
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <GestureRecognizer
                    onSwipe={(direction, state) => this.onSwipe(direction, state)}
                    config={config}
                    style={{
                        flex: 1,
                    }}
                >
                    <LinearGradient colors={['#1F5A90', '#0E1D33']} style={{ flex: 1 }}>
                        <StatusBar backgroundColor='#56BCE8' barStyle='light-content' />
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', height: 44, padding: 3 }}>
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#118A14', '#1FCB23', '#118A14']}>
                                    <View style={{ width: 80, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <Text style={{ color: '#fff', ...fontMaker({ weight: fontStyles.Bold }), fontSize: 18, }}>ĐIỂM</Text>
                                    </View>
                                </LinearGradient>
                                <View style={{ flex: 1, backgroundColor: '#1F2634', height: '100%', marginHorizontal: 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 22, color: COLOR.white(1), ...fontMaker({ weight: fontStyles.SemiBold }) }}>{numeral(this.state.point).format('000000')}</Text>
                                </View>
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#118A14', '#1FCB23', '#118A14']}>
                                    <Pressable onPress={this.reset} style={{ width: 80, justifyContent: 'center', alignItems: 'center', height: '100%', }}>
                                        <Icon name='reload' type='Ionicons' style={{ fontSize: 24, color: 'white' }} />
                                    </Pressable>
                                </LinearGradient>
                            </View>
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 4, paddingHorizontal: 6, backgroundColor: 'rgba(245, 150, 73, .6)', marginTop: 8 }}>
                                <LinearGradient style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: (this.state.point >= this.state.highScore || this.state.highScore == 0) ? width : width * this.state.point * 1.0 / this.state.highScore }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ff7505', '#ffb273']}>
                                </LinearGradient>
                                <Text style={{ color: '#fff', ...fontMaker({ weight: fontStyles.Bold }), fontSize: 18 }}>ĐIỂM CAO NHẤT</Text>
                                <Text style={{ color: '#fff', ...fontMaker({ weight: fontStyles.Bold }), fontSize: 18 }}>{this.state.highScore > this.state.point ? this.state.highScore : this.state.point}</Text>
                            </View> */}
                            <View style={styles.container}>
                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 5 }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', height: 48, paddingHorizontal: 20, alignItems: 'center', paddingVertical: 8, backgroundColor: this.state.level == 1 ? '#06d6a0' : this.state.level == 2 ? '#f8961e' : '#d62828', borderRadius: 8, marginVertical: 20 }}>
                                    <Text style={{ color: COLOR.white(1), ...fontMaker({ weight: fontStyles.Regular }) }}>Mức độ: {this.state.level == 1 ? 'Dễ' : this.state.level == 2 ? 'Trung bình' : 'Khó'}</Text>
                                </View>
                            </View> */}
                                <GameEngine
                                    ref={(ref) => { this.engine = ref; }}
                                    style={[{
                                        width: this.boardHorizontalSize, height: this.boardVerticalSize,
                                        flex: null,
                                        borderColor: Colors.pri,
                                        borderStyle: 'dotted',
                                        borderWidth: 3.5,
                                        borderRadius: 8
                                    }]}
                                    systems={[GameLoop]}
                                    entities={{
                                        head: { position: [0, 0], xspeed: 1, yspeed: 0, nextMove: 10, updateFrequency: 30, size: Constants.CELL_SIZE, renderer: <Head /> },
                                        food: { position: [this.randomBetween(0, Constants.GRID_HORIZONTAL_SIZE - 1), this.randomBetween(0, Constants.GRID_VERTICAL_SIZE - 1)], size: Constants.CELL_SIZE, renderer: <Food /> },
                                        tail: { size: Constants.CELL_SIZE, elements: [], renderer: <Tail /> }
                                    }}
                                    running={this.state.running}
                                    onEvent={this.onEvent}>

                                    {/* <StatusBar hidden={true} /> */}

                                </GameEngine>
                            </View>
                        </SafeAreaView>
                    </LinearGradient>
                </GestureRecognizer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    controls: {
        // width: 300,
        // height: 300,
        flexDirection: 'column',
    },
    controlRow: {
        height: 100,
        // width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    control: {
        width: 80,
        height: 80,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: COLOR.MAIN,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    }
});
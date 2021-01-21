import React, { Component } from "react";
import { StyleSheet, StatusBar, View, Alert, Dimensions, TouchableOpacity, Text, Pressable, ImageBackground } from "react-native";
import { GameEngine, dispatch } from "react-native-game-engine";
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

const { width, height } = Dimensions.get('window');

export default class SnakeApp extends Component {
    constructor(props) {
        super(props);
        this.boardSize = Constants.GRID_SIZE * Constants.CELL_SIZE;
        this.engine = null;
        this.state = {
            running: true,
            point: 0,
            level: 2
        }
    }

    async componentDidMount() {
        const temp = await AsyncStorage.getItem(Constants.SNAKE_LEVEL);
        console.log('-------', temp);
        if (temp) {
            this.setState({ level: temp });
        }
    }

    randomBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    onEvent = (e) => {
        if (e.type === "game-over") {
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
            head: { position: [0, 0], xspeed: 1, yspeed: 0, nextMove: 10, updateFrequency: this.state.level == 1 ? 50 : this.state.level == 2 ? 30 : 10, size: Constants.CELL_SIZE, renderer: <Head /> },
            food: { position: [this.randomBetween(0, Constants.GRID_SIZE - 1), this.randomBetween(0, Constants.GRID_SIZE - 1)], size: Constants.CELL_SIZE, renderer: <Food /> },
            tail: { size: Constants.CELL_SIZE, elements: [], renderer: <Tail /> }
        });
        this.setState({
            running: true,
            point: 0
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground style={{ width, height }} source={images.gametrainbg}>
                    <Header
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <Pressable onPress={() => this.props.navigation.goBack()} style={{ padding: 10 }} >
                            <Icon name='arrow-back' style={{ color: COLOR.MAIN, fontSize: 32 }} />
                        </Pressable>
                        <Text numberOfLines={1} style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: fontSize.h2 }}>Viet Train</Text>
                        <Pressable onPress={this.reset} style={{ padding: 10 }}>
                            <Icon name='reload' type='Ionicons' style={{ color: COLOR.MAIN_GREEN, fontSize: 26 }} />
                        </Pressable>
                    </Header>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', height: 48, paddingHorizontal: 20, alignItems: 'center', paddingVertical: 8, backgroundColor: this.state.level == 1 ? '#06d6a0' : this.state.level == 2 ? '#f8961e' : '#d62828', borderRadius: 8, marginVertical: 20 }}>
                                <Text style={{ color: COLOR.white(1), }}>Mức độ: {this.state.level == 1 ? 'Dễ' : this.state.level == 2 ? 'Trung bình' : 'Khó'}</Text>
                            </View>
                            <View style={{ width: 160, alignItems: 'center', justifyContent: 'center', height: 48, backgroundColor: COLOR.MAIN_GREEN, borderRadius: 8, marginVertical: 20 }}>
                                <Text style={{ color: COLOR.white(1), fontSize: 30 }}>{this.state.point}</Text>
                            </View>
                        </View>
                        <GameEngine
                            ref={(ref) => { this.engine = ref; }}
                            style={[{ width: this.boardSize, height: this.boardSize, backgroundColor: 'white', borderWidth: 1, borderColor: 'red', flex: null }]}
                            systems={[GameLoop]}
                            entities={{
                                head: { position: [0, 0], xspeed: 1, yspeed: 0, nextMove: 10, updateFrequency: this.state.level == 1 ? 50 : this.state.level == 2 ? 30 : 10, size: Constants.CELL_SIZE, renderer: <Head /> },
                                food: { position: [this.randomBetween(0, Constants.GRID_SIZE - 1), this.randomBetween(0, Constants.GRID_SIZE - 1)], size: Constants.CELL_SIZE, renderer: <Food /> },
                                tail: { size: Constants.CELL_SIZE, elements: [], renderer: <Tail /> }
                            }}
                            running={this.state.running}
                            onEvent={this.onEvent}>

                            <StatusBar hidden={true} />

                        </GameEngine>

                        <View style={styles.controls}>
                            <View style={styles.controlRow}>
                                <TouchableOpacity style={styles.control} onPress={() => { this.engine.dispatch({ type: "move-up" }) }}>
                                    <Icon name='arrow-bold-up' type='Entypo' style={{ fontSize: 30, color: COLOR.white(1) }} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.controlRow}>
                                <TouchableOpacity style={styles.control} onPress={() => { this.engine.dispatch({ type: "move-left" }) }}>
                                    <Icon name='arrow-bold-left' type='Entypo' style={{ fontSize: 30, color: COLOR.white(1) }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.control} onPress={() => { this.engine.dispatch({ type: "move-down" }) }}>
                                    <Icon name='arrow-bold-down' type='Entypo' style={{ fontSize: 30, color: COLOR.white(1) }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.control} onPress={() => { this.engine.dispatch({ type: "move-right" }) }}>
                                    <Icon name='arrow-bold-right' type='Entypo' style={{ fontSize: 30, color: COLOR.white(1) }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'space-around'
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
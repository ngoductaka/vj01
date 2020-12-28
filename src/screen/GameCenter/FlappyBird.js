import React, { useState, useEffect, useRef } from 'react'
import { FlatList } from 'react-native';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    Animated,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { COLOR } from '../../handle/Constant';
import { images } from '../../utils/images';
import BackHeader from '../History/Component/BackHeader';

const { width, height } = Dimensions.get('window');

const GAME_CENTERS = [
    { src: images.game1, name: 'Ai là triệu phú', slogan: 'Vui mà học, học mà chơi', route: 'WhoIsMillionarie' },
    { src: images.game1, name: 'Ai là triệu phú', slogan: 'Vui mà học, học mà chơi' },
    { src: images.game1, name: 'Ai là triệu phú', slogan: 'Vui mà học, học mà chơi' },
];

const FlappyBird = (props) => {

    const { navigation } = props;
    const ref = useRef();

    useEffect(() => {

    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <BackHeader
                title={'Flappy Bird'}
                showRight={false}
            />
            
        </View >
    )
}

export default FlappyBird;
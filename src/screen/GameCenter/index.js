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
import { COLOR, GAME_CENTERS } from '../../handle/Constant';
import { images } from '../../utils/images';
import BackHeader from '../History/Component/BackHeader';

const { width, height } = Dimensions.get('window');

const GameCenter = (props) => {

    const { navigation } = props;
    const ref = useRef();

    useEffect(() => {

    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <BackHeader
                title={'Kho trò chơi'}
                showRight={false}
            />
            <View style={{ flex: 1, }}>
                <FlatList
                    style={{ padding: 10 }}
                    data={GAME_CENTERS}
                    numColumns={3}
                    renderItem={({ item, index }) => {
                        return (
                            <GameItem src={item.src} name={item.name} slogan={item.slogan} navigation={navigation} route={item.route} />
                        );
                    }}
                    keyExtractor={(item, index) => index + 'game_item'}
                />
            </View>
        </View >
    )
}

export default GameCenter

export const GameItem = ({ src = images.game1, name, slogan, navigation, route }) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate(route)} style={{ width: (width - 40) / 3, marginRight: 10 }}>
            <View style={{ width: (width - 40) / 3, height: (width - 40) / 3, padding: 10 }}>
                <Image
                    source={src}
                    style={{ width: null, height: null, flex: 1, resizeMode: 'contain' }}
                />
            </View>
            <View style={{ padding: 5 }}>
                <Text style={{ fontSize: 15, color: COLOR.black(.8), marginTop: 2 }}>{name}</Text>
                <Text style={{ fontSize: 13, color: COLOR.black(.5), marginTop: 3 }}>{slogan}</Text>
            </View>
        </TouchableOpacity>
    );
}
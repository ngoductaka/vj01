import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View, SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import { Icon, Card } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { isEmpty, get } from 'lodash';
import LottieView from 'lottie-react-native';
import { useSelector, useDispatch } from 'react-redux';
import numeral from 'numeral';

import { GradientText } from '../../component/shared/GradientText';
import { helpers } from '../../utils/helpers';
import ViewContainer from '../../component/shared/ViewContainer';
import RankingItem from './component/RankingItem';
import { images } from '../../utils/images';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { COLOR } from '../../handle/Constant';

const PracticeRanking = (props) => {

    const { navigation } = props;
    const dispatch = useDispatch();

    const userInfo = useSelector(state => {
        return state.userInfo.user
    });

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backHeader}>
                        <Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 26, color: '#F86087' }} />
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', ...fontMaker({ weight: fontStyles.SemiBold }), color: COLOR.MAIN, fontSize: 20 }}>Xếp hạng</Text>
                    <View style={{ width: 40, height: 40 }} />
                </View>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                    <LottieView
                        autoPlay
                        loop
                        style={{ width: '100%', height: 200, alignSelf: 'center' }}
                        source={require('../../public/fireworks.json')}
                    />
                    <Text style={{ textAlign: 'center', ...fontMaker({ weight: fontStyles.SemiBold }), color: COLOR.MAIN, fontSize: 26, marginBottom: 10 }}>{numeral(10000).format()}</Text>
                    <Text style={{ textAlign: 'center', ...fontMaker({ weight: fontStyles.Regular }), color: COLOR.black(.3), fontSize: 15, marginBottom: 20 }}>Chúc mừng bạn đã hoàn thành bài thi</Text>
                    <RankingItem />
                    <RankingItem src={images.silver_medal} name='Đức' rank={2} mainColor='#C0C0C0' />
                    <RankingItem src={images.bronze_medal} name='Ngọc Anh' rank={3} mainColor='#cd7f32' />
                    <Text style={{ padding: 10, paddingVertical: 20 }}>..............</Text>
                    <RankingItem src={images.bronze_medal} name={userInfo.name} rank={10} mainColor={COLOR.black(.1)} />
                    <Text style={{ padding: 10, paddingVertical: 20 }}>..............</Text>
                </ScrollView>
            </SafeAreaView>

        </View>
    )
};

const styles = StyleSheet.create({
    backHeader: {
        width: 40, height: 40, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'white',

        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },
    }
})

export default PracticeRanking;

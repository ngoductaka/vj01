import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, Image, StatusBar } from 'react-native';
import { withNavigation } from 'react-navigation';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { BONUS_TIME_POINT, COLOR, CORRECT_POINT, TIME_PER_QUESTION } from '../../../handle/Constant';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AnimateNumber from 'react-native-animate-number';
import { findIndex, get } from 'lodash';
import { useSelector } from 'react-redux';

const convertPart = (val) => {
    if (val == 0) return 0;
    if (val > 0) {
        const res = val % 3;
        if (res == 0) {
            return val - 3 * (parseInt(val / 3) - 1);
        } else {
            return val - 3 * parseInt(val / 3);
        }
    }
};

const convertFlashPoint = (val) => {
    if (val == 0) return 1;
    if (val > 0) {
        const res = val % 3;
        if (res == 0) {
            return parseInt(val / 3);
        } else {
            return parseInt(val / 3) + 1;
        }
    }
};

const NormalHeader = (props) => {
    const {
        handleRightClick = () => { },
        index,
        totalQues,
        consecutive,
        score,
        submit,
        // initRanking,
        rankingResult,
        setStopTime = () => { },
        setTestTime = () => { },
        testTime = 0,
    } = props;

    const userId = useSelector(state => get(state, 'userInfo.user.id', -1));

    const [time, setTime] = useState(0);
    const [rank, setRank] = useState(0);

    useEffect(() => {
        const user_index = findIndex(rankingResult, (e) => { return e.userId == userId });
        if (user_index >= 0) {
            if (rankingResult.length < 5 && user_index < 2) {
                setRank(user_index + 3);
            } else {
                setRank(rankingResult[user_index]['rank']);
            }
        }
    }, [rankingResult]);

    useEffect(() => {
        // console.log('-------', time);
        const timeout = setInterval(() => {
            if (time === null) {
                clearInterval(timeout);
                return 1;
            }
            setTime(time + 1)
        }, 1000);

        if (submit) {
            setTestTime(testTime + time);
            clearInterval(timeout);
            setStopTime(time);
        }

        return () => {
            clearInterval(timeout);
        }
    }, [time, submit, index]);

    useEffect(() => {
        setTime(0);
    }, [index]);

    return (
        <View
            style={{ width: '100%', backgroundColor: 'black', padding: 10 }}
        >
            <SafeAreaView style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                <TouchableOpacity onPress={() => handleRightClick()}
                    style={{
                        borderRadius: 8,
                        padding: 10,
                        backgroundColor: '#545454',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Icon type='FontAwesome' name='pause' style={styles.iconPause} />
                </TouchableOpacity>
                <View style={{ flex: 1, flexDirection: 'row', height: '100%', paddingVertical: 2 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: '#262626', paddingHorizontal: 15, paddingVertical: 6, marginLeft: 4, borderRadius: 8 }}>
                        <Text style={{ color: 'white', fontSize: 16, ...fontMaker({ weight: 'SemiBold' }) }}>{index}/</Text>
                        <Text style={{ color: COLOR.white(.8), fontSize: 15, ...fontMaker({ weight: 'Regular' }) }}>{totalQues}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, borderWidth: 3, borderColor: '#262626', height: '100%', marginHorizontal: 4, borderRadius: 8, justifyContent: 'space-between', padding: 4 }}>
                        <View style={{ position: 'absolute', left: 2, top: 2, right: 2, bottom: 2, flexDirection: 'row' }}>
                            <LinearGradient
                                colors={['rgba(255, 176, 3, .9)', 'rgba(255, 225, 161, .8)']}
                                style={{ flex: convertPart(consecutive), borderRadius: 6, }}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            />
                            <View style={{ flex: 3 - convertPart(consecutive) }}></View>
                        </View>
                        <View style={{ flex: 1, height: '100%' }}>
                        </View>
                        <View style={{ flex: 1, height: '100%', borderLeftWidth: 2, borderLeftColor: (convertPart(consecutive) == 2 || convertPart(consecutive) == 3) ? COLOR.white(.7) : '#262626', borderRightWidth: 2, borderRightColor: convertPart(consecutive) == 3 ? COLOR.white(.7) : '#262626' }} />
                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Icon type='Entypo' name='flash' style={{ fontSize: 15, color: 'white' }} />
                            <Text style={{ color: 'white', marginLeft: 4, ...fontMaker({ weight: 'SemiBold' }), fontSize: 15 }}>{convertFlashPoint(consecutive)}</Text>
                        </View>
                    </View>
                    <View style={{
                        paddingHorizontal: 15,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#262626'
                    }}>
                        <View style={{ flexDirection: 'row', paddingVertical: 6, alignItems: 'center', borderRightWidth: 3, borderRightColor: 'black', paddingRight: 15, marginRight: 15 }}>
                            <Icon name='podium' style={{ color: '#8858BD', fontSize: 22 }} />
                            <AnimateNumber
                                countBy={1}
                                timing='linear'
                                interval={2}
                                style={{
                                    color: 'white',
                                    fontSize: 16,
                                    marginLeft: 5,
                                    ...fontMaker({ weight: fontStyles.SemiBold }),
                                }} value={rank} />
                        </View>
                        <View style={{ flexDirection: 'row', paddingVertical: 6, alignItems: 'center', }}>
                            <Icon type='FontAwesome5' name='coins' style={{ color: '#F0B539', fontSize: 16 }} />
                            <AnimateNumber
                                countBy={1}
                                timing='linear'
                                interval={2}
                                style={{
                                    color: 'white',
                                    fontSize: 16,
                                    marginLeft: 5,
                                    ...fontMaker({ weight: fontStyles.SemiBold }),
                                }} value={score} />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View >
    )
};

const styles = {
    iconPause: {
        fontSize: 16, color: COLOR.white(1),
    },
}

export default withNavigation(NormalHeader);

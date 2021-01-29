import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Icon } from 'native-base';
import numeral from 'numeral';
import * as Animatable from 'react-native-animatable';

import { fontMaker, fontStyles } from '../../../utils/fonts';
import { images } from '../../../utils/images';
import { avatarIndex, COLOR, CORRECT_POINT } from '../../../handle/Constant';
import { get, findIndex } from 'lodash';
import { useSelector } from 'react-redux';

const getRandomIntInclusive = (min, max) => {
    console.log('min = ', min);
    console.log('max = ', max);
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}


const RankingDashboard = ({
    rankingData = [],
    end = false,
    navigation,
    idExam,
    exam_relation = [],
    setStopMusic = () => { },
    dataCourseConvert,
    _handleAnalyse = () => { }
}) => {

    const [data, setData] = useState(rankingData);
    const [fakeRank, setFakeRank] = useState(null);

    const userId = useSelector(state => get(state, 'userInfo.user.id', -1));
    const avatarIdx = useSelector(state => get(state, 'userInfo.user.avatar_id', 0));

    const makeData = async (user_index) => {
        let fakeData = [];
        if (user_index < 2) {
            setFakeRank(user_index + 3);
            const temp_data = rankingData.map((item) => {
                return { ...item, rank: item.rank + 2 };
            });
            fakeData = [...temp_data];
            fakeData.unshift({
                name: avatarIndex[1].name,
                rank: 2,
                score: CORRECT_POINT + temp_data[0].score + getRandomIntInclusive(0, 238),
                avatar: 2
            });
            fakeData.unshift({
                name: avatarIndex[0].name,
                rank: 1,
                score: CORRECT_POINT + temp_data[0].score + getRandomIntInclusive(239, 499),
                avatar: 1
            });
            // console.log('userScore', temp_data);
            const userScore = temp_data[user_index].score;
            for (let i = 0; i < 6 - fakeData.length; i++) {
                fakeData.push({
                    name: avatarIndex[11 - i - 1].name,
                    rank: 3 + i + 1,
                    score: userScore > 100 ? CORRECT_POINT + getRandomIntInclusive((6 - fakeData.length - i) * ((userScore - CORRECT_POINT) * 1.0) / fakeData.length, (6 - fakeData.length - i - 1) * ((userScore - CORRECT_POINT) * 1.0) / fakeData.length) : 0,
                    avatar: 11 - i - 1
                });
            }
            await setData(fakeData);
        }
    }

    useEffect(() => {
        const temp = rankingData.length;
        const user_index = findIndex(rankingData, (e) => { return e.userId == userId });
        if (temp < 5) {
            makeData(user_index);
        }
        // fake out of top 5
        // let fake = [...rankingData];
        // for (let i = 5; i > 0; i--) {
        //     fake.unshift({
        //         name: avatarIndex[i].name,
        //         rank: i,
        //         score: 499,
        //         avatar: i
        //     });
        // }
        // setData(fake);
    }, []);

    return (
        <View style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: 'black', paddingHorizontal: 18, paddingTop: 40 }}>
            <Text style={styles.label}>Bảng xếp hạng</Text>
            <View style={{ flex: 1, marginTop: 25 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ width: 60, marginLeft: 12 }}>
                        <Text style={styles.headerText}>Hạng</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={[styles.headerText, { marginLeft: 46 }]}>Tên</Text>
                    </View>
                    <View style={{ width: 90, marginRight: 18, alignItems: 'flex-end' }}>
                        <Text style={styles.headerText}>Điểm</Text>
                    </View>
                </View>
                {data.length > 5 ?
                    <View style={{}}>
                        <FlatList
                            data={data.slice(0, 3)}
                            renderItem={({ item, index }) => {
                                return <OpponentRanking data={item} />
                            }}
                            keyExtractor={(item, index) => index + 'ranking_item_opponent'}
                            ListFooterComponent={
                                <View style={{ paddingBottom: 30 }}>
                                    <Text style={{ color: 'white', marginLeft: 40, fontSize: 30, marginTop: -25 }}>.</Text>
                                    {/* <Text style={{ color: 'white', marginLeft: 40, fontSize: 30, marginTop: -20 }}>.</Text> */}
                                    <Text style={{ color: 'white', marginLeft: 40, fontSize: 30, marginTop: -20 }}>.</Text>
                                    <MyRanking data={data[5]} avatarIdx={avatarIdx} />
                                </View>
                            }
                        />
                    </View>
                    :
                    <FlatList
                        data={data}
                        renderItem={({ item, index }) => {
                            if (item.userId == userId) return <MyRanking data={item} avatarIdx={avatarIdx} />
                            return <OpponentRanking data={item} />
                        }}
                        keyExtractor={(item, index) => index + 'ranking_item'}
                    />
                }

            </View>
            {end &&
                <TouchableOpacity onPress={() => {
                    setStopMusic(true);
                    _handleAnalyse(fakeRank);
                }} style={{ alignSelf: 'center', paddingHorizontal: 40, paddingVertical: 12, marginVertical: 10, backgroundColor: COLOR.MAIN, borderRadius: 26 }}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 17, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Thống kê</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

export default RankingDashboard;

const OpponentRanking = ({ data }) => {
    return (
        <View animation='jello' duration={1400} style={{ width: '100%', height: 56, borderRadius: 12, marginTop: 10, alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ width: 60, marginLeft: 12 }}>
                <Text style={[styles.opponentText, { color: 'white', alignSelf: 'center' }]}>{data.rank}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                <Image
                    source={avatarIndex[data.avatar || 0].img}
                    style={{ width: 36, height: 36, borderRadius: 18, resizeMode: 'contain' }}
                />
                <View style={{ flex: 1, marginLeft: 6 }}>
                    <Text numberOfLines={2} style={[styles.opponentText, { color: 'white' }]}>{data.name}</Text>
                </View>
            </View>
            <View style={{ width: 90, marginRight: 18, alignItems: 'flex-end' }}>
                <Text numberOfLines={1} style={[styles.opponentText, { color: 'white' }]}>{data.score}</Text>
            </View>
        </View>
    );
}

const MyRanking = ({ data, avatarIdx }) => {
    return (
        <Animatable.View animation='jello' duration={1400} style={{ width: '100%', height: 66, backgroundColor: 'white', borderRadius: 12, marginTop: 10, alignItems: 'center', flexDirection: 'row', }}>
            <View style={{ width: 60, marginLeft: 12 }}>
                <Text style={[styles.myText, { alignSelf: 'center', marginRight: 18 }]}>{data.rank}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={avatarIndex[avatarIdx || 0].img}
                    style={{ width: 40, height: 40, borderRadius: 18, resizeMode: 'contain' }}
                />
                <View style={{ flex: 1, marginLeft: 6 }}>
                    <Text style={styles.myText}>{data.name}</Text>
                </View>
            </View>
            <View style={{ width: 90, marginRight: 18, alignItems: 'flex-end' }}>
                <Text numberOfLines={1} style={styles.myText}>{data.score}</Text>
            </View>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    label: { color: 'white', textAlign: 'center', alignSelf: 'center', fontSize: 20, ...fontMaker({ weight: fontStyles.Regular }) },
    headerText: {
        color: 'white', ...fontMaker({ weight: fontStyles.Light }), fontSize: 15
    },
    myText: {
        color: 'black', ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 17
    },
    opponentText: {
        color: 'black', ...fontMaker({ weight: fontStyles.Light }), fontSize: 15
    },

});
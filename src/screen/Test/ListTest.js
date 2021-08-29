import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View, SafeAreaView, Text, StyleSheet, TouchableOpacity,
    FlatList,
    // ScrollView, Image, Animated, StatusBar, Platform, NativeModules,
    // PixelRatio,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { Card, Icon } from 'native-base';
import { isEmpty, get } from 'lodash';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable'
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";

import ViewContainer from '../../component/shared/ViewContainer';
import { GradientText } from '../../component/shared/GradientText';
import api, { useRequest, Loading } from '../../handle/api';
import { COLOR, fontSize, blackColor, unitIntertitialId, TIMES_SHOW_FULL_ADS } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { helpers } from '../../utils/helpers';

const { width, height } = Dimensions.get('window');

/**-------------interstitial ad----------------- */
import firebase from 'react-native-firebase';
import { fbFull, ViewWithBanner } from '../../utils/facebookAds';
const AdRequest = firebase.admob.AdRequest;
let advert;
let request;

const TAG = 'list_test';

const TestMenu = (props) => {
    const { navigation } = props;
    const chapter_id = navigation.getParam('chapter_id', '');
    const title = navigation.getParam('title', '');
    const screenAds = useSelector(state => get(state, 'subjects.screens', null));
    const advertParam = navigation.getParam('advert', null);
    // console.log('-a-sd-s-dasd', advertParam);
    // const [adsLoading, setAdsLoading] = useState(false);
    // console.log('-----asdasjdjasd-----', screenAds, frequency);
    const [testMenu, loading, err] = useRequest(`menu-items-test/${chapter_id}/lesson-chapter`, [chapter_id])
    // console.log('tes123tMenu', testMenu);

    const handleNavigate = useCallback((screen, params) => {
        navigation.navigate(screen, params)
    }, [navigation]);

    // interstial ad
    const learningTimes = useSelector(state => state.timeMachine.learning_times);
    const frequency = useSelector(state => get(state, 'subjects.frequency', 6));
    useEffect(() => {

        if (screenAds && screenAds[TAG] == "1") {
            if (advertParam && advertParam.show) {
                advertParam.show();
            } else {
                advertParam.show();
                // pre dnd
                // fbFull()
                //     .catch(err => {
                //         if (advertParam) {
                //             advertParam.show();
                //         }
                //     })
            }
        }

        advert = firebase.admob().interstitial(unitIntertitialId);
        request = new AdRequest();
        request.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');
        advert.loadAd(request.build());
    }, []);
    // useEffect(() => {
    //     if ((learningTimes + 2) % frequency === 0) {
    //         console.log('---1-1-TestMenu-1-2');
    //         advert = firebase.admob().interstitial(unitIntertitialId);
    //         request = new AdRequest();
    //         request.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');
    //         advert.loadAd(request.build());
    //     }
    // }, [learningTimes]);

    return (
        <ViewContainer
            style={{ flex: 1 }}
            title={title}
            showRight={false}
            showLeft
            headerView={
                <View >
                    <View style={{ marginTop: 50 + helpers.statusBarHeight }}>
                        <GradientText numberOfLines={3} colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']} style={{ fontSize: 26, marginTop: 4, ...fontMaker({ weight: fontStyles.Bold }) }}>{get(testMenu, 'title', '')}</GradientText>
                    </View>
                    {/* <View style={{ marginTop: 10 }}>
                        <GradientText colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']} style={{ fontSize: 22, marginTop: 4, ...fontMaker({ weight: fontStyles.Bold }) }}></GradientText>
                    </View> */}
                </View>
            }
        >
            <Loading
                isLoading={loading}
                err={err}
                com={LoadingCom}
            >
                <View style={{ flex: 1, marginTop: 40, marginBottom: 20 }}>
                    <FlatList
                        data={get(testMenu, 'children', [])}
                        initialNumToRender={10}
                        removeClippedSubviews={true}
                        renderItem={({ item, index }) => {
                            return <ExcerciseItem
                                data={item}
                                index={index}
                                handleNavigate={handleNavigate}
                                isExpandDefalt={index == 0}
                                advert={advert}
                            />
                        }}
                        keyExtractor={(item, index) => 'LessonCard' + index}
                    />
                </View>
                <ViewWithBanner type="TEST_TREE" />
                {/* {adsLoading && (
                    <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: COLOR.white(1), justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator animating={true} size='large' color={COLOR.MAIN} />
                    </View>
                )} */}
            </Loading>
        </ViewContainer>
    );
}



const ExcerciseItem = ({ data, advert = null, handleNavigate, isExpandDefalt = false, index }) => {
    const [expand, setExpand] = useState(isExpandDefalt);
    return (
        <Animatable.View animation="fadeIn" delay={index * 100} style={[{ marginVertical: 10, marginHorizontal: 5 }, stylesComponent.shadowStyle]}>
            <TouchableOpacity onPress={() => setExpand(!expand)} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingBottom: expand ? 8 : 0, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: '93%' }}>
                    <Text style={{ fontSize: 17, }}>
                        {data.title}
                        <Text style={{ fontSize: 15, marginLeft: 4, color: '#555' }}> ({get(data, 'lesson.parts', []).length} bài)</Text>
                    </Text>
                </View>
                <Icon type='AntDesign' name={expand ? 'minus' : 'plus'} style={{ fontSize: 26, color: COLOR.MAIN }} />
            </TouchableOpacity>
            {!expand || isEmpty(get(data, 'lesson.parts', [])) ? null :
                get(data, 'lesson.parts', []).map((item, index) => {
                    return <RenderItemLesson advert={advert} expand={expand} item={item} handleNavigate={handleNavigate} isLast={index == get(data, 'lesson.parts', []).length - 1} index={index} />
                })
            }
        </Animatable.View>
    );
}


export default connect(
    (state) => ({ bookInfo: state.bookInfo }),
    null
)(React.memo(TestMenu));

const RenderItemLesson = ({ item, advert = null, handleNavigate, expand, isLast, index }) => {
    return (
        <Animatable.View
            key={item.id}
            animation={expand ? "fadeIn" : "fadeOut"}>
            <TouchableOpacity
                onPress={() => handleNavigate('OverviewTest', {
                    idExam: get(item, 'partable.id', ''),
                    title: get(item, 'partable.title', ''),
                    count: get(item, 'partable.questions_count', 0),
                    icon: get(item, 'partable.icon', ''),
                    time: get(item, 'partable.duration'),
                    source: 'ListTest',
                    advert
                    // isTest: true,
                })}
                style={[stylesComponent.textItem, isLast ? { borderBottomWidth: 0, paddingBottom: 10 } : {}]}
            >
                <Text
                    numberOfLines={3}
                    style={stylesComponent.textContent}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{index + 1}. </Text> {get(item, 'partable.title', '')}
                </Text>

                {isEmpty(get(item, 'partable.user_exam', '')) ?
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 40 }}>
                        <Text style={{
                            color: COLOR.MAIN,
                            ...fontMaker({ weight: fontStyles.Regular }),
                            fontSize: 12,
                        }}> Bắt đầu</Text>
                        <Icon style={stylesComponent.icon} type="AntDesign" name="right" />
                    </View>
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 40 }}>
                        <View style={{ paddingRight: 15, paddingVertical: 3, borderRightWidth: 1, borderRightColor: COLOR.black(.1) }}>
                            <Icon type='AntDesign' name='reload1' style={{ fontSize: 17, color: COLOR.MAIN }} />
                        </View>
                        <TouchableOpacity
                            onPress={() => handleNavigate('AnalyseTest', {
                                lessonName: get(item, 'partable.title', ''),
                                examId: get(item, 'partable.id', ''),
                                source: 'ListTest',
                            })}
                            style={{ paddingLeft: 15, paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{
                                color: COLOR.MAIN,
                                fontSize: 12,
                                ...fontMaker({ weight: fontStyles.Regular })
                            }}>Phân tích</Text>
                            <Icon style={stylesComponent.icon} type="AntDesign" name="right" />
                        </TouchableOpacity>
                    </View>
                }
            </TouchableOpacity>
        </Animatable.View>
    )
}

const NoData = () => <Text style={{ fontSize: 17 }}> Tài liệu đang được biên soạn</Text>
// component
const stylesComponent = StyleSheet.create({
    textItem: {
        flexDirection: 'row',
        borderRadius: 5,
        borderBottomColor: '#dedede',
        borderBottomWidth: 2,
        padding: 10, alignItems: 'center',
        paddingVertical: 20
    },
    textContent: {
        ...fontMaker({ weight: fontStyles.Regular }),
        fontSize: fontSize.h3, color: blackColor(0.6), flex: 1,
        fontSize: fontSize.h4
    },
    icon: {
        color: '#777',
        fontSize: 12,
        marginTop: 3,
        marginLeft: 2
    },
    shadowStyle: {
        shadowColor: "rgba(0,0,0,0.4)",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,

        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10
    },


})



const LoadingCom = () => {
    return (
        <View style={{ flex: 1, padding: 20, width: width }}>
            {
                new Array(Math.floor(height / 125)).fill(null).map((i, index) => {
                    return (
                        <Placeholder
                            style={{ marginBottom: 30 }}
                            key={String(index)}
                            Animation={Fade}
                            Left={PlaceholderMedia}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                    )
                })
            }

        </View>
    )
}
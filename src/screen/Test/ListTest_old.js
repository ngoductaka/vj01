import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View, SafeAreaView, Text, StyleSheet, TouchableOpacity,
    FlatList, ScrollView, Image, Animated, StatusBar, Platform, NativeModules,
    PixelRatio,
    Dimensions
} from 'react-native';
import { Card, Icon } from 'native-base';
import { isEmpty, get } from 'lodash';
import { connect, useDispatch } from 'react-redux';

import api, { useRequest } from '../../handle/api';
import { COLOR, fontSize, blackColor } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';

import { isIphoneX } from 'react-native-iphone-x-helper';
const { width } = Dimensions.get('window');

const fakeData = [
    { curriculum: 1447, type: 0 },
    { curriculum: 1447, type: 1 },
    { curriculum: 1447, type: 2 },
    { curriculum: 1447, type: 1 },
];
const defaultImg = 'https://i2.wp.com/img.aapks.com/imgs/9/6/0/960716b7e33558f5a71d32357e2101c2.png?w=705';
// 'https://scontent.fhan2-1.fna.fbcdn.net/v/t1.0-9/65680640_856519258062118_5654789508537778176_o.jpg?_nc_cat=1&_nc_sid=e3f864&_nc_ohc=__-GXI_kjNkAX-zWSDY&_nc_ht=scontent.fhan2-1.fna&oh=18e1f4707c50e93e15036553304166a7&oe=5F39381D'
const imgSubject = {
    '3': 'https://khoahoc.vietjack.com/upload/admin@vietjack.com/subject/raw-file-toan-01-1568795428.jpg',//toan
    '15': 'https://khoahoc.vietjack.com/upload/admin@vietjack.com/subject/raw-file-hoa-01-1568795462.jpg',// hoa
    '11': 'https://khoahoc.vietjack.com/upload/admin@vietjack.com/subject/raw-file-ly-01-1568795447.jpg',// ly
    '4': 'https://khoahoc.vietjack.com/upload/admin@vietjack.com/subject/raw-file-ta-01-1568795412.jpg',// anh
    '12': 'https://khoahoc.vietjack.com/upload/admin@vietjack.com/subject/raw-file-13-1574822863.png',// sinh
}
const plaidImg = (key) => imgSubject[key] ? imgSubject[key] : defaultImg

const HEADER_MAX_HEIGHT = width * 9 / 16;
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;


const LessonOverview = (props) => {
    const { navigation } = props;
    const lessonId = navigation.getParam('lessonId', '');
    const title = navigation.getParam('title', '')
    const flatListRef = useRef();
    useEffect(() => {
        const subjectID = navigation.getParam('subjectID', '');
        const subjectDetail = `/subjects/${subjectID}/first-book`;
        const dataLesson = [];
        if (subjectID)
            api.get(subjectDetail)
                .then(({ data }) => {
                    const fn = (input) => {
                        if (isEmpty(input.children)) {
                            if (dataLesson.length < 10) dataLesson.push(input.id)
                        } else {
                            input.children.map(i => {
                                fn(i)
                            })

                        }
                    }
                    const itemMenu = data.children.find(i => i.id == navigation.getParam('idMenu', ''))
                    fn(itemMenu);
                    const listPromise = dataLesson.map(i => {
                        return api.get(`/menu-items/${i}/lesson`)
                            .then(({ data }) => {
                                const exam = [];
                                data.parts.map(part => {
                                    if (part.type == 'exam') {
                                        exam.push({
                                            ...part,
                                            lessonId: i,
                                            icon: get(data, 'book.icon_id'),
                                            title: get(data, 'book.title'),
                                            subject_id: get(data, 'book.subject_id'),
                                        })
                                    }
                                });
                                return exam;
                            })
                            .catch(_ => ([]))
                    });
                    Promise.all(listPromise)
                        .then(dataLesson => {
                            const data = dataLesson.filter(i => !isEmpty(i)).flat();
                            setDataLesson([{ type: 'exam', data }])
                        })
                })

    }, [])

    const [_dataLesson, loading, err] = useRequest(`/menu-items/${lessonId}/lesson`, [lessonId]);
    const [scrollY] = useState(new Animated.Value(0));

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
    });

    const imageTranslate = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    const heightShadow = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT / 2, 0],
        extrapolate: 'clamp',
    });

    const showHeader = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const [dataLesson, setDataLesson] = useState([]);
    const [dataLecture, setLecture] = useState({})

    useEffect(() => {
        if (_dataLesson && _dataLesson.data) {
            const article = [];
            const exam = [];
            const video = [];
            get(_dataLesson, 'data.parts', []).map(part => {
                if (part.type == "lecture"
                    && part.partable != null
                ) {
                    setLecture(part);
                } else if (part.type == 'exam') {
                    exam.push(part)
                } else if (part.type == 'video') {
                    video.push(part)
                } else {
                    article.push(part)
                }
            });
            const data = [];
            if (article[0]) data.push({ type: 'article', data: article });
            if (exam[0]) data.push({ type: 'exam', data: exam });
            if (video[0]) data.push({ type: 'video', data: video });
            setDataLesson(data)
        }
    }, [_dataLesson]);

    const handleNavigate = useCallback((screen, params) => {
        console.log(screen, params)
        navigation.navigate(screen, params)
    }, [navigation])


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    ref={flatListRef}
                    scrollEventThrottle={24}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }]
                    )}
                    contentContainerStyle={{ top: HEADER_MAX_HEIGHT, bottom: -HEADER_MAX_HEIGHT }}
                    ListFooterComponent={<View style={{ height: HEADER_MAX_HEIGHT + 200 }}></View>}
                    data={dataLesson}
                    style={{ padding: 10, flex: 1 }}
                    renderItem={({ item, index }) => {
                        if (item.type == 'exam') return <ExcerciseItem data={item.data} handleNavigate={handleNavigate} book={get(_dataLesson, 'data.book')} lessonId={lessonId} />

                        // if (item.type == 'article') return <ArticleItem data={item.data} handleNavigate={handleNavigate} />

                        // if (item.type == 'video') return <VideoItem data={item.data} handleNavigate={handleNavigate} />
                        return null;
                    }}
                    keyExtractor={(item, index) => 'LessonCard' + index}
                />
                <Animated.View style={[styles.header, {
                    height: headerHeight,
                    // backgroundColor: COLOR.MAIN
                }]}>
                    <Animated.Image
                        style={[
                            styles.backgroundImage,
                            { opacity: imageOpacity, transform: [{ translateY: imageTranslate }] },
                        ]}
                        // case null => dd
                        source={{ uri: get(dataLecture, 'partable.videos.preview_img', '') ? get(dataLecture, 'partable.videos.preview_img', '') : plaidImg(get(_dataLesson, 'data.book.icon_id')) }}
                    />
                    <View blurRadius={1} style={{ backgroundColor: "rgba(255,255,255, 0.3)", width: '100%', height: HEADER_MAX_HEIGHT / 3, top: HEADER_MAX_HEIGHT * (2 / 3), position: 'absolute' }} />
                    <View blurRadius={1} style={{ backgroundColor: "rgba(255,255,255, 0.7)", width: '100%', height: HEADER_MAX_HEIGHT / 6, top: HEADER_MAX_HEIGHT * (5 / 6), position: 'absolute' }} />
                    {/* <View blurRadius={1} style={{ backgroundColor: "rgba(255,255,255, 0.7)", width: '100%', height: HEADER_MAX_HEIGHT/10, top: HEADER_MAX_HEIGHT*(9/10), position: 'absolute' }}/> */}
                    {/* play and title */}
                    <Animated.View style={{
                        position: 'absolute',
                        top: heightShadow,
                        right: 0, left: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: imageOpacity
                    }}>
                        <TouchableOpacity
                            style={{ alignItems: 'center', }}
                            onPress={() => {
                                if (get(dataLecture, 'partable.videos.id', ''))
                                    navigation.navigate('CoursePlayer', {
                                        lectureId: get(dataLecture, 'partable.videos.id', ''),
                                        view_count: get(dataLecture, 'partable.view_count', '')
                                    })
                            }}
                        >
                            {get(dataLecture, 'partable.videos.id', '') ?
                                <Icon type="AntDesign" name={'playcircleo'} style={{ fontSize: 50, color: '#fff' }} /> :
                                // <Text style={{ color: '#111', fontSize: 17 }}>Video đang được biên soạn </Text>
                                null
                            }
                        </TouchableOpacity>
                    </Animated.View>
                    {/*  */}
                    <SafeAreaView style={{ width: '100%', height: isIphoneX() ? 86 : 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => {
                            navigation.goBack();
                        }} style={{ marginLeft: 10, marginTop: 20, padding: 5, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 10, height: 40, width: 40, justifyContent: "center", alignItems: 'center' }}>
                            <Icon type='MaterialCommunityIcons' name={'arrow-left'} style={{ fontSize: 26, color: 'black' }} />
                        </TouchableOpacity>
                        <Animated.View style={{ opacity: showHeader, marginTop: 20, flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 40 }}>
                            <Text style={{ fontSize: 20 }}>{title}</Text>
                        </Animated.View>
                    </SafeAreaView>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}


const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'stretch',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    bar: {
        marginTop: Platform.OS === 'ios' ? 28 : 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        // backgroundColor: blackColor(0.3),
        left: 0,
        right: 0,
        padding: 10,
    },
    title: {
        // backgroundColor: 'transparent',
        // color: 'white',
        fontSize: 18,
    },
    scrollViewContent: {
        marginTop: HEADER_MAX_HEIGHT,
    },
})
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
    }

})
const SeeMore = ({ onPress }) => {
    return (
        <View style={{ justifyContent: 'flex-end' }}>
            <TouchableOpacity
                onPress={onPress}
                style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 }}
            >
                <Text style={{
                    color: COLOR.MAIN,
                    fontSize: 12,
                }}>Xem thêm</Text>
                <Icon style={stylesComponent.icon} type="AntDesign" name="right" />
            </TouchableOpacity>
        </View>
    )
}

const ExcerciseItem = ({ data, handleNavigate, book, lessonId }) => {
    return (
        <View style={{ marginTop: 25 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingVertical: 20 }}>
                <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }) }}>Trắc nghiệm</Text>
            </View>
            {isEmpty(data) ? <NoData /> :
                <View style={{ paddingHorizontal: 0 }}>{
                    data.map((item, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() => handleNavigate('OverviewTest', {
                                    idExam: get(item, 'partable.id', ''),
                                    title: get(item, 'partable.title', ''),
                                    icon: get(item, 'icon'),
                                    subject: get(item, 'title'),
                                    lessonId: get(item, 'lessonId'),
                                    source: 'ListTest',
                                    // isTest: true,
                                })}

                                // OverviewTest
                                style={stylesComponent.textItem}
                            >
                                <Text
                                    numberOfLines={3}
                                    style={stylesComponent.textContent}
                                >
                                    {get(item, 'partable.title', '')}
                                </Text>
                                {!get(item, 'partable.user_exam', '') ?
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
                                        <View style={{ paddingRight: 15 }}>
                                            <Icon type='AntDesign' name='reload1' style={{ fontSize: 17, color: COLOR.MAIN }} />
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleNavigate('AnalyseTest', {
                                                examId: item.id
                                            })}
                                            style={{ paddingLeft: 15, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: COLOR.black(.1) }}>
                                            <Text style={{
                                                color: COLOR.MAIN,
                                                fontSize: 12,
                                                ...fontMaker({ weight: fontStyles.Regular })
                                            }}>Phân tích</Text>
                                            <Icon style={stylesComponent.icon} type="AntDesign" name="right" />
                                        </TouchableOpacity>
                                    </View>
                                }
                            </TouchableOpacity>)
                    })
                }
                </View>}
        </View>
    );
}

const VideoItem = ({ data, handleNavigate }) => {
    return (
        <View style={{ marginTop: 25 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingVertical: 20 }}>
                <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }) }}>Video giải bài tập</Text>
            </View>
            {isEmpty(data) ? <NoData /> :
                <View>{
                    data.slice(0, 4).map(item => {
                        return (
                            <TouchableOpacity
                                onPress={() => handleNavigate('CoursePlayer', { lectureId: get(item, 'partable_id', ''), view_count: get(item, 'partable.view_count', '') })}
                                style={stylesComponent.textItem}
                            >
                                <Text numberOfLines={2} style={stylesComponent.textContent}>
                                    {get(item, 'partable.title', '')}
                                </Text>
                                <Icon type="AntDesign" name="right" style={[stylesComponent.icon, { color: COLOR.MAIN }]} />
                            </TouchableOpacity>)
                    })
                }
                </View>
            }

            {
                data.length > 4 && <SeeMore onPress={() => handleNavigate('ListDetailLesson', { title: "Video giải bài tập", data })} />
            }
        </View>
    );
}
const CoinItem = ({ type = 'Entypo', icon = 'pencil', figure = 10, label = 'XP' }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 25 }}>
            <Icon type={type} name={icon} style={{ fontSize: 15, color: 'red' }} />
            <Text style={{ marginLeft: 7, color: '#595E63', ...fontMaker({ weight: fontStyles.Regular }), fontSize: fontSize.h5 }}>{figure} {label}</Text>
        </View>
    );
}

export default connect(
    (state) => ({ bookInfo: state.bookInfo }),
    null
)(React.memo(LessonOverview));

const NoData = () => <Text style={{ fontSize: 17 }}> Tài liệu đang được biên soạn</Text>
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View, SafeAreaView, Text, StyleSheet, TouchableOpacity,
    ScrollView, Platform,
    Dimensions,
    ImageBackground,
    BackHandler,
    Image,
    ActivityIndicator
} from 'react-native';

import { Card, Icon } from 'native-base';
import { isEmpty, get } from 'lodash';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';
import { Thumbnail } from 'react-native-thumbnail-video';
import LottieView from 'lottie-react-native';

import { useRequest, Loading } from '../../handle/api';
import { helpers } from '../../utils/helpers';
import { COLOR, fontSize, blackColor, TIMES_SHOW_FULL_ADS, unitIntertitialId } from '../../handle/Constant';

import { VideoItem } from './component/VideosList';
import { ExcerciseItem } from './component/ExamList';
import { ArticleItem, RenderChapterLesson } from './component/ArticleList'
const { width, height } = Dimensions.get('window');
import BackHeader from '../Bookmark/Component/BackHeader';
import { fontMaker, fontStyles } from '../../utils/fonts';

/**-------------interstitial ad----------------- */
import firebase from 'react-native-firebase';
import { setLearningTimes } from '../../redux/action/user_info';
const AdRequest = firebase.admob.AdRequest;
let advert;
let request;
let otherAdvert;
let otherRequest;

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

const dnd = HEADER_MAX_HEIGHT - (helpers.isIOS ? helpers.statusBarHeight : 0) - (helpers.isIOS ? 20 : 40)

const TAG = 'lesson_overview';

const LessonOverview = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();
    let endPoint = ''
    const lessonId = navigation.getParam('lessonId', '');
    const chapterData = navigation.getParam('chapterData', '');
    const lesson_id = navigation.getParam('lesson_id', '');
    // get lesson by id menuItem
    if (lessonId) endPoint = `/menu-items/${lessonId}/lesson`;
    // get lesson by lesson id
    else if (lesson_id) endPoint = `/lessons/${lesson_id}`;

    const showFullAds = navigation.getParam('showFullAds', true);
    const advertParam = navigation.getParam('advert', null);
    // console.log('adverrrrr', advertParam);

    const [_dataLesson, loading, err] = useRequest(endPoint, [lessonId + lesson_id]);
    const [dataLesson, setDataLesson] = useState([]);
    const [dataLecture, setLecture] = useState([]);
    const [showHeader, setShowHeader] = useState(null);
    const [visible, setVisible] = useState(false);

    const screenAds = useSelector(state => get(state, 'subjects.screens', null));
    const frequency = useSelector(state => get(state, 'subjects.frequency', 6));
    // console.log('-----asdasjdjasd-----', screenAds, frequency);

    // interstial ad
    const learningTimes = useSelector(state => state.timeMachine.learning_times);
    const articleLearningTimes = useSelector(state => state.timeMachine.article_learning_times);
    useEffect(() => {
        if (showFullAds) {
            if (screenAds && screenAds[TAG] == "1") {
                // if (learningTimes % frequency === 0) {
                // console.log('----------');
                if (advertParam) {
                    advertParam.show();
                }
                // advert.on('onAdClosed', () => {
                //     setAdsLoading(false);
                // });
                // }
            }
        }
    }, []);

    useEffect(() => {
        if (learningTimes % frequency == 0) {
            // console.log('---1-1-2-1-2');
            otherAdvert = firebase.admob().interstitial(unitIntertitialId);
            otherRequest = new AdRequest();
            otherRequest.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');
            otherAdvert.loadAd(otherRequest.build());
            // console.log('----a', otherAdvert);
        }
    }, [learningTimes]);

    useEffect(() => {
        if (articleLearningTimes % frequency == 0) {
            console.log('---1-22222222-2-1-2');
            advert = firebase.admob().interstitial(unitIntertitialId);
            request = new AdRequest();
            request.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');
            advert.loadAd(request.build());
        }
    }, [articleLearningTimes]);

    useEffect(() => {
        if (_dataLesson && _dataLesson.data) {
            const sbt = [];
            const sgk = [];
            const vbt = [];

            const bookType1 = [];
            const bookType2 = [];
            const bookType3 = [];
            const bookType4 = [];

            const exam = [];
            const video = [];
            const lecture = [];
            get(_dataLesson, 'data.parts', []).map(part => {
                if (part.partable === null) return 1;
                if (part.type == "lecture") {
                    lecture.push(part);
                    video.push(part);
                } if (part.type == 'exam') {
                    exam.push(part)
                } if (part.type == 'video') {
                    video.push(part);
                    lecture.push(part);
                } if (part.type == 'article') {
                    // 0:SGK|1:SBG|2:VBT| 3:Tài liệu|4:Soạn văn|5:Lý thuyết|6:Tác giả-tác phẩm

                    if (get(part, 'partable.content_type', '') == 1) {
                        sbt.push(part)
                    } else if (get(part, 'partable.content_type', '') == 2) {
                        vbt.push(part)
                    } else if (get(part, 'partable.content_type', '') == 3) {
                        bookType1.push(part)
                    } else if (get(part, 'partable.content_type', '') == 4) {
                        bookType2.push(part)
                    } else if (get(part, 'partable.content_type', '') == 5) {
                        bookType3.push(part)
                    } else if (get(part, 'partable.content_type', '') == 6) {
                        bookType4.push(part)
                    } else {
                        sgk.push(part)
                    }
                }
            });
            const data = [];
            if (sgk[0]) data.push({ type: 'sgk', data: sgk });
            if (sbt[0]) data.push({ type: 'sbt', data: sbt });
            if (vbt[0]) data.push({ type: 'vbt', data: vbt });

            if (bookType1[0]) data.push({ type: 'bookType1', data: bookType1 });
            if (bookType2[0]) data.push({ type: 'bookType2', data: bookType2 });
            if (bookType3[0]) data.push({ type: 'bookType3', data: bookType3 });
            if (bookType4[0]) data.push({ type: 'bookType4', data: bookType4 });

            if (exam[0]) data.push({ type: 'exam', data: exam });
            if (video[0]) data.push({ type: 'video', data: video });

            setLecture(lecture);
            setDataLesson(data)
        }
    }, [_dataLesson]);

    const handleNavigate = useCallback((screen, params) => {
        navigation.navigate(screen, params)
    }, [navigation]);

    const _onScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        if (currentOffset > dnd) {
            if (!showHeader) setShowHeader(true);
        } else {
            if (showHeader) setShowHeader(false);
        }
    }
    useEffect(() => {
        return () => {
            dispatch(setLearningTimes());
        }
    }, [])

    useEffect(() => {
        BackHandler.addEventListener(
            'hardwareBackPress',
            _handleBack
        );

        return () => {
            BackHandler.removeEventListener(
                'hardwareBackPress',
                _handleBack
            );
        }
    }, [_dataLesson]);

    const _handleBack = () => {
        if (lesson_id) {
            props.navigation.navigate('Subject', { bookId: get(_dataLesson, 'data.book.id', ''), title: get(_dataLesson, 'data.book.title', '') });
            return true;
        } else {
            props.navigation.goBack();
            return true;
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <BackHeader
                title={get(_dataLesson, 'data.title', '')}
                leftAction={_handleBack}
                showRight={false}
            />
            <Loading isLoading={loading} err={err}>
                {isEmpty(get(_dataLesson, 'data.parts')) ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieView
                            autoPlay
                            loop
                            style={{ width: 260, height: 260, alignSelf: 'center' }}
                            source={require('../../public/empty-notification.json')}
                        />
                        <Text style={{ fontSize: 16, textAlign: 'center', ...fontMaker({ weight: fontStyles.Regular }) }}>Tài liệu đang được biên soạn!</Text>
                    </View>
                ) :
                    <ScrollView
                        // scrollEventThrottle={2}
                        // onScroll={_onScroll}
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ width: '100%' }}>
                            {isEmpty(dataLecture) ?
                                <View style={[styles.viewBox]}>
                                    <ImageBackground
                                        style={[styles.backgroundImage, { justifyContent: 'center', alignItems: 'center' }]}
                                        source={{ uri: defaultImg }}
                                    >
                                    </ImageBackground>
                                </View>

                                :
                                <View>
                                    <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }), marginBottom: 20, paddingHorizontal: 10 }}>Video nổi bật</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    // contentContainerStyle={{ paddingHorizontal: 15 }}
                                    >
                                        {dataLecture.slice(0, 3).map((lecture, index) => {
                                            return get(lecture, 'partable.youtube_id', '') ? (
                                                <View key={String(index) + get(lecture, 'partable.id', '')} style={{
                                                    width: dataLecture.slice(0, 3).length == 1 ? width : 3 * width / 4,
                                                    height: null,
                                                    marginLeft: dataLecture.slice(0, 3).length == 1 ? 0 : 20,
                                                }}>
                                                    <View style={{
                                                        flex: 1,
                                                        // width: '100%',
                                                        height: dataLecture.slice(0, 3).length == 1 ? 9 * width / 16 : 27 * width / 64,
                                                        borderRadius: dataLecture.slice(0, 3).length == 1 ? 0 : 8, overflow: 'hidden'
                                                    }}>
                                                        <Thumbnail
                                                            iconStyle={{
                                                                height: 22,
                                                                width: 22,
                                                            }}
                                                            imageWidth={dataLecture.slice(0, 3).length == 1 ? width : 3 * width / 4}
                                                            imageHeight={dataLecture.slice(0, 3).length == 1 ? 9 * width / 16 : 27 * width / 64}
                                                            url={lecture.partable.url}
                                                        />
                                                        <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: COLOR.black(.6), paddingHorizontal: 6, paddingVertical: 4, borderTopLeftRadius: 8 }}>
                                                            <Text style={{ fontSize: 13, color: COLOR.white(1), ...fontMaker({ weight: fontStyles.Regular }) }}>
                                                                {helpers.convertTime(get(lecture, 'partable.length', ''))}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <TouchableOpacity
                                                        style={{
                                                            flex: 1,
                                                            position: 'absolute', top: 0, left: 0,
                                                            width: '100%', height: '100%',
                                                        }}
                                                        onPress={() => {
                                                            if (get(lecture, 'partable.id', ''))
                                                                navigation.navigate('CoursePlayer', {
                                                                    lectureId: get(lecture, 'partable.id', ''),
                                                                })
                                                        }}>
                                                    </TouchableOpacity>
                                                    <VideoInfoContent
                                                        title={get(lecture, 'partable.title', '')}
                                                        author={get(lecture, 'partable.author.name', '')}
                                                        style={{ padding: dataLecture.slice(0, 3).length == 1 ? 10 : 0 }}
                                                        width={dataLecture.slice(0, 3).length == 1 ? width : 3 * width / 4}
                                                        view_count={get(lecture, 'partable.view_count', '')}
                                                    // isLecture={get(lecture, 'partable.type', '') === 'lecture'}
                                                    />
                                                </View>
                                            ) : (
                                                    <TouchableOpacity
                                                        style={{
                                                            // marginRight: dataLecture.slice(0, 3).length == 1 ? 0 : 20,
                                                            marginLeft: dataLecture.slice(0, 3).length == 1 ? 0 : 20,
                                                        }}
                                                        key={String(index) + get(lecture, 'partable.videos.id', '')}
                                                        onPress={() => {
                                                            if (get(lecture, 'partable.videos.id', ''))
                                                                navigation.navigate('CoursePlayer', {
                                                                    lectureId: get(lecture, 'partable.videos.id', ''),
                                                                    view_count: get(lecture, 'partable.view_count', '')
                                                                })
                                                        }}
                                                    >
                                                        <View style={{
                                                            width: dataLecture.slice(0, 3).length == 1 ? width : 3 * width / 4,
                                                            height: dataLecture.slice(0, 3).length == 1 ? 9 * width / 16 : 27 * width / 64,
                                                            justifyContent: 'center', alignItems: 'center',
                                                            borderRadius: dataLecture.slice(0, 3).length == 1 ? 0 : 8, overflow: 'hidden'
                                                        }}>
                                                            <Image
                                                                resizeMode="contain"
                                                                style={{ position: 'absolute', width: '100%', height: '100%' }}
                                                                source={{
                                                                    uri: get(lecture, 'partable.videos.preview_img', '') ? get(lecture, 'partable.videos.preview_img', '') : plaidImg(get(_dataLesson, 'data.book.icon_id')),
                                                                    // priority: FastImage.priority.normal,
                                                                }}
                                                            // resizeMode={FastImage.resizeMode.stretch}
                                                            />
                                                            {get(lecture, 'partable.videos.id', '') ?
                                                                <Icon type="AntDesign" name={'playcircleo'} style={{ fontSize: 50, color: '#fff' }} /> :
                                                                null
                                                            }
                                                            <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: COLOR.black(.6), paddingHorizontal: 6, paddingVertical: 4, borderTopLeftRadius: 8 }}>
                                                                <Text style={{ fontSize: 13, color: COLOR.white(1), ...fontMaker({ weight: fontStyles.Regular }) }}>
                                                                    {helpers.convertTime(get(lecture, 'partable.length', ''))}
                                                                </Text>
                                                            </View>
                                                        </View>

                                                        <VideoInfoContent
                                                            title={get(lecture, 'partable.title', '')}
                                                            view_count={get(lecture, 'partable.videos.view_count', '0')}
                                                            style={{ padding: dataLecture.slice(0, 3).length == 1 ? 10 : 0 }}
                                                            width={dataLecture.slice(0, 3).length == 1 ? width : 3 * width / 4}
                                                        // isLecture={get(lecture, 'partable.type', '') === 'lecture'}
                                                        />
                                                    </TouchableOpacity>
                                                )
                                        })}
                                    </ScrollView>
                                </View>
                            }
                        </View>

                        <View style={{ padding: 10, flex: 1 }}>
                            {
                                dataLesson.map(((item, index) => {
                                    if (item.type == 'sgk') return <ArticleItem data={item.data} advertParam={advert} handleNavigate={handleNavigate} SeeMore={SeeMore} title="Sách giáo khoa" />
                                    if (item.type == 'sbt') return <ArticleItem data={item.data} advertParam={advert} handleNavigate={handleNavigate} SeeMore={SeeMore} title="Sách bài tập" />
                                    if (item.type == 'vbt') return <ArticleItem data={item.data} advertParam={advert} handleNavigate={handleNavigate} SeeMore={SeeMore} title="Vở bài tập" />
                                    if (item.type == 'bookType1') return <ArticleItem data={item.data} advertParam={advert} handleNavigate={handleNavigate} SeeMore={SeeMore} title="Tài liệu" />
                                    if (item.type == 'bookType2') return <ArticleItem data={item.data} advertParam={advert} handleNavigate={handleNavigate} SeeMore={SeeMore} title="Soạn văn" />
                                    if (item.type == 'bookType3') return <ArticleItem data={item.data} advertParam={advert} handleNavigate={handleNavigate} SeeMore={SeeMore} title="Lý thuyết" />
                                    if (item.type == 'bookType4') return <ArticleItem data={item.data} advertParam={advert} handleNavigate={handleNavigate} SeeMore={SeeMore} title="Tác giả-tác phẩm" />

                                    if (item.type == 'video') return <VideoItem setVisible={setVisible} advertParam={otherAdvert} data={item.data} handleNavigate={handleNavigate} />
                                    if (item.type == 'exam') return <ExcerciseItem data={item.data} advertParam={otherAdvert} handleNavigate={handleNavigate} book={get(_dataLesson, 'data.book')} lessonId={lessonId} SeeMore={SeeMore} />
                                    return null;
                                }))
                            }
                            {
                                get(chapterData, '[0]') ? <RenderChapterLesson data={get(chapterData, '[0]')} /> : null
                            }
                        </View>

                    </ScrollView>
                }
                {/* {adsLoading && (
                    <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: COLOR.white(1), justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator animating={true} size='large' color={COLOR.MAIN} />
                    </View>
                )} */}
            </Loading>
            <SafeAreaView />
            <Snackbar
                visible={visible}
                duration={5000}
                wrapperStyle={{ padding: 0 }}
                style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, borderRadius: 0 }}
                onDismiss={() => setVisible(false)}
                action={{
                    label: 'Xem ngay',
                    onPress: () => {
                        navigation.navigate('Bookmark');
                    },
                }}>
                Đã thêm vào "Bookmarks"
            </Snackbar>
        </View>
    );
}

const VideoInfoContent = ({ title, author = '', view_count = '0', isLecture = '', width, style }) => {
    return (
        <View style={{ width: width, paddingVertical: 14, ...style }}>
            <Text style={styles.titleContent}>{title}</Text>
            {author ?
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, paddingRight: 20 }}>
                    <Icon type='MaterialCommunityIcons' name='account' style={styles.subIcon} />
                    <Text numberOfLines={1} style={styles.subtitle}>{author}</Text>
                </View>
                :
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, paddingRight: 20 }}>
                    <Icon type='Feather' name='eye' style={styles.subIcon} />
                    <Text numberOfLines={1} style={styles.subtitle}>{view_count} lượt xem</Text>
                </View>
            }
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20 }}>
                <Icon style={styles.subIcon} name={isLecture ? "book-open" : "file-text"} type='Feather' />
                <Text style={styles.subtitle} numberOfLines={1}>
                    {isLecture ? 'Bài giảng' : 'Giải bài tập'}
                </Text>
            </View> */}
            <View style={{ paddingHorizontal: 14, paddingVertical: 4, marginTop: 10, alignSelf: 'baseline', backgroundColor: COLOR.MAIN, borderRadius: 3 }}>
                <Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.Regular }), fontSize: 15 }}>Nổi bật</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    subtitle: {
        ...fontMaker({ weight: fontStyles.Regular }),
        fontSize: 14,
        marginLeft: 10,
        color: '#777'
    },
    subIcon: {
        fontSize: 16,
        color: '#777',
    },
    titleContent: {
        ...fontMaker({ weight: fontStyles.SemiBold }),
        fontSize: 18,
    },
    viewBox: {
        width: width,
        height: HEADER_MAX_HEIGHT,
    },
    slider: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotContainer: {
        position: 'absolute',
        bottom: 0
    },
    backgroundImage: {
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'stretch',
    },
    bar: {
        marginTop: Platform.OS === 'ios' ? 28 : 20,
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        padding: 10,
    },
    title: {
        fontSize: 18,
    },
    scrollViewContent: {
        marginTop: HEADER_MAX_HEIGHT,
    },
    shadow: {
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },
    },
    searchHeader: {
        width: 40, height: 40,
        borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'white',
    },
})

const SeeMore = ({ onPress, count = 1, expanded = false }) => {
    return (
        <View style={{ justifyContent: 'center' }}>
            <TouchableOpacity
                onPress={onPress}
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}
            >
                <Text style={{
                    color: COLOR.MAIN,
                    fontSize: fontSize.h4,
                    ...fontMaker({ weight: fontStyles.Bold })
                }}>{expanded ? 'Thu gọn' : `Xem thêm ${count} bài khác`}</Text>
                <Icon name={!expanded ? 'arrow-down' : 'arrow-up'} style={{ fontSize: 16, color: COLOR.MAIN, marginLeft: 4 }} />
            </TouchableOpacity>
        </View>
    )
}

export default connect(
    (state) => ({ bookInfo: state.bookInfo }),
    null
)(React.memo(LessonOverview));

const NoData = () => <Text style={{ fontSize: 17 }}> Tài liệu đang được biên soạn</Text>
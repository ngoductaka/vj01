import React, { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    Text, BackHandler,
    SafeAreaView,
    PixelRatio, TouchableOpacity, StatusBar
} from 'react-native';
import Video from 'react-native-video';
import { get, throttle, isEmpty } from 'lodash';
import { Icon, Tab, Tabs } from 'native-base';
import LottieView from 'lottie-react-native';
import StepIndicator from 'react-native-step-indicator';
import { withNavigationFocus } from 'react-navigation';
// import YoutubePlayer from "react-native-yt-player";
import YoutubePlayer from 'react-native-youtube-iframe';
import KeepAwake from 'react-native-keep-awake';
import Orientation from 'react-native-orientation-locker';
import { Snackbar } from 'react-native-paper';

import { Loading, useRequest } from '../../handle/api';

import BackVideoHeader from './component/BackVideoHeader';
import { helpers } from '../../utils/helpers';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { Toolbar } from './component/Toolbar';
import { FeedbackModal } from './component/FeedbackModal';
import { COLOR } from '../../handle/Constant';

import { RenderArticlRelated } from '../Lesson/component/ArticleList';
import { RenderVideosRelated } from '../Lesson/component/VideosList'
import { RenderExamRelated } from '../Lesson/component/ExamList';
import { useDispatch } from 'react-redux';
import { setLearningTimes } from '../../redux/action/user_info';

const { width, height } = Dimensions.get('window');

const stepIndicatorStyles = {
    stepIndicatorSize: 10,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#aaaaaa',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 15,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: '#000000',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,.5)',
    labelColor: '#666666',
    labelSize: 15,
    currentStepLabelColor: '#fe7013',
};

const Colors = {
    white: '#ffffff',
    black: '#000000',
    pri: '#FB9A4B',
}

const CoursePlayer = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();

    const lectureId = navigation.getParam('lectureId', '');
    const [full, setFull] = useState(false);
    const [visible, setVisible] = useState(false);
    const [paused, setPaused] = useState(false);

    const timeOut = useRef();
    const mediaPlayer = useRef();

    const [isPlay, setPlay] = useState(true);
    // const [videoData, isLoading, err] = useRequest(`/videos/details/${lectureId}`, [lectureId]);
    // console.log(videoData);
    const [videoData, isLoading, err] = useRequest(`/videos/show/${lectureId}`, [lectureId]);
    // console.log('videoDatavideoDatavi123123deoData', videoData)
    const [currentPlay, setCurrentPlay] = useState(-1);
    const [showFeedback, setShowFeedback] = useState(false);
    const [convertTimeStamp, setTimeConvert] = useState({});
    // throttle set new index
    const throttled = useRef(throttle((newValue) => _onProgress(newValue), 1000));

    /** video handler */
    const _onSeekTo = ({ item, index }) => {
        try { // type 1 => youtube 0 => course
            if (get(videoData, 'data.type', 0)) { // youtube
                mediaPlayer.current.seekTo(item.time);
                setPlay(true);
            } else {
                mediaPlayer.current.seek(item.time);
            }
            setCurrentPlay(index);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        changeKeepAwake(true);
        if (!isEmpty(get(videoData, 'data.timestamps', []))) {
            const convertTime = get(videoData, 'data.timestamps', []).reduce((car, cur, index) => {
                car[cur.time] = index
                return car;
            }, {});
            setTimeConvert(convertTime);
        }

        return () => {
            changeKeepAwake(false)
        }
    }, [videoData]);

    useEffect(() => {
        throttled.current = throttle((newValue) => _onProgress(newValue), 1000)
    }, [convertTimeStamp])

    const _onProgress = (data) => {
        const timeCurrent = Math.floor(data.currentTime);
        // console.log('_onProgress', timeCurrent)
        const listTime = Object.keys(convertTimeStamp);
        const timeMinInRank = listTime.find((key, index) => timeCurrent + 1 > key && timeCurrent + 1 <= listTime[index + 1])
        const indexTime = convertTimeStamp[timeMinInRank];

        if (indexTime !== currentPlay) {
            setCurrentPlay(indexTime)
        }
    }

    const _onEnd = () => {
        setCurrentPlay(-1);
    }

    const _onReadyForDisplay = () => {
        setCurrentPlay(0);
    }

    useEffect(() => {
        BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButtonPressAndroid
        );

        return () => {
            Orientation.lockToPortrait();
            BackHandler.removeEventListener(
                'hardwareBackPress',
                handleBackButtonPressAndroid
            );
        }
    }, []);

    const handleBackButtonPressAndroid = () => {
        if (full) {
            handleBackFullScreen();
            return true;
        } else {
            props.navigation.goBack();
            return true;
        }
    }

    useEffect(() => {
        setPlay(navigation.isFocused());
        setPaused(!navigation.isFocused());
    }, [navigation.isFocused()]);

    useEffect(() => {
        const dataTime = get(videoData, 'data.timestamps', null);
        if (mediaPlayer && mediaPlayer.current && mediaPlayer.current.getCurrentTime && !isEmpty(convertTimeStamp) && isPlay) {
            timeOut.current = setInterval(() => {
                if (mediaPlayer && mediaPlayer.current && mediaPlayer.current.getCurrentTime)
                    mediaPlayer.current.getCurrentTime().then(currentTime => {
                        _onProgress({ currentTime })
                        // const indexTime = convertTimeStamp[Math.floor(currentTime)];
                        // if (indexTime !== undefined) {
                        //     setCurrentPlay(indexTime)
                        // }
                        if (dataTime && currentTime >= dataTime[dataTime.length - 1].time) {
                            clearInterval(timeOut.current);
                        }
                    });
            }, 1000);

        }
        if (!isPlay) {
            clearInterval(timeOut.current);
        }

        return () => {
            clearInterval(timeOut.current);
        }
    }, [mediaPlayer.current, convertTimeStamp, isPlay, lectureId]);

    const handleBackFullScreen = () => {
        setFull(false);
        Orientation.lockToPortrait();
    }

    useEffect(() => {
        return () => {
            dispatch(setLearningTimes());
        }
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <StatusBar
                hidden={helpers.isAndroid && full}
                barStyle='dark-content'
            />
            {!(full && helpers.isAndroid) && <BackVideoHeader rightAction={() => setShowFeedback(true)} title={get(videoData, 'data.title', '')} />}
            <SafeAreaView style={styles.container}>
                <View style={{ width: '100%', height: (helpers.isAndroid && full) ? '100%' : width * 9 / 16 }}>
                    <Loading
                        isLoading={isLoading} err={err}
                    >
                        {
                            (get(videoData, 'data.type', 0)) ?
                                <YoutubePlayer
                                    ref={mediaPlayer}
                                    height={PixelRatio.roundToNearestPixel(width / (16 / 9))}
                                    width={width}
                                    videoId={get(videoData, 'data.youtube_id', 0)}
                                    // videoId="qorU1icdKps"
                                    play={isPlay}
                                    onChangeState={event => {
                                        if (event === 'paused') setPlay(false)
                                        else if (event === 'playing') setPlay(true)
                                    }}
                                    // onReady={() => console.log("ready")}
                                    // onError={e => console.log(e)}
                                    volume={100}
                                    playbackRate={1}
                                    initialPlayerParams={{
                                        cc_lang_pref: "vn",
                                        showClosedCaptions: true
                                    }}
                                />
                                :
                                <View style={{ flex: 1 }}>
                                    <Video
                                        source={{ uri: get(videoData, 'data.url', '') }}
                                        ref={mediaPlayer}
                                        // onError={(err) => console.log('err video ios khoahoc', err)}
                                        onEnd={_onEnd}
                                        paused={paused}
                                        onReadyForDisplay={_onReadyForDisplay}
                                        onProgress={throttled.current}
                                        preventsDisplaySleepDuringVideoPlayback={true}
                                        progressUpdateInterval={1}
                                        controls={true}
                                        poster={get(videoData, 'data.preview_img', 'https://baconmockup.com/300/200/')}
                                        posterResizeMode='cover'
                                        resizeMode='contain'
                                        fullscreen={helpers.isIOS}
                                        style={{ flex: 1 }}
                                        fullscreenOrientation='landscape'
                                        onPlaybackRateChange={({ playbackRate }) => setPlay(playbackRate)}
                                    />
                                    {(helpers.isAndroid && full) &&
                                        <TouchableOpacity onPress={handleBackFullScreen} style={{ padding: 10, position: 'absolute', top: 10, left: 10 }} >
                                            <Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 26, color: COLOR.white(1) }} />
                                        </TouchableOpacity>
                                    }
                                    {(helpers.isAndroid && !full) &&
                                        <TouchableOpacity
                                            style={{ position: 'absolute', top: 10, right: 10 }}
                                            onPress={() => {
                                                Orientation.lockToLandscape();
                                                setFull(true);
                                                // mediaPlayer.current.presentFullscreenPlayer();
                                            }}>
                                            <Icon type='MaterialIcons' name='zoom-out-map' style={{ fontSize: 26, color: COLOR.white(1) }} />
                                        </TouchableOpacity>
                                    }
                                </View>
                        }
                    </Loading>
                </View>
                {!(full && helpers.isAndroid) &&
                    <View style={{ flex: 1 }}>
                        <Toolbar showLater={visible} setShowLater={setVisible} videoData={videoData} />
                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            <Loading isLoading={isLoading} err={err}>
                                <Tabs tabContainerStyle={{ elevation: 0, borderTopWidth: 0.5, borderTopColor: 'white', }} tabBarUnderlineStyle={{ height: 2, backgroundColor: Colors.pri, }} tabBarActiveTextColor={Colors.pri} tabBarBackgroundColor={Colors.white} >
                                    <Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading=" Nội dung liên quan">
                                        <ScrollView style={{ paddingHorizontal: 10 }}>
                                            {
                                                !videoData || (isEmpty(videoData.lecture_lesson) && isEmpty(videoData.video_relation)) ? null : (
                                                    [
                                                        ...videoData.lecture_lesson ? videoData.lecture_lesson : [],
                                                        ...videoData.video_relation ? videoData.video_relation : []
                                                    ]
                                                        .filter(i => get(i, 'videos.id') !== lectureId).length > 0 &&
                                                    <View style={{ marginTop: 20, paddingTop: 10, }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingBottom: 10, alignItems: 'flex-end' }}>
                                                            <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }) }}>Video liên quan</Text>
                                                        </View>
                                                        {
                                                            [
                                                                ...videoData.lecture_lesson ? videoData.lecture_lesson : [],
                                                                ...videoData.video_relation ? videoData.video_relation : []
                                                            ]
                                                                .filter(i => get(i, 'videos.id') !== lectureId)
                                                                .map((item, index) => {
                                                                    return <RenderVideosRelated
                                                                        handleNavigate={props.navigation.navigate}
                                                                        item={item}
                                                                        index={index}
                                                                        setVisible={setVisible}
                                                                    />
                                                                })
                                                        }

                                                    </View>
                                                )
                                            }

                                            {
                                                videoData && !isEmpty(videoData.exams_lesson) ? (
                                                    <View style={{
                                                        marginTop: 20, paddingTop: 10
                                                    }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingBottom: 10, alignItems: 'flex-end' }}>
                                                            <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }) }}>Các bài thi liên quan</Text>
                                                        </View>
                                                        {videoData.exams_lesson.map((item, index) => {
                                                            return <RenderExamRelated
                                                                handleNavigate={props.navigation.navigate}
                                                                item={item}
                                                                index={index}
                                                                book={videoData.lesson}
                                                                lessonId={get(videoData, 'lesson.id', '')}
                                                                stopPlayer={() => {
                                                                    setPaused(true);
                                                                    setPlay(false);
                                                                }}
                                                            />
                                                        })}
                                                    </View>
                                                ) : null
                                            }

                                            {
                                                videoData && !isEmpty(videoData.articles_lesson) ? (
                                                    <View style={{
                                                        marginTop: 25, paddingTop: 10
                                                    }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingBottom: 10, alignItems: 'flex-end' }}>
                                                            <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }) }}>Các tài liệu liên quan</Text>
                                                        </View>
                                                        {videoData.articles_lesson.slice(0, 5).map((item, index) => {
                                                            return <RenderArticlRelated
                                                                handleNavigate={props.navigation.navigate}
                                                                item={item}
                                                                index={index}
                                                                stopPlayer={() => {
                                                                    setPaused(true);
                                                                    setPlay(false);
                                                                }}
                                                            />
                                                        })}
                                                    </View>
                                                ) : null
                                            }
                                        </ScrollView>
                                    </Tab>
                                    <Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading="Đoạn trích">
                                        {!isEmpty(get(videoData, 'data.timestamps', [])) ?
                                            <ScrollView>
                                                <View style={{ height: 80 * get(videoData, 'data.timestamps', []).length, paddingLeft: 15, marginTop: 10 }}>
                                                    <StepIndicator
                                                        customStyles={stepIndicatorStyles}
                                                        stepCount={get(videoData, 'data.timestamps', []).length}
                                                        direction="vertical"
                                                        currentPosition={currentPlay}
                                                        labels={get(videoData, 'data.timestamps', [])}
                                                        onPress={num => _onSeekTo({ item: get(videoData, 'data.timestamps', [])[num], index: num })}
                                                        renderStepIndicator={({ position }) => {
                                                            return (currentPlay != position) ? null :
                                                                (
                                                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                                                        {isPlay ? <LottieView autoPlay loop style={{ width: 15, height: 15 }}
                                                                            source={require('../../public/playing.json')}
                                                                        /> :
                                                                            <Icon
                                                                                name='ios-play'
                                                                                style={{ fontSize: 15, marginLeft: 3, alignItems: 'center' }}
                                                                            />}
                                                                    </View>
                                                                )
                                                        }}
                                                        renderLabel={({ stepStatus, label }) => {
                                                            return (
                                                                <View style={{ width: width - 70, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: stepStatus !== 'current' ? '#dedede' : COLOR.MAIN, padding: 10, borderRadius: 10 }}>
                                                                    <Text
                                                                        numberOfLines={2}
                                                                        style={{ fontSize: 16, flex: 1 }}
                                                                    >{label.text}
                                                                    </Text>
                                                                    <Text style={{ fontSize: 13, marginLeft: 8, color: '#4C4F57', ...fontMaker({ weight: fontStyles.Regular }) }}>{helpers.convertTime(label.time)}</Text>
                                                                </View>
                                                            )
                                                        }}
                                                    />
                                                </View>
                                            </ScrollView>
                                            : null}
                                    </Tab>
                                </Tabs>

                            </Loading>
                        </View>
                    </View>
                }
                <Snackbar
                    visible={visible}
                    duration={5000}
                    wrapperStyle={{ padding: 0 }}
                    style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, borderRadius: 0, paddingBottom: helpers.bottomSpace }}
                    onDismiss={() => setVisible(false)}
                    action={{
                        label: 'Xem ngay',
                        onPress: () => {
                            navigation.navigate('Bookmark');
                        },
                    }}>
                    Đã thêm vào "Bookmarks"
                </Snackbar>
            </SafeAreaView>
            <FeedbackModal
                show={showFeedback}
                onClose={() => setShowFeedback(false)}
                data={{
                    id: lectureId,
                    type: 'video'
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tag: {
        paddingHorizontal: 12,
        borderWidth: 1,
        minWidth: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLOR.MAIN,
        paddingVertical: 7,
        borderRadius: 12,
        marginRight: 10,
        marginBottom: 7
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    container: { flex: 1 },
    list: {
        flex: 1,
        paddingHorizontal: 10,
        paddingBottom: 0,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    baseItem: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingVertical: 5,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
    },
    lesson: {
        paddingLeft: 10,
    },
    tabContainerStyle: {
        backgroundColor: Colors.white
    },
    activeTabStyle: {
        backgroundColor: Colors.white,
    },
    tabStyle: {
        backgroundColor: Colors.white,
    },
    textStyle: {
        fontSize: 14,
        color: '#000'
    },
    activeTextStyle: {
        fontSize: 14,
        paddingVertical: 3,
        color: Colors.pri
    },
    section: { fontSize: 18, marginVertical: 7, marginTop: 10 },
});

export default withNavigationFocus(CoursePlayer);

function changeKeepAwake(shouldBeAwake) {
    if (shouldBeAwake) {
        KeepAwake.activate();
    } else {
        KeepAwake.deactivate();
    }
}

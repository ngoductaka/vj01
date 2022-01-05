import React, { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    Text, BackHandler,
    SafeAreaView,
    PixelRatio, Image,
    TouchableOpacity, StatusBar
} from 'react-native';
import Video from 'react-native-video';
import { get, throttle, isEmpty } from 'lodash';
import { Icon, Tab, Tabs } from 'native-base';
import { withNavigationFocus } from 'react-navigation';
import KeepAwake from 'react-native-keep-awake';
import Orientation from 'react-native-orientation-locker';
import { Snackbar, TextInput } from 'react-native-paper';
import Toast from 'react-native-simple-toast';

import { Loading, useRequest } from '../../handle/api';

// import BackVideoHeader from './component/BackVideoHeader';
import { helpers } from '../../utils/helpers';
import { fontMaker, fontStyles } from '../../utils/fonts';
// import { Toolbar } from './component/Toolbar';
// import { FeedbackModal } from './component/FeedbackModal';
import { COLOR } from '../../handle/Constant';

// import { RenderArticlRelated } from '../Lesson/component/ArticleList';
// import { RenderVideosRelated } from '../Lesson/component/VideosList'
// import { RenderExamRelated } from '../Lesson/component/ExamList';
import { useDispatch } from 'react-redux';
import { setLearningTimes } from '../../redux/action/user_info';
import { convertImgLink } from './utis';
import TableContentExpand from './component/TableContent';
import { ModalWrapp } from './component/ModalVote';
import { BtnGradient } from '../../component/shared/Btn';
import { updateDoneVideo, updateLastVideo } from './services';

const { width, height } = Dimensions.get('window');

const Colors = {
    white: '#ffffff',
    black: '#000000',
    pri: '#FB9A4B',
}

const CoursePlayer = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();

    const [videoLesson, setDataLesson] = useState({});
    const [listCourse, setListCourse] = useState([]);
    const [pathPlay, setPathPlay] = useState([]);
    const [videoSrc, setVideoSrc] = useState('');

    const [errVideo, setErrVideo] = useState(false);
    const [full, setFull] = useState(false);
    const [visible, setVisible] = useState(false);

    const [showConsult, setShowConsult] = useState(false);
    const [paused, setPause] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            const videoData = navigation.getParam('videoData', null);

            if (videoData) {
                setDataLesson(videoData)
                setListCourse(navigation.getParam('listCourse', {}));
                setPathPlay(navigation.getParam('pathPlay', {}));

                setVideoSrc(get(videoData, 'raw_url', ''))
                setErrVideo(false);
                if (videoData.courseId && videoData.curriculumnId) {
                    updateLastVideo({
                        'course_id': videoData.courseId,
                        'curriculum_id': videoData.curriculumnId,
                    })
                        .catch(err => {
                            console.log("<err last video>", err)
                        })
                }

            }
        }, 100)
    }, [navigation]);

    useEffect(() => {
        changeKeepAwake(true);
        return () => {
            changeKeepAwake(false)
        }
    }, [videoLesson]);

    useEffect(() => {
        BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButtonPressAndroid
        );

        return () => {
            setPause(true)
            dispatch(setLearningTimes());
            Orientation.lockToPortrait();
            BackHandler.removeEventListener(
                'hardwareBackPress',
                handleBackButtonPressAndroid
            );
        }
    }, []);

    useEffect(() => {
        if (!props.isFocused) {
            setPause(true);
        }
    }, [props.isFocused])

    const handleBackButtonPressAndroid = () => {
        if (full) {
            handleBackFullScreen();
            return true;
        } else {
            props.navigation.goBack();
            return true;
        }
    }

    const handleBackFullScreen = () => {
        setFull(false);
        Orientation.lockToPortrait();
    }

    const _navigateToCourse = (params) => {
        // console.log('params', params)
        setVideoSrc(null)
        navigation.setParams(params)
    }
    // console.log('0----------', videoSrc)

    const _loadVideoFail = useCallback(() => {
        Toast.showWithGravity("Video không khả dụng, vui lòng thử lại sau", Toast.SHORT, Toast.CENTER);
        setErrVideo(true)
    }, [])

    const _onEnd = useCallback(() => {
        if (navigation.getParam('showConsoult', true) &&
            get(videoLesson, 'raw_url', '') &&
            get(videoLesson, 'preview', '') !== "active") {
            setShowConsult(true)
        }
        if (videoLesson && videoLesson.courseId && videoLesson.curriculumnId) {
            updateDoneVideo({
                'courseId': videoLesson.courseId,
                'curriculumId': videoLesson.curriculumnId,
            })
                .catch(err => {
                    console.log("<err done video>", err)
                })
        }
    }, [videoLesson])


    return (
        <View style={{ flex: 1 }}>
            <StatusBar
                hidden={helpers.isAndroid && full}
                barStyle='dark-content'
            />
            {/* {!(full && helpers.isAndroid) && <BackVideoHeader
                rightAction={() => setShowFeedback(true)}
                title={get(videoLesson, 'name', '')}
            />} */}
            <SafeAreaView style={styles.container}>
                <View style={{ position: 'relative', width: '100%', height: (helpers.isAndroid && full) ? '100%' : width * 9 / 16 }}>
                    <Loading isLoading={false} err={errVideo} >
                        <View style={{ flex: 1 }}>
                            {videoSrc ?
                                <Video
                                    source={{ uri: videoSrc }}
                                    // ref={mediaPlayer}
                                    onError={_loadVideoFail}
                                    onEnd={_onEnd}
                                    paused={paused}
                                    // onReadyForDisplay={_onReadyForDisplay}
                                    // onProgress={throttled.current}
                                    preventsDisplaySleepDuringVideoPlayback={true}
                                    progressUpdateInterval={1}
                                    controls={true}
                                    poster={convertImgLink(get(videoLesson, 'thumbnail', 'https://baconmockup.com/300/200/'))}
                                    posterResizeMode='cover'
                                    resizeMode='contain'
                                    fullscreen={helpers.isIOS}
                                    style={{ flex: 1 }}
                                    fullscreenOrientation='landscape'
                                // onPlaybackRateChange={({ playbackRate }) => setPlay(playbackRate)}
                                /> : null}
                            {(helpers.isAndroid && full) &&
                                <TouchableOpacity onPress={handleBackFullScreen} style={{
                                    padding: 10, position: 'absolute', top: 10, left: 10,
                                    backgroundColor: 'rgba(245,245,245,0.7)', height: 40, width: 40, borderRadius: 40,
                                    justifyContent: 'center', alignItems: 'center'
                                }} >
                                    <Icon type='AntDesign' name='shrink' style={{ fontSize: 20, color: COLOR.black(1) }} />
                                </TouchableOpacity>
                            }
                            {(helpers.isAndroid && !full) &&
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute', top: 10, right: 10,
                                    }}
                                    onPress={() => {
                                        Orientation.lockToLandscape();
                                        setFull(true);
                                        // mediaPlayer.current.presentFullscreenPlayer();
                                    }}>
                                    <Icon type='MaterialIcons' name='zoom-out-map' style={{ fontSize: 26, color: COLOR.white(1) }} />
                                </TouchableOpacity>
                            }
                        </View>
                    </Loading>
                    {!(full && helpers.isAndroid) &&
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{
                            position: 'absolute',
                            left: width / 2 - 10,
                        }}>
                            <Icon type="AntDesign" name='down' style={{ fontSize: 25, color: 'white' }} />
                        </TouchableOpacity>}
                </View>

                {!(full && helpers.isAndroid) &&
                    <View style={{ flex: 1 }}>
                        {/* <Toolbar showLater={visible} setShowLater={setVisible} videoData={videoData} /> */}
                        <View style={{ flex: 1 }}>
                            <View style={{ backgroundColor: '#fff' }}>
                                <Text style={{
                                    fontSize: 20, padding: 10,
                                    ...fontMaker({ weight: fontStyles.Regular })
                                }}>Bài giảng</Text>
                            </View>

                            <TableContentExpand
                                title={videoLesson.name}
                                _navigateToCourse={_navigateToCourse}
                                navigation={navigation}
                                listCourse={listCourse}
                                showConsoult={navigation.getParam('showConsoult', true)}
                                playPath={pathPlay}
                                setShowConsultModal={setShowConsult}
                            />

                            {/* <Tabs tabContainerStyle={{ elevation: 0, borderTopWidth: 0.5, borderTopColor: 'white', }}
                                tabBarUnderlineStyle={{ height: 2, backgroundColor: Colors.pri, }}
                                tabBarActiveTextColor={Colors.pri} tabBarBackgroundColor={Colors.white} >
                                <Tab textStyle={styles.textStyle}
                                    activeTextStyle={styles.activeTextStyle}
                                    activeTabStyle={styles.activeTabStyle}
                                    tabStyle={styles.tabStyle}
                                    heading="Bài giảng">

                                    <TableContentExpand
                                        _navigateToCourse={_navigateToCourse}
                                        navigation={navigation}
                                        listCourse={listCourse}
                                        showConsoult={navigation.getParam('showConsoult', true)}
                                        playPath={pathPlay}
                                    />
                                </Tab>
                                <Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading="Thảo luận">
                                </Tab>
                            </Tabs> */}

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
            <ModalWrapp
                show={showConsult}
                onClose={() => { setShowConsult(false) }}
                title={null}
            >
                <View>
                    <Image
                        style={{ height: 120, marginTop: -10 }}
                        resizeMode="contain"
                        source={{ uri: 'https://images.squarespace-cdn.com/content/v1/5dd67d2aaec74929770fe3cd/1575459940872-BGBP9I1OU6WAS0BNBHUT/ke17ZwdGBToddI8pDm48kEkuqA5CPVEXx22XwNGYfRpZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PI7RjJ1Sk4e_t43oExbaejIJIKzwsQ27kPBxX_EDqtFg0KMshLAGzx4R3EDFOm1kBS/VideoIcon.jpg' }}
                    />
                    <Text style={{ fontSize: 22, textAlign: 'center', marginTop: 30 }}>Bạn cần đăng ký khóa học để xem đầy đủ các bài học</Text>
                    <BtnGradient
                        text="Nhận tư vấn khoá học"
                        style={{ marginTop: 30 }}
                        textStyle={{ fontSize: 25, fontWeight: 'bold' }}
                        onPress={() => {
                            // setPause(true)
                            setShowConsult(false);
                            navigation.navigate('ConsultingForm')
                        }}
                    />
                </View>
            </ModalWrapp>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
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
        // paddingVertical: 3,
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

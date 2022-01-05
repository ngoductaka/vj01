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
import { helpers } from '../../utils/helpers';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { COLOR } from '../../handle/Constant';
// 
import BackVideoHeader from './com/header';


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

    const lectureId = navigation.getParam('lectureId', '');
    const [full, setFull] = useState(false);

    const mediaPlayer = useRef();

    const [isPlay, setPlay] = useState(true);

    useEffect(() => {
        changeKeepAwake(true);
        return () => {
            changeKeepAwake(false)
        }
    }, []);


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


    const handleBackFullScreen = () => {
        setFull(false);
        Orientation.lockToPortrait();
    }

    return (
        <SafeAreaView style={styles.container}>
            <BackVideoHeader rightAction={() => { }} title={"Live stream"} />
            <YoutubePlayer
                ref={mediaPlayer}
                height={PixelRatio.roundToNearestPixel(width / (16 / 9))}
                width={width}
                videoId={'7DoHAMXLjZA'}
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
        </SafeAreaView>
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

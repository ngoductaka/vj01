import React, { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    Text, BackHandler,
    SafeAreaView,
    PixelRatio, TouchableOpacity, StatusBar
} from 'react-native';
import { Icon, Card } from 'native-base';
import { withNavigationFocus } from 'react-navigation';
// import YoutubePlayer from "react-native-yt-player";
import YoutubePlayer from 'react-native-youtube-iframe';
import KeepAwake from 'react-native-keep-awake';
import Orientation from 'react-native-orientation-locker';
import { Thumbnail } from 'react-native-thumbnail-video';
import { helpers } from '../../utils/helpers';

import { COLOR } from '../../handle/Constant';
// 
import BackVideoHeader from './com/header';


const { width, height } = Dimensions.get('window');

const Colors = {
    white: '#ffffff',
    black: '#000000',
    pri: '#FB9A4B',
}

const CoursePlayer = (props) => {
    const { navigation } = props;

    const url = navigation.getParam('url', '');

    const idYTB = React.useMemo(() => youtube_parser(url), [url])
    console.log('idYTB', idYTB)
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
                videoId={idYTB || '7DoHAMXLjZA'}
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
            <View style={{padding: 10}}>
                <Text style={{fontSize: 22, fontWeight: '500'}}>Bài giảng liên quan</Text>
            </View>
            <FlatList
                data={fake}
                renderItem={({ item, index }) => {
                    return (
                        <ItemYtb onPress={() => { }} data={item} />
                    )
                }}
            />

        </SafeAreaView>
    )
};

const fake = [
    {
        name: 'Saccarozơ - Bài 51',
        url: 'https://www.youtube.com/watch?v=jI4lG1tGWn4'
    },
    {
        name: 'Truyện Kiều - Ngữ văn',
        url: 'https://www.youtube.com/watch?v=6d9VH3tC1vs'
    },
]


export const ItemYtb = ({ onPress, data }) => {
    return (
        <View style={{
            paddingHorizontal: 10,
            paddingVertical: 10
        }}>
            <Thumbnail
                iconStyle={{
                    height: 25,
                    width: 25,
                }}
                imageWidth={helpers.width-20}
                imageHeight={helpers.width*9/16}
                // url={'https://www.youtube.com/watch?v=yI498f491b4'}
                url={data.url}
            />
            <View style={{
                padding: 6,
                width: 3 * helpers.width / 4,
            }}>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={{ fontSize: 20, fontWeight: '500' }}>{data.name}</Text>
                    </View>
                    {/* <Text style={{ textAlign: 'right', marginLeft: 7, fontWeight: '600' }}>Từ 120k/tháng</Text> */}
                </View>
                <Text style={{ marginVertical: 5 }}>Giải đề chi tiết bộ đề luyện thi 2022</Text>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text style={{ color: '#666' }}><Icon name="star" style={{ color: COLOR.MAIN, fontSize: 20 }} /> 4.7</Text>
                    <Text style={{ marginLeft: 25, color: '#666' }}>CourseId  #4567</Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    flex: 1,
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                }}
                onPress={onPress}>
            </TouchableOpacity>
        </View>
    )
}

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

function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}
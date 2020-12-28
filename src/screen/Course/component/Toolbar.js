import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Alert,
    Image
} from 'react-native';
import { Icon } from 'native-base';
import { get } from 'lodash';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';

import { blackColor, fontSize, COLOR } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { helpers } from '../../../utils/helpers';

import api from '../../../handle/api';
import { saveVideo } from '../../Lesson/component/handleSave';
import { makeOptionShare } from '../../../constant';
import { user_services } from '../../../redux/services';

const default_channel_avatar = 'https://is3-ssl.mzstatic.com/image/thumb/Purple118/v4/66/a8/7f/66a87f76-19ef-20a7-5f7c-308aa16e4ed4/AppIcon-1x_U007emarketing-85-220-0-6.png/400x400.png';
const prefix_channel = 'https://www.youtube.com/channel/';

const Toolbar = ({ showLater, setShowLater, style = {}, videoData }) => {
    const [like, setLike] = useState(get(videoData, 'data.like', 0));
    const [dislike, setDislike] = useState(get(videoData, 'data.dislike', 0));
    const [avatar, setAvatar] = useState(default_channel_avatar);
    const channel = get(videoData, 'data.source.channel', null);
    const channel_id = get(videoData, 'data.source.url', null);

    useEffect(() => {
        setLike(get(videoData, 'data.like', 0));
        setDislike(get(videoData, 'data.dislike', 0));
    }, [videoData]);

    useEffect(() => {
        async function getChannelAvatar() {
            if (channel) {
                const result = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&fields=items%2Fsnippet%2Fthumbnails%2Fdefault&id=${channel_id}&key=AIzaSyB59yyanajG7YYBHdpdaIcdmwms7Wwk2Vc`);
                const parseJson = await result.json();
                const temp = get(parseJson, 'items[0].snippet.thumbnails.default.url', null);
                setAvatar(temp);
            }
        }
        getChannelAvatar();
    }, [channel_id]);

    const _hanlePressLike = useCallback((type) => {
        const idVideo = get(videoData, 'data.id', '');
        if (type === 'like') {
            if (get(videoData, 'data.like', 0) == like) {
                setLike(like + 1);
                if (get(videoData, 'data.dislike', 0) != dislike) {
                    setDislike(get(videoData, 'data.dislike', 0));
                    dislikeDown(idVideo)
                }
                likeUp(idVideo);
                // api.post(`videos/${get(videoData, 'data.id', '')}/like-up`)
                //     .catch(err => console.log('<err like>', err))
            } else {
                setLike(get(videoData, 'data.like', 0));
                likeDown(idVideo);
                // api.post(`videos/${get(videoData, 'data.id', '')}/like-down`)
                //     .catch(err => console.log('<err like down>', err))
            }
        } else {
            if (get(videoData, 'data.dislike', 0) == dislike) {
                setDislike(dislike + 1);
                dislikeUp(idVideo);

                if (get(videoData, 'data.like', 0) != like) {
                    setLike(get(videoData, 'data.like', 0));
                    likeDown(idVideo)
                }
                // api.post(`videos/${get(videoData, 'data.id', '')}/dislike-up`)
                //     .catch(err => console.log('<err dislike>', err))
            } else {
                setDislike(get(videoData, 'data.dislike', 0));
                dislikeDown(idVideo)
                // api.post(`videos/${get(videoData, 'data.id', '')}/dislike-down`)
                //     .catch(err => console.log('<err dislike down>', err))
            }

        }
    }, [videoData, like, dislike]);

    const handleBookmark = async (lesson_id) => {
        const result = await user_services.bookmarkLesson({
            'bookmark_id': lesson_id,
            'bookmark_type': 'video',
        });
        if (typeof (result.status) === 'undefined') {
            setShowLater(true);
        } else {
            setTimeout(() => {
                Alert.alert(
                    "Oops!",
                    `Đã có lỗi xảy ra khi bookmark bài học`,
                    [
                        { text: "OK" }
                    ],
                    { cancelable: false }
                );
            }, 351);
        }
    }

    const _hanleWatchLater = () => {

        const item = {
            imgLecture: get(videoData, 'data.preview_img', ''),
            lectureId: get(videoData, 'data.id', ''),
            videoUrl: get(videoData, 'data.url', 'https://www.youtube.com/watch?v=L3NKVP92WPM'),
            duration: get(videoData, 'data.length', 0),
            title: get(videoData, 'data.title', ''),
            viewCount: get(videoData, 'data.view_count', ''),
        };

        item.articleId = item.lectureId;
        item.isLecture = !!get(videoData, 'data.preview_img', '');
        saveVideo(item);

        if (item.lectureId !== '') {
            handleBookmark(item.lectureId);
        }

    }

    const goToChannel = () => {
        if (channel_id) {
            helpers.openUrl(`${prefix_channel}${channel_id}?sub_confirmation=1`)
        } else {
            helpers.openUrl('https://www.youtube.com/channel/UCTmKz2bAMiz1Lb54z2gHjXg?sub_confirmation=1');
        }
    }

    return (
        <View style={{ width: '100%', ...style }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30, backgroundColor: 'white', borderBottomColor: "#DDD", borderBottomWidth: .6, }}>
                <View style={styles.btn}>
                    <View style={{ width: 26, height: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                        <Icon name='eye' style={{ fontSize: 26, color: '#767577' }} />
                    </View>
                    <Text style={styles.txt}>{helpers.convertNum(get(videoData, 'data.view_count', 0))}</Text>
                </View>
                <TouchableOpacity onPress={() => _hanlePressLike('like')} style={styles.btn}>
                    <View style={{ width: 26, height: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                        <Icon type="AntDesign" name="like2" style={{ fontSize: 26, color: get(videoData, 'data.like', 0) === like ? "#767577" : COLOR.MAIN }} />
                    </View>
                    <Text style={styles.txt}>{helpers.convertNum(like)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => _hanlePressLike('dislike')} style={styles.btn}>
                    <View style={{ width: 26, height: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                        <Icon type="AntDesign" name='dislike2' style={{ fontSize: 26, color: get(videoData, 'data.dislike', 0) === dislike ? '#767577' : COLOR.MAIN }} />
                    </View>
                    <Text style={styles.txt}>{helpers.convertNum(dislike)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Share.open(makeOptionShare())} style={styles.btn}>
                    <View style={{ width: 26, height: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                        <Icon name='share' style={{ fontSize: 26, color: '#767577' }} />
                    </View>
                    <Text style={styles.txt}>Chia sẻ</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={_hanleWatchLater} style={styles.btn}>
                    <View style={{ width: 26, height: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                        <Icon name='ios-bookmark' style={{ fontSize: 26, color: !showLater ? '#767577' : COLOR.MAIN }} />
                    </View>
                    <Text style={[styles.txt, { color: !showLater ? '#1D1918' : COLOR.MAIN, }]}>Bookmark</Text>
                </TouchableOpacity>
            </View>
            {channel &&
                <View style={[styles.channelInfo]}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={goToChannel} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: avatar ? avatar : default_channel_avatar }}
                                style={styles.channelIcon}
                                resizeMode="contain"
                            />
                            <View style={styles.channelText}>
                                <Text numberOfLines={1} style={styles.channelTitle}>{channel}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={goToChannel} style={{ padding: 10, paddingRight: 0 }}>
                        <Text style={styles.txtSub}>ĐĂNG KÝ</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

const styles = {
    btn: { justifyContent: 'space-around', alignItems: 'center', paddingVertical: 5, },
    txt: { marginLeft: 2, fontSize: 14, ...fontMaker({ weight: fontStyles.Regular }), marginTop: -2 },
    channelInfo: {
        flexDirection: "row",
        alignItems: 'center',
        // justifyContent: 'space-between',
        borderBottomWidth: 0.6,
        borderBottomColor: "#DDD",
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    channelIcon: {
        width: 35,
        height: 35,
        alignSelf: 'center',
        borderRadius: 20,
        overflow: 'hidden'
    },
    channelText: {
        marginLeft: 13,
        flex: 1,
    },
    channelTitle: {
        fontSize: 18,
        ...fontMaker({ weight: fontStyles.Regular })
    },
    txtSub: {
        ...fontMaker({ weight: fontStyles.SemiBold }),
        color: '#FC0D1B',
        fontSize: 15
    }
}

export {
    Toolbar
}

const likeUp = (id) => {
    api.post(`videos/${id}/like-up`)
        .catch(err => {
            // console.log('<err dislike>', err)
        })
}
const likeDown = (id) => {
    api.post(`videos/${id}/like-down`)
        .catch(err => {
            // console.log('<err dislike>', err)
        })
}
const dislikeUp = (id) => {
    api.post(`videos/${id}/dislike-up`)
        .catch(err => {
            // console.log('<err dislike>', err)
        })
}
const dislikeDown = (id) => {
    api.post(`videos/${id}/dislike-down`)
        .catch(err => {
            // console.log('<err dislike>', err)
        })
}

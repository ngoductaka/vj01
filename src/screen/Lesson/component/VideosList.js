import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Dimensions,
    ImageBackground
} from 'react-native';
import { Icon } from 'native-base';
import { get } from 'lodash';
import { Thumbnail } from 'react-native-thumbnail-video';
import Share from 'react-native-share';

import { helpers } from '../../../utils/helpers';
import { COLOR, fontSize, blackColor } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { FeedbackModal } from './ModalReport';
import { saveVideo } from './handleSave';
const { width, height } = Dimensions.get('window');
import { makeOptionShare } from '../../../constant';



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


const VideoItem = ({ data, handleNavigate, setVisible, SeeMore }) => {
    // console.log('video---item--------', data);
    return (
        <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, marginBottom: 20, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }) }}>Video</Text>
                <Text style={{ fontSize: 16, ...fontMaker({ weight: fontStyles.Regular }), color: '#777' }}>{data.length} videos</Text>
            </View>
            {data.map((item, index) => {
                return (
                    <RenderVideoItem setVisible={setVisible} handleNavigate={handleNavigate} item={item} index={index} data={data} />
                )
            })}
            {/* {
                data.length > 3 && <SeeMore
                    onPress={() => handleNavigate('ListDetailLesson', { title: "Video", data })}
                    count={data.length - 3}
                />
            } */}
        </View>
    );
}

const stylesVideo = StyleSheet.create({
    wapperText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3
    },
    icon: {
        fontSize: 13,
        color: '#777',
        marginRight: 5,
    },
    mainText: {
        fontSize: fontSize.h4,
    },
    subText: {
        fontSize: fontSize.h5,
        color: '#777'
    },
    shadow: {
        marginRight: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 10,
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 13 },
    }
});

const ImgVideo = ({ imgLecture, lectureId, isLecture, videoUrl, _handlePress }) => {
    return isLecture ? (
        <View
            style={{
                width: width * 3 / 8,
                height: (width * 3 / 8) / 16 * 9,
            }}>
            <ImageBackground
                style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                source={{ uri: imgLecture ? imgLecture : plaidImg(3) }}
            >
                <View style={{ alignItems: 'center', }} >
                    {lectureId ?
                        <Icon type="AntDesign" name={'playcircleo'} style={{ fontSize: 50, color: '#fff' }} /> :
                        null
                    }
                </View>
            </ImageBackground>
        </View>
    ) : (
            <View style={{ flex: 1 }}>
                <Thumbnail
                    onPress={_handlePress}
                    iconStyle={{
                        padding: 10,
                        height: 30,
                        width: 25,
                    }}
                    imageWidth={width * 3 / 8}
                    imageHeight={(width * 3 / 8) / 16 * 9}
                    url={videoUrl}
                />
            </View>
        )
};

const stylesVideoItem = StyleSheet.create({
    wapper: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    imgWapper: { borderRadius: 10, overflow: 'hidden', },
    time: {
        position: 'absolute', bottom: 3, right: 3,
        padding: 7,
        justifyContent: 'flex-end',
        backgroundColor: blackColor(0.5),
        borderRadius: 4,
    },
    timeText: { color: "#fff", fontWeight: 'bold', fontSize: fontSize.h5 },
    textWapper: { flex: 1, paddingVertical: 5, flexDirection: 'row', },
    textView: { flex: 1, paddingLeft: 10, paddingRight: 0 },
})

export const RenderVideo = (props) => {
    const {
        item = {},
        style = {},
        isLecture,
        setVisible,
        _handlePress = () => { },
        _hanldeDel
    } = props;

    const {
        imgLecture,  //get(item, 'partable.videos.preview_img', '')
        lectureId, //get(item, 'partable.videos.id', '')
        videoUrl, //get(item, 'partable.url', 'https://www.youtube.com/watch?v=L3NKVP92WPM')
        duration, //get(item, 'partable.length', 0))
        title, // get(item, 'partable.title', '')
        viewCount, //get(item, 'partable.view_count', '')
    } = item;
    const watchLater = () => {
        item.articleId = item.lectureId;
        item.isLecture = isLecture;
        // saveVideo(item);
        setVisible(true);

    }
    const _handleShare = () => {
        setTimeout(() => {
            Share.open(makeOptionShare())
        }, 500)
    }

    const [isOpen, setOpenModal] = useState(false);
    return (
        <TouchableOpacity
            onPress={_handlePress}
            style={[stylesVideoItem.wapper, style]}>
            <View style={stylesVideoItem.imgWapper}>
                <ImgVideo _handlePress={_handlePress} isLecture={isLecture} imgLecture={imgLecture} lectureId={lectureId} videoUrl={videoUrl} />
                <View style={stylesVideoItem.time}>
                    <Text style={stylesVideoItem.timeText}> {helpers.convertTime(duration)}</Text>
                </View>
            </View>
            <View style={stylesVideoItem.textWapper}>
                <View style={stylesVideoItem.textView}>
                    <Text style={stylesVideo.mainText} numberOfLines={2}>
                        {title}
                    </Text>
                    {/* <View style={stylesVideo.wapperText}>
                        <Icon style={stylesVideo.icon} name={"eye"} type='Feather' />
                        <Text style={stylesVideo.subText} numberOfLines={3}>
                            {isLecture ? 'Bài giảng' : 'Giải bài tập'}
                        </Text>
                    </View> */}
                    {viewCount ?
                        <View style={stylesVideo.wapperText}>
                            <Icon style={stylesVideo.icon} name={"eye"} type='Feather' />
                            <Text style={stylesVideo.subText} numberOfLines={1}>
                                {viewCount} lượt xem
                            </Text>
                        </View> : null}
                </View>

                <TouchableOpacity
                    style={{ paddingLeft: 10 }}
                    onPress={() => { _hanldeDel ? _hanldeDel() : setOpenModal(true) }}
                >
                    <Icon
                        type='Entypo'
                        name={_hanldeDel ? 'circle-with-cross' : "dots-three-vertical"}
                        style={[{ fontSize: 20, color: 'rgba(0,0,0,0.6)' }, _hanldeDel ? { paddingLeft: 15, color: COLOR.WRONG } : {}]}
                    />
                </TouchableOpacity>

            </View>
            {
                _hanldeDel ? null :
                    <FeedbackModal
                        show={isOpen}
                        onClose={setOpenModal}
                        watchLater={watchLater}
                        _handleShare={_handleShare}
                        data={{
                            id: lectureId,
                            type: 'video'
                        }}
                    />
            }

        </TouchableOpacity>
    )

}


export const LargeVideo = (props) => {
    const {
        item = {},
        style = {},
        isLecture,
        setVisible,
        _handlePress = () => { },
        _hanldeDel,
        widthImg = width * 3 / 4
    } = props;

    const {
        imgLecture,  //get(item, 'partable.videos.preview_img', '')
        lectureId, //get(item, 'partable.videos.id', '')
        videoUrl, //get(item, 'partable.url', 'https://www.youtube.com/watch?v=L3NKVP92WPM')
        duration, //get(item, 'partable.length', 0))
        title, // get(item, 'partable.title', '')
        viewCount, //get(item, 'partable.view_count', '')
    } = item;
    const watchLater = () => {
        item.articleId = item.lectureId;
        item.isLecture = isLecture;
        saveVideo(item);
        setVisible(true);

    }
    const _handleShare = () => {
        setTimeout(() => {
            Share.open(makeOptionShare())
        }, 500)
    }

    const [isOpen, setOpenModal] = useState(false);
    return (
        <TouchableOpacity
            onPress={_handlePress}
            style={[style,
                {
                    width: widthImg,
                    // height: (widthImg) / 16 * 9,
                }
            ]}
        >
            <View style={[stylesVideoItem.imgWapper]}>
                <ImgVideoLage
                    _handlePress={_handlePress}
                    isLecture={isLecture}
                    imgLecture={imgLecture}
                    lectureId={lectureId}
                    videoUrl={videoUrl}
                    widthImg={widthImg}
                />
                <View style={stylesVideoItem.time}>
                    <Text style={stylesVideoItem.timeText}> {helpers.convertTime(duration)}</Text>
                </View>
            </View>
            <View style={[stylesVideoItem.textWapper]}>
                <View style={{ flex: 1, paddingLeft: 3, marginVertical: 5 }}>
                    <Text style={[stylesVideo.mainText, { fontSize: 18, marginBottom: 2 }]} numberOfLines={2}>
                        {title}
                    </Text>
                    <View style={stylesVideo.wapperText}>
                        <Icon style={stylesVideo.icon} name={"eye"} type='Feather' />
                        <Text style={stylesVideo.subText} numberOfLines={3}>
                            {viewCount} lượt xem
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={{ paddingLeft: 15 }}
                    onPress={() => { _hanldeDel ? _hanldeDel() : setOpenModal(true) }}
                >
                    <Icon
                        type='Entypo'
                        name={_hanldeDel ? 'circle-with-cross' : "dots-three-vertical"}
                        style={[{ fontSize: 20, color: 'rgba(0,0,0,0.6)' }, _hanldeDel ? { paddingLeft: 15, color: COLOR.WRONG } : {}]}
                    />
                </TouchableOpacity>

            </View>
            {
                _hanldeDel ? null :
                    <FeedbackModal
                        show={isOpen}
                        onClose={setOpenModal}
                        watchLater={watchLater}
                        _handleShare={_handleShare}
                        data={{
                            id: lectureId,
                            type: 'video'
                        }}
                    />
            }

        </TouchableOpacity>
    )

}


const ImgVideoLage = ({ imgLecture, lectureId, isLecture, videoUrl, _handlePress, widthImg = width * 3 / 4 }) => {
    return isLecture ? (
        <View
            style={{
                width: widthImg,
                height: (widthImg) / 16 * 9,
            }}>
            <ImageBackground
                style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                source={{ uri: imgLecture ? imgLecture : plaidImg(3) }}
            >
                <View style={{ alignItems: 'center', }} >
                    {lectureId ?
                        <Icon type="AntDesign" name={'playcircleo'} style={{ fontSize: 50, color: '#fff' }} /> :
                        null
                    }
                </View>
            </ImageBackground>
        </View>
    ) : (
            <View style={{ flex: 1 }}>
                <Thumbnail
                    onPress={_handlePress}
                    iconStyle={{
                        padding: 10,
                        height: 30,
                        width: 25,
                    }}
                    imageWidth={widthImg}
                    imageHeight={(widthImg) / 16 * 9}
                    url={videoUrl}
                />
            </View>
        )
};

const RenderVideoItem = ({ handleNavigate, item, setVisible, index, data = [], style = {} }) => {
    const isLecture = get(item, 'type', '') === 'lecture';
    const lectureId = isLecture ? get(item, 'partable.videos.id', '') : get(item, 'partable_id', '');
    const view_count = get(item, 'partable.videos.view_count', '') || get(item, 'partable.view_count', '');
    const _handlePress = () => {
        handleNavigate('CoursePlayer', { lectureId, view_count, })
    }

    const props = {
        isLecture,
        _handlePress,
        setVisible,
        item: {
            imgLecture: get(item, 'partable.videos.preview_img', ''),
            lectureId,
            videoUrl: get(item, 'partable.url', 'https://www.youtube.com/watch?v=L3NKVP92WPM'),
            duration: get(item, 'partable.length', 0),
            title: get(item, 'partable.title', ''),
            viewCount: view_count,
        },
        style,
    }

    return <RenderVideo {...props} />
};

const RenderVideosRelated = ({ handleNavigate, setVisible, item, showLater, style = {} }) => {
    const isLecture = !!get(item, 'videos', '');
    const lectureId = isLecture ? get(item, 'videos.id', '') : get(item, 'id', '');
    const view_count = get(item, 'view_count', '') || get(item, 'videos.view_count', '');
    const _handlePress = () => {
        handleNavigate('CoursePlayer', { lectureId, view_count, });
    }

    const props = {
        isLecture,
        _handlePress,
        showLater,
        setVisible,
        item: {
            imgLecture: get(item, 'videos.preview_img', ''),
            lectureId,
            videoUrl: get(item, 'url', 'https://www.youtube.com/watch?v=L3NKVP92WPM'),
            duration: get(item, 'length', 0),
            title: get(item, 'title', ''),
            viewCount: view_count,
        },
        style,
    }

    return <RenderVideo {...props} />

}

export {
    VideoItem,
    RenderVideoItem,
    RenderVideosRelated,
}
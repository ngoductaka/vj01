
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Dimensions, Image,
    ImageBackground, Animated
} from 'react-native';
import { Icon } from 'native-base';
import { get } from 'lodash';
import { Thumbnail } from 'react-native-thumbnail-video';
import Share from 'react-native-share';
import StarRating from 'react-native-star-rating';

import { helpers, convertMoney } from '../../../utils/helpers';
import { COLOR, fontSize, blackColor } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';
// import { FeedbackModal } from './ModalReport';
// import { saveVideo } from './handleSave';
const { width, height } = Dimensions.get('window');
import { makeOptionShare } from '../../../constant';

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
        name, // get(item, 'partable.name', '')
        view, //get(item, 'partable.view_count', '')
        teacher = {},
        price = '',
        get_rating = []
    } = item;
    let rate = 4;
    if (get_rating[0]) {
        try {
            rate = +(get_rating.reduce((cal, cur) => cal + cur.rating_number, 0) / get_rating.length).toFixed(1)
        } catch (err) {
            console.log(err)
        }
    }
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
                {duration ? <View style={stylesVideoItem.time}>
                    <Text style={stylesVideoItem.timeText}> {helpers.convertTime(duration)}</Text>
                </View> : null}
            </View>
            <View style={[stylesVideoItem.textWapper]}>
                <View style={{ flex: 1, paddingLeft: 3, marginVertical: 5 }}>
                    <Text style={[stylesVideo.mainText, { fontSize: 18, marginBottom: 2 }]} numberOfLines={2}>
                        {name}
                    </Text>
                    <Teacher {...teacher} />
                    <View style={stylesVideo.wapperText}>
                        <StarRating
                            maxStars={5}
                            rating={rate}
                            fullStarColor={COLOR.MAIN}
                            starSize={fontSize.h2}
                            disabled
                        />
                        {/* <Icon style={stylesVideo.icon} name={"eye"} type='Feather' /> */}
                        <Text style={stylesVideo.subText} numberOfLines={3}>
                            {rate} ({get(get_rating, 'length')})
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text style={{
                            color: COLOR.MAIN,
                            fontWeight: 'bold',
                            fontSize: fontSize.h2,
                        }}>{convertMoney(price)} </Text>
                        {/* <Text style={{
                            color: '#999',
                            fontWeight: 'bold',
                            fontSize: fontSize.h3,
                            textDecorationLine: 'line-through',
                            marginLeft: 6
                        }}>{convertMoney(price)} </Text> */}
                    </View>
                </View>
                {/* handle click three dot */}
                {/* <TouchableOpacity
                    style={{ paddingLeft: 15 }}
                    onPress={() => { _hanldeDel ? _hanldeDel() : setOpenModal(true) }}
                >
                    <Icon
                        type='Entypo'
                        name={_hanldeDel ? 'circle-with-cross' : "dots-three-vertical"}
                        style={[{ fontSize: 20, color: 'rgba(0,0,0,0.6)' }, _hanldeDel ? { paddingLeft: 15, color: COLOR.WRONG } : {}]}
                    />
                </TouchableOpacity> */}

            </View>
            {/* {
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
            } */}

        </TouchableOpacity>
    )

}

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

const ImgVideoLage = ({ imgLecture, lectureId, isLecture, videoUrl, _handlePress, widthImg = width * 3 / 4 }) => {
    const [opacity] = useState(new Animated.Value(0))
    const [opacityPlade] = useState(new Animated.Value(1))

    const _handleLoadEnd = (e) => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 1000, useNativeDriver: true
        }).start();

        Animated.timing(opacityPlade, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }
    const _handleLoadErr = () => {
        // setTimeout(() => {
        //     Animated.timing(opacityPlade, {
        //         toValue: 1,
        //         duration: 1000,useNativeDriver: true 
        //     }).start();
        // }, 1200)

    }

    return (
        <View
            style={{
                width: widthImg,
                height: (widthImg) / 16 * 9,
            }}>
            <Animated.Image
                onError={_handleLoadErr}
                onLoadEnd={_handleLoadEnd}
                style={{
                    justifyContent: 'center', alignItems: 'center',
                    flex: 1, opacity
                }}
                source={{ uri: imgLecture ? imgLecture : plaidImg(3) }}
            />

            <Animated.Image
                style={{
                    justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', left: 0, right: 0, bottom: 0, top: 0,
                    flex: 1, backgroundColor: '#dedede', opacity: opacityPlade
                }}
                source={{ uri: defaultImg }}
            />
            {/* <View style={{ alignItems: 'center', }} >
                    {lectureId ?
                        <Icon type="AntDesign" name={'playcircleo'} style={{ fontSize: 50, color: '#fff' }} /> :
                        null
                    }
                </View>
            </Animated.Image> */}
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
        color: '#777',
        marginLeft: 5
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



const Teacher = ({ img = defaultImg, name = '' }) => {
    return (
        <View style={teacherStyles.container}>
            <View style={teacherStyles.imgView}>
                <Image style={teacherStyles.img} resizeMode="cover" source={{ uri: img }} />
            </View>
            <View>
                <Text style={teacherStyles.nameStyle} numberOfLines={2} >{name}</Text>
            </View>
        </View>
    )
}

const teacherStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    imgView: { height: 35, width: 35, borderRadius: 35 },
    img: {
        flex: 1,
        height: null,
        width: null,
        borderRadius: 35,
    },
    nameStyle: {
        fontSize: 13,
        color: '#333',
        paddingHorizontal: 10,
    }

})
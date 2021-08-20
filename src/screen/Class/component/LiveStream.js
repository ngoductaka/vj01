import React from 'react';
import { TouchableOpacity, View, Text, Dimensions, StyleSheet, ImageBackground, Image, Linking } from 'react-native';
import { Icon } from 'native-base';
import { get } from 'lodash';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import moment from 'moment';

import { helpers } from '../../../utils/helpers';
import { COLOR } from '../../../handle/Constant';
import LinearGradient from 'react-native-linear-gradient';
import { useRequest } from '../../../handle/api';


const dataFake = [
    {
        img: 'https://ak.picdn.net/shutterstock/videos/1032145772/thumb/4.jpg',
        colors: ['rgba(126, 189, 233, 0.8)', 'rgba(128, 163, 241, 0.9)']
    },
    {

        colors: ['rgba(231, 169, 103, 0.8)', 'rgba(238, 160, 99, 0.9)'],
        img: 'https://fiverr-res.cloudinary.com/videos/t_main1,q_auto,f_auto/fzracxoscbzkyrhewymu/make-you-video-look-like-facebook-live-interface.png'
    },
    {

        colors: ['rgba(222, 102, 143, 0.8)', 'rgba(227, 91, 116, 0.9)'],
        img: 'https://www.pngkey.com/png/full/92-928896_facebook-live-reactions-png-facebook.png'
    },
];

const { width, height } = Dimensions.get('window');


function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideHeight = height * 0.36;
const slideWidth = wp(82);
const itemHorizontalMargin = wp(2);

export const sliderWidth = width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const LiveStream = () => {
    const [data, loading] = useRequest('http://45.124.87.227:8181/courses/recent-livestreams', [1])

    // console.log('data123', data)
    if (!get(data, 'data[0]')) return null;
    return (
        <View style={{ paddingVertical: 10 }}>
            <Carousel
                // ref={refCar}
                data={get(data, 'data')}
                renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
                sliderWidth={sliderWidth}
                parallaxFactor={0.4}
                itemWidth={itemWidth}
                // layout="stack" 
                layoutCardOffset={`18`}
                loop={true}
                loopClonesPerSide={2}
                autoplay={true}
                autoplayDelay={500}
                autoplayInterval={3000}
            // onSnapToItem={index => setIndex(index)}
            />
        </View>
    )
}

const RenderItem = ({ item, index }) => {
    return (

        <ImageBackground source={{ uri: get(dataFake, `[${index % 3}].img`) }} style={[styles.itemLive, styles.shadowStyle]}>
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={get(dataFake, `[${index % 3}].colors`)}
                style={{ flex: 1 }}
            >
                <TouchableOpacity
                    onPress={async () => {
                        const supported = await Linking.canOpenURL(item.livestreams_lesson_url);
                        if (supported) {
                            await Linking.openURL(item.livestreams_lesson_url);
                        } else {

                        }
                    }}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 5,
                        position: 'relative'
                    }}>


                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ height: 40, width: 40, borderRadius: 40 }} source={{ uri: item.author_avatar }} />
                    </View>
                    <View style={{ flex: 4, paddingRight: 20 }}>
                        <Text numberOfLines={1} style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>{item.author_name}</Text>
                        <Text numberOfLines={2} style={{ fontSize: 18, marginTop: 8, fontWeight: 'bold', color: '#fff' }}>{item.livestreams_lesson_name}</Text>
                        <Text style={{ color: '#fff', textAlign: 'right', fontWeight: 'bold', fontSize: 15, }}>{formatLiveStreamTime(item.livestreams_lesson_published_at)}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Text style={{ fontWeight: 'bold', color: '#fff' }}>Lớp 12</Text> */}
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>{item.subject_name}</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>200</Text>
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>Like</Text>

                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>500</Text>
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>Đăng ký</Text>

                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10 }}>
                        <Icon name="dots-three-horizontal" type={'Entypo'} style={{ color: '#fff', fontSize: 19 }} />
                    </TouchableOpacity>
                    {/* <View style={{ flex: 1 }}>

                </View> */}

                </TouchableOpacity>
            </LinearGradient>
        </ImageBackground>
    )
}


const LiveItem = () => {
    return (
        <TouchableOpacity
            onPress={() => {
            }}
            style={[styles.shadowStyle, styles.container]}
        >
            <View style={{ padding: 10, flex: 1, marginTop: -9, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, backgroundColor: '#fff', }}>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={2}
                        style={{ fontSize: 15, lineHeight: 20, }}>{'item.title'}</Text>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: COLOR.MAIN, borderRadius: 6, alignSelf: 'baseline', marginBottom: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>FREE</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: '#474B4E', alignSelf: 'flex-start', textAlign: 'left' }}> phút</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
                        <Icon type='Entypo' name='pencil' style={{ fontSize: 12, color: '#2FA880', }} />
                        <Text numberOfLines={4} style={{ fontSize: 12, color: '#2FA880', textAlign: 'right', marginLeft: 2 }}> lượt thi</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: helpers.isTablet ? width * 2 / 5 : width * 4 / 5,
        height: 130,
        marginRight: 10,
        borderWidth: 1, borderColor: '#DFE5EA', borderRadius: 8,
    },
    itemLive: {
        height: 200, flex: 1, borderRadius: 5,
        marginVertical: 10,
        resizeMode: "cover",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: '#ddd',
        // overflow: 'hidden'
    },
    shadowStyle: { shadowColor: 'black', shadowOffset: { width: -2, height: 2 }, shadowOpacity: 0.6, elevation: 2 },
})


export default LiveStream;



const data = {
    "title": "test", "description": null, "banner": null,
    "questions": [
        {
            "id": "wbRBS", "title": "asdfasf", "images": [],
            "listAnswer": [
                { "id": "T6NGb", "content": "asdfasdf", "correct": false },
                { "id": "aGh65", "content": "asdasdf", "correct": true }
            ],
            "answer": "asdvasdvasdv"
        }
    ]
}
const formatLiveStreamTime = (time) => {
    try {
        return !moment(time).diff(moment(), 'days') ?
            moment(time).format("HH:mm:ss") + "Hôm nay" :
            moment(time).format("HH:mm:ss DD-MM")

    } catch (err) {
        console.log('err9999999999999999999999999999', err)
        return time
    }
}
import React from 'react';
import { TouchableOpacity, View, Text, Dimensions, StyleSheet, ImageBackground, Image, Linking } from 'react-native';
import { Icon } from 'native-base';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { helpers } from '../../../utils/helpers';
import { COLOR } from '../../../handle/Constant';
import LinearGradient from 'react-native-linear-gradient';




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
    return (
        <View style={{ paddingVertical: 10 }}>
            <Carousel
                // ref={refCar}
                data={[
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
                ]}
                renderItem={({ item }) => <RenderItem item={item} />}
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

const RenderItem = ({ item }) => {
    return (

        <ImageBackground source={{ uri: item.img }} style={[styles.itemLive, styles.shadowStyle]}>
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={item.colors}
                style={{
                    flex: 1,
                }}
            >
                <TouchableOpacity
                    onPress={async () => {
                        const supported = await Linking.canOpenURL('https://www.facebook.com/cohuyenhoa');
                        if (supported) {
                            await Linking.openURL('https://www.facebook.com/cohuyenhoa');
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
                        <Image style={{ height: 40, width: 40, borderRadius: 40 }} source={{ uri: "https://khoahoc.vietjack.com/upload/msmaianh@gmail.com/avarta/raw-file-65b58c36-9f87-40b2-86f2-92525f42d9bf-1621308170.jpg" }} />
                    </View>
                    <View style={{ flex: 4, paddingRight: 20 }}>
                        <Text numberOfLines={1} style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>Cô</Text>
                        <Text numberOfLines={2} style={{ fontSize: 18, marginTop: 8, fontWeight: 'bold', color: '#fff' }}>[LIVE 09] LIVE ĐẶC BIỆT : CÁCH SỬ DỤNG VÒNG TRÒN LƯỢNG GIÁC TRONG DAO ĐỘNG DỄ NHẤT</Text>
                        <Text style={{ color: '#fff', textAlign: 'right', fontWeight: 'bold', fontSize: 15, }}>20h Hôm nay</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>Lớp 12</Text>
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}>Tiếng anh</Text>
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
        // key={'hot_exam' + idx}
        >
            {/* <View style={{
                width: (helpers.isTablet ? width * 2 / 5 : width * 4 / 5) - 1,
                height: 15, backgroundColor: '#DFE5EA',
                borderTopLeftRadius: 8, borderTopRightRadius: 8
            }}>

            </View> */}
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

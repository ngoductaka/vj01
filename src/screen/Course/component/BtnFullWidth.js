
import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    FlatList,
    Dimensions,
    SafeAreaView, ScrollView, Text, StyleSheet, Linking, Platform, ImageBackground, TouchableOpacity, Image
} from 'react-native';
import { Icon } from 'native-base';
import { get } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import StarRating from 'react-native-star-rating';
import { convertMoney, helpers } from '../../../utils/helpers';
import { COLOR, fontSize } from '../../../handle/Constant';


const BtnFullWidth = ({ text, onPress, styles, color = ['#ff7e5f', '#feb47b'] }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                colors={color}
                style={[styleBtnFullWidth.container, styles]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={styleBtnFullWidth.text}>{text}</Text>
            </LinearGradient>
        </TouchableOpacity>
    )

}
const styleBtnFullWidth = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dedede',
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
        marginVertical: 10,
        // borderRadius: 10,
    },
    text: {
        textAlign: 'center',
        fontSize: fontSize.h1,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: "capitalize"
    }
})
// 


const TitleCourse = ({
    title = '',
    subTitle = '',
    prePrice = 0,
    price = 0,
    vote = 4.5,
    bought = 0,
    content = {},

}) => {
    let rate = 4;
    if (vote[0]) {
        try {
            console.log(vote.reduce((cal, cur) => cal + cur.rating_number, 0))
            rate = +(vote.reduce((cal, cur) => cal + cur.rating_number, 0) / vote.length).toFixed(1)
        } catch (err) {
            console.log(err)

        }
    }
    const [showMore, setShowMore] = useState(false);
    return (
        <View style={stylesTitle.titleCourse}>
            <View style={{ padding: 10 }}>
                <View>
                    <Text style={stylesTitle.title} numberOfLines={3}>{title} </Text>
                </View>
                <View style={stylesTitle.priceView}>
                    <Text style={stylesTitle.price}>{convertMoney(price)} </Text>
                    <View style={{ alignItems: 'center', flexDirection:'row', marginBottom: 10 }}>
                        <StarRating
                            // disabled={true}
                            maxStars={5}
                            rating={rate}
                            fullStarColor={COLOR.MAIN}
                            starSize={fontSize.h2}
                            disabled
                        />
                        <Text style={{
                            fontSize: 12,
                            color: '#777',
                            marginLeft: 5
                        }}>
                            {rate} ({get(vote, 'length')})
                        </Text>
                    </View>
                    {bought ? <Text>{bought} học viên</Text> : null}
                </View>
                {
                    [
                        {
                            icon: {
                                name: "chalkboard-teacher",
                                type: "FontAwesome5"
                            },
                            title: 'Giáo viên',
                            content: content.teacher
                        },
                        {

                            icon: {
                                name: "layers",
                                type: "Feather"
                            },
                            title: 'Trình độ',
                            content: content.grade,
                        },
                        {

                            icon: {
                                name: "graduation-cap",
                                type: "Entypo"
                            },
                            title: 'Cấp độ',
                            content: content.level
                        },
                        {

                            icon: {
                                name: "hourglass-start",
                                type: "FontAwesome"
                            },
                            title: 'Thời lượng',
                            content: content.time
                        },
                        {

                            icon: {
                                name: "book",
                                type: "Entypo"
                            },
                            title: 'Bài giảng',
                            content: content.courseCount
                        },
                        {

                            icon: {
                                name: "file-document",
                                type: "MaterialCommunityIcons"
                            },
                            title: 'Học liệu',
                            content: content.doc
                        },
                        {

                            icon: {
                                name: "clock-time-eight-outline",
                                type: "MaterialCommunityIcons"
                            },
                            title: 'Cập nhật',
                            content: content.update
                        },
                    ].map(item => {
                        if (item.content)
                            return (
                                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Icon style={{ fontSize: 16, marginRight: 5 }} name={item.icon.name} type={item.icon.type} />
                                        <Text>{item.title}:</Text>
                                    </View>
                                    <View style={{ flex: 2 }}>
                                        <Text>{item.content}</Text>
                                    </View>
                                </View>
                            )
                    })
                }
                {subTitle ?
                    <View>
                        <Text style={stylesTitle.subTitle} numberOfLines={showMore ? 15 : 3}>{subTitle} </Text>
                        <TouchableOpacity onPress={() => setShowMore(!showMore)} style={{ alignItems: 'flex-end' }}>
                            <Text>{showMore ? "Thu gọn" : "Xem thêm"}</Text>
                        </TouchableOpacity>
                    </View>
                    : null}
                {/* <View style={stylesTitle.bottomTile}>

                </View> */}
            </View>
            {/* <ImgCourse style={{ height: helpers.isTablet ? 350 : 200 }} /> */}
        </View>
    )
}
const stylesTitle = StyleSheet.create({
    titleCourse: {
        backgroundColor: '#fff',
        borderColor: COLOR.MAIN,
        borderRadius: 10,
        overflow: 'hidden'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        // color: COLOR.MAIN,
        textTransform: "capitalize"

    },
    subTitle: {
        fontSize: fontSize.h3,
        fontWeight: '400',
        color: '#777'

    },
    bottomTile: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    star: {

    },
    priceView: {
        // flexDirection: 'row',
        // alignItems: 'flex-end',
        marginBottom: 15,
    },
    prePrice: {
        textDecorationLine: 'line-through',
        fontSize: fontSize.h5
    },
    price: {
        color: COLOR.MAIN,
        fontWeight: 'bold',
        fontSize: fontSize.h1
    }

});


// 


const ImgCourse = ({ style = {} }) => {
    return (
        <View>
            <Image
                style={[{ height: 200 }, style]}
                resizeMode={'stretch'}
                // resizeMode="contain"
                source={{
                    uri: 'https://khoahoc.vietjack.com/upload/admin@vietjack.com/course/webpnet-resizeimage-22-1574410558.png',
                }}
            />
        </View>
    )
}




const Teacher = () => (
    <View style={{
        position: 'absolute',
        height: 200, width: '100%',
        top: '60%',
        alignItems: 'center'
        //  backgroundColor: 'red'
    }}>
        <View style={[{
            height: '100%', width: '70%',
            //  opacity: 0.9,
            backgroundColor: '#fff', borderRadius: 30,
            // overflow: 'hidden'
        }, styles.shadowStyle]}>
            <View style={{}}>
                {/* <View style={{ backgroundColor: 'red' }}> */}
                <Image
                    style={{ height: 60, marginTop: 20 }}
                    resizeMode="contain"
                    source={{ uri: 'https://khoahoc.vietjack.com/upload/images/users/avatar/1/5f093b13dc694.jpg' }}
                />
                <View style={{ alignItems: 'center' }}>
                    {/* </View> */}
                    <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 8 }}> Vũ Thanh Hoa </Text>
                    <Text> Tiếng anh  </Text>
                    <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', width: '70%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon type="AntDesign" name="user" style={{ fontSize: 15, color: '#99B194', marginRight: 5 }} />
                            <View style={{}}>
                                <Text>13k</Text>
                                <Text>Theo dõi</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon type="AntDesign" name="staro" style={{ fontSize: 15, color: '#99B194', marginRight: 5 }} />
                            <View style={{}}>
                                <Text>4.5</Text>
                                <Text>Ratings</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    </View>
)


export {
    BtnFullWidth, TitleCourse
}
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, ImageBackground, ScrollView, FlatList, Dimensions } from 'react-native';
// import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { Icon, Card } from 'native-base';
import { Snackbar } from 'react-native-paper';
import { get } from 'lodash';
import { withNavigationFocus } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { Thumbnail } from 'react-native-thumbnail-video';

// 
import { images } from '../../utils/images';
import NormalHeader from '../../component/shared/NormalHeader';
import { COLOR, fontSize, unitIntertitialId } from '../../handle/Constant';
import { ClassChoosenModal } from '../../component/shared/ClassChoosenModal';
import MenuItem from '../../component/menuItem';
import { HeaderBarWithBack } from '../../component/Header/Normal';
import { User } from '../../component/User';
import { helpers } from '../../utils/helpers';
import api from '../../handle/api';
import { endpoints } from '../../constant/endpoints';
import { fontMaker, fontStyles } from '../../utils/fonts';

const App = (props) => {
    const [dataLive, setDataLive] = useState([]);
    const [freeCourse, setFreeCourse] = useState([]);
    useEffect(() => {
        requestDataInit();
    }, []);

    const requestDataInit = async () => {
        try {
            const freePoint = `${endpoints.ROOT_URL}/courses/livestreams/2/show`;
            const paidPoint = `${endpoints.ROOT_URL}/courses/livestreams/1/show`;
            const [free, paid] = await Promise.all([
                api.get(freePoint),
                api.get(paidPoint),
            ]);
            setDataLive(paid.data.lessons)
            setFreeCourse(free.data.lessons)

        } catch (err) {

        }

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBarWithBack text="Live Stream" leftAction={() => props.navigation.goBack()} />
            <ScrollView>
                <View style={{ backgroundColor: '#fff', marginBottom: 10, padding: 10 }}>
                    <SeeAllTitle
                        // onPress={() => props.navigation.navigate('TopicCourse', { advert, topic: `Khoá học của tôi`, data: myCourse, showConsoult: false })}
                        text={`Bài giảng miễn phí hôm nay`} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {freeCourse.map(videoItem => {
                            return <ItemYtbFree navigation={props.navigation} data={videoItem} />
                        })}
                    </ScrollView>
                    <SeeAllTitle
                        // onPress={() => props.navigation.navigate('TopicCourse', { advert, topic: `Khoá học của tôi`, data: myCourse, showConsoult: false })}
                        text={`Bài giảng đạt điểm cao`} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {dataLive && dataLive[0] && dataLive.map((videoItem, index) => {
                            return <ItemYtb navigation={props.navigation} data={videoItem} isPass={index == 1} />
                        })}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};


export default App;

export const ItemYtbFree = ({ navigation, data }) => {
    return (
        <View style={{
            paddingHorizontal: 15,
            paddingVertical: 10
        }}>
            <Thumbnail
                iconStyle={{
                    height: 25,
                    width: 25,
                }}
                imageWidth={3 * helpers.width / 4}
                imageHeight={27 * helpers.width / 64}
                url={data.url}
            />

            <View style={{
                padding: 6,
                width: 3 * helpers.width / 4,
            }}>
                <View style={{
                    // backgroundColor: COLOR.MAIN, 
                    borderColor: '#ddd',
                    borderWidth: 1,
                    justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingVertical: 10
                }}>
                    <Text style={{
                        color: '#333',
                        fontWeight: '600',
                        fontSize: 18
                    }}>Xem video</Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    flex: 1,
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                }}
                onPress={() => {
                    navigation.navigate('YtbPlayer', { url: data.url })
                }}>
            </TouchableOpacity>
        </View>
    )
}





export const ItemYtb = ({ navigation, data, isPass = true }) => {
    return (
        <View style={{
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 10, overflow: 'hidden',
            borderColor: '#f2f2f2',
            borderWidth: 1,
        }}>
            <Thumbnail
                iconStyle={{
                    height: 25,
                    width: 25,
                }}
                imageWidth={3 * helpers.width / 4}
                imageHeight={27 * helpers.width / 64}
                // url={'https://www.youtube.com/watch?v=yI498f491b4'}
                url={data.url}
            />
            <View style={{
                padding: 6,
                width: 3 * helpers.width / 4,
            }}>
                <View style={{ height: 50 }}>
                    <Text numberOfLines={2} style={{
                        fontSize: 19, fontWeight: '500',
                        ...fontMaker({ weight: fontStyles.SemiBold }),
                    }}><Text style={{ color: '#F3453E' }}>[FREE] </Text>{data.name} Giải đề chi tiết bộ đề luyện thi 2022</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
                    <Icon style={{
                        fontSize: 17,
                        ...fontMaker({ weight: fontStyles.Regular }),
                    }} name="user" type="Feather" />
                    <Text style={{ marginVertical: 5, marginLeft: 7 }}>Cô Thu Trang</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
                    <Icon style={{
                        fontSize: 17,
                        ...fontMaker({ weight: fontStyles.Regular }),
                    }} name="calendar" type="AntDesign" />
                    <Text style={{ marginVertical: 5, marginLeft: 7, color: '#F3453E', fontWeight: '600' }}>20:00 Hôm nay</Text>
                </View>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        marginTop: 7, marginHorizontal: 20,
                        paddingVertical: 13, borderRadius: 24,
                        minWidth: 150,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    colors={isPass ? ['#5CA3C1', '#316DBF'] : ['#CA764A', '#CA5C1F']}>
                    <Text style={{
                        ...fontMaker({ weight: fontStyles.Regular }),
                        fontWeight: '600',
                        color: 'white',
                        fontSize: fontSize.h2
                    }}>{isPass ? "Xem lại" : "Giữ chỗ"}</Text>
                </LinearGradient>
            </View >

            <TouchableOpacity
                style={{
                    flex: 1,
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                }}
                onPress={() => {
                    navigation.navigate('YtbPlayer', { url: data.url })
                }}>
            </TouchableOpacity>
        </View >
    )
}



export const ItemCourse = ({ navigation, data, isPass = true }) => {
    return (
        <View style={{
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 10, overflow: 'hidden',
            borderColor: '#f2f2f2',
            borderWidth: 1,
        }}>
            <Thumbnail
                iconStyle={{
                    height: 25,
                    width: 25,
                }}
                imageWidth={3 * helpers.width / 4}
                imageHeight={27 * helpers.width / 64}
                // url={'https://www.youtube.com/watch?v=yI498f491b4'}
                url={data.url}
            />
            <View style={{
                padding: 6,
                width: 3 * helpers.width / 4,
            }}>
                <View style={{ height: 50 }}>
                    <Text numberOfLines={2} style={{
                        fontSize: 19, fontWeight: '500',
                        ...fontMaker({ weight: fontStyles.SemiBold }),
                    }}><Text style={{ color: '#F3453E' }}>[FREE] </Text>{data.name} Giải đề chi tiết bộ đề luyện thi 2022</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }}>
                    <Icon style={{
                        fontSize: 17,
                        ...fontMaker({ weight: fontStyles.Regular }),
                    }} name="user" type="Feather" />
                    <Text style={{ marginVertical: 5, marginLeft: 7 }}>Cô Thu Trang</Text>
                </View>
                {/* <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        marginTop: 7, marginHorizontal: 20,
                        paddingVertical: 13, borderRadius: 24,
                        minWidth: 150,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    colors={['#5CA3C1', '#CA5C1F']}>
                    <Text style={{
                        ...fontMaker({ weight: fontStyles.Regular }),
                        fontWeight: '600',
                        color: 'white',
                        fontSize: fontSize.h2
                    }}>{"Xem lại chi tiết"}</Text>
                </LinearGradient> */}
            </View >

            <TouchableOpacity
                style={{
                    flex: 1,
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                }}
                onPress={() => {
                    navigation.navigate('YtbPlayer', { url: data.url })
                }}>
            </TouchableOpacity>
        </View >
    )
}




export const SeeAllTitle = ({ text, onPress = () => { } }) => {
    return (
        <View style={{
            borderTopColor: '#dedede',
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Text style={[styles.header]}>{text}</Text>
            <TouchableOpacity
                onPress={onPress}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                <Text style={{ fontSize: fontSize.h5 }}> Xem tất cả </Text>
                <Icon type='FontAwesome5' name='chevron-right' style={{ color: '#666', fontSize: 16, marginHorizontal: 10 }} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    ChooseClass: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 3,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#aedcfc',
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 10
    },
    header: {
        fontSize: fontSize.h2,
        marginLeft: 5,
        // color: COLOR.MAIN,
        fontWeight: 'bold',
        // textTransform: "capitalize",
        // marginVertical: 15
    }
});
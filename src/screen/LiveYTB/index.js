import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, ImageBackground, ScrollView, FlatList, Dimensions } from 'react-native';
// import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { Icon, Card } from 'native-base';
import { Snackbar } from 'react-native-paper';
import { get } from 'lodash';
import { withNavigationFocus } from 'react-navigation';
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

const App = (props) => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBarWithBack text="Live Stream" leftAction={() => props.navigation.goBack()} />
            <ScrollView>
                <View style={{ backgroundColor: '#fff', marginBottom: 10, padding: 10 }}>
                    <SeeAllTitle
                        // onPress={() => props.navigation.navigate('TopicCourse', { advert, topic: `Khoá học của tôi`, data: myCourse, showConsoult: false })}
                        text={`Bài giảng đạt điểm cao`} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {[1, 2, 3].map(videoItem => {
                            return <ItemYtb navigation={props.navigation} />
                        })}
                    </ScrollView>

                    <SeeAllTitle
                        // onPress={() => props.navigation.navigate('TopicCourse', { advert, topic: `Khoá học của tôi`, data: myCourse, showConsoult: false })}
                        text={`Bài giảng miễn phí hôm nay`} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {[1, 2, 3].map(videoItem => {
                            return <ItemYtbFree navigation={props.navigation} />
                        })}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};

export default App;

const ItemYtbFree = ({ navigation }) => {
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
                url={'https://www.youtube.com/watch?v=pXJ7ZxhXWy4'}
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
                    navigation.navigate('YtbPlayer')
                }}>
            </TouchableOpacity>
        </View>
    )
}


const ItemYtb = ({ navigation }) => {
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
                imageWidth={3 * helpers.width / 4}
                imageHeight={27 * helpers.width / 64}
                url={'https://www.youtube.com/watch?v=yI498f491b4'}
            />
            <View style={{
                padding: 6,
                width: 3 * helpers.width / 4,
            }}>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={2} style={{ fontSize: 20, fontWeight: '500' }}>Toán lớp 6 (bộ sách cánh diều)</Text>
                    </View>
                    <Text style={{ textAlign: 'right', marginLeft: 7, fontWeight: '600' }}>Từ 120k/tháng</Text>
                </View>
                <Text style={{ marginVertical: 5 }}>Giải đề chi tiết bộ đề luyện thi 2022</Text>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text style={{ color: '#666' }}><Icon name="star" style={{ color: COLOR.MAIN, fontSize: 20 }} /> 4.7</Text>
                    <Text style={{ marginLeft: 25, color: '#666' }}>CourseId  #4567</Text>
                </View>
                <View style={{ backgroundColor: COLOR.MAIN, justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingVertical: 10 }}>
                    <Text style={{
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: 18
                    }}>Nhận hỗ trợ</Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    flex: 1,
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                }}
                onPress={() => {
                    navigation.navigate('YtbPlayer')
                }}>
            </TouchableOpacity>
        </View>
    )
}


const SeeAllTitle = ({ text, onPress = () => { } }) => {
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
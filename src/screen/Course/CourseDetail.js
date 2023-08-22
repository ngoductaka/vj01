import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    FlatList, ActivityIndicator,
    Dimensions,
    SafeAreaView, ScrollView, Text, StyleSheet, Linking, Platform, ImageBackground, TouchableOpacity, Image
} from 'react-native';
import { Icon } from 'native-base';
import { get } from 'lodash';
import * as Animatable from 'react-native-animatable';
import firebase from 'react-native-firebase';


import { Loading } from '../../handle/api';

import Header from './component/normalHeader';
import { COLOR, fontSize, unitIntertitialId1 } from '../../handle/Constant';
import { ListLesson as RenderCourseRelated } from './component/ListLesson';
import { convertMoney, helpers } from '../../utils/helpers';

import TableContent, { FreeCourse } from './component/TableContent';
import CourseHeader from './component/CourseHeader';
import { BtnFullWidth, TitleCourse } from './component/BtnFullWidth';
import { getDetailCourse } from './services';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { ModalWrapp } from './component/ModalVote';
import { BtnGradient } from '../../component/shared/Btn';

const CourseDetail = (props) => {
    const { navigation } = props;
    const videoItem = navigation.getParam('videoItem', null);
    const showConsoult = navigation.getParam('showConsoult', true);

    const [dataCourse, setDataCouse] = useState({});
    const [listCourse, setListCourse] = useState([]);
    const [loading, setLoading] = useState(false)
    const [showConsult, setShowConsultModal] = useState(false)


    useEffect(() => {
        // try {
        //     const advertParam = props.navigation.getParam('advert', null);
        //     console.log('advesdsdsdrtParam', advertParam)
        //     if (advertParam) {
        //         advertParam.show()
        //     }
        // } catch (err) {
        //     console.log('dddd', err)
        // }

        const advert = firebase.admob().interstitial(unitIntertitialId1);
        const AdRequest = firebase.admob.AdRequest;
        const request = new AdRequest();
        request.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');
        advert.loadAd(request.build());
        advert.on('onAdLoaded', () => {
            advert.show();
        });


    }, []);

    useEffect(() => {
        setLoading(true)
        setDataCouse(videoItem);
        if (videoItem.id) {
            getDetailCourse(videoItem.id)
                .then(({ data }) => {
                    console.log('daaaa', data)
                    if (showConsoult) {
                        setListCourse([{
                            "name": "Danh sách bài học miễn phí",
                            "get_child_curriculum": data.get_free_curriculum,
                        }, ...data.get_curriculum]);

                    } else {
                        setListCourse(data.get_curriculum);
                    }
                    // setFreeCourse(data.get_free_curriculum);
                })
                .catch(() => {

                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [videoItem])

    const _navigateToCourse = useCallback((params) => {
        navigation.navigate('VideoLesson', params)
    })
    const [showHeader, setShowHeader] = useState(false)
    const handleScroll = (e) => {
        if (get(e, 'nativeEvent.contentOffset.y') && e.nativeEvent.contentOffset.y > 100) {
            setShowHeader(true)
        } else {
            setShowHeader(false)
        }
    }
    // return <View />
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <ScrollView scrollEventThrottle={24} onScroll={handleScroll}>
                    <CourseHeader navigation={navigation} imgCourse={dataCourse.imgLecture} />
                    {/* content  */}
                    <Loading>
                        <View style={{ flex: 1 }}>
                            <TitleCourse
                                title={dataCourse.name}
                                subTitle={get(dataCourse, 'description', '')}
                                prePrice={2000000}
                                price={dataCourse.price}
                                vote={dataCourse.get_rating}
                                content={{
                                    teacher: get(dataCourse, 'owner.first_name'),
                                    grade: get(dataCourse, 'classlevel', ''),
                                    level: get(dataCourse, 'level', ''),
                                    // time: get(dataCourse, 'level', ''),
                                    // courseCount: get(dataCourse, 'level', ''),
                                    // doc: get(dataCourse, 'level', ''),
                                    update: get(dataCourse, 'updated_at', ''),
                                }}
                            />
                            <View style={{ backgroundColor: '#fff', marginVertical: 20, paddingVertical: 15, borderRadius: 10 }}>
                                <Text style={{ fontSize: 27, paddingLeft: 10 }}>Nội dung khoá học: </Text>
                                {loading ? <ActivityIndicator color="#000" size="large" style={{ marginTop: 10 }} /> :
                                    <TableContent
                                        navigation={navigation}
                                        _navigateToCourse={_navigateToCourse}
                                        listCourse={listCourse}
                                        showConsoult={showConsoult}
                                        setShowConsultModal={setShowConsultModal} // overview || detail
                                    />}
                            </View>
                        </View>
                    </Loading>
                </ScrollView>
                {showConsoult && helpers.isAndroid ? <BtnFullWidth
                    onPress={() => navigation.navigate('ConsultingForm')}
                    text={"Nhận tư vấn khoá học"}
                    styles={{
                        // marginBottom: 15,
                        marginVertical: 0,
                    }}
                /> : null}
                {showHeader ? <Animatable.View
                    style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
                    animation={showHeader ? 'fadeIn' : 'fadeOut'}
                >
                    <View style={{ flexDirection: 'row', paddingVertical: 7, backgroundColor: '#fff', alignItems: 'center' }} >
                        <TouchableOpacity
                            style={{ paddingHorizontal: 15 }}
                            onPress={() => { navigation.goBack() }}
                        >
                            <Icon type='AntDesign' name='arrowleft' style={{ fontSize: 26, color: 'rgba(0, 0, 0, 0.7)' }} />
                        </TouchableOpacity>

                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text
                                numberOfLines={1} style={{
                                    paddingVertical: 5,
                                    // textAlign: 'center',
                                    fontSize: 18,
                                    marginTop: 4,
                                    ...fontMaker({ weight: fontStyles.Regular })
                                }}>{dataCourse.name}</Text>
                        </View>
                    </View>
                </Animatable.View> : null}
            </View>
            <ModalWrapp
                show={showConsult}
                onClose={() => { setShowConsultModal(false) }}
                title="Bài học yêu cầu trả phí"
            >
                <View>
                    <Image
                        style={{ height: 120, marginTop: -10 }}
                        resizeMode="contain"
                        source={{ uri: 'https://images.squarespace-cdn.com/content/v1/5dd67d2aaec74929770fe3cd/1575459940872-BGBP9I1OU6WAS0BNBHUT/ke17ZwdGBToddI8pDm48kEkuqA5CPVEXx22XwNGYfRpZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PI7RjJ1Sk4e_t43oExbaejIJIKzwsQ27kPBxX_EDqtFg0KMshLAGzx4R3EDFOm1kBS/VideoIcon.jpg' }}
                    />
                    <Text style={{ fontSize: 22, textAlign: 'center', marginTop: 30 }}>Bạn cần đăng ký khóa học để xem đầy đủ các bài học</Text>
                    <BtnGradient
                        text="Nhận tư vấn khoá học"
                        style={{ marginTop: 30 }}
                        textStyle={{ fontSize: 25, fontWeight: 'bold' }}
                        onPress={() => {
                            setShowConsultModal(false);
                            navigation.navigate('ConsultingForm')
                        }}
                    />
                </View>
            </ModalWrapp>

        </SafeAreaView>
    )
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        // backgroundColor: "#fff"//"#f7d87e"
    },
    header: {
        fontSize: fontSize.h2,
        color: COLOR.MAIN,
        fontWeight: 'bold',
        textTransform: "capitalize",
        marginVertical: 15
    },
    shadowStyle: { shadowColor: 'black', shadowOffset: { width: -2, height: 2 }, shadowOpacity: 0.6, elevation: 2 },

});

export default CourseDetail;

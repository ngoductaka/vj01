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


import { Loading } from '../../handle/api';

import Header from './component/normalHeader';
import { COLOR, fontSize } from '../../handle/Constant';
import { ListLesson as RenderCourseRelated } from './component/ListLesson';
import { convertMoney, helpers } from '../../utils/helpers';

import TableContent, { FreeCourse } from './component/TableContent';
import CourseHeader from './component/CourseHeader';
import { BtnFullWidth, TitleCourse } from './component/BtnFullWidth';
import ConsultingForm from '../../component/ConsultingForm';
import { getDetailCourse } from './services';
import { fontMaker, fontStyles } from '../../utils/fonts';

const CourseDetail = (props) => {
    const { navigation } = props;
    const videoItem = navigation.getParam('videoItem', null);
    const showConsoult = navigation.getParam('showConsoult', true);

    const [dataCourse, setDataCouse] = useState({});
    const [listCourse, setListCourse] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        setDataCouse(videoItem);
        if (videoItem.id) {
            getDetailCourse(videoItem.id)
                .then(({ data }) => {
                    setListCourse([{
                        "name": "Danh sách bài học miễn phí",
                        "get_child_curriculum": data.get_free_curriculum,
                    }, ...data.get_curriculum]);
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
                                vote={4.5}
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
                            <View style={{ backgroundColor: '#fff', paddingHorizontal: 10, marginVertical: 20, paddingVertical: 15, borderRadius: 10 }}>
                                <Text style={{ fontSize: 27 }}>Nội dung khoá học: </Text>
                                {loading ? <ActivityIndicator size="large" style={{marginTop: 10}} /> :
                                    <TableContent navigation={navigation}
                                        _navigateToCourse={_navigateToCourse}
                                        listCourse={listCourse} />}
                            </View>
                        </View>
                    </Loading>
                </ScrollView>
                {showConsoult ? <BtnFullWidth
                    onPress={() => navigation.navigate('ConsultingForm')}
                    text={"Nhận tư vấn khoá học"}
                    styles={{ marginHorizontal: 15, marginVertical: 0, }}
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

// data fake

const tableContent = [
    {
        title: 'luyen thi trung hoc pho thong quoc gia',
        children: [
            {
                title: 'bài 1'
            }
        ]
    },
    {
        title: 'chương 1',
        children: [
            {
                title: 'bài 1...'
            },
            {
                title: 'bài 1...'
            },
            {
                title: 'bài 1...'
            },
            {
                title: 'bài 1...'
            },
            {
                title: 'bài 1...'
            }
        ]
    },

    {
        title: 'Chương 2 ',
        children: [
            {
                title: 'bài 3'
            }
        ]
    }
]
import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    FlatList,
    Dimensions,
    SafeAreaView, ScrollView, Text, StyleSheet, Linking, Platform, ImageBackground, TouchableOpacity, Image
} from 'react-native';
import { Icon } from 'native-base';
import { get } from 'lodash';

import { Loading } from '../../handle/api';

import Header from './component/normalHeader';
import { COLOR, fontSize } from '../../handle/Constant';
import { ListLesson as RenderCourseRelated } from './component/ListLesson';
import { convertMoney, helpers } from '../../utils/helpers';

import TableContent from './component/TableContent';
import CourseHeader from './component/CourseHeader';
import { BtnFullWidth, TitleCourse } from './component/BtnFullWidth';
import ConsultingForm from '../../component/ConsultingForm';
import { getDetailCourse } from './services';

const CourseDetail = (props) => {
    const { navigation } = props;
    const [dataCourse, setDataCouse] = useState({});
    const [listCourse, setListCourse] = useState([]);

    useEffect(() => {
        setDataCouse(props.navigation.state.params);
        if (props.navigation.state.params.id) {
            getDetailCourse(props.navigation.state.params.id)
                .then(({ data }) => {
                    setListCourse(data.get_curriculum)
                })
                .catch(() => {

                })
        }
    }, [props.navigation.state.params])

    const [isOpen, setOpen] = useState(false);

    const _navigateToCourse = useCallback((params) => {
        navigation.navigate('VideoLesson', params)
    })
    // return <View />
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
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
                            <TableContent navigation={navigation}
                                _navigateToCourse={_navigateToCourse}
                                listCourse={listCourse} />
                        </View>
                    </View>
                </Loading>
            </ScrollView>
            <BtnFullWidth
                onPress={() => navigation.navigate('ConsultingForm')}
                text={"Nhận tư vấn khoá học"}
                styles={{ marginHorizontal: 15, marginVertical: 0, }}
            />
        </SafeAreaView>
    )
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
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
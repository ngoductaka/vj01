import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    FlatList,
    Dimensions,
    SafeAreaView, ScrollView, Text, StyleSheet, Linking, Platform, ImageBackground, TouchableOpacity, Image
} from 'react-native';
import { Icon } from 'native-base';

import { Loading } from '../../handle/api';

import Header from './component/normalHeader';
import { COLOR, fontSize } from '../../handle/Constant';
import { ListLesson as RenderCourseRelated } from './component/ListLesson';
import { convertMoney, helpers } from '../../utils/helpers';

import TableContent from './component/TableContent';
import CourseHeader from './component/CourseHeader';
import { BtnFullWidth, TitleCourse } from './component/BtnFullWidth';
import ConsultingForm from '../../component/ConsultingForm';

const CourseDetail = (props) => {
    const { navigation } = props;

    const [listCourse, setListCourse] = useState(tableContent);
    const [isOpen, setOpen] = useState(false);

    const _navigateToCourse = useCallback((params) => {
        navigation.navigate('CoursePlayer', { lectureId: 5601, view_count: 0 })
    })
    // return <View />
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <CourseHeader navigation={navigation} imgCourse={undefined} />
                {/* content  */}
                <Loading>
                    <View style={{ flex: 1 }}>
                        <TitleCourse
                            title={'luyen thi trung hoc pho thong quoc gia'}
                            subTitle={'Khóa học này tập trung vào 20 chuyên đề ngữ pháp Tiếng Anh ôn thi THPT Quốc gia, cùng với đó là thủ thuật giải nhanh đề thi trắc nghiệm, cung cấp kiến thức từ cơ bản đến chuyên sâu ,các lời khuyên về định hướng cách học Tiếng Anh, các bí quyết ôn tập Tiếng Anh hiệu quả, phương pháp làm bài hiệu quả, hướng dẫn giải bài tập và đề thi một cách cụ thể, chi tiết nhất. '}
                            prePrice={2000000}
                            price={100000}
                        />
                     <TableContent _navigateToCourse={_navigateToCourse} listCourse={listCourse} />
                    </View>
                </Loading>
            </ScrollView>
            <BtnFullWidth onPress={() => navigation.navigate('ConsultingForm')} text={"Nhận tư vấn khoá học"} styles={{ marginHorizontal: 15 }} />
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
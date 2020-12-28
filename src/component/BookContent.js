

import React, { useCallback, useState, useEffect } from "react";
import { Icon, Card } from "native-base";
import { FlatList, SafeAreaView, View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { isEmpty } from 'lodash';
import MenuItem from './menuItem';

import { GradientText } from "./shared/GradientText";
import TrendItem from "./shared/TrendItem";

const { width } = Dimensions.get('window');
import { useRequest } from '../handle/api';
import BannerBottomAd from "./shared/BannerBottomAd";
import { fontSize } from "../handle/Constant";
import { fontMaker, fontStyles } from "../utils/fonts";
import LinearGradient from "react-native-linear-gradient";

export const _renderBookItem = (menuItem, index, handleNavigation) => {
    return (
        <Card style={{ borderRadius: 10, marginRight: 10, paddingVertical: 10, shadowRadius: 1 }}>
            <MenuItem
                title={menuItem.title}
                icon={menuItem.icon_id}
                index={index}
                style={{ backgroundColor: 'white' }}
                container_width={(width - 50) / 3}
                onPressItem={() => handleNavigation(menuItem)}
            />
        </Card>
    )
}

export const RenderListBook = ({ listBook, handleNavigation = () => { } }) => {
    return (
        <FlatList
            data={listBook}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => _renderBookItem(item, index, handleNavigation)}
            keyExtractor={(item, index) => index + 'subitem'}
        />
    )
}

const BookContent = ({ books, navigation, series_url, topic_id, listTestExam = [], subjectTest = {} }, ...props) => {

    const [showTrend, setShowTrend] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowTrend(true);
        }, 600);
    }, []);

    let endPoint = `trend-week/series_lop-${series_url}/${topic_id}`;
    // const [trendTopic, loading, err] = useRequest(endPoint, [series_url, endPoint]);

    const _handleNavigation = ({ url, title }) => {
        navigation.navigate('Subject', { book: url, title })
    }
    const _handleNavigationToLesson = (item) => {
        navigation.navigate("Lesson", { key: item.url, bookName: item.category_url, title: item.title });
    }
    const _navigateTest = (screen = '', params = {}) => {
        navigation.navigate(screen, { ...params, subjectTest })
    }

    const renderItemBook = useCallback(({ item, index }) => _renderBookItem(item, index, _handleNavigation))
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginLeft: 10 }}>
                    <RenderCardBook
                        title={'Sách giáo khoa'}
                        listBook={books.filter(i => i.group === 1)}
                        renderItemBook={renderItemBook}
                        style={{ marginBottom: 15, marginTop: 15 }}
                    />
                    <RenderCardBook
                        title={'Sách bài tập'}
                        icon='book-open'
                        listBook={books.filter(i => i.group != 1)}
                        renderItemBook={renderItemBook}
                        style={{ marginBottom: 15 }}
                    />
                    {/* <RenderCardBook
                        title={'Đề thi'}
                        type='FontAwesome'
                        icon='pencil-square-o'
                        listBook={books.filter(i => i.group != 1)}
                        renderItemBook={renderItemBook}
                        style={{ marginBottom: 15 }}
                    /> */}
                </View>
                <TestExam listTestExam={listTestExam} navigateTest={_navigateTest} />
                {/* <BannerBottomAd height={300} key='fake_10_ad_banner' /> */}
                {/* trend */}
                {/* {!isEmpty(trendTopic) &&
                    showTrend &&
                    <View style={{ padding: 10, paddingTop: 10, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon style={{ color: '#FEDB6D', fontSize: 22, marginLeft: 6 }} name='star' />
                            <Text style={{ marginLeft: 7, fontSize: 15, ...fontMaker({ weight: 'Bold' }), color: '#FC8023' }}>Xu hướng bài học</Text>
                        </View>
                        <FlatList
                            data={trendTopic}
                            renderItem={({ item, index }) => _renderTrendItem(item, index, _handleNavigationToLesson)}
                            keyExtractor={(_, index) => 'trendItem' + index.toString()}
                        />
                    </View>
                } */}
            </ScrollView>
        </SafeAreaView>
    );
}


const _renderTrendItem = (menuItem, index, _handleNavigationToLesson) => {
    return (
        <TrendItem
            title={menuItem.title}
            subTitle={menuItem.topic_title + ' - ' + menuItem.series_title}
            img={menuItem.topic_type}
            showBorder={index % 6}
            onPressItem={() => _handleNavigationToLesson(menuItem)}
        />
    );
}

export default BookContent;

const TestExam = ({ listTestExam, navigateTest }) => {
    if (isEmpty(listTestExam)) return null;
    return (
        <View style={{ width: '100%', paddingVertical: 0, marginBottom: 20, paddingBottom: 20, marginLeft: 10 }}>
            <TouchableOpacity
                onPress={() => navigateTest('HomeTest', { currSubjectName: new Date() })}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, paddingVertical: 7 }}>
                    <Icon name='pencil-square-o' type='FontAwesome' style={{ fontSize: 30, color: '#FC652B' }} />
                    <Text style={{ color: '#000', fontSize: fontSize.h2, fontWeight: 'bold', marginLeft: 10 }}>Đề thi</Text>
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ ...fontMaker({ weight: 'Light' }) }}>Xem tất cả</Text>
                    <Icon name='ios-arrow-forward' style={{ color: 'black', fontSize: 16, marginHorizontal: 10, color: "#444", paddingRight: 10 }} />
                </View> */}
            </TouchableOpacity>

            <FlatList
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
                horizontal={true}
                data={listTestExam}
                renderItem={({ item }) => RenderLesson({ content: item, navigateTest })}
                keyExtractor={(item, index) => index + 'subitem'}
            />
        </View>
    );
}


const RenderLesson = ({ content, navigateTest }) => {
    const { courses = [] } = content;
    const countCourse = courses.length;
    return (
        <TouchableOpacity onPress={() => navigateTest('ExamFormat', { idDetail: content.id, sourceScreen: 'Book' })} >
            <Card style={lessonSt.container}>
                <Text style={{ color: '#000', fontSize: 17, flexShrink: 1 }} numberOfLines={5}>
                    {content.name}
                </Text>
                {/*  */}
                <View style={lessonSt1.textBottom}>
                    <View style={lessonSt1.swapperLeft}>
                        <View style={lessonSt1.textLeft}>
                            <Icon type='FontAwesome5' name="file" style={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 13 }} />
                            <Text style={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 12, flexShrink: 1 }}> {`${countCourse} bộ đề`} </Text>
                        </View>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    )
}

const lessonSt = StyleSheet.create({
    container: {
        width: width / 2 - 40,
        marginRight: 10,
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'space-between',

        borderBottomRightRadius: 30,
        backgroundColor: '#fff',
        height: 160,
        borderRadius: 15,
        justifyContent: 'space-between'
    },
    textLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    swapperLeft: {
        flex: 1,
    },
    textRight: {
        flex: 1,
        borderLeftColor: '#dedede',
        borderLeftWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    textBottom: {
        flexDirection: 'row',
    }
})


const lessonSt1 = StyleSheet.create({
    textLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    swapperLeft: {
        flex: 1,
    },
    textRight: {
        flex: 1,
        borderLeftColor: '#dedede',
        borderLeftWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    textBottom: {
        flexDirection: 'row',
    }
})


const RenderCardBook = ({ title, listBook, type = 'MaterialCommunityIcons', renderItemBook, icon = 'book-open-page-variant', style }) => {
    return (
        <View style={[{ borderRadius: 10, overflow: 'hidden' }, style]}>
            {
                listBook.length > 0 &&
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, paddingVertical: 7, }}>
                    <Icon name={icon} type={type} style={{ fontSize: 30, color: '#FC652B' }} />
                    <Text style={{ marginLeft: 10, color: '#000', fontSize: fontSize.h2, fontWeight: 'bold' }}>{title}</Text>
                </View>
            }
            <FlatList
                data={listBook}
                numColumns={3}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItemBook}
                keyExtractor={(item, index) => index + 'subitem'}
            />
        </View>
    )
}
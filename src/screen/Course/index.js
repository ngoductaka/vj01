import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, ImageBackground, ScrollView, FlatList, Dimensions } from 'react-native';
// import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { Icon, Card } from 'native-base';
import { Snackbar } from 'react-native-paper';
import { get } from 'lodash';


import { images } from '../../utils/images';
import NormalHeader from '../../component/shared/NormalHeader';
import { COLOR, fontSize } from '../../handle/Constant';
import { ClassChoosenModal } from '../../component/shared/ClassChoosenModal';
import { ListLesson } from './component/ListLesson';
import MenuItem from '../../component/menuItem';
import HeaderBar from '../../component/Header/Normal';
import { User } from '../../component/User';
import { LargeVideo } from './component/VideoItem';

import { getCouse } from './services';
import { convertImgLink } from './utis'

const { width } = Dimensions.get('window');



const Course = (props) => {

    const { navigation } = props;
    const [visible, setVisible] = useState(false);
    const [gradeCourse, setGradeCourse] = useState([]);
    const [groupCourse, setGroupCourse] = useState([]);
    const [loadGrade, setLoadingGradle] = useState(false);

    const userInfo = useSelector(state => state.userInfo);
    // console.log('userInfo123', userInfo)
    const [currentClass, setClass] = useState(userInfo && userInfo.class ? userInfo.class : '');
    const [classModal, setShowClassModal] = useState(false);

    // console.log('gradeCourse', gradeCourse)

    useEffect(() => {
        if (userInfo.class) {
            _setCurrentClass(userInfo.class);
            _getCourseViaGrade(userInfo.class);
            _getCourseViaGroup()
        }
    }, [userInfo.class]);
    const _getCourseViaGrade = (grade) => {
        setLoadingGradle(true)
        getCouse({ classlevel: grade })
            .then(({ data }) => {
                setGradeCourse(data)
            })
            .catch(err => {

            })
            .finally(() => {
                setLoadingGradle(false)

            })

    }


    const _getCourseViaGroup = () => {
        setLoadingGradle(true)
        getCouse({ group: 'luyen_thi_thpt_qg' })
            .then(({ data }) => {
                setGroupCourse(data)
            })
            .catch(err => {
            })
            .finally(() => {
                setLoadingGradle(false)
            })

    }



    const _handlePressLesson = (item) => {
        navigation.navigate('CourseDetail', {});
    }
    const _onClose = () => {
        setShowClassModal(false);
    }

    const _setCurrentClass = (cls) => {
        setClass(cls);
        setShowClassModal(false);
    }

    return (
        <View style={styles.container}>
            {/* <NormalHeader onPressSearch={() => props.navigation.navigate('SearchView', { searchText: '' })} onRightAccount={() => setRightAction(!rightAction)} /> */}
            <SafeAreaView style={{ flex: 1 }}>
                <HeaderBar navigation={props.navigation} />
                <ScrollView>
                    <View style={{ backgroundColor: '#fff', marginBottom: 10, padding: 10 }}>
                        <SeeAllTitle
                            onPress={() => props.navigation.navigate('TopicCourse', { topic: `Khoá học lớp ${currentClass}`, data: gradeCourse })}
                            text={`Khoá học lớp ${currentClass}`} />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {gradeCourse.slice(0, 5).map(videoItem => {
                                return <VideoContinue
                                    navigate={navigation.navigate}
                                    setVisible={() => { }}
                                    videos={videoItem}
                                    style={{ marginRight: 20, width: width * 4 / 5 }}
                                />
                            })}
                        </ScrollView>
                    </View>


                    <View style={{ backgroundColor: '#fff', marginBottom: 10, padding: 10 }}>
                        <SeeAllTitle
                            onPress={() => props.navigation.navigate('TopicCourse', { topic: `Khoá học lớp ${currentClass}`, data: gradeCourse })}
                            text={'Luyện thi THPT quốc gia'} />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {groupCourse.slice(0, 5).map(videoItem => {
                                return <VideoContinue
                                    navigate={navigation.navigate}
                                    setVisible={() => { }}
                                    videos={videoItem}
                                    style={{ marginRight: 20, width: width * 4 / 5 }}
                                />
                            })}
                        </ScrollView>
                    </View>

                    {/* <FlatList
                    style={{ marginTop: 8, backgroundColor: '#ddd' }}
                    data={[`Khoá học lớp ${currentClass}`, 'Luyện thi THPT', 'KHoá học của bạn']}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ backgroundColor: '#fff', marginBottom: 10, padding: 10 }}>
                                <SeeAllTitle
                                    onPress={() => props.navigation.navigate('TopicCourse', { topic: item })}
                                    text={currentClass ? item : ''} />
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {gradeCourse.slice(0, 5).map(videoItem => {
                                        return <VideoContinue
                                            navigate={navigation.navigate}
                                            setVisible={() => { }}
                                            videos={{}}
                                            style={{ marginRight: 20, width: width * 4 / 5 }}
                                        />
                                    })}
                                </ScrollView>
                            </View>

                        )
                    }}
                    keyExtractor={({ item, index }) => `${index}`}
                /> */}

                </ScrollView>
                <ClassChoosenModal
                    isShowMore="true"
                    show={classModal}
                    onClose={_onClose}
                    showCancel={typeof (userInfo.class) !== 'undefined'}
                    setCurrentClass={_setCurrentClass}
                />
            </SafeAreaView>
            <Snackbar
                visible={visible}
                duration={5000}
                wrapperStyle={{ padding: 0, margin: 0 }}
                style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, borderRadius: 0, borderRadius: 0 }}
                onDismiss={() => setVisible(false)}
                action={{
                    label: 'Xem ngay',
                    onPress: () => {
                        navigation.navigate('Bookmark');
                    },
                }}>
                Đã thêm vào "Bookmarks"
            </Snackbar>
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
        textTransform: "capitalize",
        // marginVertical: 15
    }
});

export default Course;
// com
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

const Category = [
    {
        key: "",
        text: 'Luyện thi THPT Quốc Gia'
    },
    {
        key: "",
        text: 'Ôn thi vào lớp 10'
    },
    {
        key: "",
        text: "Baì Giảng Tóan lớp 12"
    },
    {
        key: "",
        text: "Lý lượng Tử hay nhất"
    },
    {
        key: "",
        text: "Tip hay cho trắc nghiệm"
    },
]

const Header = ({ showFilter, onSearch }) => {
    return (
        <View style={{
            flexDirection: 'row', justifyContent: 'space-between',
            paddingTop: 10, backgroundColor: '#fff',
            borderBottomColor: '#ddd', borderBottomWidth: 1,
            paddingBottom: 10, paddingHorizontal: 10, alignItems: 'center'
        }}>
            <TouchableOpacity
                onPress={onSearch}
                style={{
                    flexDirection: 'row', alignItems: 'center', flex: 1
                }}>
                <User />
                <Text style={{ fontSize: 16, marginLeft: 10 }}>Bạn muốn học gì?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={showFilter} style={stylesHeader.filter}>
                <Icon style={stylesHeader.iconFilter} type="AntDesign" name="filter" />
                {/* <Text style={styles.h2}> Lọc câu hỏi</Text> */}
            </TouchableOpacity>
        </View>
    )
}

const stylesHeader = StyleSheet.create({

    filter: {
        flexDirection: 'row',
        paddingVertical: 10,
        backgroundColor: COLOR.MAIN,
        height: 40,
        width: 40,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
        // padding
    },

    iconFilter: {
        fontSize: 17,
        color: '#fff'
    },
})



const VideoContinue = ({ navigate, setVisible, videos = {}, style = {}, widthImg = width * 3 / 4 }) => {

    const teacher = get(videos, 'owner', {});
    // console.log('----', get(videos, 'get_ldp.thumbnail', ''))
    const videoItem = {
        imgLecture: convertImgLink(get(videos, 'get_ldp.thumbnail', '')),
        teacher: {
            ...teacher,
            name: teacher.first_name,
            img: convertImgLink(teacher.avatar)
        },
        ...videos,
    }

    const propsVideo = {
        setVisible,
        widthImg,
        item: videoItem,
        _handlePress: () => {
            navigate('CourseDetail', videoItem)
        },
    };
    return (
        <LargeVideo {...propsVideo} style={style} />
    )
}
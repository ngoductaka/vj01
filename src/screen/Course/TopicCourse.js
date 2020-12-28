import React, { useState, useEffect } from 'react';
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
import { HeaderBarWithBack } from '../../component/Header/Normal';
import { User } from '../../component/User';
import { LargeVideo } from '../Lesson/component/VideosList';

const { width } = Dimensions.get('window');



const Course = (props) => {

    const { navigation } = props;
    const [visible, setVisible] = useState(false);
    // 
    const topic = navigation.getParam('topic', topic)

    const userInfo = useSelector(state => state.userInfo);
    // console.log('userInfo123', userInfo)
    const [currentClass, setClass] = useState(userInfo && userInfo.class ? userInfo.class : '');
    const [classModal, setShowClassModal] = useState(false);

    const _onClose = () => {
        setShowClassModal(false);
    }

    const _setCurrentClass = (cls) => {
        setClass(cls);
        setShowClassModal(false);
    }
    useEffect(() => {
        if (userInfo.class) _setCurrentClass(userInfo.class)
    }, [userInfo.class]);

    const _handlePressLesson = (item) => {
        navigation.navigate('CourseDetail', {});
    }

    return (
        <View style={styles.container}>
            {/* <NormalHeader onPressSearch={() => props.navigation.navigate('SearchView', { searchText: '' })} onRightAccount={() => setRightAction(!rightAction)} /> */}
            <SafeAreaView style={{ flex: 1 }}>
                <HeaderBarWithBack
                    leftAction={() => props.navigation.goBack()}
                    text={topic}
                />
                <ScrollView style={{ marginTop: 8, backgroundColor: '#ddd' }}>
                    {/* current class */}
                    {["Toán", "Văn", "Hoá", 'Lý', "Sinh"].map(i => {
                        return (
                            <View key={i} style={{ backgroundColor: '#fff', marginBottom: 10, padding: 10 }}>
                                <SeeAllTitle
                                    onPress={() => props.navigation.navigate('CourseDetail')}
                                    text={i} />
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {[1, 2, 3].map(item => {
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
                    })}
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
            {/* <TouchableOpacity
                onPress={onPress}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                <Text style={{ fontSize: fontSize.h5 }}> Xem tất cả </Text>
                <Icon type='FontAwesome5' name='chevron-right' style={{ color: '#666', fontSize: 16, marginHorizontal: 10 }} />
            </TouchableOpacity> */}
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
    const propsVideo = {
        isLecture: !!videos.preview_img,
        setVisible,
        widthImg,
        item: {
            imgLecture: get(videos, 'preview_img', ''),
            lectureId: get(videos, 'id', ''),
            videoUrl: get(videos, 'url', 'https://www.youtube.com/watch?v=COfrDO4lV-k'),
            duration: get(videos, 'length', 0),
            title: get(videos, 'title', ' test title'),
            viewCount: get(videos, 'view_count', '1k')
        },
        _handlePress: () => {
            navigate('CourseDetail', { lectureId: get(videos, 'id', ''), view_count: get(videos, 'view_count', '') })
        },
    };
    return (
        <LargeVideo {...propsVideo} style={style} />
    )
}
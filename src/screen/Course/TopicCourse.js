import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, ImageBackground, ScrollView, FlatList, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
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
import { LargeVideo } from './component/VideoItem';
import { MAP_SUBJECT } from '../../constant';
import { convertImgLink } from './utis'

const { width } = Dimensions.get('window');



const Course = (props) => {

    const { navigation } = props;
    const [visible, setVisible] = useState(false);
    const [dataTopic, setDataTopic] = useState(false);
    // 
    const topic = navigation.getParam('topic', topic)
    const data = navigation.getParam('data', []);
    const showConsoult = navigation.getParam('showConsoult', true);

    useEffect(() => {
        try {
            const advertParam = props.navigation.getParam('advert', null);
            if (advertParam) {
                advertParam.show()
            }
        } catch (err) {
            console.log('dddd', err)
        }
    }, []);

    useEffect(() => {
        // console.log('datadatadatadata', data);
        const dataConvert = data.reduce((cal, cur) => {
            const { subject } = cur;
            if (subject) {
                cal[subject] = cal[subject] ? [...cal[subject], cur] : [cur];
            }
            return cal;
        }, {});

        console.log('dataConvert', 'dataConvert', dataConvert)

        setDataTopic(dataConvert);

    }, [data])

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
                    {Object.keys(dataTopic).map((key, indexTop) => {
                        return (
                            <Animatable.View animation="fadeIn" delay={indexTop * 1000} key={key} style={{ backgroundColor: '#fff', marginBottom: 10, padding: 10 }}>
                                <SeeAllTitle
                                    onPress={() => { }}
                                    text={MAP_SUBJECT[key]} />

                                <FlatList horizontal showsHorizontalScrollIndicator={false}
                                    data={dataTopic[key]}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Animatable.View animation="fadeIn" delay={index * 500}>
                                                <VideoContinue
                                                    showConsoult={showConsoult}
                                                    navigate={navigation.navigate}
                                                    setVisible={() => { }}
                                                    videos={item}
                                                    style={{ marginRight: 20, width: width * 4 / 5 }}
                                                />
                                            </Animatable.View>
                                        )
                                    }}
                                    keyExtractor={({ item, index }) => String(index)}
                                />
                            </Animatable.View>

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

const VideoContinue = ({ navigate, setVisible, videos = {}, style = {}, widthImg = width * 3 / 4, showConsoult = true }) => {
    // console.log('videos', videos);

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
            navigate('CourseDetail', { videoItem, showConsoult })
        },
    };
    return (
        <LargeVideo {...propsVideo} style={style} />
    )
}
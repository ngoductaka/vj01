import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, ScrollView, ImageBackground, Dimensions, StatusBar, Alert } from 'react-native';
import { Icon } from 'native-base';
import FastImage from 'react-native-fast-image';
import { useSelector, useDispatch } from 'react-redux';
import { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import Share from 'react-native-share';
import { withNavigationFocus } from 'react-navigation';

import { ConfirmBox as ModalInfoBox } from '../../component/ModalConfirm';
import { actLogout } from '../../redux/action/user_info';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { setUserInfo } from '../../redux/action/user_info';


import { ClassChoosenModal } from '../../component/shared/ClassChoosenModal';
import { fontSize, blackColor, COLOR, avatarIndex } from '../../handle/Constant';
import LinearGradient from 'react-native-linear-gradient';
import SimpleToast from 'react-native-simple-toast';
import { helpers } from '../../utils/helpers';
import { makeOptionShare } from '../../constant';
import { ExitModal } from '../../component/shared/ExitModal';
import api, { useRequest } from '../../handle/api';
import { actGetListSubjects } from '../../redux/action/class';
import { get } from 'lodash';

const Profile = (props) => {

    const { navigation, isFocused } = props;

    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [mount, setMount] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const avatarIdx = useSelector(state => get(state, 'userInfo.user.avatar_id', 0));

    const netInfo = useNetInfo();
    const userInfo = useSelector(state => {
        return state.userInfo.user
    });

    const userInfoClass = useSelector(state => {
        return state.userInfo
    });

    const [currentClass, setClass] = useState('');
    const [isShowClassModal, setShowClassModal] = useState(false);

    useEffect(() => {
        // console.log('currentClass', currentClass)
        if (!isFocused) {
            setShowClassModal(false)
        }

    }, [isFocused])

    useEffect(() => {
        setTimeout(() => {
            if (userInfoClass.class) {
                _setCurrentClass(userInfoClass.class);
                async function getListSubjects() {
                    const detailClass = `subjects?grade_id=${userInfoClass.class}`;
                    const result = await api.get(detailClass);
                    if (result.data) {
                        dispatch(actGetListSubjects(result.data));
                    }
                }
                getListSubjects();
            } else {
                setShowClassModal(true);
            }
        }, 100);
    }, [userInfoClass.class]);

    useEffect(() => {
        setMount(true);
    }, []);

    const _setCurrentClass = (cls) => {
        setShowClassModal(false);
        dispatch(setUserInfo({ class: cls }))
        AsyncStorage.setItem('class', String(cls));
        setClass(cls);
        setTimeout(() => {
            if (mount) SimpleToast.showWithGravity('Thay đổi lớp học thành công', 3, SimpleToast.TOP);
        }, 501);
    };

    useEffect(() => {
        console.log('currnet', currentClass);
        if (currentClass) {
            api.post(`/grades/${parseInt(currentClass)}/user`, {
                "user_id": userInfo.id,
                "class_id": parseInt(currentClass)
            })
                .then(response => console.log('--------', response))
                .catch(err => console.log('----errr----', err));

        }
    }, [currentClass]);

    const _onLogout = () => {
        if (!netInfo.isConnected) {
            setShow(true);
        } else {
            navigation.navigate('Login');
            dispatch(actLogout());
        }
    }

    const _handleShare = () => {
        Share.open(makeOptionShare())
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 0.1, y: 1 }} colors={['rgba(153, 143, 255, .8)', '#A27BFC', '#7e73eb', 'rgba(39, 17, 250, 0.7)']}>
                <ImageBackground source={require('../../public/image/top_right_1.png')} style={{
                    height: helpers.isIpX ? 295 : 270,
                    paddingTop: helpers.isIpX ? 10 : 20
                }}>
                    <SafeAreaView style={{ flex: 1, }}>
                        {/* <View style={{ alignSelf: 'center', width: 100, height: 100, borderWidth: 3, borderColor: 'white', borderRadius: 50, overflow: 'hidden' }}>
                            {userInfo.thumbnail ?
                                <FastImage
                                    style={{ flex: 1, width: null, height: null, }}
                                    source={{
                                        uri: userInfo.thumbnail.includes('https') ? userInfo.thumbnail : `https://khoahoc.vietjack.com${userInfo.thumbnail}`,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                :
                                <View style={{ backgroundColor: '#97928F', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 30, ...fontMaker({ weight: fontStyles.Bold }) }}>{userInfo.name && userInfo.name.charAt(0).toUpperCase()}</Text>
                                </View>
                            }
                        </View> */}

                        <View style={{ alignSelf: 'center', width: 100, height: 100, borderWidth: 1.5, borderColor: COLOR.white(1), borderRadius: 50, padding: 10, overflow: 'hidden' }}>
                            <Image
                                source={avatarIndex[avatarIdx || 0].img}
                                style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                            />
                        </View>

                        <View style={styles.userName}>
                            <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { userInfo })} style={styles.editBtn}>
                                <Text style={styles.name}>{userInfo.name}</Text>
                                <Icon type='AntDesign' name='edit' style={styles.editIcon} />
                            </TouchableOpacity>
                            <View style={styles.wapBtnClass}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowClassModal(true)
                                    }}
                                    style={[styles.btnChooseClass, styles.shadow]}
                                >
                                    <Text style={{ color: '#665DD1', fontSize: 17, ...fontMaker({ weight: fontStyles.Regular }) }}>{currentClass ? `Lớp ${currentClass}` : "Chọn Lớp"}</Text>
                                    <Icon type='FontAwesome5' style={styles.iconChoose} name='sort-down' />
                                </TouchableOpacity>

                            </View>
                        </View>
                    </SafeAreaView>
                </ImageBackground>
            </LinearGradient>
            <View style={{ flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20, overflow: 'hidden', backgroundColor: '#fff' }}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                    <ProfileItem navigation={navigation} title='Lịch sử học tập' style={{ marginTop: 10 }} route='History' />
                    <ProfileItem navigation={navigation} icon='md-download' color={COLOR.MAIN} title='Bài học đã lưu' route='SavedArticle' />
                    {/* <ProfileItem navigation={navigation} icon='stopwatch' color='#ADA3E4' title='Video xem sau' route='WatchLater' /> */}
                    <ProfileItem type='FontAwesome' navigation={navigation} icon='bookmark' color='#ADA3E4' title='Bookmarks' route='Bookmark' data={{ type: 'bookmark' }} />
                    <ProfileItem navigation={navigation} type='Entypo' icon='mail' color='#FA9B43' size={24} title='Phản hồi' route='FeedBack' />
                    <ProfileItem navigation={navigation} type='SimpleLineIcons' icon='share' size={22} color='#1D8BF8' title='Chia sẻ ứng dụng' handlePress={_handleShare} />
                    <ProfileItem navigation={navigation} type='AntDesign' icon='poweroff' size={23} color='#ED5855' title='Đăng xuất' handlePress={() => setShowExitModal(true)} />
                    <Text style={{ alignSelf: 'flex-end', marginTop: 20, fontSize: 15, ...fontMaker({ weight: 'Regular' }), color: blackColor(.6) }}>Phiên bản 2.2.8</Text>
                </ScrollView>
            </View>
            <ModalInfoBox show={show} onCancel={() => setShow(false)} text="Không có internet !" cancelText="Trở lại" isInfo={true} />

            {/*  modal class*/}
            <ClassChoosenModal
                show={isShowClassModal}
                onClose={() => setShowClassModal(false)}
                showCancel={!!userInfoClass.class}
                setCurrentClass={_setCurrentClass}
            />
            <ExitModal
                show={showExitModal}
                onConfirm={() => setShowExitModal(false)}
                onCancel={() => _onLogout()}
            />
        </View >
    )
}

const ProfileItem = ({ title, route, type = 'Ionicons', style, navigation, size = 28, icon = 'glasses', color = '#9AC5E4', handlePress = () => { }, data = {} }) => {
    const _handlePress = () => {
        if (route) {
            navigation.navigate(route, data)
        } else {
            handlePress()
        }
    }
    return (
        <TouchableOpacity style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', ...style }} onPress={_handlePress}>
            <View style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Icon type={type} name={icon} style={{ fontSize: size, color: color, marginRight: 10 }} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, ...fontMaker({ weight: 'Regular' }), }}>{title}</Text>
                <Icon name='ios-arrow-forward' style={{ fontSize: 20, color: 'grey' }} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    editIcon: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 10
    },
    userName: {
        // marginBottom: 20
    },
    wapBtnClass: {
        flexDirection: 'row',
        justifyContent: "center"
    },
    btnChooseClass: {
        backgroundColor: '#fff',
        display: 'flex',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 24,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconChoose: {
        fontSize: 22,
        marginTop: -10,
        color: '#665DD1',
        marginLeft: 15

    },
    shadow: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 8,
        shadowOffset: { width: 1, height: 10 },
    },
    textBtn: { color: 'white', marginLeft: 8, ...fontMaker({ weight: 'Regular' }) },
    socialBtn: { justifyContent: 'center', flexDirection: 'row', alignItems: 'center', width: 140, height: 40, borderRadius: 5 },
    name: {
        alignItems: 'center',
        fontSize: fontSize.h1,
        ...fontMaker({ weight: 'Bold' }),
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: 10,
    }
});

export default withNavigationFocus(Profile);

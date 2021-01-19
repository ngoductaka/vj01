import React, { useState, useEffect, useRef } from 'react';
import {
    View, FlatList, Text, StyleSheet, Platform, Alert,
    TouchableOpacity, Dimensions, Image, ScrollView,
    SafeAreaView, TextInput, Keyboard, ActivityIndicator
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Icon } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import { check, PERMISSIONS, RESULTS, openSettings, request } from 'react-native-permissions';

import { fontSize, COLOR } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';

import { FilterModal, mapTypeQestion } from './com/FilterModal';
import KeyboardStickyView from '../../component/shared/StickeyKeyboad';
import imagePicker from '../../utils/imagePicker';

import { TollBar } from './com/com';
import services from '../../handle/services';
import api from '../../handle/api';
import { helpers } from '../../utils/helpers';

const { width, height } = Dimensions.get('window');
const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";

const QnA = (props) => {
    const [filter, setFilter] = useState({ cls: 13 });
    const [showFilter, setShowFilter] = useState(true);
    const [questionContent, setContent] = useState('');
    const [showKeyboad, setShowKeyboard] = useState(false);

    // const userInfo.class
    const userInfo = useSelector(state => state.userInfo);
    const current_class = useSelector(state => state.userInfo.class);
    useEffect(() => { setFilter({ cls: current_class }) }, [current_class])

    // console.log('userInfo42345', userInfo.user.photo)
    const inputRef = useRef(null);
    const hanldleClick = (params) => {
        props.navigation.navigate("QuestionDetail", params);
    };

    // console.log('vvvvv', filter);
    useEffect(() => {
        // if (inputRef && inputRef.current) {
        //     setTimeout(() => {
        //         inputRef.current.focus();
        //     }, 1000)
        // }

        setShowKeyboard(true);
    }, []);

    const [photos, setPhotos] = useState([]);

    const _handleOpenSetting = () => {
        Alert.alert(
            "Mở cài đặt",
            "Vui lòng cấp quyền để upload ảnh",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: openSettings }
            ],
            { cancelable: true }
        );

    }

    const _handleClickPhoto = async () => {
        // 
        if (helpers.isIOS) {
            const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
            if (result == RESULTS.GRANTED) {
                _handleSelectPhoto()
            } else if (result === RESULTS.DENIED) {
                const resultRequest = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                if (resultRequest === RESULTS.GRANTED) {
                    _handleSelectPhoto()
                } else {
                    _handleOpenSetting()
                }
            } else {
                _handleSelectPhoto()
            }
        } else {
            const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            if (result === RESULTS.GRANTED) {
                _handleSelectPhoto();
            } else if (result === RESULTS.DENIED) {
                const resultRequest = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
                if (resultRequest === RESULTS.GRANTED) {
                    _handleSelectPhoto()
                } else {
                    _handleOpenSetting()
                }
            } else {
                _handleSelectPhoto()
            }
        }
    };

    const _handleSelectPhoto = () => {
        imagePicker.launchLibrary({ multiple: true }, {
            onChooseImage: (response) => {
                if (response) {
                    try {
                        const arrImg = [...photos, ...response];
                        if (arrImg.length < 4) {
                            setPhotos(arrImg);
                        }
                        else
                            Toast.showWithGravity("Bạn chỉ được gửi tối đa 3 ảnh", Toast.SHORT, Toast.CENTER);

                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        });
    };

    const _handleUseCamera = () => {

        imagePicker.launchCamera(false, {
            onChooseImage: (response) => {
                if (response.path) {
                    console.log('response1111', response)
                    try {
                        if (photos.length < 3)
                            setPhotos([...photos, response])
                        else
                            Toast.showWithGravity("Bạn chỉ được gửi tối đa 3 ảnh", Toast.SHORT, Toast.CENTER);

                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        })
    }

    const _handleClickCamera = async () => {
        // 
        if (helpers.isIOS) {
            const result = await check(PERMISSIONS.IOS.CAMERA);
            if (result == RESULTS.GRANTED) {
                _handleUseCamera()
            } else if (result === RESULTS.DENIED) {
                const resultRequest = await request(PERMISSIONS.IOS.CAMERA);
                if (resultRequest === RESULTS.GRANTED) {
                    _handleUseCamera()
                } else {
                    _handleOpenSetting()
                }

            } else {
                _handleUseCamera()
            }
        } else {
            const result = await check(PERMISSIONS.ANDROID.CAMERA);
            if (result === RESULTS.GRANTED) {
                _handleUseCamera();
            } else if (result === RESULTS.DENIED) {
                const resultRequest = await request(PERMISSIONS.ANDROID.CAMERA);
                if (resultRequest === RESULTS.GRANTED) {
                    _handleUseCamera()
                } else {
                    _handleOpenSetting()
                }
            } else {
                _handleUseCamera()
            }
        }
    }

    const hanldeRemoveImg = (index) => {
        photos.splice(index, 1);

        setPhotos([...photos]);
    }

    const [loading, setLoading] = useState(false);

    const uploadQuestion = async () => {
        try {
            if (!questionContent) {
                Toast.showWithGravity("Vui lòng nhập nội dung câu hỏi", Toast.SHORT, Toast.CENTER);
                return 1;
            };
            const { cls = '', currSub = '' } = filter || {};
            if (!currSub) {
                Toast.showWithGravity("Vui lòng chọn môn học", Toast.SHORT, Toast.CENTER);
                return 1;
            };
            if (cls == 13) {
                Toast.showWithGravity("Vui lòng chọn lớp", Toast.SHORT, Toast.CENTER);
                return 1;
            }
            // 
            setLoading(true)
            // console.log('currSub=========', currSub)
            const body = {
                "grade": cls,
                "subject": currSub && currSub.id || '99',
                // subject: 1,
                "content": questionContent
            };
            // console.log('photosphotos', photos)
            if (photos[0]) {
                const dataUpload = new FormData();
                photos.map(file => {
                    if (file.path) {
                        dataUpload.append("img[]", {
                            uri: file.path,
                            name: get(file, 'filename', 'dd'),
                            type: 'multipart/form-data',
                        });
                    }
                });
                try {

                    const imageUpload = await services.uploadImage(dataUpload);
                    if (imageUpload && imageUpload.data) {
                        body.image = imageUpload.data;
                        const data = await api.post('/question', body);
                        if (data && data.question_id) {
                            props.navigation.navigate('QuestionDetail', { questionId: data.question_id, source: "QnA" })
                        }
                    }
                    setLoading(false)

                } catch (err) {
                    console.log('==== err', err)
                    setLoading(false)

                }
            } else {
                try {
                    const data = await api.post('/question', body);
                    if (data && data.question_id) {
                        props.navigation.navigate('QuestionDetail', { questionId: data.question_id, source: "QnA" })
                    }

                    setLoading(false)
                } catch (err) {
                    console.log('<err upload question>', err)

                    setLoading(false)
                }
            }

        } catch (err) {
            setLoading(false)
        }

    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1, position: 'relative' }}>
                {/* top */}
                <TollBar
                    leftAction={() => props.navigation.goBack()}
                    text="Đặt câu hỏi"
                    icon="close"
                    iconStyle={{ fontSize: 40 }}
                />
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', paddingHorizontal: 8,
                    borderTopColor: '#ddd', borderTopWidth: 1, paddingTop: 20,
                }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        marginBottom: 10,
                    }}>
                        <View style={styles.largeImgWapper} >
                            <Image style={userStyle.img} source={{ uri: get(userInfo, 'user.photo', '') }} />
                            {/* <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                                <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
                            </View> */}
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{userInfo.user.name}</Text>
                            <FilterTag {...{ filter, setFilter, setShowFilter }} />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setShowFilter(true)} style={styles.filter}>
                        <Icon style={styles.iconFilter} type="AntDesign" name="filter" />
                        {/* <Text style={styles.h2}> Lọc câu hỏi</Text> */}
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginBottom: 20 }}>
                    <ScrollView
                        // contentContainerStyle={{ flex: 1, backgroundColor: 'red' }}
                        // onPress={() => {
                        //     console.log('asdfasdfasfaf')
                        //     Keyboard.dismiss();
                        // }}
                        onScroll={() => Keyboard.dismiss()}
                        scrollEventThrottle={24}
                    >

                        {/* Form */}
                        <TextInput
                            value={questionContent}
                            onChangeText={val => setContent(val)}
                            ref={inputRef}
                            multiline
                            numberOfLines={4}
                            placeholder={`Hãy hỏi 1 câu duy nhất hoặc chia nhỏ câu hỏi để có lời giải nhanh nhất nhé `}
                            style={[{
                                maxHeight: height / 5,
                                borderBottomColor: '#efefef',
                                paddingBottom: 20,
                                borderBottomWidth: 1,
                                textAlignVertical: 'top',
                                fontSize: 18,
                                paddingHorizontal: 15,
                                marginTop: 15,
                                marginBottom: 10,
                                // backgroundColor: 'red'
                            }]}
                        />
                        {
                            photos[0] ? photos.map((photo, index) => {
                                return (
                                    <View key={photo.path} style={{
                                        height: get(photo, 'height', width / 2) * (width / get(photo, 'width', width / 2)),
                                        width,
                                        marginBottom: 20
                                    }}>
                                        <Image
                                            source={{ uri: photo.path }}
                                            style={{ flex: 1, width: undefined, height: undefined }}
                                        // resizeMode='contain'
                                        />
                                        <TouchableOpacity
                                            onPress={() => hanldeRemoveImg(index)}
                                            style={{
                                                position: 'absolute',
                                                backgroundColor: '#ddd', right: 0,
                                                // paddingHorizontal: 10, 
                                                justifyContent: 'center',
                                                height: 40, width: 40,
                                                alignItems: 'center', justifyContent: 'center', borderRadius: 40
                                            }}>
                                            <Icon name="close" style={{ color: 'red' }} />
                                        </TouchableOpacity>

                                    </View>
                                )
                            }) : null
                        }
                    </ScrollView>
                </View>
                {showKeyboad ?
                    <KeyboardStickyView style={{ backgroundColor: '#ddd' }}>
                        <View style={{
                            flex: 1,
                            width: width,
                            height: 55,
                            borderTopColor: '#dedede',
                            borderTopWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff',
                            paddingBottom: 15,
                            paddingTop: 5,
                        }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TouchableOpacity onPress={_handleClickPhoto} style={{ paddingHorizontal: 10, marginLeft: 15 }} >
                                    <Icon name="image" type='Entypo' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={_handleClickCamera} style={{ paddingHorizontal: 10 }} >
                                    <Icon name="camera" type='Entypo' />
                                </TouchableOpacity>
                            </View>
                            {
                                loading ? <ActivityIndicator color="#000" style={{ paddingRight: 20 }} /> :

                                    <TouchableOpacity style={{ paddingRight: 20 }} onPress={uploadQuestion}>
                                        <Icon name="ios-send" type="Ionicons" style={{ color: COLOR.MAIN }} />
                                    </TouchableOpacity>
                            }
                        </View>
                    </KeyboardStickyView> : null}
            </SafeAreaView>
            <FilterModal
                show={showFilter}
                onClose={() => setShowFilter(false)}
                setFilter={setFilter}
                filter={filter}
                showState={false}
                headerText="Thông tin câu hỏi"
                cancelAble={true}
                showAll={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingHorizontal: 10
    },
    headerText: {
        paddingVertical: 5,
        // textAlign: 'center',
        fontSize: 20,
        fontSize: 26,
        marginTop: 4,
        ...fontMaker({ weight: fontStyles.Bold })
    },
    head: {
        backgroundColor: '#fff'
    },
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
    h2: {
        fontSize: 18,
        color: '#555',
        ...fontMaker({ weight: fontStyles.Bold })
    },
    itemQ: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        padding: 10,
        // borderRadius: 10,
        marginTop: 10
    },
    itemHead: {
        fontSize: 17,
        color: '#555',
        marginBottom: 5,
        ...fontMaker({ weight: fontStyles.Bold }),

    },
    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    largeImgWapper: {
        height: 35, width: 35,
        borderRadius: 35,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    userComment: {
        flexDirection: 'row',
        marginTop: 7,
    },
    headerTag: {
        alignItems: 'center', flexDirection: 'row',
        paddingVertical: 4, paddingHorizontal: 7, alignSelf: 'baseline',
        backgroundColor: '#eee', borderRadius: 10,
        borderColor: '#ddd', borderWidth: 1
    },
    contentTag: {
        color: COLOR.black(0.7),
        fontSize: 12,
        ...fontMaker({ weight: fontStyles.SemiBold })
    },

})


export default QnA;

const userStyle = StyleSheet.create({
    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },

    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    userCount: {
        height: 25,
        // width: 25,
        paddingHorizontal: 5,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    img: { flex: 1, borderRadius: 25 },

    userComment: {
        flexDirection: 'row',
        // marginTop: 7,
    }
})


const FilterTag = ({ filter, setFilter, setShowFilter }) => {
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginTop: 3, paddingHorizontal: 1 }}>
                <TouchableOpacity onPress={() => {
                    if (filter.cls != 13) {
                        setFilter({ cls: '13', currSub: null })
                    } else {
                        setShowFilter(true);
                    }
                }} style={[styles.headerTag]}>
                    <Text style={styles.contentTag}>{filter.cls == 13 ? 'Tất cả các lớp' : `Lớp ${filter.cls}`}</Text>
                    {filter.cls != 13 &&
                        <View style={{ paddingLeft: 4, }}>
                            <Icon type='AntDesign' name='close' style={{ fontSize: 12, color: 'red' }} />
                        </View>
                    }
                </TouchableOpacity>
                {filter.currSub && filter.currSub.title ?
                    <TouchableOpacity onPress={() => setFilter({ ...filter, currSub: null })} style={[styles.headerTag, { marginLeft: 4 }]}>
                        <Text style={styles.contentTag}>{filter.currSub.title}</Text>
                        <View style={{}}>
                            <Icon type='AntDesign' name='close' style={{ fontSize: 12, color: 'red' }} />
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => setShowFilter(true)} style={[styles.headerTag, { marginHorizontal: 15 }]}>
                        <Text style={styles.contentTag}>Tất cả các môn</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        </View>
    )
}
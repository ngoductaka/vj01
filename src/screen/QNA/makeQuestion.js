import React, { useState, useEffect, useRef } from 'react';
import {
    View, FlatList, Text, StyleSheet, Platform, Alert,
    TouchableOpacity, Dimensions, Image, ScrollView, NativeEventEmitter,
    SafeAreaView, TextInput, Keyboard, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Icon, Button } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { get, debounce } from 'lodash';
import { RNCamera } from 'react-native-camera';
import { check, PERMISSIONS, RESULTS, openSettings, request } from 'react-native-permissions';

import Orientation from 'react-native-orientation-locker';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import firebase from 'react-native-firebase';

import { fontSize, COLOR, unitIntertitialId } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';

import { FilterModal, mapTypeQestion } from './com/FilterModal';
import KeyboardStickyView from '../../component/shared/StickeyKeyboad';
import imagePicker from '../../utils/imagePicker';
import ImagePickerCrop from "react-native-image-crop-picker";


import { TollBar } from './com/com';
import services from '../../handle/services';
import api from '../../handle/api';
import { helpers } from '../../utils/helpers';
import useDebounce from '../../utils/useDebounce';
import { search_services } from './service';
import { RenderQnAForImg } from '../../component/shared/ItemDocument';
import { cameraPermission } from '../../utils/permission';

const { width, height } = Dimensions.get('window');
const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";

const QnA = (props) => {
    const [resultSearch, setResultSearch] = useState([])
    const [path, setPath] = useState([])

    return (
        <SafeAreaView style={{ flex: 1, position: 'relative' }}>
            {resultSearch && resultSearch[0] ?
                <ResultView setPath={setPath} path={path} setResultSearch={setResultSearch} resultSearch={resultSearch} {...props} /> :
                <CameraView
                    setResultSearch={setResultSearch}
                    goBack={() => props.navigation.goBack()}
                    setPath={setPath}
                    goToTextQna={() => props.navigation.navigate('createTextQna')}
                />}
        </SafeAreaView>
    );
};

const ResultView = ({ setPath, path, resultSearch, setResultSearch, ...props }) => {
    const [activeSlide, setActiveSlide] = useState(0)
    const resultSearchFilter = React.useMemo(() => {
        return resultSearch.filter(i => !!get(i, 'answers[0].question_id'))
    }, [resultSearch]);

    console.log('resultSearchFilter', resultSearchFilter)
    return (
        <View style={{ paddingLeft: 8, position: 'relative', flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}><Icon type="AntDesign" name="left" /></TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10, marginLeft: 20 }}>Kết quả tìm kiếm: </Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
                {path ? <Image source={{ uri: path }} style={{ height: 100 }} resizeMode="contain" /> : null}
                <View style={{ flexDirection: 'row' }}>
                    {
                        new Array(resultSearchFilter.length).fill(0).map((_, index) => {
                            return <View style={{
                                height: 21, width: 21, borderRadius: 21, marginLeft: 5,
                                backgroundColor: activeSlide == index ? COLOR.MAIN : '#ddd', justifyContent: 'center', alignContent: 'center',
                            }}>
                                <Text style={{ textAlign: 'center' }}>{index + 1}</Text>
                            </View>
                        })
                    }
                </View>
                <Carousel
                    // ref={refCar}
                    data={resultSearchFilter}
                    onSnapToItem={index => setActiveSlide(index)}
                    renderItem={({ item, index }) => {
                        const {
                            content_vi: title = '',
                            class: grade = '',
                            subject: book = '',
                            subject: subject_name = "",
                            answers = []
                        } = item;
                        const questionId = get(item, 'answers[0].question_id');
                        if (!questionId) return null
                        return (
                            <RenderQnAForImg
                                onPress={() => {
                                    props.navigation.navigate('QuestionDetail', { questionId })
                                }}
                                {...{ title, grade: "Lớp " + grade, book: subject_name, answers, index }}
                            />
                        )
                    }}
                    sliderWidth={width}
                    parallaxFactor={0.4}
                    itemWidth={width}
                    layoutCardOffset={`18`}
                />
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 6 }}>
                <TouchableOpacity style={{
                    paddingVertical: 10, paddingHorizontal: 30, flexDirection: 'row',
                    alignItems: 'center', backgroundColor: '#fff', borderRadius: 20
                }} onPress={() => {
                    setResultSearch([]);
                    setPath('')
                }}>
                    <Icon name="camera" style={{ color: COLOR.MAIN }} />
                    <Text style={{ color: COLOR.MAIN, fontWeight: 'bold', fontSize: 16, marginLeft: 7 }}>Chụp lại</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    paddingVertical: 10, paddingHorizontal: 30, flexDirection: 'row',
                    backgroundColor: COLOR.MAIN,
                    alignItems: 'center', borderRadius: 20
                }} onPress={() => { props.navigation.navigate('createTextQna') }}>
                    <Icon type="MaterialCommunityIcons" name="pen-plus" style={{ color: '#fff' }} />
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 7 }}>Đặt câu hỏi</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const CameraView = ({ setResultSearch, goBack, goToTextQna = () => { }, setPath }) => {

    const camera = useRef(null);

    const [loading, setLoading] = useState(false)
    const [orientation, setOrientation] = useState('NORMAL')

    useEffect(() => {
        // Orientation.unlockAllOrientations();
        Orientation.getOrientation(_handleOrientation);
        // // Orientation.getDeviceOrientation(_handleOrientation);
        Orientation.addOrientationListener(_handleOrientation)
        return () => {
            Orientation.removeOrientationListener(_handleOrientation)
            Orientation.lockToPortrait();
        }
    }, []);

    const _handleOrientation = (val) => {
        console.log('val_handleOrientation', val)
        if (val == 'LANDSCAPE-LEFT' || val == 'LANDSCAPE-RIGHT') {
            setOrientation(val)
        } else {
            setOrientation('NORMAL')
        }
    }
    console.log('orientation', orientation)


    const takePicture = async () => {
        if (camera && camera.current) {
            const options = { quality: 0.5, base64: true };
            const data = await camera.current.takePictureAsync(options);
            console.log(data.uri, '=====dnd');
            ImagePickerCrop.openCropper({

                freeStyleCropEnabled: true,

                width: 350,
                height: 100,
                path: data.uri,
            }).then(image => {
                console.log('image123ee', image)
                _handleUploadImg(image)
            });
        }
    };

    const _handleUploadImg = async (file) => {
        try {
            if (file && file.path) {
                setPath(file.path)
                setLoading(true)
                const dataUpload = new FormData();
                dataUpload.append("file", { uri: file.path, name: get(file, 'filename', 'dnd.jpg'), type: 'multipart/form-data', });

                const data = await services.uploadFile('http://45.117.82.169:5411/api/vj/extracteq', dataUpload);

                const result = get(data, 'data.result.lines', '');
                if (result && result[0]) {
                    const resultLine = result.reduce((car, cur) => `${car} \n ${cur}`);
                    console.log({ resultLine })
                    handleSearch({ questionContent: resultLine })
                } else {
                    Alert.alert(
                        "Không có dữ liệu",
                        "Không ghi nhận dữ liệu từ ảnh ảnh",
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ]
                    );
                    setLoading(false)
                }
            } else {
                Alert.alert(
                    "Không có dữ liệu",
                    "Không ghi nhận dữ liệu từ ảnh ảnh",
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
                setLoading(false)
                console.log("No img")
            }
        } catch (err) {
            setLoading(false)
            console.log('err', err)
            Alert.alert(
                "Có lỗi!",
                "Ảnh không thể upload vui lòng thử lại sau",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        }
    }

    const handleSearch = ({ questionContent }) => {
        setLoading(true)
        api.post('http://45.117.82.169:9998/search_raw', {
            text: questionContent
        })
            .then(({ response }) => {
                // console.log('response123', response)
                setResultSearch(response);
            })
            .catch(err => {
                console.log(err)
                Alert.alert(
                    "Có lỗi!",
                    "Ảnh không tìm thấy kết quả tìm kiếm",
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
            })
            .finally(() => {
                setLoading(false)
            })
    };
    const _handleSelectPhoto = () => {
        imagePicker.launchLibrary({}, {
            onChooseImage: (response) => {
                _handleUploadImg(response)
            }
        });
    };
    return (
        <View style={[styles.container, { backgroundColor: '#fff' }]}>
          
            <RNCamera
                ref={camera}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                androidRecordAudioPermissionOptions={{
                    title: 'Permission to use audio recording',
                    message: 'We need your permission to use your audio',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
            // onGoogleVisionBarcodesDetected={({ barcodes }) => {
            //     console.log(barcodes);
            // }}
            />
            {/* {orientation == "NORMAL" ? <View style={{position: ''}}>
                <View style={{ height: 1, backgroundColor: '#fff', width: 60, position: 'absolute', top: (height - (orientation == 'NORMAL' ? 100 : 50)) / 2, left: (width - 60) / 2 }} />
                <View style={{ width: 1, backgroundColor: '#fff', height: 60, position: 'absolute', top: (height - (orientation == 'NORMAL' ? 160 : 110)) / 2, left: (width) / 2 }} />
            </View> : null} */}
            {loading ? <View style={{
                justifyContent: 'center', alignItems: 'center',
                position: 'absolute',
                // bottom: height / 2 - 200,
                bottom: 0,
                borderRadius: 10,
                width: width,
                backgroundColor: '#fff',
                paddingHorizontal: 30, paddingVertical: 20, paddingBottom: 40
            }}>
                <ActivityIndicator size="large" style={{ marginBottom: 20 }} />
                <Text>Đang xử lý dữ liệu ảnh</Text>
                <Text>Vui lòng chờ trong giây lát</Text>
            </View> :
                <View style={styles[`${orientation}_wrapper`]}>
                    <TouchableOpacity onPress={_handleSelectPhoto}
                        style={styles[`${'NORMAL'}_btnPhoto`]}
                    >
                        <Icon type="FontAwesome" name="photo" style={{ color: COLOR.MAIN }} />
                        <Text style={{ color: COLOR.MAIN, marginTop: 2 }}>Chọn ảnh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takePicture} style={[styles[`NORMAL_btn_search`]]}>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goToTextQna} style={styles[`${'NORMAL'}_btnText`]}>
                        <Icon type="MaterialCommunityIcons" name="pen-plus" style={{ color: COLOR.MAIN }} />
                        <Text style={{ color: COLOR.MAIN, marginTop: 2 }}>Đặt câu hỏi</Text>
                    </TouchableOpacity>
                </View>
                // <Btn {...{ orientation, takePicture, _handleSelectPhoto, goToTextQna }} />
            }
            <TouchableOpacity onPress={goBack} style={styles[`${orientation}_btn_close`]}>
                <Icon type="AntDesign" name="close" style={{ color: COLOR.MAIN }} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        position: 'relative',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    btnSnap: {
        height: 70, width: 70, borderRadius: 70,
        backgroundColor: '#eee',
        position: 'absolute',
        bottom: 35, left: width / 2 - 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLOR.MAIN
    },
    // left
    'LANDSCAPE-LEFT_btn_search': {
        height: 70, width: 70, borderRadius: 70,
        backgroundColor: '#eee',
        position: 'absolute',
        bottom: height / 2 - 50, right: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLOR.MAIN
    },
    'LANDSCAPE-LEFT_btnPhoto': {
        position: 'absolute',
        bottom: 10, right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    'LANDSCAPE-LEFT_btnText': {
        position: 'absolute',
        bottom: height - 90, right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    'LANDSCAPE-LEFT_btn_close': {
        height: 60, width: 60, borderRadius: 60,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLOR.MAIN,
        position: 'absolute',
        left: 10, top: 20, height: 40, width: 40, borderRadius: 40,
    },
    // right
    'LANDSCAPE-RIGHT_btn_search': {
        height: 70, width: 70, borderRadius: 70,
        backgroundColor: '#eee',
        position: 'absolute',
        bottom: height / 2 - 50,
        left: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLOR.MAIN
    },
    'LANDSCAPE-RIGHT_btnPhoto': {
        position: 'absolute',
        bottom: 10, left: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    'LANDSCAPE-RIGHT_btnText': {
        position: 'absolute',
        bottom: height - 90, left: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    'LANDSCAPE-RIGHT_btn_close': {
        height: 60, width: 60, borderRadius: 60,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLOR.MAIN,
        position: 'absolute',
        right: 10, top: 20, height: 40, width: 40, borderRadius: 40,
    },

    // nomal
    'NORMAL_btnText': {
        // height: 50, width: 50, borderRadius: 50,
        // backgroundColor: '#eee',
        // position: 'absolute',
        // bottom: 30, right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: COLOR.MAIN
    },
    NORMAL_btn_close: {
        height: 60, width: 60, borderRadius: 60,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLOR.MAIN,
        position: 'absolute', left: 10, top: 20, height: 40, width: 40, borderRadius: 40,
    },
    NORMAL_btn_search: {
        height: 70, width: 70, borderRadius: 70,
        backgroundColor: COLOR.MAIN,
        // position: 'absolute',
        // bottom: 35, left: width / 2 - 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff'
    },
    NORMAL_btnPhoto: {
        // position: 'absolute',
        // bottom: 10, left: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    NORMAL_wrapper: {
        position: 'absolute', bottom: 20, left: 10, right: 10,
        justifyContent: 'space-between',
        flexDirection: 'row', alignItems: 'flex-end'
    },
    'LANDSCAPE-LEFT_wrapper': {
        position: 'absolute', bottom: 20, right: 10, top: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    'LANDSCAPE-RIGHT_wrapper': {
        position: 'absolute', bottom: 10, left: 20, top: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },

})




export default QnA;

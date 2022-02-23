import React, { useState, useEffect, useRef } from 'react';
import {
    View, FlatList, Text, StyleSheet, Platform, Alert,

    TouchableOpacity, Dimensions, Image, ScrollView, NativeEventEmitter,
    SafeAreaView, TextInput, Keyboard, ActivityIndicator, useWindowDimensions, Pressable,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Icon, Button } from 'native-base';
import { get, debounce } from 'lodash';
import { RNCamera } from 'react-native-camera';
import { CropView } from 'react-native-image-crop-tools';
import * as ImagePicker from "react-native-image-picker"
import ModalBox from 'react-native-modalbox';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { connect, useDispatch } from 'react-redux';

import { fontSize, COLOR, unitIntertitialId } from '../../handle/Constant';
// import imagePicker, { optionDefault } from '../../utils/imagePicker';
// import ImagePickerCrop from "react-native-image-crop-picker";

import services from '../../handle/services';
import api from '../../handle/api';

import { RenderQnAForImg } from '../../component/shared/ItemDocument';
import { images } from '../../utils/images';
import { getItem, KEY } from '../../handle/handleStorage';
import { endpoints } from '../../constant/endpoints';
import BannerAd from '../../component/shared/BannerAd';
import { helpers } from '../../utils/helpers';
const { width, height } = Dimensions.get('window');

const QnA = (props) => {
    const [resultSearch, setResultSearch] = useState([])
    const [path, setPath] = useState();
    const [dataHis, setDataHis] = useState([])

    useEffect(() => {
        Toast.showWithGravity("Chỉ chụp 1 câu hỏi", Toast.LONG, Toast.CENTER);
        console.log('userInfo123', props.userInfo.user)

        _handleFetchHis()
    }, [])


    const _handleFetchHis = async () => {
        const data = await getItem(KEY.saved_user);
        api.get(`/qa-user/history/${data.id}/image-search?page=0&limit=5`)
            .then(({ data }) => {
                setDataHis(data);
                console.log('data00', data)
            })
    }

    const _saveHis = async ({ imgData, response }) => {
        try {
            const dataUpload = new FormData();
            dataUpload.append("file", { uri: imgData.uri, name: get(imgData, 'filename', 'dnd.jpg'), type: 'multipart/form-data' });
            dataUpload.append("user_id", props.userInfo.user.id);
            const data = await services.uploadFile(`${endpoints.hoi_dap_api}/api/v1/media/upload-image-search`, dataUpload);
            // console.log('data234', data)
        } catch (err) {
            console.log('err_saveHis', err)
        }
    }
    // 
    const navigationToResult = (result) => {
        if (result && result[0]) {
            props.navigation.navigate('ResultView', { path, resultSearch: result })
            setPath('');
            setResultSearch([])
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, position: 'relative', backgroundColor: '#fff' }}>
            {/* {resultSearch && resultSearch[0] ?
                <ResultView setPath={setPath} path={path} setResultSearch={setResultSearch} resultSearch={resultSearch} {...props} /> : */}
            <CameraView
                setResultSearch={setResultSearch}
                goBack={() => props.navigation.goBack()}
                setPath={setPath}
                dataHis={dataHis}
                _saveHis={_saveHis}
                navigationToResult={navigationToResult}
                goToTextQna={() => props.navigation.navigate('createTextQna')}
            />
            {/* } */}
        </SafeAreaView>
    );
};

export const ResultView = ({ navigation }) => {

    const path = navigation.getParam('path', '');
    const resultSearch = navigation.getParam('resultSearch', '');

    const scrollRef = useRef();

    const [activeSlide, setActiveSlide] = useState(0)
    const resultSearchFilter = React.useMemo(() => {
        return resultSearch.filter(i => !!get(i, 'answers[0].question_id'))
    }, [resultSearch]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ paddingLeft: 8, position: 'relative', flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}><Icon type="AntDesign" name="left" /></TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10, marginLeft: 20 }}>Kết quả tìm kiếm: </Text>
                </View>
                {path ? <Image source={{ uri: path }} style={{ height: 100 }} resizeMode="contain" /> : null}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingHorizontal: 10 }}>
                    <TouchableOpacity style={{
                        paddingVertical: 5, paddingHorizontal: 8,
                        backgroundColor: COLOR.MAIN,
                        borderRadius: 10, flexDirection: 'row', alignItems: 'center'
                    }} onPress={() => {
                        scrollRef.current.snapToPrev()
                    }}>
                        <Icon type="AntDesign" name="left" style={{ fontSize: 17, marginRight: 5, color: '#fff' }} />
                        <Text style={{ color: '#fff' }}>Pre</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        paddingHorizontal: 8,
                        backgroundColor: COLOR.MAIN,
                        borderRadius: 10, flexDirection: 'row', alignItems: 'center'
                    }} onPress={() => {
                        scrollRef.current.snapToNext()
                    }}>
                        <Text style={{ color: '#fff' }}>Next</Text>
                        <Icon type="AntDesign" name="right" style={{ fontSize: 17, marginLeft: 5, color: '#fff' }} />
                    </TouchableOpacity>
                </View>
                <Carousel
                    scrollEnabled={false}
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
                                    navigation.navigate('QuestionDetail', { questionId })
                                }}
                                {...{ title, grade: "Lớp " + grade, book: subject_name, answers, index }}
                            />
                        )
                    }}
                    ref={scrollRef}
                    sliderWidth={width}
                    parallaxFactor={0.4}
                    itemWidth={width}
                    layoutCardOffset={`18`}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 6 }}>
                    <TouchableOpacity style={{
                        paddingVertical: 10, paddingHorizontal: 30, flexDirection: 'row',
                        alignItems: 'center', backgroundColor: '#fff', borderRadius: 20
                    }} onPress={() => {
                        navigation.navigate('MakeQuestion');
                    }}>
                        <Icon name="camera" style={{ color: COLOR.MAIN }} />
                        <Text style={{ color: COLOR.MAIN, fontWeight: 'bold', fontSize: 16, marginLeft: 7 }}>Chụp lại</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        paddingVertical: 10, paddingHorizontal: 30, flexDirection: 'row',
                        backgroundColor: COLOR.MAIN,
                        alignItems: 'center', borderRadius: 20
                    }} onPress={() => { navigation.navigate('createTextQna') }}>
                        <Icon type="MaterialCommunityIcons" name="pen-plus" style={{ color: '#fff' }} />
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 7 }}>Đặt câu hỏi</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const CameraView = ({
    dataHis = [],
    setResultSearch,
    goBack,
    _saveHis = () => { },
    goToTextQna = () => { },
    navigationToResult = () => { },
    setPath
}) => {
    const camera = useRef(null);
    const cropViewRef = useRef(null);
    const [loading, setLoading] = useState(false)
    const [showBanner, setShowBanner] = useState(false)
    const [showHelper, setShowHelper] = useState(false)
    const [showHis, setShowHis] = useState(false)
    const [showNote, setShowNote] = useState(true)
    const [url, setUrl] = useState('')
    const [response, setResponse] = useState(null)
    const [loadImg, setLoadImg] = useState(false);

    const takePicture = async () => {
        try {
            if (camera && camera.current) {
                setLoadImg(true)
                const options = {};
                const data = await camera.current.takePictureAsync(options);
                setLoadImg(false);
                setUrl(data.uri)
            }
        } catch (err) {
            setLoadImg(false);
        }
    };

    const _handleUploadImg = async (file) => {
        try {
            if (file && file.uri) {
                setPath(file.uri)
                setLoading(true)
                const dataUpload = new FormData();
                dataUpload.append("file", { uri: file.uri, name: get(file, 'filename', 'dnd.jpg'), type: 'multipart/form-data', });

                const data = await services.uploadFile('http://45.117.82.169:5411/api/vj/extracteq', dataUpload);

                const result = get(data, 'data.result.lines', '');
                if (result && result[0]) {
                    const resultLine = result.reduce((car, cur) => `${car} \n ${cur}`);
                    handleSearch({ questionContent: resultLine, imgData: { uri: file.uri, name: get(file, 'filename', 'dnd.jpg') } })
                } else {
                    Alert.alert(
                        "Không có dữ liệu",
                        "Không ghi nhận dữ liệu từ ảnh ảnh",
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ]
                    );
                    setLoading(false);
                    setLoadImg(false);
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
                setLoadImg(false);
                console.log("No img")
            }
        } catch (err) {
            setLoading(false);
            setLoadImg(false);
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
    const handleSearch = ({ questionContent, imgData }) => {
        setShowBanner(true);
        setLoading(true)
        api.post('http://45.117.82.169:9998/search_raw', {
            text: questionContent
            // text: "Đề bài: Tìm điều kiện của n để A  chia hết B A= $14x^{8}y^{n}$ B= $-7x^{7}y^{4}$"
        })
            .then(({ response }) => {
                // console.log('handleSearch_search_raw', {response, questionContent});
                setResponse(response);
                if (imgData) {
                    _saveHis({ imgData, response })
                }
            })
            .catch(err => {
                setShowBanner(false);
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
                setLoading(false);
                setLoadImg(false);
            })
    };
    const _handleSelectPhoto = () => {
        ImagePicker.launchImageLibrary({ noData: true }, response => {
            const uriData = get(response, 'assets[0].uri', null);
            if (uriData) {
                setUrl(response.assets[0].uri);
            } else {
                Alert.alert(
                    "Có lỗi!",
                    "Ảnh không ghi nhận dữ liệu ảnh",
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );

            }
        });
    };


    const _handleSearchImgLink = (link) => {

        setLoading(true)
        setShowHis(false);
        // const textSearch = ''
        // handleSearch(textSearch, null)
    }

    const _setShowResult = () => {
        setShowBanner(false);
        if (response) {
            setLoading(false);
            setShowBanner(false);
            setShowHelper(false);
            setShowHis(false);
            setUrl('');
            setResponse(null);
            navigationToResult(response);
        }

    }
    return (
        <View style={[styles.container, { backgroundColor: '#fff' }]}>
            {!url ? <RNCamera
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
            /> :
                <CropView
                    sourceUrl={url}
                    style={{ flex: 1 }}
                    ref={cropViewRef}
                    onImageCrop={(file) => {
                        _handleUploadImg(file)
                    }}
                    aspectRatio={{ width: 16, height: 5 }}
                />}
            {showBanner ? <View style={{
                justifyContent: 'space-between', alignItems: 'center',
                position: 'absolute',
                bottom: 0, top: 90,
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                width: width,
                backgroundColor: '#fff',
                paddingHorizontal: 30, paddingVertical: 20, paddingBottom: 80, paddingTop: 20
            }}>
                <View>
                    <Text style={{ fontSize: 21, textAlign: 'center', marginTop: 10 }}>
                        Vietjack luôn cải thiện tính năng tìm kiếm chính xác hơn thông qua từ phí quảng cáo
                    </Text>
                </View>
                <BannerAd type={0} />
                {loading ? <View>
                    <ActivityIndicator size="large" color={COLOR.MAIN} style={{
                        marginBottom: 20,
                        marginTop: 10
                    }} />
                    <Text style={{ fontSize: 20 }}>Đang xử lý dữ liệu ảnh</Text>
                    <Text>Vui lòng chờ trong giây lát</Text>
                </View> :
                    <View style={{ alignSelf: 'stretch' }}>
                        <TouchableOpacity style={{
                            paddingVertical: 10,
                            // alignSelf: 'flex-start',
                            // flex: 1,
                            // paddingHorizontal: 30,
                            //  flexDirection: 'row',
                            backgroundColor: COLOR.MAIN,
                            // alignItems: 'center', 
                            borderRadius: 10
                        }} onPress={() => {
                            _setShowResult()
                        }}>
                            <Text style={{
                                color: '#fff', textAlign: 'center',
                                fontWeight: 'bold', fontSize: 16, marginLeft: 7
                            }}>Xem kết quả</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View> :
                (!url ? <View style={styles[`${'NORMAL'}_wrapper`]}>
                    <TouchableOpacity onPress={_handleSelectPhoto}
                        style={styles[`${'NORMAL'}_btnPhoto`]}
                    >
                        <Icon type="FontAwesome" name="photo" style={{ color: COLOR.MAIN }} />
                        <Text style={{ color: COLOR.MAIN, marginTop: 2 }}>Chọn ảnh</Text>
                    </TouchableOpacity>
                    {loadImg ? <ActivityIndicator color={COLOR.MAIN} size={'large'} /> : <TouchableOpacity onPress={takePicture} style={[styles[`NORMAL_btn_search`]]}></TouchableOpacity>}
                    <TouchableOpacity onPress={goToTextQna} style={styles[`${'NORMAL'}_btnText`]}>
                        <Icon type="MaterialCommunityIcons" name="pen-plus" style={{ color: COLOR.MAIN }} />
                        <Text style={{ color: COLOR.MAIN, marginTop: 2 }}>Đặt câu hỏi</Text>
                    </TouchableOpacity>
                </View> :
                    <View style={styles[`${'NORMAL'}_wrapper`]}>
                        <TouchableOpacity onPress={() => setUrl('')} style={styles[`${'NORMAL'}_btnText`]}>
                            <Icon type="MaterialCommunityIcons" name="close" style={{ color: COLOR.MAIN }} />
                            <Text style={{ color: COLOR.MAIN, marginTop: 2 }}>Chụp ảnh khác</Text>
                        </TouchableOpacity>
                        <TouchableOpacity loading={loadImg} onPress={() => {
                            if (cropViewRef.current && !loadImg) {
                                setLoadImg(true)
                                cropViewRef.current.saveImage(true, 30)
                            } else {
                                Alert.alert(
                                    "Có lỗi!",
                                    "cropViewRef errors lỗi không mong luôn",
                                    [
                                        { text: "OK", onPress: () => console.log("OK Pressed") }
                                    ]
                                );
                            }
                        }}
                            style={styles[`${'NORMAL'}_btnPhoto`]}
                        >
                            {loadImg ? <ActivityIndicator color={COLOR.MAIN} size={'large'} /> : <Icon type="FontAwesome" name="check" style={{ color: COLOR.MAIN }} />}
                            <Text style={{ color: COLOR.MAIN, marginTop: 2 }}>Chọn ảnh</Text>
                        </TouchableOpacity>

                    </View>)
            }
            <TouchableOpacity onPress={goBack} style={styles[`${'NORMAL'}_btn_close`]}>
                <Icon type="AntDesign" name="closecircleo" style={{ color: COLOR.MAIN }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowHelper(true)} style={styles[`NORMAL_btn_help`]}>
                <Icon type="help" name="Entypo" style={{ color: COLOR.MAIN }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowHis(true) }} style={styles[`NORMAL_btn_his`]}>
                <Icon type="FontAwesome" name="history" style={{ color: COLOR.MAIN }} />
            </TouchableOpacity>

            <ModalBox
                onClosed={() => setShowNote(false)}
                isOpen={showNote}
                animationDuration={300}
                coverScreen={true}
                backdropPressToClose={true}
                swipeToClose={false}
                backdropColor='rgba(0, 0, 0, .7)'
                style={{
                    width: width - 30, height: width - 20, borderRadius: 15,
                    borderTopRightRadius: 15, overflow: 'hidden', paddingTop: 5
                }}
                position='center'
            >
                <TouchableOpacity onPress={() => setShowNote(false)} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end', marginRight: 20, marginTop: 10 }}>
                    <Icon name={'close'} type="AntDesign" />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24, marginTop: 10, marginBottom: 20 }}>Tính năng thử nghiệm</Text>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, fontWeight: '400', margin: 20, marginTop: 0 }}>
                        * Kết quả tìm kiếm từ ảnh vẫn đang được hoàn thiện để đạt độ chính xác cao hơn
                    </Text>
                    <Text style={{ fontSize: 17, fontWeight: '400', margin: 20, marginTop: 0 }}>
                        * Vui lòng chụp ảnh thẳng và rõ nét để có kết qủa tốt nhất
                    </Text>
                    <Text style={{ fontSize: 17, fontWeight: '400', margin: 20, marginTop: 0 }}>
                        * Nếu chưa có kết quả mong muốn vui lòng "Đặt câu hỏi" để nhận giải đáp từ gia sư
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Pressable style={{ marginRight: 25, marginBottom: 20 }} onPress={() => setShowNote(false)}><Text style={{ fontSize: 18, fontWeight: '500' }}>OK</Text></Pressable>
                </View>
            </ModalBox>

            <ModalBox
                onClosed={() => setShowHelper(false)}
                isOpen={showHelper}
                animationDuration={300}
                coverScreen={true}
                backdropPressToClose={true}
                swipeToClose={false}
                backdropColor='rgba(0, 0, 0, .7)'
                style={{
                    width: width, height: height - 100, borderTopLeftRadius: 15,
                    borderTopRightRadius: 15, overflow: 'hidden', paddingTop: 5
                }}
                position='bottom'
            >
                <ScrollView>
                    <TouchableOpacity onPress={() => setShowHelper(false)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name={'down'} type="AntDesign" />
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>Tip tìm kiếm hiệu quả</Text>
                    <View>
                        <Text style={{ fontSize: 17, fontWeight: '400', margin: 20 }}>01. Chụp ảnh rõ nét và thẳng </Text>
                        <Image style={{ height: width, width: width }} source={images.cut_img}
                        // source={{ uri: 'https://im2.ezgif.com/tmp/ezgif-2-6b257f041a56.gif' }}
                        />
                        <Text style={{ fontSize: 17, fontWeight: '400', margin: 20 }}>02. chỉ cắt 1 câu hỏi mà bạn muốn tìm kiếm để đạt hiệu quả cao nhất</Text>
                    </View>
                </ScrollView>
            </ModalBox>
            <ModalBox
                onClosed={() => setShowHis(false)}
                isOpen={showHis}
                animationDuration={300}
                coverScreen={true}
                backdropPressToClose={true}
                swipeToClose={false}
                backdropColor='rgba(0, 0, 0, .7)'
                style={{
                    width: width, height: height - 100, borderTopLeftRadius: 15,
                    borderTopRightRadius: 15, overflow: 'hidden', paddingTop: 5
                }}
                position='bottom'
            >
                <ScrollView>
                    <TouchableOpacity onPress={() => setShowHis(false)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name={'down'} type="AntDesign" />
                    </TouchableOpacity>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>Lịch sử tìm kiếm</Text>
                    <View>
                        <FlatList
                            data={dataHis}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity onPress={() => { _handleSearchImgLink(item.url) }}>
                                        <Text style={{ marginLeft: 10, fontSize: 18, marginTop: 16 }}>{index + 1}.</Text>
                                        <View style={{ height: 100, marginTop: 5, marginHorizontal: 5 }}>
                                            <Image style={{ height: null, width: null, flex: 1 }} source={{ uri: item.url }} />
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                            keyExtractor={(item) => item.path}
                            extraData={dataHis}
                        />
                    </View>
                </ScrollView>
            </ModalBox>
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
    'NORMAL_btn_help': {
        height: 60, width: 60, borderRadius: 60,
        // backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: COLOR.MAIN,
        position: 'absolute',
        right: 10, top: 20, height: 40, width: 40, borderRadius: 40,

    },
    'NORMAL_btn_his': {
        height: 60, width: 60, borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 60, top: 20, height: 40, width: 40, borderRadius: 40,

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
        height: 70, width: 70, borderRadius: 70,
        // backgroundColor: '#eee',
        // justifyContent: 'center',
        // alignItems: 'center',
        // borderWidth: 2,
        // borderColor: COLOR.MAIN,
        position: 'absolute', left: 20, top: 30, height: 40, width: 40, borderRadius: 40,
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




export default connect(
    (state) => ({
        userInfo: state.userInfo,
    }),
    () => { }
)(QnA);

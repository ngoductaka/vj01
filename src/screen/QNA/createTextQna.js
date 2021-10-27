import React, { useState, useEffect, useRef } from 'react';
import {
    View, FlatList, Text, StyleSheet, Platform, Alert,
    TouchableOpacity, Dimensions, Image, ScrollView,
    SafeAreaView, TextInput, Keyboard, ActivityIndicator
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Icon } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { get, debounce } from 'lodash';
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
import useDebounce from '../../utils/useDebounce';
import { search_services } from './service';
import { RenderQnASearch } from '../../component/shared/ItemDocument';
import { cameraPermission } from '../../utils/permission';

const { width, height } = Dimensions.get('window');
const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";

const QnA = (props) => {

    const inputRef = useRef(null);

    const [filter, setFilter] = useState({ cls: 13 });
    const [showFilter, setShowFilter] = useState(false);
    const [questionContent, setContent] = useState('');
    const [photos, setPhotos] = useState([]);
    const [resultSearch, setResultSearch] = useState([])
    const [loading, setLoading] = useState(false);

    const userInfo = useSelector(state => state.userInfo);
    const current_class = useSelector(state => state.userInfo.class);

    useEffect(() => { setFilter({ cls: current_class }) }, [current_class])

    // useEffect(() => {
    //     if (questionContent) {
    //         handleSearchDebounce({ questionContent, filter })
    //     }
    // }, [questionContent, filter]);



    const _requestSearch = ({ questionContent, filter }) => {
        const { cls = '', currSub = '' } = filter || {};
        const query = { grade_id: cls == 13 ? '' : cls };
        if (currSub && currSub.id) {
            query.subject_id = currSub.id
        }
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
                // Toast.showWithGravity("Load câu hỏi lỗi!", Toast.SHORT, Toast.CENTER);
            })
            .finally(() => {
                setLoading(false)
            })

    }

    const handleSearchDebounce = React.useCallback(debounce(_requestSearch, 10000), []);

    useEffect(() => {
        // _handleClickCamera()
    }, []);

    const _handleClickPhoto = () => photoPermission({ next: _handleSelectPhoto })
    const _handleClickCamera = () => cameraPermission({ next: _handleUseCamera })

    const _handleUploadImg = async (file) => {
        try {
            const dataUpload = new FormData();
            if (file.path) {
                dataUpload.append("file", {
                    uri: file.path,
                    name: get(file, 'filename', 'dnd.jpg'),
                    type: 'multipart/form-data',
                });
                // dataUpload.append("list_equation_boxes", []);
                // http://45.117.82.169:5411/api/vj/extracteq?file

                const data = await services.uploadFile('http://45.117.82.169:5411/api/vj/extracteq', dataUpload);
                // console.log("dat242423a", data);

                const result = get(data, 'data.result.lines', '');
                if (result && result[0]) {
                    setContent(result.reduce((car, cur) => `${car} \n ${cur}`))
                }
            } else {
                alert("dnd err")
            }
        } catch (err) {
            console.log('err dsfadsfasfdupload', get(err, 'data[0]', ''), err)
            const result = get(err, 'data[0].data.result.lines', '');
            if (result && result[0]) {
                setContent(result.reduce((car, cur) => `${car} \n ${cur}`))
            }
        }
    }


    const _handleSelectPhoto = () => {
        imagePicker.launchLibrary({}, {
            onChooseImage: (response) => {
                if (response) {
                    try {
                        // setPhotos([...photos, response])
                        setPhotos([response])
                        _handleUploadImg(response)
                        // const arrImg = [...photos, response];
                        // if (arrImg.length < 2) {
                        //     setPhotos(arrImg);
                        // }
                        // else
                        //     Toast.showWithGravity("Bạn chỉ được chọn 1 ảnh", Toast.SHORT, Toast.CENTER);

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
                        setPhotos([response])
                        _handleUploadImg(response)
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        })
    }

    const hanldeRemoveImg = (index) => {
        photos.splice(index, 1);
        setPhotos([...photos]);
    }


    const uploadQuestion = async () => {
        try {
            if (!questionContent) {
                Toast.showWithGravity("Vui lòng nhập nội dung câu hỏi", Toast.SHORT, Toast.CENTER);
                return 1;
            };
            const { cls = '', currSub = '' } = filter || {};
            if (!get(currSub, 'id')) {
                Toast.showWithGravity("Vui lòng chọn môn học", Toast.SHORT, Toast.CENTER);
                setTimeout(() => {
                    setShowFilter(true)
                }, 500)
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
                "subject": currSub && currSub.id || 31,
                // subject: 1,
                "content": questionContent
                    .replace(/&/g, "&amp;")
                    .replace(/>/g, "&gt;")
                    .replace(/</g, "&lt;")
                    .replace(/"/g, "&quot;")
            };
            // console.log('photosphotos', photos)

            if (photos[0]) {
                const dataUpload = new FormData();
                photos.map(file => {
                    if (file.path) {
                        dataUpload.append("img[]", {
                            uri: file.path,
                            name: get(file, 'filename', 'dd.jpg'),
                            type: 'multipart/form-data',
                        });
                    }
                });
                try {
                    const imageUpload = await services.uploadImage(dataUpload);
                    if (imageUpload && imageUpload.data) {
                        body.image = imageUpload.data;
                    }

                    _handleCreateQuestion(body)

                } catch (err) {
                    console.log('==== err', err)
                    _handleCreateQuestion(body)

                }
            } else {
                _handleCreateQuestion(body)
            }

        } catch (err) {
            setLoading(false);
        }

    }

    const _handleCreateQuestion = async (body) => {
        try {
            const data = await api.post('/question', body);
            // console.log('da24143ta', data)
            if (!data) return 0;
            if (!data.status) {
                Alert.alert(
                    "Quá số lượng câu hỏi",
                    "Bạn có thử chức năng chụp ảnh giải bài tập", [{ text: "OK", onPress: () => props.navigation.goBack() }]
                );
                return 0;
            }
            if (data.question_id) {
                props.navigation.navigate('QuestionDetail', { questionId: data.question_id, source: "QnA" })
            }
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.log('<err upload question>', err)
            Toast.showWithGravity("Đặt câu hỏi thất bại, vui lòng thử lại sau", Toast.SHORT, Toast.CENTER);
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
                    {/* <TouchableOpacity onPress={() => setShowFilter(true)} style={styles.filter}>
                        <Icon style={styles.iconFilter} type="AntDesign" name="filter" />
                    </TouchableOpacity> */}
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView
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
                            style={[styles.inputQnA, styles.shadow]}
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
                        {
                            resultSearch && resultSearch[0] ?
                                <View style={{ paddingLeft: 8 }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Có thể bạn đang tìm: </Text>
                                    {
                                        resultSearch.map((item, index) => {
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
                                                <RenderQnASearch
                                                    onPress={() => { props.navigation.navigate('QuestionDetail', { questionId }) }}
                                                    {...{ title, grade: "Lớp " + grade, book: subject_name, answers, index }}
                                                />
                                            )
                                        })
                                    }

                                </View>

                                // <FlatList
                                //     showsVerticalScrollIndicator={false}
                                //     data={resultSearch}
                                //     contentContainerStyle={{ paddingHorizontal: 10 }}
                                //     ListHeaderComponent={() => {
                                //         return (
                                //             <View style={{ marginTop: 15 }}>
                                //                 <Text style={{ fontSize: 22 }}>Câu hỏi liên quan:</Text>
                                //             </View>
                                //         )
                                //     }}
                                //     renderItem={({ item, index }) => {
                                //         const { title = '',
                                //             grade_id: grade = '',
                                //             subject_id: book = '',
                                //             id: questionId = '',
                                //             subject_name = ""
                                //         } = item
                                //         return (
                                //             <RenderQnASearch
                                //                 onPress={() => { props.navigation.navigate('QuestionDetail', { questionId }) }}
                                //                 {...{ title, grade: "Lớp " + grade, book: subject_name }}
                                //             />
                                //         )
                                //     }}
                                //     keyExtractor={(item, index) => item.id}
                                // />
                                : null
                        }
                    </ScrollView>
                </View>
                {/* {showKeyboad ?
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
                    </KeyboardStickyView> : null} */}

                <View style={{
                    // flex: 1,
                    width: width,
                    height: 55,
                    // borderTopColor: '#dedede',
                    // borderTopWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    justifyContent: 'space-around'
                    // paddingBottom: 15,
                    // paddingTop: 5,
                    // backgroundColor: 'red'
                }}>

                    <TouchableOpacity disabled={loading} style={{
                        paddingVertical: 10, paddingHorizontal: 30, flexDirection: 'row',
                        alignItems: 'center', backgroundColor: '#fff', borderRadius: 20
                    }} onPress={() => {
                        uploadQuestion()
                    }}>
                        {loading ? <ActivityIndicator color="#000" style={{ paddingRight: 20 }} /> : <Icon name="ios-send" type="Ionicons" style={{ color: COLOR.MAIN }} />}
                        <Text style={{ color: COLOR.MAIN, fontWeight: 'bold', fontSize: 16, marginLeft: 7 }}>Gửi câu hỏi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity disabled={loading} style={{
                        paddingVertical: 10, paddingHorizontal: 30, flexDirection: 'row',
                        backgroundColor: COLOR.MAIN,
                        alignItems: 'center', borderRadius: 20
                    }} onPress={() => {
                        _requestSearch({ questionContent, filter })
                    }}>
                        {loading ? <ActivityIndicator color="#000" style={{ paddingRight: 20 }} /> : <Icon type="AntDesign" name="search1" style={{ color: '#fff' }} />}
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 7 }}>Tìm kiếm</Text>
                    </TouchableOpacity>

                    {/* <View style={{ flex: 1, flexDirection: 'row' }}>
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
                    } */}
                </View>
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
    inputQnA: {
        maxHeight: height / 5,
        borderBottomColor: '#ddd',
        paddingBottom: 20,
        borderBottomWidth: 1,
        textAlignVertical: 'top',
        fontSize: 18,
        paddingHorizontal: 15,
        marginTop: 15,
        marginBottom: 10,
    },
    shadow: {
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },
    },
    headerText: {
        paddingVertical: 5,
        // textAlign: 'center',
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
        marginLeft: 4,
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
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, FlatList, Text, StyleSheet, Platform, Alert,
    TouchableOpacity, Dimensions, Image, ScrollView,
    SafeAreaView, TextInput, Keyboard, BackHandler, ActivityIndicator
} from 'react-native';
import { get } from 'lodash';
import { Icon } from 'native-base';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import OptionsMenu from "react-native-option-menu";
import ImageView from "react-native-image-viewing";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";
import { check, PERMISSIONS, RESULTS, openSettings, request } from 'react-native-permissions';

import ImageZoom from 'react-native-image-pan-zoom';
import { SvgXml } from 'react-native-svg';
import {
    InterstitialAdManager
} from 'react-native-fbads';

import api from '../../handle/api';
import { getDiffTime, helpers } from '../../utils/helpers'

import { fontSize, COLOR } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import imagePicker from '../../utils/imagePicker';
// 
import KeyboardStickyView from '../../component/shared/StickeyKeyboad';
// import RenderData, { RenderDataJson } from '../../component/shared/renderHtmlNew';
import RenderData, { RenderDataJson } from '../../component/shared/renderHtmlQuestion';
import services from '../../handle/services';
import { endpoints } from '../../constant/endpoints';
import { search_services } from './service';
import { RenderListImg } from '../../component/Image/renderListImg';
import { ViewWithBanner, fbFull } from '../../utils/facebookAds';


const { width, height } = Dimensions.get('window');
const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";


const QnA = (props) => {
    const contentQuestion = props.navigation.getParam('contentQuestion', '');
    const questionId = props.navigation.getParam('questionId', '8675');
    const source = props.navigation.getParam('source', '');
    const [showKeyboad, setShowKeyBoard] = useState(false);
    const [commentType, setType] = useState({ type: 'answer' });
    const inputEl = useRef(null);
    const refList = useRef(null);

    // useEffect(() => {
    //     fbFull();
    // }, [])

    const handleComment = (type = 'answer', data) => {
        setType({ type, data });
        if (inputEl && inputEl.current) {
            inputEl.current.focus();
        }
    }
    const [questionData, setQuestionData] = useState({});
    const [loading, setLoading] = useState(false);
    const [isFollow, setFollow] = useState(false);
    // show img in content
    const [showImg, setShowImg] = useState(false);
    // show img upload
    const [listImgShow, setListShowImg] = useState(false);
    const [refreshing, setRefesh] = useState(false);

    const requesQuestion = (isScroll) => {
        setLoading(true);
        return api.get(`/question/${questionId}`)
            .then(({ data = {} }) => {
                setLoading(false);
                setFollow(data.is_follow)
                setQuestionData(data);
                if (isScroll) {
                    try {
                        setTimeout(() => {
                            refList.current.scrollToEnd({ animated: true })
                        }, 100)

                    } catch (err) {
                        console.log('err request question', err)
                    }
                }
            })
            .catch(err => {
                console.log('err load question', err)
                setLoading(false);
            })
    };

    const addComment = (data, type = '') => {
        try {
            if (type === 'comment') {
                const { index, ...restData } = data;
                if (questionData.answer && questionData.answer[index] &&
                    questionData.answer[index].comment) {
                    questionData.answer[index].comment.push(restData)
                }
                setQuestionData({ ...questionData });
                setType({ type: 'answer' });

            } else {
                questionData.answer.push(data);
                setQuestionData({ ...questionData });
                setTimeout(() => {
                    refList.current.scrollToEnd({ animated: true })
                }, 100)
            }
        } catch (err) {
            console.log('err request question', err)
        }
    }

    const handleBack = useCallback(() => {
        // console.log('source-------', source)
        if (source) {
            props.navigation.navigate(source)
        } else {
            props.navigation.goBack()
        }
    }, [source]);

    useEffect(() => {
        requesQuestion();
        setTimeout(() => {
            setShowKeyBoard(true);
            handleComment()
        }, 1000);

        BackHandler.addEventListener('hardwareBackPress', () => {
            if (!props.navigation.isFocused()) {
                return false;
            }
            handleBack();
            return true;
        });

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', () => {
                if (!props.navigation.isFocused()) {
                    return false;
                }
                handleBack();
                return true;
            });
        }
    }, [questionId]);
    const _gotoProfile = (id = '') => {
        props.navigation.navigate('UserQnA', { userId: id })
    }

    const _handleFollow = () => {
        search_services.handleFollow(questionId)
            .then(() => {
                Toast.showWithGravity(isFollow ? "Bỏ theo dõi thành công" : "Theo dõi thành công", Toast.SHORT, Toast.CENTER);
            })
    };
    const _handleReport = () => {

    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* back header */}
                <Header
                    userName={get(questionData, 'user.name', '')}
                    time={questionData.timestamp}
                    avatar={get(questionData, 'user.avatar', '')}
                    isCheck={get(questionData, 'user.role_id') == 1 || get(questionData, 'user.role_id') == 2}
                    handleBack={handleBack}
                    gotoProfile={() => _gotoProfile(get(questionData, 'user.id', ''))}
                    _handleFollow={_handleFollow}
                    _handleReport={_handleReport}
                    isFollow={isFollow}
                    subtitle={`• ${get(questionData, 'path.subject.subject_name', '')} • lớp ${get(questionData, 'path.class', '')}`}
                />

                {/* <View style={{ height: 200 }}> */}
                    {/* <ViewWithBanner /> */}
                {/* </View> */}
                {/* list */}
                <View style={{ flex: 1, marginBottom: 65 }}>
                    <KeyboardAwareFlatList
                        ref={refList}
                        data={get(questionData, 'answer', [])}
                        showsVerticalScrollIndicator={false}
                        onRefresh={() => {
                            setRefesh(true);
                            requesQuestion()
                                .finally(() => setRefesh(false))
                        }}
                        refreshing={refreshing}
                        // header content
                        ListHeaderComponent={
                            <RenderQuestion
                                item={{
                                    content: contentQuestion || get(questionData, 'content.parse_content'),
                                    image: get(questionData, 'content.image'),
                                    answerCount: get(questionData, 'answer', []).length,
                                }}
                                questionId={questionId}
                                handleClickAnswer={handleComment}
                                setListShowImg={setListShowImg}
                                setShowImg={setShowImg}
                            />
                        }
                        // render list anwer
                        renderItem={({ item, index }) => {
                            return <RenderAnwser {...{ item, index, handleComment, _gotoProfile, setShowImg, setListShowImg }} />
                        }}
                        extraData={questionData}
                        keyExtractor={(item) => '' + item.id}
                        // loading
                        ListFooterComponent={
                            loading ? (
                                <View style={{ padding: 10 }}>
                                    <Placeholder Animation={Fade}
                                        Left={PlaceholderMedia}>
                                        <PlaceholderLine height={40} />
                                    </Placeholder>
                                </View>
                            ) : null
                        }

                    />
                </View>
                {showKeyboad ?
                    <KeyboardStickyView style={{ backgroundColor: '#fff' }}>
                        <FormComment
                            commentType={commentType}
                            resetType={() => setType({ type: 'answer' })}
                            addComment={addComment}
                            questionId={questionId}
                            inputEl={inputEl}
                        />
                    </KeyboardStickyView>
                    : null
                }
            </SafeAreaView>

            <ImageView
                images={get(listImgShow, 'data[0]', null) ?
                    get(listImgShow, 'data', []).map(img => ({ uri: `${endpoints.MEDIA_URL}${get(img, 'path', '')}` })) : []
                }
                imageIndex={+get(listImgShow, 'index', 0)}
                visible={!!listImgShow}
                onRequestClose={() => setListShowImg(false)}
            />

            {!!showImg ?
                <TouchableOpacity style={{ flex: 1, position: 'absolute', width, height }} >
                    <ImageZoom
                        onClick={() => setShowImg(false)}
                        cropWidth={width}
                        cropHeight={height}
                        imageWidth={width}
                        imageHeight={get(showImg, 'size.height', '')}
                        style={{ backgroundColor: '#fff' }}
                        pinchToZoom={false}
                    >
                        {
                            showImg.type == 'svg' ?
                                <SvgXml
                                    xml={showImg.content}
                                    width={showImg.width}
                                    height={showImg.height}
                                    color="#000"
                                    style={{
                                        backgroundColor: '#fff'
                                    }}
                                />
                                :
                                <Image
                                    resizeMode="contain"
                                    style={{ flex: 1, height: undefined, width: undefined, backgroundColor: '#fff' }}
                                    source={{
                                        uri: get(showImg, 'uri', ''),
                                    }}
                                />
                        }
                    </ImageZoom>
                </TouchableOpacity>
                : null}
        </View >
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
        paddingLeft: 10,
        // textAlign: 'center',
        fontSize: 20,
        marginTop: 4,
        ...fontMaker({ weight: fontStyles.Bold })
    },
    head: {

    },
    filter: {
        flexDirection: 'row',
        paddingVertical: 10
        // padding
    },
    iconFilter: {
        fontSize: 17
    },
    h2: {
        fontSize: 18,
        color: '#555',
        ...fontMaker({ weight: fontStyles.Bold })
    },
    itemQ: {
        backgroundColor: '#fefefe',
        paddingVertical: 10,
        // padding: 10,
        // borderRadius: 10,
        // marginVertical: 10
    },
    itemHead: {
        fontSize: 17,
        color: '#555',
        marginBottom: 5,
        marginVertical: 10,
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
    userComment: {
        flexDirection: 'row',
        marginTop: 7,
    },
    headerTag: {
        alignItems: 'center', flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'baseline', backgroundColor: '#ffa154', borderRadius: 20
    },
    contentTag: {
        color: COLOR.white(1),
        ...fontMaker({ weight: fontStyles.SemiBold })
    },
    btnComment: {
        paddingVertical: 10,
        backgroundColor: '#C8EDF9',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    tinybtnComment: {
        paddingVertical: 10,
        backgroundColor: '#C8EDF9',
        borderRadius: 20,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
    }

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
    imgLargeWapper: {
        height: 35, width: 35,
        borderRadius: 35,
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
        marginTop: 7,
    }
})


const User = ({ isCheck = false, style = {}, uri, _gotoProfile = () => { } }) => {
    return (
        <TouchableOpacity onPress={_gotoProfile} style={[userStyle.imgLargeWapper, style]} >
            <Image style={[userStyle.img, {}]} source={{ uri: handleImgLink(uri) }} />
            {isCheck ? <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
            </View> : null}
        </TouchableOpacity>
    )
}

const mapImg = {
    1: width - 20,
    2: (width - 30) / 2,
    // 3: 3,
}

const RenderQuestion = ({ questionId, item, index, handleClickAnswer = () => { }, setListShowImg = () => { }, setShowImg }) => {
    // console.log('item.image[0]', endpoints.BASE_URL)
    const [like, setLike] = useState(false);
    const _handleLike = useCallback(() => {
        search_services.handleLike(questionId, { "rate": like ? -1 : 1 })
            .then(() => {
                setLike(!like);
            })
            .catch(err => {
                // Toast.
                // Toast.showWithGravity("Bạn chỉ được gửi tối đa 3 ảnh", Toast.SHORT, Toast.CENTER);
            })
    }, [like])
    return (
        <View style={[styles.itemQ]} >
            <View style={{ paddingHorizontal: 8 }}>
                <RenderDataJson indexItem={index} content={item.content || ''} setShowImg={setShowImg} />
            </View>
            <RenderListImg listImg={item.image} setVisible={setListShowImg} />
            <View style={{
                flexDirection: 'row',
                borderTopColor: '#cecece', borderTopWidth: 1,
                alignItems: 'flex-end',
                paddingTop: 8,
                marginTop: 10,
                paddingHorizontal: 8
                // justifyContent: 'flex-end'
            }}>
                {/* <ListUser /> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        {/* <TouchableOpacity
                            onPress={_handleLike}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <Icon name="heart" type="EvilIcons" style={{ fontSize: 38, color: like ? COLOR.MAIN : '#111' }} />
                            <Text style={{ fontSize: 18, color: like ? COLOR.MAIN : '#111' }}>Like</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            onPress={() => handleClickAnswer()}
                            style={{ flexDirection: 'row', marginLeft: 0, alignItems: 'center' }}>
                            <Icon name="comment" type="EvilIcons" style={{ fontSize: 28 }} />
                            <Text style={{ fontSize: 18 }}>Trả lời</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text> {item.answerCount} câu trả lời</Text>
                    </View>
                </View>

            </View>
        </View>
    )
}

const RenderAnwser = ({ item, index, handleComment, _gotoProfile = () => { }, setShowImg = () => { }, setListShowImg = () => { } }) => {
    const {
        id = '',
        user: {
            id: useID = '',
            avatar = '',
            name = '',
            role_id = ''
        } = {},
        content = '',
        viewCount = null,
        commentCount = 3,
        likeCount = '',
        timestamp = '2020-05-11T19:39:36.000000Z',
        comment = [],
        parse_content = '',
        image = []
    } = item;
    const [like, setLike] = useState(false);
    const _handleLike = useCallback(() => {
        search_services.handleLikeAnwser(id, { "rate": like ? -1 : 1 })
            .then(() => {
                setLike(!like);
            })
            .catch(err => {
                console.log('err', err)
            })
    }, [like]);
    return (
        <View
            style={[styles.itemQ, {}]}
        >
            <View style={{ flexDirection: 'row', paddingRight: 10 }}>
                <User style={{ marginRight: 5 }}
                    _gotoProfile={() => _gotoProfile(useID)}
                    uri={avatar}
                    isCheck={role_id == 1 || role_id == 2}
                />
                <View style={{ flex: 1 }}>
                    <View style={{ padding: 10, backgroundColor: '#F1F2F6', flex: 1, borderRadius: 10 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{name}</Text>
                        <View>
                            <RenderDataJson
                                indexItem={index}
                                content={parse_content}
                                isAnwser
                                setShowImg={setShowImg}
                            />
                            <TouchableOpacity onPress={() => { console.log('wewe'), setListShowImg(image) }}>
                                <RenderListImg listImg={image} setVisible={setListShowImg} />
                            </TouchableOpacity>
                            {/* <Text style={{}}>{JSON.stringify(parse_content)}</Text> */}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 16, marginLeft: 5 }}>{getDiffTime(timestamp)}</Text>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={_handleLike}>
                                <Icon name="heart" style={{ fontSize: 14, color: like ? '#FD7A6C' : '#ddd', marginLeft: 15, }} type='AntDesign' />
                                <Text style={{ fontSize: 16, marginLeft: 5, color: like ? '#FD7A6C' : '#222' }}>Cảm ơn ({+likeCount + (like ? 1 : 0)})</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleComment('comment', { id, name, index })}>
                                {/* <Icon name="heart" style={{ fontSize: 15, color: 'red' }} type='AntDesign' /> */}
                                <Text style={{ fontSize: 16, marginLeft: 15 }}>Trả lời</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <FlatList
                            data={comment}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return RenderFeedbackComment({ item, index, _gotoProfile })
                            }}
                            keyExtractor={(item) => '' + item.id}
                        />
                    </View>

                </View>
            </View>
        </View>
    )
}


const RenderFeedbackComment = ({
    item,
    index,
    _gotoProfile = () => { }
}) => {
    const {
        user: {
            id = '',
            avatar = '',
            name = "",
        } = {},
        content = '',
        timestamp = '',
        parse_content = ''
    } = item;

    return (
        <View
            style={[styles.itemQ, {}]}
        >
            <View style={{ flexDirection: 'row' }}>
                <User style={{ marginRight: 5 }} uri={avatar} _gotoProfile={_gotoProfile} />
                <View style={{ flex: 1 }}>
                    <View style={{ padding: 10, backgroundColor: '#F1F2F6', flex: 1, borderRadius: 10 }}>
                        <Text numberOfLines={1} style={{ fontWeight: 'bold', marginBottom: 8 }}>{name}</Text>
                        <View>
                            <Text>{content}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 16, marginLeft: 5 }}>{getDiffTime(timestamp)}</Text>
                            {/* <Text style={{ fontSize: 16, marginLeft: 15 }}>Thích</Text> */}
                        </View>
                    </View>
                </View>
            </View>
        </View>

    )
}


const Header = ({
    userName = '',
    time = '',
    avatar = '',
    handleBack = () => { },
    gotoProfile = () => { },
    _handleFollow = () => { },
    _handleReport = () => { },
    isFollow = false,
    isCheck,
    subtitle = ''
}) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={{ marginLeft: 10 }}
                >
                    <Icon type='MaterialCommunityIcons' name={'arrow-left'} style={{ fontSize: 26, color: '#836AEE' }} />
                </TouchableOpacity>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    marginBottom: 10, marginLeft: 8
                }}>
                    <TouchableOpacity onPress={gotoProfile} style={styles.largeImgWapper} >
                        <Image style={userStyle.imgLargeWapper} source={{ uri: handleImgLink(avatar) }} />
                        <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                            {isCheck ? <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" /> : null}
                        </View>
                    </TouchableOpacity>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{userName}</Text>
                        <Text numberOfLines={1} style={{ fontSize: 13 }}>{getDiffTime(time)} {subtitle}</Text>
                    </View>
                </View>
            </View>
            <OptionsMenu
                customButton={<Icon name='dots-three-vertical' type='Entypo' style={{ fontSize: 16, color: '#040404', paddingHorizontal: 20, paddingBottom: 20 }} />}
                destructiveIndex={1}
                options={[isFollow ? "Bỏ theo dõi" : "Theo dõi", "Báo cáo", "Huỷ bỏ"]}
                actions={[_handleFollow, _handleReport]} />

        </View>
    )
}

const FormComment = ({
    commentType,
    addComment = () => { },
    questionId = "",
    inputEl,
    resetType = () => { }
}) => {
    const [commentText, setCommentText] = useState('');
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (commentType && commentType.type === 'comment') {
            setPhotos([])
        }

    }, [commentType])
    // console.log('loading', loading)
    const hanldeRemoveImg = (index) => {
        photos.splice(index, 1);
        setPhotos([...photos]);
    }

    const handleChoosePhotos = () => {
        // imagePicker.
        imagePicker.launchLibrary({}, {
            onChooseImage: (response) => {
                if (response.path) {
                    try {
                        if (photos.length < 3)
                            setPhotos([...photos, response.path])
                        else
                            Toast.showWithGravity("Bạn chỉ được gửi tối đa 3 ảnh", Toast.SHORT, Toast.CENTER);

                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        });
    };



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
                handleChoosePhotos()
            } else if (result === RESULTS.DENIED) {
                const resultRequest = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                if (resultRequest === RESULTS.GRANTED) {
                    handleChoosePhotos()
                } else {
                    _handleOpenSetting()
                }
            } else {
                handleChoosePhotos()
            }
        } else {
            const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            if (result === RESULTS.GRANTED) {
                handleChoosePhotos();
            } else if (result === RESULTS.DENIED) {
                const resultRequest = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
                if (resultRequest === RESULTS.GRANTED) {
                    handleChoosePhotos()
                } else {
                    _handleOpenSetting()
                }
            } else {
                handleChoosePhotos()
            }
        }
    };

    const hanldePostAnswer = async () => {
        try {
            setLoading(true)
            if (photos[0]) {
                const dataUpload = new FormData();
                photos.map(file => {
                    let fileName = file.split('/');
                    // console.log('filefilefilefilefile34234', file)
                    dataUpload.append("img[]", {
                        uri: file,
                        name: fileName[fileName.length - 1],
                        type: 'multipart/form-data',
                    });
                });
                const imageUpload = await services.uploadImage(dataUpload);
                // console.log('imageUpload============', imageUpload)
                if (imageUpload && imageUpload.data) {
                    const bodyComment = { content: commentText, image: imageUpload.data }
                    // console.log('bodyComment=========', bodyComment)
                    const commentResult = await api.post(`answer/${questionId}`, bodyComment);
                    setLoading(false);
                    setPhotos([])
                    // console.log('commentResult============', commentResult);
                    if (commentResult.data) addComment(commentResult.data, 'answer');
                    setTimeout(() => { setCommentText('') }, 10);

                    Toast.showWithGravity("Upload câu trả lời thành công", Toast.LONG, Toast.CENTER);
                    Keyboard.dismiss();
                }
                setLoading(false)
            } else {
                const commentResult = await api.post(`answer/${questionId}`, { content: commentText })
                setLoading(false)
                if (commentResult.data) addComment(commentResult.data, 'answer');
                setTimeout(() => {
                    setCommentText('');
                }, 10);


                Toast.showWithGravity("Upload câu trả lời thành công", Toast.LONG, Toast.CENTER);
                Keyboard.dismiss();
            }

        } catch (error) {
            setLoading(false)
            console.log('weeeeee=====', error)
            Toast.showWithGravity("Upload câu trả lời thất bại", Toast.LONG, Toast.CENTER);

        }

    }

    const handlePostComment = async () => {
        // console.log(commentText, loading, 'commentType=========')

        if (!commentText || loading) { // if no content
            Toast.showWithGravity("Bạn chưa nhập nội dung", Toast.SHORT, Toast.CENTER);
            return 1;
        }
        // console.log(commentType, 'commentType=========')

        if (commentType.type === 'answer') { //
            await hanldePostAnswer();
        } else { // comment
            const { data: { id: answerId = '', index } = {} } = commentType;
            // console.log(answerId, 'answerId=========')
            if (answerId) {
                setLoading(true)
                api.post(`comment/${answerId}`, { content: commentText })
                    .then(({ data }) => {
                        if (data) {
                            data.index = index;
                            addComment(data, 'comment');
                        }

                        setTimeout(() => {
                            setCommentText('');
                        }, 10)

                        Toast.showWithGravity("Upload câu trả lời thành công", Toast.LONG, Toast.CENTER);

                        Keyboard.dismiss();
                        setLoading(false)
                    })
                    .catch(err => {
                        setLoading(false)
                        console.log('err comment', err)
                        Toast.showWithGravity("Upload câu trả lời thất bại", Toast.LONG, Toast.CENTER);
                    })
            }
        }
    };

    return (
        <View style={{
            marginTop: 10,
            borderTopColor: '#ddd',
            borderTopWidth: 1,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', }}>
                    {
                        photos[0] ? photos.map((p, index) => {
                            return (
                                <View key={p} style={{ margin: 5, paddingHorizontal: 3, position: 'relative' }}>
                                    <Image
                                        source={{ uri: p }}
                                        style={{
                                            flex: 1, width: undefined, height: width / 6, width: width / 6,
                                            borderRadius: 10,
                                        }}
                                    // resizeMode='contain'
                                    />
                                    <TouchableOpacity
                                        onPress={() => hanldeRemoveImg(index)}
                                        style={{
                                            position: 'absolute',
                                            backgroundColor: '#fff',
                                            right: 0,
                                            // paddingHorizontal: 10, 
                                            justifyContent: 'center',
                                            height: 25, width: 25,
                                            alignItems: 'center', justifyContent: 'center',
                                            borderRadius: 25,
                                            backgroundColor: '#fff',
                                        }}>
                                        <Icon name="close" style={{ color: 'red', fontSize: 19 }} />
                                    </TouchableOpacity>

                                </View>
                            )
                        }) : null
                    }
                </View>
            </View>

            {(commentType && commentType.data) ?
                <View style={{
                    marginTop: 10,
                    marginHorizontal: 25,
                    flexDirection: 'row',
                    // justifyContent: 'space-between'
                }}>
                    <TouchableOpacity onPress={resetType}>
                        <Text> <Text style={{ fontWeight: 'bold' }}>Đang trả lời {commentType.data.name}</Text>  • Huỷ</Text>
                    </TouchableOpacity>
                </View> : null
            }
            <View style={{
                flex: 1,
                width: width,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                {commentType.type === 'answer' ? <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={_handleClickPhoto}
                        style={{
                            paddingLeft: 5,
                            marginLeft: 5
                        }} >
                        <Icon name="image" type='Entypo' />
                    </TouchableOpacity>
                </View> : null}
                <View style={{
                    flex: 1,
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    marginVertical: 10,
                    marginRight: 20,
                    marginLeft: 10,
                    paddingHorizontal: 15,
                    paddingVertical: 8
                }}>
                    <TextInput
                        ref={inputEl}
                        style={{
                            flex: 1,
                            height: 30,
                        }}
                        placeholder={(commentType && commentType.data) ?
                            `Trả lời ${commentType.data.name}` :
                            "Viết câu trả lời ..."}
                        multiline={true}
                        numberOfLines={10}
                        onChangeText={text => setCommentText(text)}
                        value={commentText}
                    />
                </View>
                {loading ? <ActivityIndicator color="#000" style={{ paddingRight: 20 }} /> :
                    <TouchableOpacity style={{ paddingRight: 20 }} onPress={handlePostComment}>
                        <Icon name="ios-send" type="Ionicons" style={{ color: COLOR.MAIN }} />
                    </TouchableOpacity>}
            </View>
        </View>

    )
}

const handleImgLink = (link) => {
    try {
        if (!link) return "https://www.xaprb.com/media/2018/08/kitten.jpg"
        return link.includes('http') ? link : endpoints.BASE_HOI_DAP + link;
    } catch (err) {
        return link;
    }
}
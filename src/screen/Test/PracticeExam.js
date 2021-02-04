import React, { useState, useCallback, useEffect, useRef, } from 'react';
import { FlatList, View, SafeAreaView, ScrollView, Text, StyleSheet, Platform, TouchableOpacity, Dimensions, Image, BackHandler, ActivityIndicator } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';
import { get, throttle, isEmpty } from 'lodash';
// import { SCLAlert } from 'react-native-scl-alert';
// import { useSelector } from 'react-redux';
import { SvgXml } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from "rn-placeholder";
// import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';

import { UseAnimation, NavigateIndex } from '../Test/component/slider';
import { RenderItemPow } from '../../component/shared/RenderPow';
import RenderTable from '../Test/component/renderTable';
import { FeedbackModal } from './component/ModalReport';
import RenderData, { ImageSVG } from './component/renderHtmlTest'
import api, { Loading, useRequest } from '../../handle/api';
import { COLOR, fontSize, unitIntertitialId } from '../../handle/Constant';

const { width, height } = Dimensions.get('window');
//  ========== show list subject class====================

// use state 
import globalHook from './component/globalHook';
import PracticeHeader from './component/PracticeHeader';
import EndPracticeModal from './component/EndPracticeModal';
const initialState = {};

const actions = {
    setNewResult(store, newState) {
        store.setState({
            ...store.state,
            ...newState,
        });
    },
    resetState(store) {
        store.setState(initialState);
    }
};

const useGlobal = globalHook(React, initialState, actions);

/**-------------interstitial ad----------------- */
import firebase from 'react-native-firebase';
import { setLearningTimes } from '../../redux/action/user_info';
import { fbFull } from '../../utils/facebookAds';
const AdRequest = firebase.admob.AdRequest;
let advert;
let request;

const TAG = 'practice_exam';

// main function
const PracticeExam = (props) => {
    const { navigation } = props;
    const idExam = navigation.getParam('idExam', '');
    const dispatch = useDispatch();

    const iosAnimated = useRef();
    const [resultGlobal, actionGlobal] = useGlobal();

    // index start with 1 => min and max is length 
    const [index, setIndexQ] = useState(1);
    // throttle set new index
    const throttled = useRef(throttle((newValue) => setIndexQ(newValue), 400))
    const setIndex = throttled.current;

    const [listCourse, isLoadingListCourse, errLoadingListCourse = ''] = useRequest(`/exams/${idExam}`, [idExam]);
    // console.log('listCourselistCourse', listCourse)
    // modal
    const [showEnd, setShowEnd] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const [adsLoading, setAdsLoading] = useState(false);

    const dataCourseConvert = get(listCourse, 'data.questions', []);

    const flatRef = useRef(null);
    // for ios scroll
    const refIos = useRef();
    useEffect(() => {
        if (refIos.current && refIos.current.scrollTo) refIos.current.scrollTo({ y: 0 })
    }, [index]);

    const screenAds = useSelector(state => get(state, 'subjects.screens', null));
    const frequency = useSelector(state => get(state, 'subjects.frequency', 6));
    // interstial ad
    const learningTimes = useSelector(state => state.timeMachine.learning_times);
    // console.log('-----asdasjdjasd-----', screenAds, frequency);

    useEffect(() => {
        if (screenAds && screenAds[TAG] == "1") {
            if (learningTimes > 0 && learningTimes % (3 * frequency) === 0) {
                fbFull()
                    .catch(err => {
                        setAdsLoading(true);
                        advert = firebase.admob().interstitial(unitIntertitialId);
                        request = new AdRequest();
                        request.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');

                        advert.loadAd(request.build());

                        advert.on('onAdLoaded', () => {
                            // console.log('----------Advert ready to show.--------');
                            // if (navigation.isFocused() && advert.isLoaded()) {
                            if (advert.isLoaded()) {
                                advert.show();
                            } else {
                                // console.log('---------interstitial fail---------', navigation.isFocused());
                            }
                        });
                        advert.on('onAdClosed', () => {
                            setAdsLoading(false);
                        });
                    })
            }
        }
    }, [learningTimes]);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (!props.navigation.isFocused()) {
                return false;
            }
            setShowEnd(true);
            return true;
        });

        return () => {
            dispatch(setLearningTimes());
            BackHandler.removeEventListener('hardwareBackPress', () => {
                if (!props.navigation.isFocused()) {
                    return false;
                }
                // setShowEnd(true);
                return true;
            });
        }
    }, []);

    const _handleSubmitExam = useCallback(() => {
        const correct = [];
        const incorrect = [];
        Object.keys(resultGlobal).map((key) => {
            const { isCorrect, idQuestion } = resultGlobal[key] || {};
            if (isCorrect) correct.push(idQuestion)
            else incorrect.push(idQuestion);
        });

        api.post(`/exams/${idExam}`, {}, { correct, incorrect })
            .then(() => {
                setShowEnd(false);
                setTimeout(() => props.navigation.goBack(), 351);
            })
            .catch((err) => {
                setShowEnd(false);
                setTimeout(() => props.navigation.goBack(), 351);
            })

    }, [resultGlobal])

    useEffect(() => {
        if (iosAnimated.current) {
            iosAnimated.current.animate(zoomOut)
        }
    }, [index])

    const handleScrollFlatList = (indexScroll = 10) => {
        if (flatRef.current && flatRef.current.scrollToOffset) {
            flatRef.current.scrollToOffset({ animated: true, offset: indexScroll * 60 });
        }
    }
    useEffect(() => {
        handleScrollFlatList(index - 1)
    }, [index]);

    useEffect(() => {
        actionGlobal.resetState();
        return () => {
            actionGlobal.resetState();
        }
    }, [idExam]);

    const handleChangeIndexIos = useCallback((nextIndex) => {
        if (nextIndex > dataCourseConvert.length) {
            // setOpenConfirm(true);
            return 1;
        } else if (nextIndex == 0) {
            return 1;
        } else {
            setIndex(nextIndex)
        }
    }, [index, dataCourseConvert.length])

    return (
        <View style={styles.container}>
            <PracticeHeader
                handleRightClick={() => setShowEnd(true)}
            />
            <SafeAreaView style={styles.container}>
                <Loading isLoading={isLoadingListCourse} err={errLoadingListCourse} com={LoadingCom}>
                    <View style={{
                        // height: 60,
                        borderBottomColor: '#dedede',
                        borderBottomWidth: 1,
                        marginBottom: 15
                    }}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            ref={flatRef}
                            contentContainerStyle={{ alignItems: 'center' }}
                            horizontal={true}
                            // data={[null, ...new Array(dataCourseConvert.length).fill('').map((_, i) => i + 1), null]}
                            data={[null, ...new Array(dataCourseConvert.length).fill('').map((_, i) => i + 1), null]}
                            renderItem={({ item }) => {
                                const isCurrent = item == index;
                                if (item === null) {
                                    return (
                                        <View style={{ width: width / 2 - 30, height: 10 }} />
                                    )
                                }
                                else return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setIndex(`${item}`)
                                        }}
                                        style={{
                                            height: 60,
                                            width: 60,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Text style={{
                                            color: isCurrent ? COLOR.MAIN : handleColor(item, resultGlobal),
                                            fontSize: isCurrent ? 21 : 17,
                                            fontWeight: isCurrent ? "bold" : '400'
                                        }}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={(item, index) => index + 'subitem'}
                        />
                        <View style={{ height: 2, width: 60, backgroundColor: COLOR.MAIN, marginLeft: width / 2 - 30 }} />
                    </View>
                    <View style={{ flex: 1 }}>

                        <View style={{ flex: 1 }}>
                            <ScrollView ref={refIos}>
                                <Animatable.View ref={iosAnimated} duration={400}>
                                    {RenderQuestion(index, dataCourseConvert, actionGlobal, resultGlobal, setShowImg)}
                                </Animatable.View>
                                <FeedbackModal data={{ type: 'question', id: get(dataCourseConvert, `[${index}].id`, '') }} />
                            </ScrollView>
                            <NavigateIndex
                                index={index}
                                handleChangeIndex={handleChangeIndexIos}
                                max={dataCourseConvert.length}
                            />
                        </View>
                    </View>
                </Loading>
                {adsLoading && (
                    <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: COLOR.white(1), justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator animating={true} size='large' color={COLOR.MAIN} />
                    </View>
                )}
            </SafeAreaView>
            <EndPracticeModal
                setClose={setShowEnd}
                isOpen={showEnd}
                onExit={_handleSubmitExam}
            />
            {!!showImg ?
                <TouchableOpacity style={{ flex: 1, position: 'absolute', width, height, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center' }} >
                    <ImageZoom
                        onClick={() => setShowImg(false)}
                        cropWidth={width}
                        cropHeight={height}
                        imageWidth={width}
                        imageHeight={get(showImg, 'size.height', '')}
                        style={{ paddingLeft: 15 }}
                        enableSwipeDown={true}
                        pinchToZoom={false}
                    >
                        {
                            showImg.type == 'svg' ?
                                (Platform.OS === 'ios' ?
                                    <SvgXml
                                        xml={showImg.content}
                                        width={showImg.width}
                                        height={showImg.height}
                                        color="#000"
                                        style={{
                                            backgroundColor: '#fff'
                                        }}
                                    /> : <ImageSVG
                                        source={{ uri: `data:image/svg+xml;utf8,` + showImg.content }}
                                        style={[showImg.size, { backgroundColor: '#fff', width: width - 20, backgroundColor: '#fff' }]}
                                    />
                                )
                                :
                                <Image
                                    resizeMode="contain"
                                    style={{ flex: 1, height: undefined, width: undefined, backgroundColor: '#fff' }}
                                    source={{
                                        uri: get(showImg, 'uri', ''),
                                        // priority: FastImage.priority.normal,
                                    }}
                                // resizeMode={FastImage.resizeMode.contain}
                                />
                        }
                    </ImageZoom>
                </TouchableOpacity>
                : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"//"#f7d87e"
    }
})

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    (state) => ({
        userInfo: state.userInfo,
    }),
    mapDispatchToProps
)(PracticeExam);

const styleContent = StyleSheet.create({
    viewRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    }
})
// 

const RenderQuestion = (indexItem = 1, dataCourseConvert, actionGlobal, resultGlobal, setShowImg = () => { }) => {
    // const [resultGlobal, actionGlobal] = useGlobal();
    if (indexItem === 0 || indexItem > dataCourseConvert.length) return null;
    const { content, answers = [], answer_detail = '', id } = dataCourseConvert[indexItem - 1];

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{
                padding: 10,
                marginBottom: 10,
            }}>
                <RenderData
                    indexItem={indexItem}
                    content={content}
                    setShowImg={setShowImg}
                />
            </View>
            <SelectAnswer
                indexQes={indexItem}
                listAnswer={answers}
                _handleSelect={(dataAns) => actionGlobal.setNewResult(dataAns)}
                answerDetail={answer_detail}
                userChoose={resultGlobal[indexItem]}
                idQuestion={id}
                setShowImg={setShowImg}
            />
        </ScrollView>
    )
}
const convertAnswer = ['a', 'b', 'c', 'd', 'e', 'f']
// 
const SelectAnswer = ({
    indexQes = '',
    _handleSelect = () => { },
    listAnswer = [],
    resultQes = '',
    userChoose: userChooseProp = null,
    answerDetail = "",
    idQuestion,
    setShowImg = () => { }
}) => {
    const [userChooses, setUserChoose] = useState('');
    const [isShow, setShowAns] = useState(false);

    // handle show data
    useEffect(() => {
        if (userChooseProp) {
            setUserChoose(userChooseProp.answerId)
            setShowAns(true);
        } else {
            setUserChoose('');
            setShowAns(false)
        }
    }, [indexQes, userChooseProp]);

    const _handleSubmit = useCallback((answerId, isCorrect) => {
        setShowAns(true);
        _handleSelect({
            [indexQes]: { idQuestion, answerId, isCorrect }
        })
    }, [idQuestion]);

    return (
        <View style={{
            marginHorizontal: 10,
            borderTopColor: '#eee',
            borderTopWidth: 1,
            flex: 1,
        }}>
            {listAnswer.map((answerItem, index) => {
                const {
                    id: answerId = null,
                    is_correct: isCorrect = '',
                    content = []
                } = answerItem;

                const isActive = userChooses == answerId;
                if (content == '[]') return null;

                return (
                    <View>
                        <TouchableOpacity
                            key={`${indexQes}+${index} list answer`}
                            onPress={() => {
                                setUserChoose(userChooses == answerId ? '' : answerId);
                                _handleSubmit(answerId, isCorrect)

                            }}
                            style={[styleAnswer.container, {
                                borderColor: isCorrect && isShow ? COLOR.CORRECT : (isActive ? COLOR.WRONG : '#dedede'),
                            }]}
                            disabled={isShow}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styleAnswer.swapper]}>
                                    <Text style={[styleAnswer.quesText, { color: COLOR.MAIN }]}>{convertAnswer[index]}.</Text>
                                </View>
                                <RenderData
                                    indexItem={indexQes}
                                    content={content}
                                    typeRender="answer"
                                    setShowImg={setShowImg}
                                />
                            </View>
                            {
                                isShow && isCorrect ?
                                    <View style={{ paddingLeft: 10, marginTop: 20 }}>
                                        <RenderData
                                            content={answerDetail}
                                            indexItem={indexQes}
                                            typeRender="reason"
                                            setShowImg={setShowImg}
                                        />
                                    </View> : null
                            }
                        </TouchableOpacity>
                        {/* {
                            isActive && !isShow &&
                            <TouchableOpacity
                                onPress={() => _handleSubmit(answerId, isCorrect)}
                                style={{
                                    right: 0,
                                    alignSelf: 'flex-end',
                                    fontSize: 20,
                                }}>
                                <BtnFullColor text="Kiểm tra" />
                            </TouchableOpacity>
                        } */}

                    </View>
                )
            })}
        </View >
    )
}

const styleAnswer = StyleSheet.create({
    quesText: {
        color: '#000',
        fontSize: 20
    },
    container: {
        flexDirection: 'column',
        paddingVertical: 10,
        paddingRight: 10,
        marginVertical: 10,
        borderRadius: 8,
        width: '100%',
        borderWidth: 2,
    },

    swapper: { alignItems: 'center', marginHorizontal: 10 },
    iconSelect: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 40,
    },
})

const RenderData_ = ({ typeRender = "", indexItem = '', content, answer_content }) => {
    let data = [];
    try {
        data = JSON.parse(content);
    } catch (err) {
        return null;
    }
    if (isEmpty(data)) return null;
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center'
        }}>
            {
                data.map((row, indexRow) => {
                    return (
                        <View key={`${indexItem}_row_${indexRow}`} style={styleContent.viewRow}>
                            {typeRender == 'reason' && indexRow == 0 ? <Text style={{ fontSize: 20, color: COLOR.CORRECT }}>Đáp án:</Text> : null}
                            {
                                row.map(({ type = '', content, params = {} }, index) => {
                                    if (type === 'text') return <RenderItemPow key={indexRow + indexItem + index + 'text'} indexRow={index} content={content} />
                                    else if (type === 'svg') {
                                        const { height: svgH = 5, width: svgW = 20 } = params;
                                        if (isNaN(svgH) || isNaN(svgW)) return null;
                                        if (!content.includes('svg')) {
                                            return null;
                                        }
                                        const heightConvert = svgH * 10;
                                        const widthConvert = getWidth(svgW * 10, typeRender);
                                        if (Platform.OS === 'ios') {
                                            return (
                                                <SvgXml
                                                    key={indexRow + indexItem + index + 'ios_svg'}
                                                    xml={content} width={widthConvert}
                                                    height={heightConvert}
                                                    color="#000" />
                                            )
                                        }
                                        return <ImageSVG
                                            key={indexRow + indexItem + index + 'android'}
                                            source={{ uri: `data:image/svg+xml;utf8,` + content }}
                                            style={{ height: heightConvert, width: widthConvert }}
                                        />

                                    } else if (type.includes('sub') || type.includes('sub')) {
                                        return <RenderItemPow key={indexRow + indexItem + index + 'sub'} type={type} content={content} />
                                    } else if (type === 'img') {
                                        const { height: imgH = 0, width: imgW = 0 } = params;
                                        if (isNaN(imgH) || isNaN(imgW)) return null;
                                        const widthConvert = getWidth(imgW, typeRender);
                                        return RenderImg(content, imgH, widthConvert, `${indexItem}-${index}-img`, typeRender)
                                    } else if (type === 'ul') {
                                        return (
                                            <View key={indexRow + indexItem + 'ul' + index}>
                                                {
                                                    content.map((itemCont, indexLi) => <Text key={indexRow + indexItem + 'li' + indexLi + index} style={{ fontSize: 18 }}>{`${indexLi + 1} ${itemCont}`}</Text>)
                                                }
                                            </View>
                                        )
                                    } else if (type === 'table') {
                                        return <RenderTable key={indexRow + indexItem + 'table' + index} style={{ height: 400, width: width }} content={content} />
                                    }
                                })
                            }

                        </View>
                    )
                })
            }
        </View >
    )
}

const RenderImg = (uri, height, widthImg, indexItem, typeRender) => {
    if (height && widthImg) {
        return (
            <View key={indexItem + 'img'} style={{ height, width: widthImg > width ? width - 5 : widthImg }}>
                <Image
                    style={{ flex: 1, height: undefined, width: undefined }}
                    resizeMode="contain"
                    source={{ uri: uri }}
                />
            </View>
        )
    }
    const [size, setSize] = useState({ width: 200, height: 50 })
    const onSuccess = useCallback(
        (width, height) => {
            setSize({ height, width: getWidth(width, typeRender) });
        }
        , [uri]);

    useEffect(() => {
        Image.getSize(uri, onSuccess);
    }, [uri])
    return (
        <View key={indexItem + 'img'} style={size}>
            <Image
                style={{ flex: 1, height: undefined, width: undefined }}
                resizeMode="contain"
                source={{ uri: uri }}
            />
        </View>
    )
}

const handleResult = ({ resultGlobal = {}, dataCourseConvert }) => {

    const correctAns = Object.keys(resultGlobal).filter(key => get(resultGlobal, `[${key}].isCorrect`, false)).length;
    const wrongAns = Object.keys(resultGlobal).filter(key => !get(resultGlobal, `[${key}].isCorrect`, false)).length;

    const percentCorr = (correctAns / dataCourseConvert.length).toFixed(3);
    const percentWro = (wrongAns / dataCourseConvert.length).toFixed(3);
    const result = {
        score: `${correctAns}/${dataCourseConvert.length}`,
        percentCorr,
        correctAns,
        wrongAns,
        max: dataCourseConvert.length,
        percentWro
    }
    if (percentCorr * 10 > 9) {
        result.text = "xuất sắc"
    } else if (percentCorr * 10 > 6) {
        result.text = "tuyệt vời"
    } else {
        result.text = "";
    }
    return result;

}

const getWidth = (svgWidth, type) => {
    if (type == "answer") return svgWidth >= width - 69 ? width - 69 : svgWidth
    return svgWidth >= width - 10 ? width - 10 : svgWidth
}

const zoomOut = {
    0: {
        opacity: 1,
        scale: 1,
    },
    0.5: {
        opacity: 0.3,
        scale: 0.98,
    },
    1: {
        opacity: 1,
        scale: 1,
    },
};

const LoadingCom = () => {
    return (
        <View style={{ flex: 1, padding: 10, width: width }}>
            <Placeholder
                style={{ marginBottom: 30 }}
                Animation={Fade}
            >
                <PlaceholderLine />
                <PlaceholderLine width={80} />
                <PlaceholderLine width={30} />
            </Placeholder>
            {
                [1, 2, 3, 4].map((i, index) => {
                    return (
                        <Placeholder
                            style={{ marginBottom: 30 }}
                            key={String(index)}
                            Animation={Fade}
                            Left={PlaceholderMedia}
                        >
                            <PlaceholderLine />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                    )
                })
            }

        </View>
    )
}

const handleColor = (currIndex, resultGlobal) => {
    const isCorrect = get(resultGlobal, `[${currIndex}].isCorrect`);
    if (isCorrect === undefined) return '#111';
    return isCorrect ? COLOR.CORRECT : COLOR.WRONG
}

const submitTest = (exam_id, body) => {
    console.log('bodybodybodybody', body)
    return api.post(`/exams/${exam_id}`, {}, body)
        .then(console.log)
        .catch(console.log)
}

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FlatList, View, SafeAreaView, ScrollView, Text, StyleSheet, Platform, TouchableOpacity, Dimensions, Image, BackHandler, Vibration } from 'react-native';
import { connect, useSelector } from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';
import { get, throttle, isEmpty, findIndex } from 'lodash';
// import { SCLAlert } from 'react-native-scl-alert';
// import { useSelector } from 'react-redux';
import { SvgXml } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from "rn-placeholder";
import ImageZoom from 'react-native-image-pan-zoom';

import { RenderItemPow } from '../../component/shared/RenderPow';
import RenderTable from '../Test/component/renderTable';
import { FeedbackModal } from './component/ModalReport';
import RenderData, { ImageSVG } from './component/renderHtmlTest'
import api, { Loading, useRequest } from '../../handle/api';
import { BONUS_TIME_POINT, COLOR, CORRECT_POINT, fontSize, TIME_PER_QUESTION } from '../../handle/Constant';
import RankingDashboard from './component/RankingDashboard';

const { width, height } = Dimensions.get('window');
//  ========== show list subject class====================

// use state 
import globalHook from './component/globalHook';
// import { fontMaker, fontStyles } from '../../utils/fonts';
// import { helpers } from '../../utils/helpers';
import TestHeader from './component/header';
import EndPracticeModal from './component/EndPracticeModal';
import FadingOutCom from './component/FadingOutCom';
import { helpers } from '../../utils/helpers';
import { Icon } from 'native-base';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { Countdown } from '../../component/shared/Countdown';
import BarLoading from './component/BarLoading';
import SoundPlayer from './component/SoundPlayer';
import { user_services } from '../../redux/services';
import FadingQuestionNumber from './component/FadingQuestionNumber';
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

// main function
const Test = (props) => {
    const { navigation } = props;
    const idExam = navigation.getParam('idExam', '');
    const source = navigation.getParam('source', '');
    const userId = useSelector(state => get(state, 'userInfo.user.id', -1));

    const iosAnimated = useRef();
    const [resultGlobal, actionGlobal] = useGlobal();

    const [showLoadingAnim, setShowLoadingAnim] = useState({ show: false, correct: false });
    // const [showTimeout, setShowTimeout] = useState(false);
    const [showNextQues, setShowNextQues] = useState(false);
    const [stopTime, setStopTime] = useState(0);
    const [submit, setSubmit] = useState(false);
    const [score, setScore] = useState(0);
    const [consecutive, setConsecutive] = useState(0);
    // const [showNextRanking, setShowNextRanking] = useState(false);
    const [rankingResult, setRankingResult] = useState([]);
    // const [currentHighscore, setCurrentHighscore] = useState({});
    const [stopMusic, setStopMusic] = useState(false);
    const [testTime, setTestTime] = useState(0);
    const [vibrated, setVibrated] = useState(true);

    useEffect(() => {
        if (showLoadingAnim.show) {
            if (showLoadingAnim.correct) {
                setSubmit(true);
                setConsecutive(consecutive + 1);
                // setScore(score + CORRECT_POINT);
            } else {
                if (vibrated) {
                    Vibration.vibrate();
                }
                setConsecutive(0);
            }

            setTimeout(() => {
                setShowLoadingAnim({ show: false, correct: false });
                handleNextRanking();
            }, 1700);
        }
    }, [showLoadingAnim.show]);

    useEffect(() => {
        // console.log('alksakljsas', stopTime, score);
        if (stopTime != null && showLoadingAnim.correct) {
            let incentive = 0;
            if (consecutive > 0 && consecutive % 3 == 0) {
                incentive += 100 * parseInt(consecutive / 3);
            }
            if (stopTime < 300 && stopTime > 0) {
                const remainingTime = 300 - stopTime;
                if (remainingTime > 0) {
                    const bonusTimePoint = Math.floor(50 * remainingTime * 1.0 / 300);
                    incentive += bonusTimePoint;
                }
            }
            // console.log('asnkajhsjas', incentive);
            setScore(score + CORRECT_POINT + incentive);
        }

        setTimeout(() => {
            setStopTime(null);
        }, 500);

    }, [stopTime]);

    // useEffect(() => {
    //     if (consecutive > 0 && consecutive % 3 == 0) {
    //         setScore(score + 100 * parseInt(consecutive / 3));
    //     }
    // }, [consecutive]);

    const saveScore = async (score) => {
        const result = await user_services.savePracticeScore({
            "exam_id": idExam,
            "score": score
        });
        // console.log('asajhskjahskjahskjahsjkasas', result);
        if (result && result.data && Array.isArray(result.data)) {
            setRankingResult(result.data);
        }
    }

    useEffect(() => {
        saveScore(score);
    }, [score]);

    const handleNextRanking = () => {
        if (index != dataCourseConvert.length) {
            setShowNextQues(true);
        }
        setShowRanking(true);
    }

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
    const [showCounting, setShowCounting] = useState(true);
    const [showQuesIdx, setShowQuesIdx] = useState(false);
    const [showRanking, setShowRanking] = useState(false);
    // const [showBarLoading, setShowBarLoading] = useState(true);

    let timeoutNext;

    useEffect(() => {
        if (showRanking && index < dataCourseConvert.length) {
            timeoutNext = setTimeout(() => {
                setSubmit(false);
                setShowRanking(false);
                if (index < dataCourseConvert.length) {
                    setIndex(+index + 1);
                }
                setShowNextQues(false);
                setShowQuesIdx(true);
            }, 3000);
        }

        return () => {
            clearTimeout(timeoutNext);
        }

    }, [showRanking]);

    const dataCourseConvert = get(listCourse, 'data.questions', []);

    const flatRef = useRef(null);
    // for ios scroll
    const refIos = useRef();
    useEffect(() => {
        if (refIos.current && refIos.current.scrollTo) refIos.current.scrollTo({ y: 0 })
    }, [index]);

    useEffect(() => {

        async function getCurrentRaking() {
            const res = await user_services.getCurrentRaking(idExam);
            // console.log('alkhskjagshakgsa', res);
            // if (res) setCurrentHighscore(res.rank);
        }

        // getCurrentRaking();

        setTimeout(() => {
            setShowCounting(false);
            setShowQuesIdx(true);
        }, 4000);
        BackHandler.addEventListener('hardwareBackPress', () => {
            if (!props.navigation.isFocused()) {
                return false;
            }
            setShowEnd(true);
            return true;
        });

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', () => {
                if (!props.navigation.isFocused()) {
                    return false;
                }
                // setShowEnd(true);
                return true;
            });
        }
    }, []);

    useEffect(() => {
        if (showQuesIdx) {
            setTimeout(() => { setShowQuesIdx(false) }, 1000);
        }
    }, [showQuesIdx]);

    const _handleAnalyse = async (fakeRank) => {
        const user_index = findIndex(rankingResult, (e) => { return e.userId == userId });
        let rank = 1;
        let score = 0;
        if (user_index >= 0) {
            rank = rankingResult[user_index]['rank'];
            score = rankingResult[user_index]['score'];
        }
        const dataAnalyse = {
            correctCount: 0,
            wrongCount: 0,
            length: dataCourseConvert.length,
            duration: get(listCourse, 'data.duration', 0),
            timeStop: testTime,
            rank: fakeRank ? fakeRank : rank,
            score,
        }
        let correctArray = [];
        let inCorrectArray = [];
        Object.keys(resultGlobal)
            .map(i => {
                if (resultGlobal[i].isCorrect) {
                    dataAnalyse.correctCount++;
                    correctArray.push(resultGlobal[i].idQuestion);
                } else {
                    dataAnalyse.wrongCount++;
                    inCorrectArray.push(resultGlobal[i].idQuestion);
                }
            });

        navigation.navigate('AnalyseTest', {
            dataAnalyse,
            dataCourseConvert,
            resultGlobal,
            exam_relation: get(listCourse, 'exam_relation', []),
            lesson: get(listCourse, 'lesson', []),
            article_lesson: get(listCourse, 'article_lesson', []),
            lectures_lesson: get(listCourse, 'lectures_lesson', []),
            videos_lesson: get(listCourse, 'videos_lesson', []),
            examId: '',
            source,
        })

    }


    const _handleSubmitExam = useCallback(() => {
        setShowEnd(false);
        setTimeout(() => props.navigation.goBack(), 351);
        const correct = [];
        const incorrect = [];
        // Object.keys(resultGlobal).map((key) => {
        //     const { isCorrect, idQuestion } = resultGlobal[key] || {};
        //     if (isCorrect) correct.push(idQuestion)
        //     else incorrect.push(idQuestion);
        // });

        // api.post(`/exams/${idExam}`, {}, { correct, incorrect })
        //     .then(() => {
        //         setShowEnd(false);
        //         setTimeout(() => props.navigation.goBack(), 351);
        //     })
        //     .catch((err) => {
        //         setShowEnd(false);
        //         setTimeout(() => props.navigation.goBack(), 351);
        //     })

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
            return 1;
        } else if (nextIndex == 0) {
            return 1;
        } else {
            setIndex(nextIndex);
        }
    }, [index, dataCourseConvert.length])

    return (
        <View style={styles.container}>
            <TestHeader
                handleRightClick={() => setShowEnd(true)}
                handleChangeIndexIos={() => handleChangeIndexIos(+index + 1)}
                index={index}
                score={score}
                consecutive={consecutive}
                submit={submit}
                rankingResult={rankingResult}
                // initRanking={initRanking}
                showLoadingAnim={showLoadingAnim}
                setStopTime={setStopTime}
                isStop={showLoadingAnim.show}
                totalQues={dataCourseConvert.length}
                testTime={testTime}
                setTestTime={setTestTime}
            // setShowTimeout={setShowTimeout}
            />
            <SafeAreaView style={styles.container}>
                <Loading isLoading={isLoadingListCourse} err={errLoadingListCourse} com={LoadingCom}>
                    <View style={{ flex: 1, paddingVertical: 20, backgroundColor: '#fff' }}>
                        <ScrollView ref={refIos}>
                            <Animatable.View ref={iosAnimated} duration={400}>
                                {RenderQuestion(index, dataCourseConvert, actionGlobal, resultGlobal, setShowImg, setShowLoadingAnim)}
                            </Animatable.View>
                            <FeedbackModal data={{ type: 'question', id: get(dataCourseConvert, `[${index}].id`, '') }} />
                        </ScrollView>
                    </View>
                    {showRanking && <RankingDashboard
                        idExam={idExam}
                        end={index == dataCourseConvert.length} //dataCourseConvert.length
                        navigation={navigation}
                        setStopMusic={setStopMusic}
                        rankingData={rankingResult}
                        dataCourseConvert={dataCourseConvert}
                        _handleAnalyse={_handleAnalyse}
                        exam_relation={get(listCourse, 'exam_relation', [])}
                    />}
                </Loading>
                <View style={{ backgroundColor: 'black', height: 60, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <SoundPlayer end={stopMusic} />
                        <TouchableOpacity onPress={() => setVibrated(!vibrated)} style={{ backgroundColor: '#E6E6E6', width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                            <Icon type='MaterialCommunityIcons' name={vibrated ? 'vibrate' : 'vibrate-off'} style={{ color: 'black', fontSize: 26 }} />
                        </TouchableOpacity>
                    </View>
                    {showNextQues &&
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <BarLoading />
                        </View>
                    }
                </View>
                {showCounting && <Countdown />}
                {showQuesIdx && <FadingQuestionNumber index={index} />}
            </SafeAreaView>

            <EndPracticeModal
                setClose={setShowEnd}
                isOpen={showEnd}
                onExit={_handleSubmitExam}
            />
            {
                !!showImg ?
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
                                        }}
                                    />
                            }
                        </ImageZoom>
                    </TouchableOpacity>
                    : null
            }

            {
                showLoadingAnim.show ?
                    <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}>
                        <FadingOutCom
                            correct={showLoadingAnim.correct}
                        />
                        {showLoadingAnim.correct ?
                            <View style={{ position: 'absolute', top: 85 + helpers.statusBarHeight, right: 0, padding: 10, }}>
                                <Animatable.View animation='fadeOutUp' delay={500} duration={1600} style={{ paddingVertical: 5, alignItems: 'center', flexDirection: 'row' }}>
                                    <View style={{ width: 17, height: 17, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0DB576' }}>
                                        <Icon type='Feather' name='check' style={{ color: 'white', fontSize: 12 }} />
                                    </View>
                                    <Text style={{ marginLeft: 8, fontSize: 16, color: '#FDBF41', ...fontMaker({ weight: fontStyles.Bold }), backgroundColor: 'white', }}>+{CORRECT_POINT}</Text>
                                </Animatable.View>
                                {stopTime < 300 && stopTime > 0 &&
                                    <Animatable.View animation='fadeOutUp' delay={750} duration={1600} style={{ paddingVertical: 5, alignItems: 'center', flexDirection: 'row' }}>
                                        <View style={{ width: 17, height: 17, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8855C3' }}>
                                            <Icon type='Feather' name='clock' style={{ color: 'white', fontSize: 10 }} />
                                        </View>
                                        <Text style={{ marginLeft: 8, fontSize: 16, color: '#FDBF41', ...fontMaker({ weight: fontStyles.Bold }), backgroundColor: 'white', }}>{Math.floor(50 * (300 - stopTime) * 1.0 / 300)}</Text>
                                    </Animatable.View>
                                }
                                {consecutive % 3 == 0 &&
                                    <Animatable.View animation='fadeOutUp' delay={1000} duration={1600} style={{ paddingVertical: 5, alignItems: 'center', flexDirection: 'row' }}>
                                        <View style={{ width: 17, height: 17, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                                            <Icon type='Entypo' name='flash' style={{ fontSize: 13, color: 'white' }} />
                                        </View>
                                        <Text style={{ marginLeft: 8, fontSize: 16, color: '#FDBF41', ...fontMaker({ weight: fontStyles.Bold }), backgroundColor: 'white', }}>+{parseInt(consecutive / 3) * 100}</Text>
                                    </Animatable.View>
                                }
                            </View>
                            :
                            null
                        }
                    </View>
                    :
                    null
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
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
)(Test);

const styleContent = StyleSheet.create({
    viewRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    }
})
// 

const RenderQuestion = (indexItem = 1, dataCourseConvert, actionGlobal, resultGlobal, setShowImg = () => { }, showLoadingAnim = () => { }) => {
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
                showLoadingAnim={showLoadingAnim}
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
    setShowImg = () => { },
    showLoadingAnim = () => { }
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
                                _handleSubmit(answerId, isCorrect);
                                showLoadingAnim({ show: true, correct: isCorrect });
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
                            {/* {
                                isShow && isCorrect ?
                                    <View style={{ paddingLeft: 10, marginTop: 20 }}>
                                        <RenderData
                                            content={answerDetail}
                                            indexItem={indexQes}
                                            typeRender="reason"
                                            setShowImg={setShowImg}
                                        />
                                    </View> : null
                            } */}
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

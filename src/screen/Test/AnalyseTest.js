import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View, BackHandler, SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { Icon, Card } from 'native-base';
import { Snackbar } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import { fontMaker, fontStyles } from '../../utils/fonts';
import { fontSize, blackColor, COLOR, unitIntertitialId } from '../../handle/Constant';
import { GradientText } from '../../component/shared/GradientText';
import { helpers } from '../../utils/helpers';
import ViewContainer from '../../component/shared/ViewContainer';

import { RenderVideosRelated } from '../Lesson/component/VideosList';
import { RenderExamRelated } from '../Lesson/component/ExamList';
import { RenderArticlRelated } from '../Lesson/component/ArticleList';
import { useHookTextInput } from './component/CustomHook';
import { ClassChoosenModal } from '../../component/shared/ClassChoosenModal';
import SimpleToast from 'react-native-simple-toast';
import { test_services } from '../../redux/services/test.service';
import { user_services } from '../../redux/services';
import { setLearningTimes } from '../../redux/action/user_info';

/**-------------interstitial ad----------------- */
import firebase from 'react-native-firebase';
const AdRequest = firebase.admob.AdRequest;
let advert;
let request;

const TAG = 'analyse_test';

const AnalyseTest = (props) => {

    const { navigation } = props;
    const dispatch = useDispatch();

    const examId = navigation.getParam('examId', '');
    const source = navigation.getParam('source', '');

    const userInfoClass = useSelector(state => {
        return state.userInfo
    });

    // const lessonName = navigation.getParam('lessonName', '');

    const [dataAnalyse, setDataAnalyse] = useState(navigation.getParam('dataAnalyse', ''));
    const resultGlobal = navigation.getParam('resultGlobal', '');
    const dataCourseConvert = navigation.getParam('dataCourseConvert', '');

    const [showClass, setShowClass] = useState(false);
    const [visible, setVisible] = useState(false);
    const [grade, setGrade] = useState(get(userInfoClass, 'class', ''));

    const exam_relation = navigation.getParam('exam_relation', '');
    const lesson = navigation.getParam('lesson', '');
    // const article_lesson = navigation.getParam('article_lesson', '');
    // const lectures_lesson = navigation.getParam('lectures_lesson', '');
    // const videos_lesson = navigation.getParam('videos_lesson', '');

    useEffect(() => {
        setDataAnalyse(navigation.getParam('dataAnalyse', ''));
    }, [navigation.getParam('dataAnalyse', '')]);

    // interstial ad
    const learningTimes = useSelector(state => state.timeMachine.learning_times);
    useEffect(() => {
        console.log('---1-1-AnalyseTest-1-2');
        advert = firebase.admob().interstitial(unitIntertitialId);
        request = new AdRequest();
        request.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');
        advert.loadAd(request.build());
    }, [learningTimes]);

    useEffect(() => {
        async function getExamDashboard() {
            try {
                const result = await test_services.getTestDashboard(examId);
                if (result.data) {
                    const {
                        correct_answer,
                        incorrect_answer,
                        timedo,
                        unanswer,
                        exam
                    } = result.data;
                    const correctAnswer = JSON.parse(correct_answer)
                    const incorrectAnswer = JSON.parse(incorrect_answer);

                    setDataAnalyse({
                        correctCount: correctAnswer.length,
                        duration: exam.duration,
                        length: unanswer + correctAnswer.length + incorrectAnswer.length,
                        timeStop: exam.duration - timedo,
                        wrongCount: incorrectAnswer.length
                    })
                }

            } catch (err) {
                // console.log(err, '<err get ana>')
            }
        }

        // if (!navigation.getParam('dataAnalyse', '') && examId) getExamDashboard();

        BackHandler.addEventListener('hardwareBackPress', () => {
            if (!navigation.isFocused()) {
                return false;
            }
            handleBack()
        });

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', () => {
                if (!navigation.isFocused()) {
                    return false;
                }
                handleBack()
            });
        }

    }, [examId, source]);

    const handleBack = () => {
        if (source) {
            navigation.navigate(source);
            return true;
        } else {
            if (examId) {
                navigation.goBack();
                return true;
            } else {
                navigation.navigate('OverviewTest');
                return true;
            }
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ViewContainer
                showRight={false}
                showLeft={true}
                title='Thống kê'
                onLeft={handleBack}
                headerView={
                    <View style={{ flex: 1, marginRight: 20, marginTop: 45 + helpers.statusBarHeight }}>
                        <GradientText colors={['#1A66C3', '#29C3AB', '#29C3AB', '#29C3AB']} style={{ fontSize: 22, marginTop: 20 }}>Thống kê</GradientText>
                    </View>
                }
            >
                {dataAnalyse ?
                    <>
                        <RankingBanner dataAnalyse={dataAnalyse} />
                        {/* <ScorePart dataAnalyse={dataAnalyse} /> */}
                        {
                            // <TouchableOpacity onPress={() => {
                            //     // if (examId) {
                            //     //     navigation.navigate('Test', {
                            //     //         idExam: examId,
                            //     //         source,
                            //     //     })
                            //     //     return 1;
                            //     // }
                            //     if (dataCourseConvert && resultGlobal) {
                            //         navigation.navigate('ViewAnswer', { dataCourseConvert, resultGlobal });
                            //         dispatch(setLearningTimes());
                            //     }
                            // }} style={{}}>
                            //     <LinearGradient
                            //         start={{ x: 0, y: 0 }}
                            //         end={{ x: 1, y: 0 }}
                            //         style={{ width: '100%', paddingVertical: 12, alignSelf: 'center', borderRadius: 12, minWidth: 150, justifyContent: 'center', alignItems: 'center' }} colors={['#febf6f', COLOR.MAIN]}>
                            //         <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: 'white', fontSize: 17 }}>{''}</Text>
                            //     </LinearGradient>
                            // </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if (dataCourseConvert && resultGlobal) {
                                    navigation.navigate('ViewAnswer', { dataCourseConvert, resultGlobal, advert });
                                    // dispatch(setLearningTimes());
                                }
                            }} style={{}}>
                                <View style={{ backgroundColor: '#febf6f', flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 12, zIndex: 1001 }}>
                                    <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), color: 'white', fontSize: 17 }}>Xem lời giải</Text>
                                </View>
                                <View style={{ height: 20, backgroundColor: '#fa9e2f', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, zIndex: 1000, marginTop: -10 }}></View>
                            </TouchableOpacity>
                        }
                        <RelatingPart
                            exam_relation={exam_relation}
                            lesson={lesson}
                            // article_lesson={article_lesson}
                            // lectures_lesson={lectures_lesson}
                            // videos_lesson={videos_lesson}
                            navigation={navigation}
                            setVisible={setVisible}
                        />
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('TestStack');
                        }} style={{ marginTop: 25 }}>
                            <View style={{ backgroundColor: '#febf6f', flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 12, zIndex: 1001 }}>
                                <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), color: 'white', fontSize: 17 }}>Tìm bài thi khác</Text>
                            </View>
                            <View style={{ height: 20, backgroundColor: '#fa9e2f', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, zIndex: 1000, marginTop: -10 }}></View>
                        </TouchableOpacity>
                        {/* <StatisticsPart dataAnalyse={dataAnalyse} /> */}
                        <ConsultingForm
                            exam_relation={exam_relation}
                            setShowClass={setShowClass}
                            grade={grade}
                            setGrade={setGrade}
                            userInfoClass={userInfoClass}
                        />
                    </>
                    : null}

            </ViewContainer>

            <SafeAreaView />

            {/*  modal class*/}
            <ClassChoosenModal
                show={showClass}
                onClose={() => setShowClass(false)}
                setCurrentClass={(item) => {
                    setGrade(item);
                    setShowClass(false);
                }}
            />
            <Snackbar
                visible={visible}
                duration={5000}
                wrapperStyle={{ padding: 0 }}
                style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, borderRadius: 0 }}
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
};

const RankingBanner = ({ dataAnalyse }) => {
    const {
        rank,
        score,
        correctCount,
        wrongCount,
        length,
        timeStop,
    } = dataAnalyse;
    const noAnwer = length - correctCount - wrongCount;
    return (
        <View style={{ marginTop: 78, marginBottom: 36 }}>
            <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18 }}>Kết quả và lời giải</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 25, }}>
                <Animatable.View animation="slideInLeft" style={{ flex: 1, marginRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 12, backgroundColor: COLOR.MAIN_GREEN }}>
                    <View>
                        <Text style={{ color: COLOR.black(.7), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 16 }}>Hạng</Text>
                        <Text style={{ color: COLOR.white(1), ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 22, marginTop: 3 }}>{rank}</Text>
                    </View>
                    <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#8858BD', }}>
                        <Icon name='podium' style={{ color: 'white', fontSize: 22 }} />
                    </View>
                </Animatable.View>
                <Animatable.View animation="slideInRight" style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 12, backgroundColor: COLOR.MAIN }}>
                    <View>
                        <Text style={{ color: COLOR.black(.7), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 16 }}>Điểm</Text>
                        <Text style={{ color: COLOR.white(1), ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 22, marginTop: 3 }}>{score}</Text>
                    </View>
                    <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#F0B539' }}>
                        <Icon type='FontAwesome5' name='coins' style={{ color: 'white', fontSize: 16 }} />
                    </View>
                </Animatable.View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 20, }}>
                <Animatable.View animation="slideInLeft" style={{ flex: 1, marginRight: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 12, backgroundColor: COLOR.black(.1) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'center' }}>
                        <Icon type='Feather' name='check' style={{ color: '#69B175', fontSize: 22, marginRight: 3 }} />
                        <Text style={{ color: COLOR.black(1), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 20 }}>{correctCount}</Text>
                    </View>
                    <Text style={{ color: COLOR.black(.8), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 16, marginTop: 3 }}>Đúng</Text>
                </Animatable.View>
                <Animatable.View animation="slideInLeft" style={{ flex: 1, marginRight: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 12, backgroundColor: COLOR.black(.1) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'center' }}>
                        <Icon type='EvilIcons' name='close' style={{ color: '#F04465', fontSize: 22, marginRight: 3 }} />
                        <Text style={{ color: COLOR.black(1), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 20 }}>{wrongCount}</Text>
                    </View>
                    <Text style={{ color: COLOR.black(.8), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 16, marginTop: 3 }}>Sai</Text>
                </Animatable.View>
                <Animatable.View animation="slideInRight" style={{ flex: 1, marginRight: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 12, backgroundColor: COLOR.black(.1) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'center' }}>
                        <Icon type='AntDesign' name='exclamation' style={{ color: '#F04465', fontSize: 22, marginRight: 3 }} />
                        <Text style={{ color: COLOR.black(1), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 20 }}>{noAnwer}</Text>
                    </View>
                    <Text style={{ color: COLOR.black(.8), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 16, marginTop: 3 }}>Chưa làm</Text>
                </Animatable.View>
                <Animatable.View animation="slideInRight" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 12, backgroundColor: COLOR.black(.1) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'center' }}>
                        <Icon type='Entypo' name='stopwatch' style={{ color: '#69B175', fontSize: 22, marginRight: 3 }} />
                        <Text style={{ color: COLOR.black(1), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 20 }}>{(timeStop * 1.0 / length).toFixed(1)}s</Text>
                    </View>
                    <Text style={{ color: COLOR.black(.8), ...fontMaker({ weight: fontStyles.Regular }), fontSize: 16, marginTop: 3 }}>/Câu</Text>
                </Animatable.View>
            </View>
        </View>
    );
}

const ScorePart = ({ _hanldeShow, dataAnalyse }) => {
    const {
        correctCount,
        wrongCount,
        length,
    } = dataAnalyse;
    const noAnwer = length - correctCount - wrongCount;

    const data = [{ val: correctCount, color: '#69B175' }, { val: wrongCount, color: '#F04465' }, { val: noAnwer, color: '#dedede' }];

    return (
        <View style={{ flex: 1, marginTop: 5, marginHorizontal: 12, paddingTop: 20, backgroundColor: 'tranparent' }}>
            <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18 }}>Kết quả và lời giải</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 30 }}>
                <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18 }}>Kết quả và lời giải</Text>
                <View style={{ height: 160, width: 160, alignItems: 'flex-start', justifyContent: 'center' }}>
                    <AnimatedCircularProgress
                        size={120}
                        width={5}
                        duration={1000}
                        fill={correctCount / length * 100}
                        rotation={0}
                        tintColor="#69B175"
                        backgroundColor="#D5CFCD">
                        {
                            (fill) => (
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 17 }}>{correctCount}</Text>
                                    <View style={{ height: 1, width: 40, backgroundColor: COLOR.black(.5), marginVertical: 2 }} />
                                    <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: '#756964', fontSize: 17 }}>{length}</Text>
                                </View>
                            )
                        }
                    </AnimatedCircularProgress>
                </View>
                <View style={{ flex: 1, }}>
                    <Animatable.View animation='slideInRight' style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: COLOR.black(.07), width: '100%', paddingVertical: 12 }}>
                        <View style={{ width: 30 }}>
                            <Icon type='Feather' name='check' style={{ color: '#69B175', fontSize: 20 }} />
                        </View>
                        <Text style={{ ...fontMaker({ weight: 'Regular' }), color: COLOR.black(.6) }}>{correctCount} câu đúng</Text>
                    </Animatable.View>
                    <Animatable.View animation='slideInRight' delay={150} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: COLOR.black(.07), width: '100%', paddingVertical: 12 }}>
                        <View style={{ width: 30 }}>
                            <Icon type='EvilIcons' name='close' style={{ color: '#F04465', fontSize: 20 }} />
                        </View>
                        <Text style={{ ...fontMaker({ weight: 'Regular' }), color: COLOR.black(.6) }}>{wrongCount} câu sai</Text>
                    </Animatable.View>
                    <Animatable.View animation='slideInRight' delay={300} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: COLOR.black(.07), width: '100%', paddingVertical: 12 }}>
                        <View style={{ width: 30 }}>
                            <Icon type='AntDesign' name='doubleright' style={{ color: COLOR.MAIN, fontSize: 16, marginLeft: 2 }} />
                        </View>
                        <Text style={{ ...fontMaker({ weight: 'Regular' }), color: COLOR.black(.6) }}>{noAnwer} câu chưa trả lời</Text>
                    </Animatable.View>
                    <Animatable.View animation='slideInRight' delay={450} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: COLOR.black(.07), width: '100%', paddingVertical: 12 }}>
                        <View style={{ width: 30 }}>
                            <Icon type='Entypo' name='list' style={{ color: COLOR.MAIN, fontSize: 20 }} />
                        </View>
                        <Text style={{ ...fontMaker({ weight: 'Regular' }), color: COLOR.black(.6) }}>{length} câu hỏi</Text>
                    </Animatable.View>
                </View>
            </View>
        </View>
    );
}

const StatisticsPart = ({ dataAnalyse }) => {
    const {
        correctCount,
        wrongCount,
        length,
        timeStop,
        duration
    } = dataAnalyse;
    const noAnwer = length - correctCount - wrongCount;
    const correctPer = Math.floor((correctCount / length) * 100);
    const wrongPer = Math.floor((wrongCount / length) * 100);

    const timePer = Math.floor(((duration - timeStop) / duration) * 100);

    return (
        <View style={{ flex: 1, marginTop: 38, marginHorizontal: 12, borderTopWidth: 1, paddingTop: 20, borderTopColor: blackColor(0.1) }}>
            <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18 }}>Thống kê</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginVertical: 30 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 40 }}>
                    <AnimatedCircularProgress
                        size={120}
                        width={5}
                        duration={1000}
                        fill={correctPer}
                        rotation={0}
                        tintColor="#494DCB"
                        // onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="#D5CFCD">
                        {
                            (fill) => (
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ ...fontMaker({ weight: fontStyles.Bold }), fontSize: 18 }}>{correctPer}</Text>
                                    <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: '#756964' }}>%</Text>
                                </View>
                            )
                        }
                    </AnimatedCircularProgress>
                    <Text style={{ ...fontMaker({ weight: fontStyles.Bold }), fontSize: 17, marginTop: 25, color: '#3B333E' }}>Độ chính xác</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <AnimatedCircularProgress
                        size={120}
                        width={5}
                        duration={1000}
                        fill={timePer}
                        rotation={0}
                        tintColor="#629D38"
                        // onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="#D5CFCD">
                        {
                            (fill) => (
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ ...fontMaker({ weight: fontStyles.Bold }), fontSize: 18 }}>{timePer}</Text>
                                    <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: '#756964' }}>%</Text>
                                </View>
                            )
                        }
                    </AnimatedCircularProgress>
                    <Text style={{ ...fontMaker({ weight: fontStyles.Bold }), fontSize: 17, marginTop: 25, color: '#3B333E' }}>Thời gian làm bài</Text>
                </View>
            </View>
        </View>
    );
}

const ConsultingForm = ({ setShowClass, grade, userInfoClass, exam_relation }) => {

    const [name, nameInput] = useHookTextInput({});
    const [phone, phoneInput] = useHookTextInput({ placeholder: '096xxxxxxx', label: 'Số điện thoại (*)' });

    const handleRegister = async () => {
        try {

            // console.log('handleRegister', name, phone, grade);
            if (!(name.trim().length >= 3)) {
                Alert.alert(
                    "Chú ý",
                    'Tên của bạn cần có 3 ký tự trở lên',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
                return;
            }
            if (!helpers.checkValidPhone(phone)) {
                Alert.alert(
                    "Chú ý",
                    'Số điện thoại của bạn không đúng định dạng',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
                return;
            }
            const result = await user_services.getConsulting({
                name, phone, class: grade
            });

            if (result.status) {
                SimpleToast.show('Đã có lỗi khi đăng ký nhận tư vấn, mời bạn thử lại sau!');
            } else {
                SimpleToast.show('Đã đăng ký thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!');
            }
        } catch (err) {
            SimpleToast.show('Đã có lỗi khi đăng ký nhận tư vấn, mời bạn thử lại sau!');
        }

    }

    return (
        <View style={{ flex: 1, marginTop: exam_relation.length > 0 ? 5 : 30, paddingTop: 15, borderTopWidth: 1, borderTopColor: exam_relation.length > 0 ? 'white' : COLOR.black(.1) }}>
            <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18, textAlign: 'center', marginTop: 5 }}>Đăng ký nhận tư vấn và học thử miễn phí</Text>
            <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), fontSize: 16, textAlign: 'center', color: '#999CA2', marginTop: 10 }}>Dựa vào kết quả bài kiểm tra, đội ngũ gia sư của chúng tôi sẽ gọi điện tư vấn phương pháp học hiệu quả nhất dành cho bạn!</Text>
            <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type='Feather' name='check' style={{ color: COLOR.MAIN_GREEN, fontSize: 24 }} />
                    <Text style={{ marginLeft: 6 }}>Cam kết tăng 1-2 điểm thi</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type='Feather' name='check' style={{ color: COLOR.MAIN_GREEN, fontSize: 24 }} />
                    <Text style={{ marginLeft: 6 }}>Học thử hoàn toàn
                    <Text style={{ color: COLOR.MAIN, fontWeight: 'bold' }}> miễn phí</Text>
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type='Feather' name='check' style={{ color: COLOR.MAIN_GREEN, fontSize: 24 }} />
                    <Text style={{ marginLeft: 6 }}>Học online với đội ngũ gia sư
                    <Text style={{ color: COLOR.MAIN, fontWeight: 'bold' }}> chất lượng</Text>
                    </Text>
                </View>
            </View>
            {nameInput}
            {phoneInput}
            <Text style={styles.label}>Lớp bạn đang học</Text>
            <TouchableOpacity onPress={() => setShowClass(true)} style={styles.touchable}>
                {grade.length == 0 ?
                    <Text style={styles.grade}>Chọn lớp</Text>
                    :
                    <Text style={[styles.grade, { color: COLOR.black(1) }]}>Lớp {grade}</Text>
                }
                <Icon name='ios-arrow-down' style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister} style={{ alignSelf: 'center', marginTop: 25, marginBottom: 30 }}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ paddingHorizontal: 36, paddingVertical: 10, borderRadius: 24, minWidth: 150, justifyContent: 'center', alignItems: 'center' }} colors={['#febf6f', COLOR.MAIN]}>
                    <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: 'white', fontSize: fontSize.h3 }}>Đăng ký</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const RelatingPart = (props) => {
    const {
        exam_relation,
        lesson,
        // article_lesson,
        // lectures_lesson,
        // videos_lesson,
        // navigation,
        setVisible
    } = props;
    return (
        <View>

            {
                !isEmpty(exam_relation) ? (
                    <View style={{ borderTopColor: blackColor(0.1), borderTopWidth: 1, marginTop: 36, paddingTop: 10 }}>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10,  }}> */}
                        <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18, textAlign: 'center', marginTop: 7 }}>Các bài thi liên quan</Text>
                        {/* </View> */}
                        {exam_relation.slice(0, 5).map((item, index) => {
                            return <RenderExamRelated
                                handleNavigate={props.navigation.navigate}
                                item={item}
                                index={index}
                                book={lesson}
                                lessonId={get(lesson, 'id', '')}
                            />
                        })}
                    </View>
                ) : null
            }
            {/* {
                !isEmpty(lectures_lesson) || !isEmpty(videos_lesson) ? (
                    <View style={{ borderTopColor: '#ddd', borderTopWidth: 2, marginTop: 20, paddingTop: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingBottom: 10, alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 20, ...fontMaker({ weight: fontStyles.Regular }) }}>Các Videos liên quan</Text>
                        </View>
                        {[...videos_lesson, ...lectures_lesson].slice(0, 5).map((item, index) => {
                            return <RenderVideosRelated
                                handleNavigate={props.navigation.navigate}
                                item={item}
                                index={index}
                                setVisible={setVisible}
                            />
                        })}
                    </View>
                ) : null
            }
            {!isEmpty(article_lesson) &&
                <View style={{ borderTopColor: '#ddd', borderTopWidth: 2, marginTop: 20, paddingTop: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingBottom: 10, alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }) }}>Các bài tập liên quan</Text>
                    </View>
                    {article_lesson.slice(0, 5).map((item, index) => {
                        return <RenderArticlRelated
                            handleNavigate={navigation.navigate}
                            item={item}
                            index={index}
                        />
                    })}
                </View>
            } */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appleButton: {
        width: '100%',
        paddingVertical: 20,
        marginTop: 15
    },
    backHeader: {
        width: 40, height: 40, borderRadius: 20, marginLeft: 10,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'white',

        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },

    },
    touchable: {
        marginTop: 10,
        padding: 12,
        backgroundColor: COLOR.black(.03),
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLOR.black(.03),
        ...fontMaker({ weight: fontStyles.Regular }),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    grade: {
        ...fontMaker({ weight: fontStyles.Regular }),
        fontSize: 16,
        color: COLOR.black(.3)
    },
    icon: {
        fontSize: 20,
        color: COLOR.black(.3)
    },
    label: {
        ...fontMaker({ weight: fontStyles.Regular }),
        color: COLOR.black(.3),
        marginTop: 20
    },
})

export default AnalyseTest;

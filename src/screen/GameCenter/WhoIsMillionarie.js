import React, { useState, useEffect, useRef } from 'react'
import { Alert, FlatList } from 'react-native';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    Animated,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    ScrollView,
    ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { COLOR } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { images } from '../../utils/images';
import { Icon } from 'native-base';
import SQLite from 'react-native-sqlite-storage';
import { helpers } from '../../utils/helpers';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
SQLite.enablePromise(true);

const MAP_ANSWER = ['A', 'B', 'C', 'D'];

const { width, height } = Dimensions.get('window');

let db;

const WhoIsMillionaire = (props) => {

    const { navigation } = props;
    const [step, setStep] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [ans, setAns] = useState(null);
    const [submit, setSubmit] = useState(false);
    const [order, setOrder] = useState(0);
    const [timer, setTimer] = useState(30);
    const [restart, setRestart] = useState(true);

    const timerRef = useRef();

    const userInfo = useSelector(state => state.userInfo.user);

    useEffect(() => {
        if (step == 2) {
            timerRef.current = setInterval(() => {
                if (timer > 0) {
                    setTimer(prev => prev - 1)
                }
            }, 1000);
        }
    }, [step]);

    useEffect(() => {
        // if (timer == 30) {
        //     timerRef.current = setInterval(() => {
        //         if (timer > 0) {
        //             setTimer(prev => prev - 1)
        //         }
        //     }, 1000);
        // }
    }, [timer]);

    useEffect(() => {
        if (timer == 0) {
            clearInterval(timerRef.current);
            if (ans == null || ans != (questions[order].answer - 1)) {
                Alert.alert(
                    'VietJack',
                    `Đáp án của chúng tôi là ${MAP_ANSWER[questions[order].answer - 1]}. Cảm ơn bạn đã đến với chúng tôi, hãy trải nghiệm cùng VietJack nhé.`,
                    [
                        {
                            text: "Chơi game khác",
                            onPress: () => { navigation.goBack() }
                        },
                        { text: "Chơi lại", onPress: () => handleRestartGame(), style: "cancel" },
                    ],
                    { cancelable: false }
                );
            }
        }
    }, [timer]);


    useEffect(() => {
        if (ans != null) {
            Alert.alert(
                get(userInfo, 'name', ''),
                `Đáp án cuối cùng của bạn là ${MAP_ANSWER[ans]}`,
                [
                    {
                        text: "Chọn lại",
                        onPress: () => {
                            setAns(null);
                            // setOrder(0);
                        },
                        style: "cancel"
                    },
                    { text: "Đồng ý", onPress: () => handleConfirmAns(), }
                ],
                { cancelable: false }
            );
        }

    }, [ans]);

    const handleSelectAnswer = (idx) => {
        setAns(idx);
    }

    const handleRestartGame = () => {
        setOrder(0);
        setTimer(30);
        setAns(null);
        setSubmit(false);
        setRestart(true);
    }

    useEffect(() => {
        // console.log('------', submit);
        if (submit) {
            if (ans == (questions[order].answer - 1)) {
                setTimeout(() => {
                    setSubmit(false);
                    setAns(null);
                }, 3000);

                if (order < questions.length - 1) {
                    setTimeout(() => {
                        setOrder(order + 1);
                    }, 3000);
                }
            } else {
                setTimeout(() => {
                    setSubmit(false);
                    setAns(null);
                }, 3000);
            }
        }
    }, [submit]);

    const handleConfirmAns = async () => {
        // console.log('---as-a-s-as-as', ans, questions[order].answer - 1, ans == (questions[order].answer - 1));
        if (ans == (questions[order].answer - 1)) {
            if (order < questions.length - 1) {
                // setCorrectBlink(true);
                clearInterval(timerRef);
                setSubmit(true);
            } else {
                setSubmit(true);
                Alert.alert(
                    'Chúc mừng!!!',
                    `${get(userInfo, 'name', '')}, bạn đã trở thành ai là triệu phú "Tri thức"`,
                    [
                        {
                            text: "Chơi game khác",
                            onPress: () => { navigation.goBack() }
                        },
                        { text: "Chơi lại", onPress: () => handleRestartGame(), style: "cancel" },
                    ],
                    { cancelable: false }
                );
            }
        } else {
            // setCorrectBlink(true);
            // setWrongBlink(true);
            setSubmit(true);
            Alert.alert(
                'VietJack',
                `Đáp án của chúng tôi là ${MAP_ANSWER[questions[order].answer - 1]}. Cảm ơn bạn đã đến với chúng tôi, hãy trải nghiệm cùng VietJack nhé.`,
                [
                    {
                        text: "Chơi game khác",
                        onPress: () => { navigation.goBack() }
                    },
                    { text: "Chơi lại", onPress: () => handleRestartGame(), style: "cancel" },
                ],
                { cancelable: false }
            );
        }
    }

    useEffect(() => {
        if (restart) {
            // timerRef.current = setInterval(() => {
            //     if (timer > 0) {
            //         setTimer(prev => prev - 1)
            //     }
            // }, 1000);
            console.log('----get data-----');
            (async () => {
                db = await SQLite.openDatabase(
                    {
                        name: 'game.db',
                        createFromLocation: 1,
                    },
                    (success) => {
                        console.log('success', db);
                        if (db) {
                            db.transaction(tx => {
                                let allQuestions = [];

                                let p1 = new Promise((resolve, reject) => {
                                    tx.executeSql("SELECT * FROM millionaire WHERE level=1", [], (tx, results) => {
                                        let questionsData = [];
                                        for (let i = 0; i < results.rows.length; i++) {
                                            questionsData.push(results.rows.item(i));
                                        }
                                        const randomQuestions = helpers.getRandom(questionsData, 5);
                                        // console.log('questionsData===', randomQuestions);
                                        resolve(randomQuestions);
                                    });
                                });
                                let p2 = new Promise((resolve, reject) => {
                                    tx.executeSql("SELECT * FROM millionaire WHERE level=2", [], (tx, results) => {
                                        let questionsData = [];
                                        for (let i = 0; i < results.rows.length; i++) {
                                            questionsData.push(results.rows.item(i));
                                        }
                                        const randomQuestions = helpers.getRandom(questionsData, 5);
                                        resolve(randomQuestions);
                                    });
                                });
                                let p3 = new Promise((resolve, reject) => {
                                    tx.executeSql("SELECT * FROM millionaire WHERE level=3", [], (tx, results) => {
                                        let questionsData = [];

                                        for (let i = 0; i < results.rows.length; i++) {
                                            questionsData.push(results.rows.item(i));
                                        }
                                        const randomQuestions = helpers.getRandom(questionsData, 5);
                                        resolve(randomQuestions);
                                    });
                                });

                                Promise.all([p1, p2, p3]).then(values => {
                                    console.log(values);
                                    setRestart(true);
                                    setQuestions([...values[0], ...values[1], ...values[2]]);
                                }, reason => {
                                    console.log(reason)
                                });

                            });
                        }
                    },
                    (err) => {
                        console.log('----', err);
                    }
                )
            })();
        }
    }, [restart]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground source={images.milionBg} style={{ width, height, }}>
                {step == 0 &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Animatable.View animation='slideInLeft' duration={1200}>
                            <LinearGradient style={{ overflow: 'hidden', borderRadius: 30 }} colors={['#23308E', '#1D72D9', '#23308E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                <TouchableOpacity onPress={() => setStep(2)} style={styles.btn}>
                                    <Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.Bold }), fontSize: 20 }}>BẮT ĐẦU</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </Animatable.View>
                        <Animatable.View animation='slideInRight' duration={1200}>
                            <LinearGradient style={{ overflow: 'hidden', borderRadius: 30, marginTop: 16 }} colors={['#23308E', '#1D72D9', '#23308E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                <TouchableOpacity onPress={() => setStep(1)} style={styles.btn}>
                                    <Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.Bold }), fontSize: 20 }}>HƯỚNG DẪN</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </Animatable.View>
                        <Animatable.View animation='slideInLeft' duration={1200}>
                            <LinearGradient style={{ overflow: 'hidden', borderRadius: 30, marginTop: 16 }} colors={['#23308E', '#1D72D9', '#23308E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
                                    <Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.Bold }), fontSize: 20 }}>GAME KHÁC</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </Animatable.View>
                    </View>
                }
                {step == 1 &&
                    <SafeAreaView style={{ flex: 1 }}>
                        <Animatable.View animation='fadeIn' style={{ flex: 1, paddingHorizontal: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => setStep(0)} style={{ paddingVertical: 10, paddingRight: 10 }}>
                                    <Icon name='arrow-back' style={{ fontSize: 25, color: COLOR.MAIN }} />
                                </TouchableOpacity>
                                <Text style={{ color: 'yellow', fontSize: 22, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Hướng dẫn cách chơi</Text>
                            </View>
                            <Text style={{ color: 'white', fontSize: 15, ...fontMaker({ weight: fontStyles.Regular }) }}>Người chơi sẽ lần lượt vượt qua 15 câu hỏi của chương trình. Người thắng cuộc là người trả lời được câu hỏi số 15. Bạn sẽ có 3 sự trợ giúp:</Text>
                        </Animatable.View>
                    </SafeAreaView>
                }
                {step == 2 &&
                    <SafeAreaView style={{ flex: 1, }}>
                        <View style={{ flex: 1, padding: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity>
                                    <Text style={{ color: 'white' }}>Help1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={{ color: 'white' }}>Help2</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={{ color: 'white' }}>Help3</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, padding: 10 }}>
                                <View>
                                    <LinearGradient style={{ overflow: 'hidden', borderRadius: 12, padding: 12, marginTop: 16 }} colors={['#244196', '#1DAFED', '#244196']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                        <View style={{ width: '100%', minHeight: height / 6, justifyContent: 'center' }}>
                                            <Text style={{ color: 'white', fontSize: 16, }}>{get(questions, `${order}.question`)}</Text>
                                        </View>
                                    </LinearGradient>
                                    <View style={{ position: 'absolute', top: 2, left: 20, height: 26, backgroundColor: COLOR.white(1), justifyContent: 'center', paddingHorizontal: 12, borderRadius: 8 }}>
                                        <Text>Câu {order + 1}</Text>
                                    </View>
                                    <View style={{ position: 'absolute', bottom: -12, alignSelf: 'center', height: 26, backgroundColor: COLOR.white(1), justifyContent: 'center', paddingHorizontal: 12, borderRadius: 8 }}>
                                        <Text>{timer}</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, marginTop: 20 }}>
                                    <ScrollView style={{ flex: 1 }}>
                                        {questions.length > 0 &&
                                            ['option1', 'option2', 'option3', 'option4'].map((key, index) => {
                                                return (
                                                    <AnswerOption
                                                        key={index + key + 'answer'}
                                                        index={index}
                                                        value={questions[order][key]}
                                                        correctAns={questions[order].answer - 1}
                                                        userAns={ans}
                                                        // wrong={submit && wrongBlink}
                                                        submit={submit}
                                                        handleSelect={() => handleSelectAnswer(index)}
                                                    />
                                                )
                                            })}
                                    </ScrollView>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    Alert.alert(
                                        get(userInfo, 'name', ''),
                                        `Bạn có thực sự muốn từ bỏ cuộc chơi không?`,
                                        [
                                            {
                                                text: "Đồng ý",
                                                onPress: () => {
                                                    handleRestartGame();
                                                    setStep(0);
                                                },
                                                style: "cancel"
                                            },
                                            { text: "Huỷ bỏ", onPress: () => { }, }
                                        ],
                                        { cancelable: false }
                                    );
                                }} style={{ alignSelf: 'flex-end' }}>
                                    <Icon name='exit' style={{ fontSize: 32, color: 'red' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                }
            </ImageBackground>
        </View >
    )
}

export default WhoIsMillionaire;

const AnswerOption = ({ index, value, handleSelect = () => { }, correctAns, userAns, submit }) => {

    const [blink, setBlink] = useState(false);

    useEffect(() => {
        // let interval = null;
        // if (submit) {
        //     interval = setInterval(() => {
        //         setBlink(!blink);
        //     }, 200);
        // }

        // // setTimeout(() => { clearInterval(interval) }, 3000);

        // return () => {
        //     // if (submit) {
        //     // clearInterval(interval);
        //     // }
        // }
        const interval = setInterval(() => {
            setBlink((blink) => !blink);
        }, 200);
        return () => clearInterval(interval);
    }, [submit]);

    return (
        <Animatable.View animation={index % 2 ? 'slideInLeft' : 'slideInRight'} duration={1200}>
            <LinearGradient style={{ overflow: 'hidden', borderRadius: 30, marginTop: 20 }} colors={['#23308E', '#1D72D9', '#23308E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {userAns != null && userAns == index && !submit &&
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#B27D1F', '#f2ba55', '#B27D1F']} style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}></LinearGradient>
                }
                {submit &&
                    (correctAns == userAns ?
                        (
                            index == userAns &&
                            (blink && <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#18862F', '#1FAE28', '#18862F']} style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}></LinearGradient>)
                        )
                        :
                        (
                            (blink && <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={index == userAns ? ['#833413', '#B22A19', '#833413'] : (index == correctAns ? ['#18862F', '#1FAE28', '#18862F'] : ['transparent'])} style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}></LinearGradient>)
                        )
                    )}
                <TouchableOpacity onPress={handleSelect} style={[styles.option]}>
                    <Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.Regular }), fontSize: 18 }}>{MAP_ANSWER[index]}. {value}</Text>
                </TouchableOpacity>
            </LinearGradient>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    btn: {
        padding: 8, borderRadius: 30, borderWidth: 1, borderColor: 'white', width: 240, justifyContent: 'center', alignItems: 'center'
    },
    option: {
        padding: 8, borderRadius: 30, borderWidth: 1, borderColor: 'white', width: '100%', justifyContent: 'center',
        paddingHorizontal: 20
    }
});


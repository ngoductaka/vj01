import React, {
    useState,
    useCallback,
    useEffect,
    useRef
} from 'react';
import {
    FlatList,
    View,
    SafeAreaView,
    ScrollView,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Dimensions,
    Image,
    BackHandler,
    ActivityIndicator,
} from 'react-native';
import {
    Placeholder,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import { Icon } from 'native-base';
import { isEmpty, get } from 'lodash';
import * as Animatable from 'react-native-animatable';

import { COLOR, TIMES_SHOW_FULL_ADS, unitIntertitialId } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { useDispatch, useSelector } from 'react-redux';
import RenderData from './component/renderHtmlTest';

const { width, height } = Dimensions.get('window');

/**-------------interstitial ad----------------- */
import firebase from 'react-native-firebase';
import { setLearningTimes } from '../../redux/action/user_info';
import { fbFull } from '../../utils/facebookAds';
const AdRequest = firebase.admob.AdRequest;
let advert;
let request;

const TAG = 'view_answer';

const ViewAnwser = ({ navigation }) => {

    const resultGlobal = navigation.getParam('resultGlobal', '');
    const dataCourseConvert = navigation.getParam('dataCourseConvert', '');
    const [delay, setDelay] = useState(false);
    const screenAds = useSelector(state => get(state, 'subjects.screens', null));
    // const [adsLoading, setAdsLoading] = useState(false);
    const advertParam = navigation.getParam('advert', null);
    // console.log('-a-sa-s--a-sdasd', advertParam);
    const dispatch = useDispatch();

    useEffect(() => {
        if (screenAds && screenAds[TAG] == "1") {
            if (advertParam) {
                advertParam.show();
            } else {
                advertParam.show();
                fbFull()
            }
        }
        setTimeout(() => {
            setDelay(true)
        }, 50)

        BackHandler.addEventListener('hardwareBackPress', () => {
            if (!navigation.isFocused()) {
                return false;
            }
            navigation.goBack();
            return true;
        });

        return () => {
            dispatch(setLearningTimes());
            BackHandler.removeEventListener('hardwareBackPress', () => {
                if (!navigation.isFocused()) {
                    return false;
                }
                navigation.goBack();
                return true;
            });
        }
    }, []);

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#fff',
        }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}
                    style={[styles.backHeader]}>
                    <Icon type='MaterialIcons' name='close' style={{ fontSize: 26, color: '#F86087' }} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Text numberOfLines={1} style={{ color: '#444', fontSize: 18, ...fontMaker({ weight: fontStyles.Bold }) }}> Xem lời giải </Text>
                </View>
            </View>
            <View style={styles.container}>
                {
                    delay ?
                        <FlatList
                            data={dataCourseConvert}
                            style={{ marginBottom: 10 }}
                            extraData={dataCourseConvert}
                            renderItem={({ item, index }) => RenderQuestion(item, index, resultGlobal)}
                            keyExtractor={(item, index) => index + 'subitem'}
                        /> :
                        <View style={{ flex: 1 }}>
                            <View
                                style={{ backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 15, flex: 1, borderRadius: 10 }}
                            >
                                <Placeholder
                                    style={{ padding: 15, flex: 1 }}
                                    Animation={Fade}
                                >
                                    <PlaceholderLine style={{
                                        flex: 1,
                                        // marginTop: 40,
                                        width: '100%'
                                    }} />
                                    <PlaceholderLine style={{
                                        // flex: 1,
                                        width: '100%',
                                        marginTop: 35
                                    }} />
                                    <PlaceholderLine style={{
                                        // flex: 1,
                                        width: '100%',
                                        marginTop: 35
                                    }} />
                                    <PlaceholderLine style={{
                                        // flex: 1,
                                        width: '100%',
                                        marginTop: 35
                                    }} />
                                    <PlaceholderLine style={{
                                        // flex: 1,
                                        width: '100%',
                                        marginTop: 35
                                    }} />
                                </Placeholder>
                            </View>
                            <View
                                style={{ backgroundColor: '#fff', marginHorizontal: 10, marginVertical: 15, flex: 1, borderRadius: 10 }}
                            >
                                <Placeholder
                                    style={{ padding: 15, flex: 1 }}
                                    Animation={Fade}
                                >
                                    <PlaceholderLine style={{
                                        flex: 1,
                                        // marginTop: 40,
                                        width: '100%'
                                    }} />
                                    <PlaceholderLine style={{
                                        // flex: 1,
                                        width: '100%',
                                        marginTop: 35
                                    }} />
                                    <PlaceholderLine style={{
                                        // flex: 1,
                                        width: '100%',
                                        marginTop: 35
                                    }} />
                                    <PlaceholderLine style={{
                                        // flex: 1,
                                        width: '100%',
                                        marginTop: 35
                                    }} />
                                    <PlaceholderLine style={{
                                        // flex: 1,
                                        width: '100%',
                                        marginTop: 35
                                    }} />
                                </Placeholder>
                            </View>
                        </View>
                }
                {/* {adsLoading && (
                    <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: COLOR.white(1), justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator animating={true} size='large' color={COLOR.MAIN} />
                    </View>
                )} */}
            </View>
        </SafeAreaView>
    )
};

const colorMap = {
    1: COLOR.CORRECT,
    0: COLOR.WRONG,
    '-1': '#888'
}
const isCorrectMap = {
    1: 'Đúng',
    0: 'Sai',
    '-1': 'Chưa trả lời'
}
// 
const RenderQuestion = (dataCourseConvert, indexItem, resultGlobal) => {
    const { content, answers = [], answer_detail = '', id } = dataCourseConvert;
    const isCorrect = get(resultGlobal, `${indexItem + 1}.isCorrect`, -1);

    return (
        <Animatable.View
            animation='fadeInUp'
            delay={100 * (indexItem)}
            style={{
                marginTop: 15,
                backgroundColor: '#fff',
                borderRadius: 10,
                marginHorizontal: 10,
            }}>
            <View style={{
                padding: 10,
                marginBottom: 10,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontSize: 20, ...fontMaker({ weight: fontStyles.Bold }) }}>
                        Câu {indexItem + 1}
                    </Text>
                    <View style={{ backgroundColor: colorMap[isCorrect], paddingVertical: 5, borderRadius: 5, minWidth: 70, alignItems: 'center', paddingHorizontal: 15 }}>
                        <Text style={{ color: '#fff', ...fontMaker({ weight: fontStyles.Bold }) }}>
                            {isCorrectMap[isCorrect]}
                        </Text>
                    </View>
                </View>
                <RenderData
                    indexItem={indexItem}
                    content={content}
                />
            </View>
            <SelectAnswer
                indexQes={indexItem}
                listAnswer={answers}
                _handleSelect={() => { }}
                answerDetail={answer_detail}
                userChoose={resultGlobal[indexItem + 1]}
                idQuestion={id}
                show={true}
            />
        </Animatable.View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    backHeader: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        // shadowColor: "rgba(0,0,0,0.3)",
        // shadowOffset: {
        //     width: 1,
        //     height: 2,
        // },
        // shadowOpacity: 0.37,
        // shadowRadius: 10.49,
        // elevation: 12,
    },
    container: {
        flex: 1,
        // paddingTop: 20,
        // marginBottom: 40,
        backgroundColor: '#dedede'
    }
})


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
    show
}) => {
    const [userChooses, setUserChoose] = useState('');
    const [isShow, setShowAns] = useState(false);

    // handle show data
    useEffect(() => {
        if (userChooseProp) {
            setUserChoose(userChooseProp.answerId)
            // setShowAns(true);
        } else {
            setUserChoose('');
            setShowAns(false)
        }
    }, [indexQes, userChooseProp]);

    const _handleSubmit = useCallback((answerId, isCorrect) => {
        // setShowAns(true);
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
                                setUserChoose(userChooses == answerId ? '' : answerId)
                                _handleSubmit(answerId, isCorrect)
                            }}
                            style={[styleAnswer.container, {
                                borderColor: isCorrect && show ? COLOR.CORRECT : (isActive ? COLOR.WRONG : '#dedede'),
                            }]}
                            disabled={show}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styleAnswer.swapper]}>
                                    <Text style={[styleAnswer.quesText, { color: COLOR.MAIN }]}>{convertAnswer[index]}.</Text>
                                </View>
                                <RenderData
                                    indexItem={indexQes}
                                    content={content}
                                    typeRender="answer"
                                />
                            </View>
                            {
                                show && isCorrect ?
                                    <View style={{ paddingLeft: 10, marginTop: 20 }}>
                                        <RenderData
                                            content={answerDetail}
                                            indexItem={indexQes}
                                            typeRender="reason"
                                        />
                                    </View> : null
                            }
                        </TouchableOpacity>
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

const styleContent = StyleSheet.create({
    viewRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    }
});
export default ViewAnwser;
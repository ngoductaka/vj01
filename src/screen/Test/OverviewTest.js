import React, { useEffect, useState } from 'react';
import {
    View,
    SafeAreaView, ScrollView, Text, StyleSheet,
    TouchableOpacity, Image, StatusBar, BackHandler,
    Dimensions, Alert
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Icon, Card } from 'native-base';
import * as Animatable from 'react-native-animatable';
import { Snackbar } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import { Loading } from '../../handle/api';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { fontSize, COLOR } from '../../handle/Constant';
import { GradientText } from '../../component/shared/GradientText';
import { handleSrc } from '../../component/menuItem';
import { images } from '../../utils/images';
import { helpers } from '../../utils/helpers';
import { setLearningTimes } from '../../redux/action/user_info';
import { user_services } from '../../redux/services';
const { height, width } = Dimensions.get('window');

const OverviewTest = (props) => {

    const dispatch = useDispatch();

    const title = props.navigation.getParam('title', '');
    const idExam = props.navigation.getParam('idExam', '');
    const subject = props.navigation.getParam('subject', '');
    const lessonId = props.navigation.getParam('lessonId', '');
    const time = props.navigation.getParam('time', '');
    const count = props.navigation.getParam('count', '');

    const [visible, setVisible] = useState(false);

    const _onTest = (item) => {
        props.navigation.navigate('Test', { idExam, title, lessonId })
    }
    const _handleNavigate = (screen, params) => {
        props.navigation.navigate(screen, params)
    }

    useEffect(() => {
        BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButtonPressAndroid
        );
        return () => {
            dispatch(setLearningTimes());
            BackHandler.removeEventListener(
                'hardwareBackPress',
                handleBackButtonPressAndroid
            );
        }
    }, []);

    const handleBackButtonPressAndroid = () => {
        if (props.navigation.isFocused()) {
            props.navigation.goBack();
            return true;
        }
        return false;
    }

    const handleBookmark = async () => {
        const result = await user_services.bookmarkLesson({
            'bookmark_id': idExam,
            'bookmark_type': 'exam',
        });
        // console.log(result)
        if (typeof (result.status) === 'undefined') {
            setVisible(true);
        } else {
            setTimeout(() => {
                Alert.alert(
                    "Oops!",
                    `Đã có lỗi xảy ra khi bookmark bài học`,
                    [
                        { text: "OK" }
                    ],
                    { cancelable: false }
                );
            }, 351);
        }
    }

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <StatusBar backgroundColor={'#fff'} barStyle='dark-content' />
            <SafeAreaView style={{ flex: 1 }}>
                <Loading>
                    <View style={{ paddingHorizontal: 15, flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginRight: 20, marginTop: 45 + helpers.statusBarHeight }}>
                            <Text numberOfLines={2} style={{ ...fontMaker({ weight: fontStyles.Light }), lineHeight: 22, fontSize: 15 }}>{subject || ''}</Text>
                            <GradientText style={{ fontSize: 22, marginTop: 4 }}>{title || ''}</GradientText>
                        </View>
                        <Animatable.View animation='bounceIn' delay={400}>
                            <TouchableOpacity onPress={handleBookmark} style={styles.bookmark}>
                                <Icon name='ios-bookmark' style={{ fontSize: 20, color: COLOR.white(1) }} />
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                    <View style={{ flex: 1, marginTop: 38 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                            <OverviewItem figure={count} />
                            <OverviewItem icon={images.clock} figure={Math.floor(time / 60)} label='Phút' style={{ marginLeft: 40 }} />
                        </View>
                        <Text style={{ fontSize: 20, ...fontMaker({ weight: fontStyles.Regular }), marginVertical: 30, paddingHorizontal: 20 }}>HƯỚNG DẪN</Text>
                        <ScrollView style={{ flex: 1, }}>
                            <IntroductionItem icon={images.star_test} text='Với những câu trả lời đúng bạn sẽ giành được 1 điểm, 0 điểm đối với những câu trả lời sai' />
                            <IntroductionItem icon={images.checked_test} text='Chọn câu trả lời bằng cách "Click" vào nó' style={{ marginTop: 10 }} />
                            <IntroductionItem icon={images.eye_test} text='Bạn có thể bỏ qua câu hỏi nếu chưa có sự lựa chọn nào, sau đó có thể làm lại' style={{ marginTop: 10 }} />
                        </ScrollView>
                    </View>
                    {/* back btn */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', paddingVertical: 8 }}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backHeader}>
                            <Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 26, color: '#F86087' }} />
                        </TouchableOpacity>
                    </View>
                </Loading>
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-around', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => _handleNavigate('PracticeExam', { idExam })}
                        style={{ alignSelf: 'center', marginBottom: 20 }}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ width: width / 2 - 30, alignItems: "center", paddingVertical: 12, alignSelf: 'center', borderRadius: 24 }} colors={['#F25B71', COLOR.MAIN]}>
                            <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: 'white', fontSize: fontSize.h3 }}>Luyện tập</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={_onTest} style={{ alignSelf: 'center', marginBottom: 20 }}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ width: width / 2 - 30, alignItems: "center", paddingVertical: 12, alignSelf: 'center', borderRadius: 24 }} colors={['#F25B71', '#EF94F5']}>
                            <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: 'white', fontSize: fontSize.h3 }}>Thi Đấu</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <Snackbar
                visible={visible}
                duration={5000}
                wrapperStyle={{ padding: 0 }}
                style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, borderRadius: 0 }}
                onDismiss={() => setVisible(false)}
                action={{
                    label: 'Xem ngay',
                    onPress: () => {
                        props.navigation.navigate('Bookmark');
                    },
                }}>
                Đã thêm vào "Bookmarks"
                </Snackbar>
        </View>
    )
};

const OverviewItem = ({ icon = images.question, figure = 10, label = 'Câu hỏi', style = {} }) => {
    return (

        <View style={{ flexDirection: 'row', alignItems: 'center', ...style }}>
            <View style={{ width: 50, height: 50 }}>
                <Image
                    source={icon}
                    style={{ flex: 1, width: null, height: null }}
                />
            </View>
            <View style={{ height: 50, marginLeft: 8, justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 28, ...fontMaker({ weight: fontStyles.Bold }) }}>{figure}</Text>
                <Text style={{ ...fontMaker({ weight: fontStyles.Regular }) }}>{label}</Text>
            </View>
        </View>

    );
}

const IntroductionItem = ({ icon = images.star_test, text = '', style = {} }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, ...style }}>
            <Image source={icon} style={{ width: 40, height: 40 }} />
            <View style={{ flex: 1, marginLeft: 20 }}>
                <Text style={{ lineHeight: 22, color: '#5B5B5B' }}>{text}</Text>
            </View>
        </View>
    );
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
    bookmark: {
        width: 40, height: 40, marginTop: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: COLOR.MAIN, borderRadius: 20,
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 11,
        shadowOffset: { width: 12, height: 13 },
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
    }
})

export default OverviewTest;

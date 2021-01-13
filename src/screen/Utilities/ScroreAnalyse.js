import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Alert, TextInput, TouchableOpacity,
    Pressable, Text, Dimensions, ImageBackground, FlatList
} from 'react-native';
import { cloneDeep } from 'lodash';
import TimeTableView_, { genTimeBlock } from 'react-native-timetable';
import Orientation from 'react-native-orientation-locker';
import { Icon } from 'native-base';
import ModalBox from 'react-native-modalbox';
import TimePicker from 'react-native-simple-time-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { get } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';

import { HeaderBarWithBack } from '../../component/Header/Normal';
import ScoreTable, { listSubject, calScore, calAverage } from './com/ScoreTable'
import { useStorage, KEY } from '../../handle/handleStorage';
import { COLOR } from '../../handle/Constant';
import { GradientText } from '../../component/shared/GradientText';

const { height, width } = Dimensions.get('screen');

const Timetable = (props) => {
    const { navigation } = props;
    const [isOpen, setOpen] = useState(false);
    const [view, setView] = useState(0);
    const [events, setEvents] = useStorage(KEY.SCORETABLE, []);
    const userInfo = useSelector(state => state.userInfo);
    const [focus, setFocus] = useState(null);
    const flatRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            // console.log('focusfocusfocusfocus', flatRef.current)
            if (focus && flatRef.current && flatRef.current.scrollToIndex) {
                // console.log('-------000000', focus)
                flatRef.current.scrollToIndex({ animated: true, index: 5 });
            }

        }, 500)
    }, [focus])

    const _hanldePress = (val) => {
        const [key] = Object.keys(val);
        const [level, subject] = key.split('-');
        const score = val[key]
        console.log(level, subject)

        if (level != 0)
            setOpen({ score, level, subject })
    }

    const _hanldeDelete = () => {
        Alert.alert(
            "Xoá thông tin",
            "Bạn muốn xoá tất cả thông tin học tập ?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => setEvents({}) }
            ],
            { cancelable: true }
        );

    }

    const _handleSubmit = useCallback((val) => {
        setEvents({
            ...events,
            ...val
        })
        setOpen(false)
    }, [events]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBarWithBack
                text="Kết quả học tập"
                RightCom={
                    <TouchableOpacity onPress={_hanldeDelete}>
                        <Icon name="delete-sweep" type="MaterialIcons" style={{ color: 'red' }} />
                    </TouchableOpacity>
                }
                leftAction={() => navigation.goBack()} />
            <View style={styles.container}>
                {/* <TimeTableView
                    data={events}
                    onPress={_hanldePress}
                /> */}
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AccountStack')}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 19, marginBottom: 9, color: '#111' }}>{get(userInfo, 'user.name', '')}</Text>
                        <Text style={{ color: '#333' }}>Lớp {userInfo.class}</Text>
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <ImageBackground
                            style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}
                            resizeMode="contain"
                            source={{ uri: 'https://previews.123rf.com/images/jovanas/jovanas1602/jovanas160201067/52031553-laurel-icon.jpg' }}>
                            <GradientText>
                                {calAverage(events) || "..."}
                            </GradientText>
                        </ImageBackground>
                        <Text>Trung bình môn</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 19, marginBottom: 9, color: '#111' }}>Học kỳ 1</Text>
                    </View>
                </View>

                <View style={{ overflow: 'hidden', backgroundColor: '#fff', flex: 1 }}>

                    <ScoreTable
                        refS={flatRef}
                        style={{
                            display: view ? 'flex' : 'none',
                        }}
                        onPress={_hanldePress} data={events}
                        focus={view ? focus: null}
                         />
                    <FlatList
                        data={listSubject}
                        numColumns={2}
                        style={{ display: view ? 'none' : 'flex' }}
                        renderItem={({ item, index }) => {
                            // const cl = randomColor() || 'febf6f';
                            // console.log('clclclclcl', cl)
                            const colors = [item.color, hexToRGB(item.color)];
                            const tb = calScore(index, events)

                            return (
                                <TouchableOpacity onPress={() => {
                                    setView(1); setFocus(index);
                                    console.log('indexindexindex', index)
                                }}>
                                    <LinearGradient
                                        style={{
                                            height: 100,
                                            width: width / 2 - 30,
                                            // backgroundColor: 'red',
                                            margin: 10, justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 10,
                                            marginHorizontal: 15,
                                        }}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        // style={{ flex: 1 }}
                                        // style={{ paddingHorizontal: 36, paddingVertical: 10, borderRadius: 24, minWidth: 150, justifyContent: 'center', alignItems: 'center' }}
                                        // colors={['#ff7e5f', '#feb47b']}
                                        colors={colors}
                                    >

                                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#f2f2f2' }}>{item.text}</Text>
                                        <Text style={{ marginTop: 5, color: '#f2f2f2' }}>{tb || "..."}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            )
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => setView(!view)}
                        style={[{
                            position: 'absolute',
                            bottom: 10, right: 10, height: 50, width: 50, borderRadius: 50,
                            justifyContent: 'center', alignItems: 'center', borderColor: '#f3f3f3', borderWidth: 1,
                        }, styles.shadow]}>
                        <Icon name="swap" type="AntDesign" />

                    </TouchableOpacity>

                </View>

            </View>
            <ModalScore
                setOpen={setOpen}
                isOpen={isOpen}
                submit={_handleSubmit} />
        </SafeAreaView>
    )
};

export default Timetable;

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#004bb9',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bottomView: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 0, left: 0,
    },
    addBtn: {
        height: 50,
        width: 50,
        backgroundColor: 'green',
        borderRadius: 50,
        opacity: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
    },
    shadow: {
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },
    },
});


const ModalScore = ({
    setOpen = () => { },
    isOpen = false,
    submit
}) => {
    const [scoreSuject, setScoreSubject] = useState(['']);
    const [title, setTitle] = useState('');

    const [showSubject, setShowSubject] = useState(false)

    const _handleSubmit = () => {

        const { score, level, subject } = isOpen;
        const listScore = scoreSuject.filter(Boolean);
        if (!listScore.length) {
            Toast.show(`Bạn chưa nhập điểm`);
            submit({ [`${level}-${subject}`]: '' })
        }
        const inValidNUmber = listScore.find(i => {
            if (isNaN(i) || parseFloat(i) > 10) {
                return true
            }
            return false
        });
        if (inValidNUmber) {
            Toast.show(`${inValidNUmber} không hợp lệ vui lòng nhập lại`);

        } else {
            submit({ [`${level}-${subject}`]: listScore.join('-') })

        }
        console.log('inValidNUmber', inValidNUmber)
        // if (!subject) {
        //     Toast.showWithGravity("Vui lòng nhập môn học", Toast.SHORT, Toast.CENTER);
        //     return 1;
        // }
        // const [position = ''] = Object.keys(isOpen);
        // submit({ [position]: subject })

    }

    const _handleAddMore = () => {
        if (scoreSuject.length >= 4) {
            Toast.show("Bạn chỉ có thể nhật tối đa 4 điểm số")
            return 1;
        }
        setScoreSubject([...scoreSuject, ''])

    }
    const _handleChangeText = (index, text) => {
        scoreSuject[index] = text;
        setScoreSubject([...scoreSuject])

    }
    const _handleRemove = (index) => {
        scoreSuject.splice(index, 1);
        console.log('scoreSuject', scoreSuject)
        setScoreSubject([...scoreSuject]);
    }
    useEffect(() => {
        if (isOpen) {
            try {
                const { score, level, subject } = isOpen;
                setTitle(`Môn ${get(listSubject, `[${subject}].text`)} • hệ số ${level}`)
                if (score) {
                    const listScore = score.split('-');
                    if (listScore < 4) {
                        setScoreSubject([...listScore, ''])

                    } else
                        setScoreSubject(listScore)

                } else {
                    setScoreSubject([''])

                }

            } catch (err) {
                console.log(err)
            }
        } else {
            setScoreSubject([''])
        }
    }, [isOpen])
    return (
        <ModalBox
            onClosed={() => setOpen(false)}
            isOpen={!!isOpen}
            animationDuration={300}
            coverScreen={true}
            backdropPressToClose={true}
            swipeToClose={false}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{
                width: width - 20,
                height: null,
                borderRadius: 10,
                // borderTopLeftRadius: 15, borderTopRightRadius: 15,
                overflow: 'hidden'
            }}
            position='center'
        >
            <View style={{
                paddingTop: 20,
                // height: height / 3,
                backgroundColor: '#fff', width: '100%', paddingHorizontal: 20
            }}>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: '#222', marginBottom: 10, fontWeight: '600' }}>Sửa bảng điểm</Text>
                    <Text style={{ fontSize: 15, color: '#222', marginBottom: 20 }}>{title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, }}>
                            {scoreSuject.map((scoreItem, index) => {
                                return (
                                    <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            clearButtonMode="always"
                                            value={scoreItem}
                                            onChangeText={(text) => _handleChangeText(index, text)}
                                            placeholder="Nhập điểm"
                                            keyboardType="numeric"
                                            // underlineColor={"#fff"}
                                            underlineColor="transparent"
                                            underlineColorAndroid="transparent"
                                            style={{
                                                backgroundColor: '#fff',
                                                height: 40,
                                                paddingHorizontal: 10,
                                                paddingVertical: 5,
                                                borderWidth: 1,
                                                fontSize: 16,
                                                borderColor: "#ddd",
                                                borderRadius: 7,
                                                flex: 1
                                            }} />
                                        <Pressable style={{ paddingLeft: 10 }} onPress={() => _handleRemove(index)}>
                                            <Icon name="minus" type="AntDesign" />
                                        </Pressable>
                                    </View>
                                )

                            })}
                            {/* <View>
                                <TextInput
                                    clearButtonMode="always"
                                    value={''}
                                    onChangeText={() => { }}
                                    placeholder="Nhập điểm"
                                    keyboardType="numeric"
                                    underlineColor="transparent"
                                    underlineColorAndroid="transparent"
                                    style={{
                                        backgroundColor: '#fff',
                                        height: 40,
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderWidth: 1,
                                        fontSize: 16,
                                        borderColor: "#ddd",
                                        borderRadius: 7,
                                    }} />
                            </View> */}
                        </View>

                    </View>
                </View>
                <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={_handleAddMore}
                        style={{
                            backgroundColor: "#f2f2f2",
                            paddingHorizontal: 15, paddingVertical: 10,
                            borderRadius: 7, borderColor: '#ddd', borderWidth: 1,
                            marginBottom: 18, marginTop: 20
                        }}>
                        <Text style={{ color: '#222' }}>Thêm điểm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={_handleSubmit}
                        style={{
                            backgroundColor: "#337ab7",
                            paddingHorizontal: 15, paddingVertical: 10,
                            borderRadius: 7, borderColor: '#ddd', borderWidth: 1,
                            marginBottom: 18, marginTop: 20
                        }}>
                        <Text style={{ color: '#fff' }}>Cập nhật</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ModalBox
                onClosed={() => setShowSubject(false)}
                isOpen={showSubject}
                animationDuration={300}
                coverScreen={true}
                backdropPressToClose={true}
                swipeToClose={false}
                backdropColor='rgba(0, 0, 0, 1)'
                style={{
                    width: width,
                    height: null,
                    borderRadius: 10,
                    // borderTopLeftRadius: 15, borderTopRightRadius: 15,
                    overflow: 'hidden'
                }}
                position='bottom'
            >

                <View style={{
                    paddingTop: 20,
                    height: height * 2 / 3,
                    backgroundColor: '#fff', width: '100%', paddingHorizontal: 20
                }}>
                    <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: '600' }}>Chọn môn học</Text>
                    <FlatList
                        data={listSubject}
                        style={{ flex: 1, marginBottom: 30 }}
                        renderItem={({ item }) => {
                            return (
                                <Pressable onPress={() => { setSubject(item.text); setShowSubject(false) }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 }}>
                                        <View style={{ height: 30, width: 30, borderRadius: 30, borderWidth: 2, borderColor: COLOR.MAIN, justifyContent: 'center', alignItems: 'center' }} >
                                            <View style={{ borderRadius: 15, height: 15, width: 15, backgroundColor: item.text == subject ? COLOR.MAIN : '#fff' }} />
                                        </View>
                                        <Text style={{ marginLeft: 20, fontSize: 16 }}>{item.text}</Text>
                                    </View>
                                </Pressable>
                            )
                        }}
                        keyExtractor={({ item, index }) => index + ''}
                    />
                </View>
            </ModalBox>
        </ModalBox>
    )
}


const mapDay = {
    2: 'Thứ 2',
    3: 'Thứ 3',
    4: 'Thứ 4',
    5: 'Thứ 5',
    6: 'Thứ 6',
    7: 'Thứ 7',
    0: 'Chủ nhật'
};

const mapSession = {
    's': 'Sáng',
    'c': 'Chiều',
    't': 'Tối'
}


var randomColor = () => Math.floor(Math.random() * 16777215).toString(16)
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function hexToRGB(h) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];

        // 6 digits
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }

    return "rgba(" + +r + "," + +g + "," + +b + ",0.5)";
}
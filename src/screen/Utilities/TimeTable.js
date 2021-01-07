import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Alert, TextInput,
    Pressable, Text, Dimensions,
} from 'react-native';
import { cloneDeep } from 'lodash';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import Orientation from 'react-native-orientation-locker';
import { Icon } from 'native-base';
import ModalBox from 'react-native-modalbox';
import TimePicker from 'react-native-simple-time-picker';


import { HeaderBarWithBack } from '../../component/Header/Normal';

const { height, width } = Dimensions.get('screen');

const Timetable = (props) => {
    const { navigation } = props;
    const [events, setEvents] = useState(events_data_Init)
    const [isOpen, setOpen] = useState(false)
    useEffect(() => {
        Orientation.lockToLandscape();
        console.log('heightheightheight', height, width)
        return () => {
            Orientation.lockToPortrait()
        }

    }, []);

    const hanldeAddItem = useCallback((val) => {
        // const {}

    }, [events])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBarWithBack text="Thời khoá biểu" leftAction={() => navigation.goBack()} />
            <View style={styles.container}>
                <TimeTableView
                    // scrollViewRef={this.scrollViewRef}
                    events={events}
                    pivotTime={9}
                    pivotEndTime={20}
                    pivotDate={genTimeBlock('mon')}
                    numberOfDays={6}
                    onEventPress={(evt) => {
                        Alert.alert("onEventPress", JSON.stringify(evt));
                    }}
                    headerStyle={styles.headerStyle}
                    formatDateHeader="dddd"
                    locale="vi"
                />
            </View>
            <View style={styles.bottomView}>
                <Pressable onPress={() => setOpen(true)} style={styles.addBtn}>
                    <Icon style={{ color: '#fff' }} name="plus" type="AntDesign" />
                </Pressable>
            </View>
            <ModalTimetable
                setOpen={setOpen}
                isOpen={isOpen}
                submit={hanldeAddItem} />
        </SafeAreaView>
    )
};

export default Timetable;

const events_data_Init = [
    {
        title: "Math-----",
        startTime: genTimeBlock("MON", 9),
        endTime: genTimeBlock("MON", 10, 30),
        location: "Classroom 403",
        extra_descriptions: ["Kim", "Lee"],
    },
    {
        title: "Math",
        startTime: genTimeBlock("WED", 9),
        endTime: genTimeBlock("WED", 10, 50),
        location: "Classroom 403",
        extra_descriptions: ["Kim", "Lee"],
    },
    {
        title: "Physics",
        startTime: genTimeBlock("MON", 11),
        endTime: genTimeBlock("MON", 11, 50),
        location: "Lab 404",
        extra_descriptions: ["Einstein"],
    },
    {
        title: "Physics",
        startTime: genTimeBlock("WED", 11),
        endTime: genTimeBlock("WED", 11, 50),
        location: "Lab 404",
        extra_descriptions: ["Einstein"],
    },
    {
        title: "Mandarin",
        startTime: genTimeBlock("TUE", 9),
        endTime: genTimeBlock("TUE", 10, 50),
        location: "Language Center",
        extra_descriptions: ["Chen"],
    },
    {
        title: "Japanese",
        startTime: genTimeBlock("FRI", 9),
        endTime: genTimeBlock("FRI", 10, 50),
        location: "Language Center",
        extra_descriptions: ["Nakamura"],
    },
    {
        title: "Club Activity",
        startTime: genTimeBlock("THU", 9),
        endTime: genTimeBlock("THU", 10, 50),
        location: "Activity Center",
    },
    {
        title: "Club Activity",
        startTime: genTimeBlock("FRI", 13, 30),
        endTime: genTimeBlock("FRI", 14, 50),
        location: "Activity Center",
    },
];

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#004bb9',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
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
    }
});


const ModalTimetable = ({
    setOpen = () => { },
    isOpen = false,
    submit
}) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState({
        from: [8, 30],
        to: [10, 30],
    });
    console.log('isOpenisOpenisOpen', isOpen)
    return (
        <ModalBox
            onClosed={() => setOpen(false)}
            isOpen={!!isOpen}
            animationDuration={300}
            coverScreen={true}
            backdropPressToClose={true}
            swipeToClose={false}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{ width: width, height: null, borderTopLeftRadius: 15, borderTopRightRadius: 15, overflow: 'hidden' }}
            position='bottom'
        >
            <View style={{
                paddingTop: 20,
                height: height * 4 / 5,
                backgroundColor: '#fff', width: '100%', paddingHorizontal: 80
            }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, color: '#222', marginBottom: 20 }}>Thêm mới</Text>
                        <View style={{ flex: 1 }}>

                            {/* <Text>Môn học:</Text> */}
                            <TextInput
                                value={subject}
                                onChangeText={setSubject}
                                placeholder="Nhập môn học"
                                // underlineColor={"#fff"}
                                underlineColor="transparent"
                                underlineColorAndroid="transparent"
                                style={{
                                    backgroundColor: '#fff',
                                    height: 40,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    // backgroundColor: COLOR.black(.03),
                                    marginTop: 10,
                                    borderWidth: 1,
                                    fontSize: 16,
                                    borderColor: "#ddd",
                                    borderRadius: 7
                                }} />


                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                placeholder={`Chú thích`}
                                style={[{
                                    backgroundColor: '#fff',
                                    height: 70,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    marginTop: 10,
                                    borderWidth: 1,
                                    fontSize: 16,
                                    borderColor: "#ddd",
                                    borderRadius: 7
                                }]}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Pressable style={{
                                backgroundColor: "#fff",
                                paddingHorizontal: 15, paddingVertical: 10,
                                borderRadius: 7, borderColor: '#ddd', borderWidth: 1,
                                marginRight: -60,marginBottom: 18
                            }}>
                                <Text>Thêm mới</Text>
                            </Pressable>
                        </View>

                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center', fontSize: 17, color: '#333' }}>Thời gian học</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#111', fontSize: 16 }}>Từ: </Text>
                            <View style={{ width: 100 }}>
                                <TimePicker
                                    selectedHours={time.from[0]}
                                    selectedMinutes={time.from[1]}
                                    onChange={(hours, minutes) => {
                                        setTime({
                                            ...time,
                                            from: [hours, minutes]
                                        })
                                    }}
                                />
                            </View>
                            <Text style={{ color: '#111', fontSize: 16 }}> Đến: </Text>
                            <View style={{ width: 100 }}>
                                <TimePicker
                                    selectedHours={time.to[0]}
                                    selectedMinutes={time.to[1]}
                                    onChange={(hours, minutes) => {
                                        setTime({
                                            ...time,
                                            to: [hours, minutes]
                                        })
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ModalBox>
    )
}
import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Alert, TextInput, TouchableOpacity,
    Pressable, Text, Dimensions, newEvent
} from 'react-native';
import { cloneDeep } from 'lodash';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import Orientation from 'react-native-orientation-locker';
import { Icon } from 'native-base';
import ModalBox from 'react-native-modalbox';
import TimePicker from 'react-native-simple-time-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { get } from 'lodash';


import { HeaderBarWithBack } from '../../component/Header/Normal';

const { height, width } = Dimensions.get('screen');

const Timetable = (props) => {
    const { navigation } = props;
    const [events, setEvents] = useState(events_data_Init)
    const [isOpen, setOpen] = useState(false)
    useEffect(() => {
        Orientation.lockToLandscape();
        return () => {
            Orientation.lockToPortrait()
        }

    }, []);

    const _handleSubmit = useCallback((val) => {
        const { subject, description, day, time, type } = val;
        const { from, to } = time;
        console.log('-----------------', type)
        const newEvent = {
            title: subject,
            startTime: genTimeBlock(day, from[0], from[1]),
            endTime: genTimeBlock(day, to[0], to[1]),
            location: `${from[0]}:${from[1]} - ${to[0]}:${to[1]}`,
            extra_descriptions: [description],
        };
        const listEvent = events.concat(newEvent);
        setEvents(cloneDeep(listEvent));

        setOpen(false)
    }, [events]);

    const _handleClickEvent = useCallback((even) => {
        const { title, startTime, endTime, location, extra_descriptions, _id = '' } = even;

        const from = moment(startTime);
        const day = from.get('day')
        const startH = from.get('H')
        const startM = from.get('m');

        const to = moment(endTime);
        const toH = to.get('H')
        const toM = to.get('m');


        const evenConvert = {
            subject: title,
            description: extra_descriptions[0],
            day,
            time: {
                from: [startH, startM],
                to: [toH, toM]
            },
            type: 'edit'
        };

        setOpen(evenConvert)
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBarWithBack text="Thời khoá biểu" leftAction={() => navigation.goBack()} />
            <View style={styles.container}>
                <TimeTableView
                    // scrollViewRef={this.scrollViewRef}
                    events={events}
                    pivotTime={6}
                    pivotEndTime={20}
                    pivotDate={genTimeBlock('mon')}
                    numberOfDays={6}
                    onEventPress={_handleClickEvent}
                    headerStyle={styles.headerStyle}
                    formatDateHeader="dddd"
                    locale="vi"
                />
            </View>
            <View style={styles.bottomView}>
                <Pressable onPress={() => setOpen({ type: 'add' })} style={styles.addBtn}>
                    <Icon style={{ color: '#fff' }} name="plus" type="AntDesign" />
                </Pressable>
            </View>
            <ModalTimetable
                setOpen={setOpen}
                isOpen={isOpen}
                submit={_handleSubmit} />
        </SafeAreaView>
    )
};

export default Timetable;

const events_data_Init = []

// const events_data_Init = [
//     {
//         title: "Math-----",
//         startTime: genTimeBlock("MON", 9),
//         endTime: genTimeBlock("MON", 10, 30),
//         location: "Classroom 403",
//         extra_descriptions: ["Kim", "Lee"],
//     },
//     {
//         title: "Math",
//         startTime: genTimeBlock("WED", 9),
//         endTime: genTimeBlock("WED", 10, 50),
//         location: "Classroom 403",
//         extra_descriptions: ["Kim", "Lee"],
//     },
//     {
//         title: "Physics",
//         startTime: genTimeBlock("MON", 11),
//         endTime: genTimeBlock("MON", 11, 50),
//         location: "Lab 404",
//         extra_descriptions: ["Einstein"],
//     },
//     {
//         title: "Physics",
//         startTime: genTimeBlock("WED", 11),
//         endTime: genTimeBlock("WED", 11, 50),
//         location: "Lab 404",
//         extra_descriptions: ["Einstein"],
//     },
//     {
//         title: "Mandarin",
//         startTime: genTimeBlock("TUE", 9),
//         endTime: genTimeBlock("TUE", 10, 50),
//         location: "Language Center",
//         extra_descriptions: ["Chen"],
//     },
//     {
//         title: "Japanese",
//         startTime: genTimeBlock("FRI", 9),
//         endTime: genTimeBlock("FRI", 10, 50),
//         location: "Language Center",
//         extra_descriptions: ["Nakamura"],
//     },
//     {
//         title: "Club Activity",
//         startTime: genTimeBlock("THU", 9),
//         endTime: genTimeBlock("THU", 10, 50),
//         location: "Activity Center",
//     },
//     {
//         title: "Club Activity",
//         startTime: genTimeBlock("FRI", 13, 30),
//         endTime: genTimeBlock("FRI", 14, 50),
//         location: "Activity Center",
//     },
// ];

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
    const [day, setDay] = useState('MON');
    const [time, setTime] = useState({
        from: [8, 30],
        to: [10, 30],
    });

    const _handleReset = () => {
        setSubject('');
        setDescription('');
        setDay(mapDay[1]);
        setTime({
            from: [8, 30],
            to: [10, 30],
        })
    }

    const _handleSubmit = () => {
        if (!subject) {
            Toast.showWithGravity("Vui lòng nhập môn học", Toast.SHORT, Toast.CENTER);
            return 1;
        }

        if (get(time, 'from[0]') < 6 || get(time, 'from[0]') > 20 || get(time, 'to[0]') < 6 || get(time, 'to[0]') > 20) {
            Toast.showWithGravity("Vui lòng nhập thời gian học từ 6h đến 20h ", Toast.LONG, Toast.CENTER);
            return 1;
        }
        console.log({ subject, description, day, time });
        const type = get(isOpen, 'type')
        submit({ subject, description, day, time, type })

    }
    useEffect(() => {
        if (get(isOpen, 'type', '') == 'edit') {
            const { subject, description, day, time } = isOpen;
            console.log('isOpen', isOpen)
            setSubject(subject);
            setDescription(description);
            setDay(mapDay[day]);
            setTime(time)
        } else {
            _handleReset()

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
                            <DropDownPicker
                                items={[
                                    { label: 'Thứ 2', value: 'MON' },
                                    { label: 'Thứ 3', value: 'TUE' },
                                    { label: 'Thứ 4', value: 'WED' },
                                    { label: 'Thứ 5', value: 'THU' },
                                    { label: 'Thứ 6', value: 'FRI' },
                                    { label: 'Thứ 7', value: 'SAT' },
                                ]}
                                defaultValue={day}
                                containerStyle={{ height: 40 }}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                labelStyle={{
                                    fontSize: 14,
                                    // ...fontMaker({ weight: fontStyles.Regular }),
                                    textAlign: 'left',
                                    color: '#000'
                                }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={item => setDay(item.value)}
                            />
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
                            {/*  */}

                            {/*  */}
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
                <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={_handleSubmit}
                        style={{
                            backgroundColor: "#337ab7",
                            paddingHorizontal: 15, paddingVertical: 10,
                            borderRadius: 7, borderColor: '#ddd', borderWidth: 1,
                            marginRight: -60, marginBottom: 18
                        }}>
                        <Text style={{ color: '#fff' }}>Thêm mới</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ModalBox>
    )
}


const mapDay = {
    1: 'MON',
    2: 'TUE',
    3: "WED",
    4: 'THU',
    6: 'FRI',
    7: 'SAT'
}
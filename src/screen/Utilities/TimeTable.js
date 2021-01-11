import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Alert, TextInput, TouchableOpacity,
    Pressable, Text, Dimensions
} from 'react-native';
import { cloneDeep } from 'lodash';
import TimeTableView_, { genTimeBlock } from 'react-native-timetable';
import Orientation from 'react-native-orientation-locker';
import { Icon } from 'native-base';
import ModalBox from 'react-native-modalbox';
import TimePicker from 'react-native-simple-time-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { get } from 'lodash';



import { HeaderBarWithBack } from '../../component/Header/Normal';
import TimeTableView, { listSubject } from './com/TimeTableView'
import { useStorage, KEY } from '../../handle/handleStorage';
import { FlatList } from 'react-native-gesture-handler';
import { COLOR } from '../../handle/Constant';

const { height, width } = Dimensions.get('screen');

const Timetable = (props) => {
    const { navigation } = props;
    const [isOpen, setOpen] = useState(false)
    const [events, setEvents] = useStorage(KEY.TIMETABLE, [])

    const _hanldePress = (val) => {
        console.log('valvalvalval', val)
        setOpen(val)
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
            <HeaderBarWithBack text="Thời khoá biểu" leftAction={() => navigation.goBack()} />
            <View style={styles.container}>
                <TimeTableView
                    data={events}
                    onPress={_hanldePress}
                />
            </View>
            <ModalTimetable
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
    const [title, setTitle] = useState('');

    const [showSubject, setShowSubject] = useState(false)

    const _handleSubmit = () => {
        // if (!subject) {
        //     Toast.showWithGravity("Vui lòng nhập môn học", Toast.SHORT, Toast.CENTER);
        //     return 1;
        // }
        const [position = ''] = Object.keys(isOpen);
        submit({ [position]: subject })

    }
    useEffect(() => {
        if (isOpen) {
            try {
                const [position = ''] = Object.keys(isOpen);
                const [day, session, time] = position.split('');

                setTitle(`${mapDay[day]} - ${mapSession[session]} - Tiết ${time}`)
                const subject = isOpen[position];
                setSubject(subject);
            } catch (err) {
                console.log(err)
            }
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
                    <Text style={{ fontSize: 20, color: '#222', marginBottom: 10, fontWeight: '600' }}>Sửa thời khoá biểu</Text>
                    <Text style={{ fontSize: 15, color: '#222', marginBottom: 20 }}>{title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, }}>

                            <TextInput
                                clearButtonMode="always"
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
                                    // marginTop: 10,
                                    borderWidth: 1,
                                    fontSize: 16,
                                    borderColor: "#ddd",
                                    borderRadius: 7,
                                }} />
                        </View>

                        <Pressable onPress={() => setShowSubject(true)} style={{ marginLeft: 20 }}>
                            <Icon name="plus" type='AntDesign' />
                        </Pressable>

                    </View>
                </View>
                <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
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


var randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16)
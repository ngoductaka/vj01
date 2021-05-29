import React, { useState, useEffect, useCallback } from 'react';
import {
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import { get } from 'lodash';
import Toast from 'react-native-simple-toast';
import { Icon } from 'native-base';

import { blackColor, COLOR } from '../../../handle/Constant';
import { Colors } from '../../../utils/colors';
import { helpers } from '../../../utils/helpers';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { class_services } from '../../../redux/services/class.service';

const { width, height } = Dimensions.get('window');
const MODAL_WIDTH = helpers.isTablet ? 300 : 3 * width / 4;

export const FilterModal = (props) => {
    const {
        show = false,
        onClose = () => { },
        setFilter = () => { },
        filter, showState = true,
        headerText = 'Lọc theo:',
        cancelAble = true,
        showAll = true,
    } = props;

    const current_class = useSelector(state => state.userInfo.class);

    const [subjects, setSubjects] = useState([]);

    const [currSub, setCurrSub] = useState(null);
    const [currIndex, setCurrIndex] = useState(null);

    const [curType, setCurType] = useState(Object.keys(mapTypeQestion)[0]);

    const [cls, setCls, clsChoosen] = useClassChoosen({ initVal: current_class });

    useEffect(() => {
        async function fetchAllSubjects() {
            const result = await class_services.getAllSubjectsInClass(cls);
            setSubjects(result.data);
            // setCurrIndex(0);
            if (!showAll) {
                // setCurrSub(result.data[0]);
                setFilter({
                    cls, currSub: {
                        // index: currIndex, ...get(result, 'data[0]', {})
                    }, curType
                });
            } else {
                setCurrSub(null);
            }

        }
        fetchAllSubjects();
    }, [cls]);

    useEffect(() => {
        if (filter.cls) {
            setCls('' + filter.cls);
            if (filter.cls == '13') {
                // setCurrIndex(0);
                // setCurrSub(null);
            } else {
                // setCurrIndex(0);
            }
        }
    }, [filter.cls]);

    useEffect(() => {
        setCls('' + current_class);
    }, [current_class])

    const handleSubmit = () => {
        setFilter({ cls, currSub: { index: currIndex, ...currSub }, curType });
        if (!currSub) {
            Toast.show('Bạn chưa chọn môn để tiếp tục');
            // return 1;
        }
        onClose(false);
    }

    const hanldeCancel = useCallback(() => {
        if (cancelAble) {
            onClose(false)
        }
    }, [cancelAble, currSub])

    return (
        <Modal
            animationIn='slideInRight'
            animationOut='slideOutRight'
            onModalHide={onClose}
            isVisible={show}
            coverScreen={true}
            useNativeDriver={true}
            onBackdropPress={hanldeCancel}
            onBackButtonPress={hanldeCancel}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{ width: MODAL_WIDTH, height: height, backgroundColor: 'white', margin: 0, position: 'absolute', right: 0 }}
        >
            <View style={{ flex: 1, paddingVertical: helpers.statusBarHeight + 10, paddingHorizontal: 10 }}>
                {/* <ScrollView> */}

                <View style={styles.titleContainer}>
                    <Text style={{ color: '#282828', fontSize: 18, ...fontMaker({ weight: 'Bold' }) }}>{headerText}</Text>
                    <TouchableOpacity onPress={hanldeCancel}>
                        <Icon name='ios-close' style={{ fontSize: 32, color: '#ACACAC' }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginTop: 10 }} >
                    <Text style={{ color: COLOR.MAIN, fontSize: 16, ...fontMaker({ weight: 'Regular' }) }}>- Lớp:</Text>
                    <ScrollView style={{ marginTop: 80, marginBottom: 10 }} containerStyle={{ paddingBottom: 30 }}>
                        {cls != 13 &&
                            <View style={{ width: '100%' }}>
                                <Text style={{ color: COLOR.MAIN, fontSize: 16, ...fontMaker({ weight: 'Regular' }) }}>- Môn:</Text>
                                <FlatList
                                    data={showAll ? [{ title: 'Tất cả', id: null }, ...subjects] : subjects}
                                    style={{ marginTop: 15 }}
                                    numColumns={2}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFilter({ cls, currSub: { index, ...item }, curType });
                                                setCurrSub(item);
                                                setCurrIndex(index);
                                            }}
                                            key={index + 'subject'}
                                            style={{ width: (MODAL_WIDTH - 30) / 2, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 4, marginRight: index % 2 ? 0 : 10, marginBottom: 10, backgroundColor: currIndex == index ? COLOR.MAIN : COLOR.black(.05) }}
                                        >
                                            <Text style={{ color: currIndex == index ? COLOR.white(1) : Colors.black, ...fontMaker({ weight: 'Regular' }), fontSize: 13 }}>{item.title}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => 'subject' + index}
                                />
                            </View>
                        }
                        {
                            showState ?
                                <View style={{ marginTop: cls != 13 ? 0 : 80, width: '100%' }}>
                                    <Text style={{ color: COLOR.MAIN, fontSize: 16, ...fontMaker({ weight: 'Regular' }), marginVertical: 15 }}>- Trạng thái câu hỏi:</Text>
                                    <FlatList
                                        data={Object.keys(mapTypeQestion)}
                                        numColumns={2}
                                        keyExtractor={(item, index) => 'subject' + index}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setCurType(item);
                                                        // setCurrIndex(index);
                                                    }}
                                                    key={index + 'subject'}
                                                    style={{
                                                        width: (MODAL_WIDTH - 30) / 2,
                                                        padding: 10, justifyContent: 'center',
                                                        alignItems: 'center', borderRadius: 4,
                                                        marginRight: index % 2 ? 0 : 10, marginBottom: 10,
                                                        backgroundColor: curType == item ? COLOR.MAIN : COLOR.black(.05)
                                                    }}
                                                >
                                                    <Text style={{ color: curType == item ? COLOR.white(1) : Colors.black, ...fontMaker({ weight: 'Regular' }), fontSize: 13 }}>{mapTypeQestion[item]}</Text>
                                                </TouchableOpacity>

                                            )
                                        }}
                                    />
                                </View> : null
                        }
                    </ScrollView>
                </View>

                <View style={{ position: 'absolute', top: 120, left: 10, right: 10 }}>
                    {clsChoosen}
                </View>
                <TouchableOpacity onPress={handleSubmit} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, backgroundColor: '#59B98F', borderRadius: 8 }}>
                    <Text style={{ color: Colors.white, ...fontMaker({ weight: 'Bold' }), fontSize: 16 }}>Xác nhận</Text>
                </TouchableOpacity>
                {/* </ScrollView> */}
            </View>
        </Modal >
    );
}

const styles = {
    titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
}

export const mapType = [
    {
        val: '1',
        title: "Tất cả",
    },
    {
        val: '2',
        title: "Đã trả lời",
    },
    {
        val: '3',
        title: "Chưa trả lời",
    },
    {
        val: '4',
        title: "Hỏi lần đầu",
    }
];
export const mapTypeQestion =
{
    '1': "Tất cả",

    '2': "Đã trả lời",

    '3': "Chưa trả lời",

    '4': "Hỏi lần đầu",
}

const allCls = [
    { label: 'Tất cả', value: '13' },
    { label: 'Lớp 3', value: '3' },
    { label: 'Lớp 4', value: '4' },
    { label: 'Lớp 5', value: '5' },
    { label: 'Lớp 6', value: '6' },
    { label: 'Lớp 7', value: '7' },
    { label: 'Lớp 8', value: '8' },
    { label: 'Lớp 9', value: '9' },
    { label: 'Lớp 10', value: '10' },
    { label: 'Lớp 11', value: '11' },
    { label: 'Lớp 12', value: '12' },
];


const useClassChoosen = ({ initVal = 10 }) => {

    const [cls, setCls] = useState(String(initVal));

    const view = (
        <DropDownPicker
            items={allCls}
            defaultValue={cls}
            containerStyle={{ height: 40 }}
            style={{ backgroundColor: '#fafafa' }}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            labelStyle={{
                fontSize: 13,
                ...fontMaker({ weight: fontStyles.Regular }),
                textAlign: 'left',
                color: '#000'
            }}
            dropDownStyle={{ backgroundColor: '#fafafa' }}
            onChangeItem={item => setCls(item.value)}
        />
    );

    return [cls, setCls, view];
}
import React, { useState, useEffect } from 'react';
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

const { width, height } = Dimensions.get('window');

import { Icon } from 'native-base';
import { blackColor, COLOR } from '../../../handle/Constant';
import { Colors } from '../../../utils/colors';
import { helpers } from '../../../utils/helpers';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { class_services } from '../../../redux/services/class.service';

const MODAL_WIDTH = helpers.isTablet ? 300 : 3 * width / 4;

export const FilterModal = (props) => {
    const { show = false,
        onClose = () => { },
        setFilter = () => { },
        filter
    } = props;

    const current_class = useSelector(state => state.userInfo.class);

    const [subjects, setSubjects] = useState([]);
    const [currSub, setCurrSub] = useState(null);
    const [currIndex, setCurrIndex] = useState(0);

    const [cls, setCls, clsChoosen] = useClassChoosen({ initVal: current_class });

    useEffect(() => {
        setCurrIndex(0);
        setCurrSub(null);
        async function fetchAllSubjects() {
            const result = await class_services.getAllSubjectsInClass(cls);
            setSubjects(result.data);
        }
        fetchAllSubjects();
    }, [cls]);

    useEffect(() => {
        console.log(filter);
        if (filter.cls) {
            setCls(filter.cls);
            if (filter.cls == '13') {
                setCurrIndex(0);
                setCurrSub(null);
            } else {
                setCurrIndex(0);
            }
        }
    }, [filter]);

    useEffect(() => {
        setCls('' + current_class)
    }, [current_class])

    const handleSubmit = () => {
        setFilter({ cls, currSub });
        onClose(false);
    }

    return (
        <Modal
            animationIn='slideInRight'
            animationOut='slideOutRight'
            onModalHide={onClose}
            isVisible={show}
            coverScreen={true}
            useNativeDriver={true}
            onBackdropPress={() => onClose(false)}
            onBackButtonPress={() => onClose(false)}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{ width: MODAL_WIDTH, height: height, backgroundColor: 'white', margin: 0, position: 'absolute', right: 0 }}
        >
            <View style={{ flex: 1, paddingVertical: helpers.statusBarHeight + 10, paddingHorizontal: 10 }}>

                <View style={styles.titleContainer}>
                    <Text style={{ color: '#282828', fontSize: 18, ...fontMaker({ weight: 'Bold' }) }}>Lọc theo:</Text>
                    <TouchableOpacity onPress={() => onClose(false)}>
                        <Icon name='ios-close' style={{ fontSize: 32, color: '#ACACAC' }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginTop: 10 }}>
                    <Text style={{ color: COLOR.MAIN, fontSize: 16, ...fontMaker({ weight: 'Regular' }) }}>- Lớp:</Text>
                    {cls != 13 &&
                        <View style={{ marginTop: 80, width: '100%' }}>
                            <Text style={{ color: COLOR.MAIN, fontSize: 16, ...fontMaker({ weight: 'Regular' }) }}>- Môn:</Text>
                            <FlatList
                                data={[{ title: 'Tất cả', id: null }, ...subjects]}
                                style={{ marginTop: 15 }}
                                numColumns={2}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => {
                                        setCurrSub(item);
                                        setCurrIndex(index);
                                    }} key={index + 'subject'} style={{ width: (MODAL_WIDTH - 30) / 2, padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 4, marginRight: index % 2 ? 0 : 10, marginBottom: 10, backgroundColor: currIndex == index ? COLOR.MAIN : COLOR.black(.05) }}>
                                        <Text style={{ color: currIndex == index ? COLOR.white(1) : Colors.black, ...fontMaker({ weight: 'Regular' }), fontSize: 13 }}>{item.title}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => 'subject' + index}
                            />
                        </View>
                    }
                </View>

                <View style={{ position: 'absolute', top: 120, left: 10, right: 10 }}>
                    {clsChoosen}
                </View>
                <TouchableOpacity onPress={handleSubmit} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, backgroundColor: '#59B98F', borderRadius: 8 }}>
                    <Text style={{ color: Colors.white, ...fontMaker({ weight: 'Bold' }), fontSize: 16 }}>Xác nhận</Text>
                </TouchableOpacity>
            </View>
        </Modal >
    );
}

const styles = {
    titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
}

const useClassChoosen = ({ initVal = 10 }) => {

    const [cls, setCls] = useState(String(initVal));

    const view = (
        <DropDownPicker
            items={[
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
            ]}
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
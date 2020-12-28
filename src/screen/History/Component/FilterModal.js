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
export const docType = ["Tài liệu", "Video", "Thi online", "Tất cả"];
export const mapDoc = {
    "Tài liệu": 'Article',
    "Video": 'Video',
    "Thi online": "Exam"
}

const MODAL_WIDTH = helpers.isTablet ? 300 : 3 * width / 4;

export const FilterModal = (props) => {
    const { show = false,
        onClose = () => { },
        setFilter = () => { },
        curClass,
    } = props;

    // const current_class = useSelector(state => state.userInfo.class);

    const [cls, setCls, clsChoosen] = useClassChoosen({ initVal: curClass });
    const [cate, setCate, cateChoosen] = useCategoryChoosen({ initVal: 'Tất cả' });

    const handleSubmit = () => {
        setFilter({ cls, cate });
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

                    <View style={{ marginTop: 80, width: '100%' }}>
                        <Text style={{ color: COLOR.MAIN, fontSize: 16, ...fontMaker({ weight: 'Regular' }), marginBottom: 6 }}>- Thể loại:</Text>
                        {cateChoosen}
                    </View>
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
    optionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textWrapper: {
        marginLeft: 10,
        paddingVertical: 10,
        color: COLOR.black(.7)
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLOR.black(.4)
    }
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

const useCategoryChoosen = ({ initVal = "Tất cả" }) => {

    const [cate, setCate] = useState(initVal);

    const view = (
        docType.map((item, index) => {
            return (
                <TouchableOpacity onPress={() => setCate(item)} key={item + index} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}>
                    <View style={[{ width: 18, height: 18, borderRadius: 9, overflow: 'hidden', backgroundColor: 'white', borderWidth: 2, borderColor: COLOR.black(.2) }]}>
                        <View style={{ backgroundColor: item == cate ? COLOR.MAIN_GREEN : COLOR.white(1), flex: 1, borderRadius: 9, margin: 1 }} />
                    </View>
                    <Text style={{ marginLeft: 10, ...fontMaker({ weight: fontStyles.Regular }) }}>{item}</Text>
                </TouchableOpacity>
            );
        })
    );

    return [cate, setCate, view];
}
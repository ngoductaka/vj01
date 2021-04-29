import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux'
import Toast from 'react-native-simple-toast'
import { Icon } from 'native-base';
import { isEmpty, get } from 'lodash';

import History from './History';
import { COLOR } from '../../../../handle/Constant';
import { insertItem, KEY, useStorage } from '../../../../handle/handleStorage';


const OptionView = ({
    setData = () => { },
    handleRequestSearch = () => { },
    setSearchText = () => { },
    navigation
}) => {

    const [history] = useStorage(KEY.HIS_DICTIONARY, []);
    const [savedWord] = useStorage(KEY.SAVE_DICTIONARY, []);

    const grade = useSelector(state => {
        return get(state, 'userInfo.class')
    })
    const _handlePressItem = (item, type) => {
        if (type === "saved") {
            setData(item)
        } else {
            handleRequestSearch(item.word)
        }
        console.log('item.word', item.word)
        setSearchText(item.word)
    };
    return (<View>
        <History history={history} _handlePressItem={_handlePressItem} />
        <History history={savedWord} _handlePressItem={_handlePressItem} type="saved" text="Từ của bạn" />
        <TouchableOpacity onPress={() => {
            Toast.showWithGravity('Tính năng sẽ ra mắt trong thời gian tới', Toast.LONG, Toast.CENTER)
        }} style={[styles.shadow, styles.itemsFun]}>
            <Icon name="graduation-cap" type="FontAwesome" style={{ color: COLOR.MAIN, width: 40 }} />
            <Text style={{ marginLeft: 15, fontSize: 18 }}>Từ vựng lớp {grade}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            navigation.navigate('Subject', {
                source: 'dic',
                icon_id: 4, bookId: 406,
                title: "Bảng Động Từ Bất Quy Tắc (480 Động Từ)",
                subject: 104
            })

        }} style={[styles.shadow, styles.itemsFun]}>
            <Icon name="list" style={{ color: COLOR.MAIN, width: 40 }} />
            <Text style={{ marginLeft: 15, fontSize: 18 }}>Động từ bất quy tắc</Text>
        </TouchableOpacity>
    </View>)
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    value: {
        color: "#fff",
        fontSize: 30,
        textAlign: "right",
        marginRight: 20,
        // marginBottom: 0
    },
    headClose: {
        alignSelf: 'center',
    },
    closeBtn: { fontSize: 25, color: '#111' },
    backBtn: {
        height: 40, width: 40, justifyContent: 'center', alignItems: 'center',
        borderRadius: 40, shadowColor: 'rgba(0, 0, 0, 0.08)', marginLeft: 7
    },
    shadow: {
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },
    },
    itemsFun: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 15, backgroundColor: '#fff', marginTop: 20,
        paddingHorizontal: 10, borderRadius: 10
    },
});


export default OptionView;

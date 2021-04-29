import React, { useState } from 'react';
import Collapsible from 'react-native-collapsible';
import { Icon } from 'native-base';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLOR } from '../../../../handle/Constant';
import { useStorage, KEY } from '../../../../handle/handleStorage';
import { FlatList } from 'react-native-gesture-handler';

const History = ({ _handlePressItem, history = [], text = "Lịch sử tìm kiếm", type }) => {
    const [expand, setExpand] = useState((type) ? true : false);
    const [showAll, setShowAll] = useState(false)
    return (
        <View style={[styles.shadow, { marginTop: 20, borderRadius: 10, paddingBottom: expand ? 0 : 20 }]}>
            <TouchableOpacity onPress={() => setExpand(!expand)} style={styles.header}>
                <View style={styles.head}>
                    <Icon style={{ color: COLOR.MAIN, fontSize: 35, width: 45 }} name={!type ? "history" : "star"} type="FontAwesome" />
                    <Text style={{ marginLeft: 15, fontSize: 18 }}>{text}</Text>
                </View>
                <Icon style={{ color: COLOR.MAIN, fontSize: 24 }} name={expand ? "down" : "up"} type="AntDesign" />
            </TouchableOpacity>
            {history && history[0] ?
                <Collapsible collapsed={expand}>
                    <FlatList
                        data={showAll ? history : history.slice(0, 5)}
                        extraData={showAll}
                        renderItem={({ item, index }) => {
                            if (item.word)
                                return (
                                    <TouchableOpacity onPress={() => _handlePressItem(item, type)} style={styles.itemStyle}>
                                        <Text numberOfLines={1} style={{ color: '#1198b6', fontSize: 20 }}>{item.word}</Text>
                                        <Text numberOfLines={1} style={{ fontSize: 14 }}>{item.suggest_text}</Text>
                                    </TouchableOpacity>
                                )
                        }}
                    />
                    {
                        history.length > 5 ?
                            <TouchableOpacity onPress={() => setShowAll(!showAll)} style={{ alignSelf: 'center', marginTop: 20 }}><Text style={{ color: COLOR.MAIN }}>{showAll ? "Thu gọn" : "Xem thêm"}</Text></TouchableOpacity>
                            : null
                    }
                </Collapsible> : null}
        </View>
    )
}


const styles = StyleSheet.create({

    shadow: {
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },
    },
    itemsFun: {
        marginTop: 20, borderRadius: 10,
    },
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15, backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    head: { flexDirection: 'row', alignItems: 'center' },
    itemStyle: {
        flex: 1,
        marginHorizontal: 20,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        paddingVertical: 5,
        // marginBottom: 15,
        // backgroundColor: 'red'
    }
});
export default History;
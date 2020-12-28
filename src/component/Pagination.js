
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Icon, Item } from 'native-base';

const Pagination = (props) => {

    const {
        onPrevAct = () => { },
        onPageAct = () => { },
        onNextAct = () => { },
        curPage = 0
    } = props;
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>
            <TouchableOpacity onPress={onPrevAct} style={[styles.btn, { marginRight: 5 }]}>
                <Icon type='MaterialCommunityIcons' name='chevron-left' style={styles.icon} />
            </TouchableOpacity>
            {[1, 2, 3, 4].map((item, index) => {
                return <TouchableOpacity key={'pagi' + index} onPress={() => onPageAct(index)} style={styles.page}><Text style={[styles.pageTxt, curPage === index && { color: '#3ca4b8' }]}>{item}</Text></TouchableOpacity>
            })}
            <TouchableOpacity onPress={onNextAct} style={[styles.btn, { marginLeft: 5 }]}>
                <Icon type='MaterialCommunityIcons' name='chevron-right' style={styles.icon} />
            </TouchableOpacity>
        </View >
    );
}

export default Pagination;

const styles = StyleSheet.create({
    btn: {
        width: 30, height: 30, borderRadius: 15, backgroundColor: '#b9e2f1', justifyContent: 'center', alignItems: 'center'
    },
    page: { paddingHorizontal: 12 },
    pageTxt: { fontSize: 16, fontWeight: '600' },
    icon: { fontSize: 26, color: 'white' }
});

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

import { UserLive } from '../../../component/User';
import { openLink } from '../hepper';

const LiveNow = () => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        setShow(true)
    }, [])

    if (!show) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    openLink('https://www.facebook.com/cohuyenhoa')
                }}
                style={styles.containerView}>
                <View>
                    <UserLive />
                </View>
                <View style={styles.wapperText}>
                    <Text numberOfLines={2}>[LIVE 09] LIVE ĐẶC BIỆT : CÁCH SỬ DỤNG VÒNG TRÒN LƯỢNG GIÁC TRONG DAO ĐỘNG DỄ NHẤT</Text>
                </View>
                <View style={styles.joinView}>
                    <Text style={styles.joinText}>Tham gia</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    setShow(false)
                }} style={styles.closeBtn}>
                    <Icon style={{ fontSize: 15 }} name="close" />
                </TouchableOpacity>
            </TouchableOpacity>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute', bottom: 0,
        left: 0, right: 0,
        backgroundColor: '#E8F1EA',
    },
    containerView: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    wapperText: { flex: 1, marginHorizontal: 7 },
    joinView: { backgroundColor: '#F5576F', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 },
    joinText: { color: '#fff' },
    closeBtn: {
        borderColor: '#dedede', borderWidth: 1,
        position: 'absolute', top: -15, right: 0, height: 35, width: 35, borderRadius: 35,
        backgroundColor: "#E8F1EA", alignItems: 'center', justifyContent: 'center'
    }



})

export default LiveNow;
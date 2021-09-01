import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import { get } from 'lodash';
import moment from 'moment';

import * as Animatable from 'react-native-animatable';
import { UserLive } from '../../../component/User';
import { openLink } from '../hepper';
import api from '../../../handle/api';
import { endpoints } from '../../../constant/endpoints';

const LiveNow = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        _handleGetData()

        let inter = setInterval(() => {
            _handleGetData()
        }, 30 * 1000);
        return () => {
            clearInterval(inter)
        }
    }, [])

    const _handleGetData = () => {
        // livestreams_lesson_published_at

        api.get(`${endpoints.ROOT_URL}/courses/trending-livestreams`)
            .then(({ data }) => {
                if (data) {
                    let min = -1;
                    let indexItem = 0;
                    data.map((i, index) => {
                        const diff = moment(i.livestreams_lesson_published_at).diff(moment(), 'seconds');
                        if (diff >= 0 && diff < min) {
                            min = diff;
                            indexItem = index;
                        }
                    })
                    if (min >= 0) {
                        setShow(data[indexItem])
                    }

                }
            })
    }

    if (!show) return null;

    return (
        <Animatable.View animation="slideInRight" style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    openLink(get(show, 'livestreams_lesson_url'))
                }}
                style={styles.containerView}>
                <View>
                    <UserLive />
                </View>
                <View style={styles.wapperText}>
                    <Text numberOfLines={2}>{get(show, 'livestreams_lesson_name')}</Text>
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

        </Animatable.View>
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
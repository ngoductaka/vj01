import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    FlatList,
    Dimensions,
    SafeAreaView, ScrollView, Text, StyleSheet, Linking, Platform, ImageBackground, TouchableOpacity, Image
} from 'react-native';
import { Icon } from 'native-base';
const fakeImg = 'https://khoahoc.vietjack.com/upload/images/courses/banner/1/5f06ecf349b7c.png'

const CourseHeader = ({ navigation, imgCourse = fakeImg }) => {
    return (

        <View>
            <View style={{
                // backgroundColor: 'red',
                height: 250,
            }}>
                <Image
                    style={{
                        flex: 1
                    }}
                    resizeMode='stretch'
                    source={{ uri: imgCourse }} />
            </View>
            <TouchableOpacity
                onPress={() => { navigation.goBack() }}
                style={{
                    flexDirection: 'row', alignItems: 'center',
                    position: 'absolute',
                    padding: 8,

                }}
            >
                <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 40, backgroundColor:  'rgba(244, 244, 244, 0.7)' }}>
                    <Icon type='AntDesign' name='arrowleft' style={{ fontSize: 26, color: 'rgba(0, 0, 0, 0.7)' }} />
                </View>
            </TouchableOpacity>
            {/*  */}
        </View>

    )
}


export default CourseHeader;
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
                    marginLeft: 15, position: 'absolute',
                    // top: 50,
                    // backgroundColor: '#dfdfdf',
                    padding: 8,
                    // borderRadius: 30

                }}
            >
                <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 20, }}>
                    <Icon type='AntDesign' name='arrowleft' style={{ fontSize: 26, color: 'rgba(0, 0, 0, 0.7)' }} />
                </View>
            </TouchableOpacity>
            {/*  */}
        </View>

    )
}


export default CourseHeader;
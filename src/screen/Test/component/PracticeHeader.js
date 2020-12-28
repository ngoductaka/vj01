import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, Image, StatusBar } from 'react-native';
// import { Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import { isIphoneX } from 'react-native-iphone-x-helper'
import { fontMaker } from '../../../utils/fonts';
import { COLOR } from '../../../handle/Constant';
// import { helpers } from '../../../utils/helpers';

const PracticeHeader = (props) => {
    const {
        handleRightClick = () => { },
    } = props;

    return (
        <View
            style={{ width: '100%' }}
        >
            {/* <StatusBar backgroundColor="#fff" barStyle='dark-content' /> */}
            <SafeAreaView style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handleRightClick()}
                    style={{
                        marginRight: 15,
                        alignSelf: 'flex-end',
                    }}
                >
                    <View style={{
                        borderRadius: 20,
                        padding: 5,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: '#E7954D',
                            fontSize: 16,
                            ...fontMaker({ weight: 'Bold' }),
                            marginLeft: 10
                        }}>Kết thúc</Text>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
};

export default withNavigation(PracticeHeader);

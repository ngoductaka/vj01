import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, Image } from 'react-native';
import { Icon, Header } from 'native-base';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { COLOR, blackColor } from '../../../handle/Constant';

const fullColor = [
    ['#fee082', '#feb47b'],
    ['#fee082', '#acbb78'],
    ['#fee082', '#ffa751'],
    ['#fee082', '#a5fecb'],
]

const BackVideoHeader = (props) => {
    const {
        title = '',
        subtitle = '',
        navigation,
        icon = 0,
        rightAction = () => { }
    } = props;

    return (
        <View
            style={{ width: '100%', height: 50, }}
        >
            <LinearGradient
                colors={['#D34026', '#FB862B']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{flex: 1}}
            >
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 50, justifyContent: 'center', alignItems: 'center', paddingVertical: 8 }}>
                        <Icon name='md-arrow-back' style={{ fontSize: 25, color: 'white' }} />
                    </TouchableOpacity>
                    <View style={{ flex: 9 }}>
                        <Text numberOfLines={1} style={{ fontSize: 16, color: 'white' }}>{title}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={rightAction} style={{ paddingHorizontal: 15 }}>
                            <Icon type='Foundation' name='flag' style={{ fontSize: 22, color: COLOR.white(1) }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </View >
    )
};

export default withNavigation(BackVideoHeader);


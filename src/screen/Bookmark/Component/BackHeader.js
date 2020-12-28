import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, Image, StatusBar, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import * as Animatable from 'react-native-animatable';

import { fontMaker } from '../../../utils/fonts';
import { COLOR } from '../../../handle/Constant';
import { helpers } from '../../../utils/helpers';


const BackHeader = (props) => {
    const {
        title = '',
        navigation,
        leftAction = () => navigation.goBack(),
        style = {},
        handleRightPress,
        isSave = false,
        showRight = true,
    } = props;

    return (
        <View style={{ height: null, minHeight: 48, ...style }}>
            <StatusBar backgroundColor={'#fff'} barStyle='dark-content' />
            <View style={{ marginTop: helpers.isIOS ? (helpers.isIpX ? helpers.statusBarHeight : 10) : 2, paddingVertical: 15, flexDirection: 'row' }}>
                <TouchableOpacity onPress={leftAction}
                    style={[styles.backHeader]}>
                    <Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 26, color: COLOR.MAIN }} />
                </TouchableOpacity>
                <View style={{ marginHorizontal: 10, marginTop: 1, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ fontSize: 17, ...fontMaker({ weight: 'Regular' }) }}>{title} </Text>
                </View>
                {showRight ?
                    <Animatable.View animation="slideInRight">
                        <TouchableOpacity
                            disabled={isSave}
                            onPress={handleRightPress}
                            style={{ justifyContent: 'center', alignItems: 'center', width: 40, height: 40, marginRight: 5, ...styles.shadow }}>
                            <Icon type='AntDesign' name='filter' style={{ fontSize: 25, color: COLOR.MAIN }} />
                        </TouchableOpacity>
                    </Animatable.View>
                    :
                    <View style={{ width: 40, height: 40, }} />
                }
            </View>
        </View>
    )
};

export default withNavigation(BackHeader);

const styles = StyleSheet.create({

    backHeader: {
        width: 40,
        height: 40,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },
    shadow: {
        shadowColor: "rgba(0,0,0,0.3)",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,

        elevation: 3,
    }
})


import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, Image, StatusBar, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { helpers } from '../../../utils/helpers';
import { COLOR } from '../../../handle/Constant';
import { fontMaker } from '../../../utils/fonts';

const BackHeader = (props) => {
    const {
        title = '',
        subtitle = '',
        navigation,
        leftAction = () => navigation.goBack(),
        style = {},
        iconName = "arrow-left",
        handleRightPress,
        isSave = false,
    } = props;

    return (
        <View style={{ height: null, minHeight: 48, ...style }}>
            <StatusBar backgroundColor={'#fff'} barStyle='dark-content' />
            <View style={{ marginTop: helpers.isIOS ? (helpers.isIpX ? helpers.statusBarHeight : 10) : 2, paddingVertical: 15, flexDirection: 'row' }}>
                <TouchableOpacity onPress={leftAction}
                    style={[styles.backHeader]}>
                    <Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 26, color: '#F86087' }} />
                </TouchableOpacity>
                <View style={{ marginHorizontal: 10, marginTop: 1, flex: 1 }}>
                    <Text numberOfLines={1} style={{ color: '#777', marginTop: 10, fontSize: 17, ...fontMaker({ weight: 'Black' }) }}>{title} </Text>
                </View>
                {
                    handleRightPress &&
                    <Animatable.View delay={2400} animation="slideInRight">
                        <TouchableOpacity
                            disabled={isSave}
                            onPress={handleRightPress}
                            style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: !isSave ? COLOR.MAIN_GREEN : '#ddd', borderRadius: 20, marginRight: 10, width: 40, height: 40, ...styles.shadow }}>
                            <Icon type='Entypo' name='bookmark' style={{ fontSize: 20, color: 'white' }} />
                        </TouchableOpacity>
                    </Animatable.View>
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
        borderRadius: 20,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: "rgba(0,0,0,0.3)",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.37,
        shadowRadius: 10.49,

        elevation: 12,

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


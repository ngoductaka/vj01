
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import ModalBox from 'react-native-modalbox';
import { getBottomSpace } from 'react-native-iphone-x-helper';

const { width, height } = Dimensions.get('window');
import { COLOR } from '../../../handle/Constant';

const ConfirmModal = ({
    setClose = () => { },
    isOpen = false,
    onConfirm = () => { },
    title = "",
    canDismiss = true,
    subTitle = "",
    confirmText = "Thoát",
}) => {
    return (
        <ModalBox
            onClosed={() => setClose(false)}
            isOpen={isOpen}
            backdropPressToClose={canDismiss}
            backButtonClose={canDismiss}
            swipeToClose={false}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{
                width: width, height: null, borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden',
                backgroundColor: '#E9E9ED',
            }}
            position='bottom'
            animationDuration={300}
            coverScreen={true}
        >
            <View
                style={{
                    maxHeight: 3 * Dimensions.get('window').height / 4,
                    marginBottom: getBottomSpace(),
                    paddingHorizontal: 10
                }}
            >
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        if (canDismiss) setClose(false);
                    }} style={{ paddingHorizontal: 30, paddingVertical: 4 }}>
                        <Icon type='MaterialCommunityIcons' name='chevron-down' style={{ fontSize: 20, color: "#999" }} />
                    </TouchableOpacity>
                    <Image resizeMode="contain" source={require('../../../public/image/new_test.png')} style={{ height: 100, marginVertical: 20 }} />
                </View>
                <View style={{ paddingLeft: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>{title}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500', marginVertical: 10, color: '#777', marginBottom: 50 }}>{subTitle}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setClose(false);
                            setTimeout(() => {
                                onConfirm();
                            }, 301)
                        }}
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                    >
                        <Btn {...{ confirmText }} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        onPress={() => setClose(false)}
                        style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', paddingVertical: 15, alignItems: 'center' }}>
                            <Text style={{ color: COLOR.MAIN, fontSize: 18 }}> Tiếp tục </Text>
                        </View>
                    </TouchableOpacity> */}
                </View>
            </View>

        </ModalBox>
    )
}

const Btn = ({ confirmText }) => {
    return (
        <LinearGradient
            start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}
            colors={['#F25B71', COLOR.MAIN]}
            style={stylesConfirm.btn}
        >
            <Text style={{ color: '#fff', fontSize: 18 }}> {confirmText} </Text>
        </LinearGradient>
    )
}
const stylesConfirm = StyleSheet.create({
    btn: {
        justifyContent: 'center',
        paddingVertical: 10,
        alignItems: 'center',
        paddingHorizontal: 45,
        borderRadius: 36,
        marginBottom: 30
    }
})

export {
    ConfirmModal,
}
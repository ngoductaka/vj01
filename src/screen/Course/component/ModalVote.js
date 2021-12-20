import React from 'react';
import {
    Text,
    Platform,
    View,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import ModalBox from 'react-native-modalbox';
// import LottieView from 'lottie-react-native';
// import { getBottomSpace } from 'react-native-iphone-x-helper';
const { width } = Dimensions.get('window');

export const ModalWrapp = (props) => {
    const {
        show = false, onClose = () => { },
        showCancel = true, title='', position = 'center'
    } = props;
    return (
        <ModalBox
            onClosed={onClose}
            isOpen={show}
            animationDuration={300}
            coverScreen={true}
            backdropPressToClose={!!showCancel}
            swipeToClose={!!showCancel}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{ width: width, height: null, borderRadius: 25, overflow: 'hidden' }}
            position={position}
        >
            <View
                style={{
                    backgroundColor: 'white',
                    padding: 20,
                    maxHeight: 3 * Dimensions.get('window').height / 4,
                    // marginBottom: getBottomSpace()
                }}
            >
                <Text style={{ color: '#282828', fontSize: 20, fontWeight: '600' }}>{title}</Text>
                <View style={{ paddingTop: 30, paddingBottom: 10 }}>
                    {props.children}
                </View>
            </View>
        </ModalBox>
    );
}

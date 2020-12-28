
import React from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Image,
    BackHandler,
} from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import ModalBox from 'react-native-modalbox';
import { getBottomSpace } from 'react-native-iphone-x-helper';

const { width, height } = Dimensions.get('window');
import { COLOR, provinces } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';

export const DistrictModal = ({
    show,
    setShow,
    setSelect,
}) => {
    return (
        <ModalBox
            onClosed={() => setShow(false)}
            isOpen={show}
            backdropPressToClose={true}
            useNativeDriver={true}
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
                    minHeight: 4 * Dimensions.get('window').height / 5,
                    marginBottom: getBottomSpace(),
                    padding: 15,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ width: 40 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Tỉnh / Thành phố</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShow(false)} style={styles.closeBtn}>
                        <Icon style={styles.icon} name='ios-close' />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={provinces}
                    style={{ flex: 1 }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => setSelect(item)} style={styles.item}>
                            <Text style={styles.text}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index + 'district'}
                />
            </View>

        </ModalBox>
    )
}


const styles = StyleSheet.create({
    closeBtn: {
        width: 34, height: 34, justifyContent: 'center', alignItems: 'center', backgroundColor: COLOR.black(.12), borderRadius: 20, overflow: 'hidden'
    },
    title: {
        ...fontMaker({ weight: fontStyles.Bold }), fontSize: 18, textAlign: 'center'
    },
    icon: {
        fontSize: 34, color: COLOR.black(.7)
    },
    item: {
        padding: 12
    },
    text: {
        fontSize: 15,
        ...fontMaker({ weight: fontStyles.Regular }),
    }
});
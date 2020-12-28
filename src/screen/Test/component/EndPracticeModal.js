
import React from 'react';
import {
    FlatList,
    View,
    SafeAreaView,
    ScrollView,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Dimensions,
    Image,
    BackHandler,
} from 'react-native';
import { Icon } from 'native-base';

import ModalBox from 'react-native-modalbox';
const { width, height } = Dimensions.get('window');
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { COLOR, fontSize } from '../../../handle/Constant';
import { images } from '../../../utils/images';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import LinearGradient from 'react-native-linear-gradient';

const EndPracticeModal = ({
    setClose = () => { },
    isOpen = false,
    onExit = () => { }
}) => {
    return (
        <ModalBox
            onClosed={() => setClose(false)}
            isOpen={isOpen}
            backdropPressToClose={true}
            swipeToClose={true}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{ width: width, height: null, borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden' }}
            position='bottom'
            animationDuration={300}
            coverScreen={true}
        >
            <View
                style={{
                    backgroundColor: 'white',
                    maxHeight: 3 * Dimensions.get('window').height / 4,
                    marginBottom: getBottomSpace()
                }}
            >
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setClose(false)}>
                        <Icon type='MaterialCommunityIcons' name='chevron-down' style={{ fontSize: 20, color: "#999" }} />
                    </TouchableOpacity>
                    <Image resizeMode="contain" source={images.end_practice} style={{ height: 100, marginVertical: 20 }} />
                </View>
                <View style={{ paddingHorizontal: 30 }}>
                    <Text style={{ fontSize: 20, marginTop: 22, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Thoát khỏi lượt thi đấu?</Text>
                    <Text style={{ fontSize: 15, ...fontMaker({ weight: fontStyles.Regular }), marginBottom: 22, marginTop: 10, color: '#909090' }}>Bạn vẫn chưa hoàn thành bài thi. Bạn có thực sự muốn dừng thi luôn?</Text>
                    <TouchableOpacity onPress={() => setClose(false)} style={{ alignSelf: 'center', marginBottom: 20 }}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ paddingHorizontal: 60, paddingVertical: 12, alignSelf: 'center', borderRadius: 24 }} colors={['#FD5667', '#FE8E40']}>
                            <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: 'white', fontSize: fontSize.h3 }}>Tiếp tục làm bài</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onExit} style={{ alignSelf: 'center', marginBottom: 20 }}>
                        <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: '#FE8E40', fontSize: fontSize.h3 }}>Kết thúc</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </ModalBox>
    )
}

export default EndPracticeModal;
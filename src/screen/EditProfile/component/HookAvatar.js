import { Icon } from 'native-base';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, View, TextInput, Image, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import * as Animatable from 'react-native-animatable';
import ModalBox from 'react-native-modalbox';
import { useDispatch, useSelector } from 'react-redux';

import { avatarIndex, COLOR } from '../../../handle/Constant';
import { user_services } from '../../../redux/services';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { images } from '../../../utils/images';
import { updateAvatar } from '../../../redux/action/user_info';
import { KEY, saveItem } from '../../../handle/handleStorage';
import { get } from 'lodash';
import { GradientText } from '../../../component/shared/GradientText';
const { width, height } = Dimensions.get('window');


export const useHookAvatar = ({ initVal = 0 }) => {

    const avatarIdx = useSelector(state => get(state, 'userInfo.user.avatar_id', 0));

    const [value, setValue] = useState(avatarIdx || 0);
    const [show, setShow] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const onConfirm = async () => {
        await setError(null);
        const result = await user_services.updateAvatar({ avatar_id: value });
        console.log(result);
        if (result && result.status) {
            dispatch(updateAvatar(value));
            setShow(false);
            AsyncStorage.getItem(KEY.saved_user)
                .then(user => {
                    if (JSON.parse(user)) {
                        const temp = { ...JSON.parse(user), avatar_id: value };
                        saveItem(KEY.saved_user, temp);
                    } else {

                    }
                })
                .catch((err) => {

                });
        } else {
            setError('Cập nhật không thành công');
        }
    }

    const view = (
        <View>
            <TouchableOpacity onPress={() => setShow(true)} style={{ width: 120, height: 120, alignSelf: 'center', marginTop: 10, borderRadius: 70, borderWidth: 1.5, borderColor: COLOR.MAIN, marginBottom: 20, padding: 10 }}>
                <Image
                    source={avatarIndex[avatarIdx || 0].img}
                    style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                />
                <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: COLOR.MAIN_GREEN, padding: 5, borderRadius: 30, borderWidth: 1, borderColor: 'white' }}>
                    <Icon type='AntDesign' name='edit' style={{ fontSize: 22, color: 'white', }} />
                </View>
            </TouchableOpacity>
            <ModalBox
                onClosed={setShow}
                isOpen={show}
                animationDuration={300}
                coverScreen={true}
                backdropPressToClose={true}
                swipeToClose={false}
                backdropColor='rgba(0, 0, 0, .7)'
                style={{ width: width - 60, height: null, borderRadius: 16, overflow: 'hidden' }}
                position='center'
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        paddingTop: 10,
                        paddingHorizontal: 10,
                        maxHeight: 3 * height / 4,
                        marginBottom: getBottomSpace()
                    }}
                >
                    <Text style={{ textAlign: 'center', color: '#68676C', ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 17 }}>Chọn Avatar</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, paddingHorizontal: 10 }}>
                        <Image
                            style={{ width: (width) / 5, height: (width) / 5, padding: 10 }}
                            source={avatarIndex[value || 0].img}
                        />
                        <View style={{ marginLeft: 10 }}>
                            <GradientText
                                colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                                style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 22 }}>
                                {avatarIndex[value || 0].name}
                            </GradientText>
                            {error && <Animatable.Text animation='shake' style={{ textAlign: 'center', marginVertical: 2, alignSelf: 'center', color: 'red', fontSize: 13 }}>{error}</Animatable.Text>}
                            <TouchableOpacity onPress={onConfirm} style={{ alignSelf: 'baseline', paddingHorizontal: 26, paddingVertical: 6, marginTop: 10, backgroundColor: '#1FC887', borderRadius: 6 }}>
                                <Text style={{ fontSize: 16, color: 'white', ...fontMaker({ weight: fontStyles.SemiBold }) }}>Xác nhận</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View style={{ height: width - 90, width: width - 90, alignSelf: 'center', marginTop: 30 }}>
                        <FlatList
                            data={avatarIndex}
                            numColumns={3}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return <AvatarItem item={item} setValue={setValue} selected={value} index={index} />
                            }}
                            extraData={(item, idx) => idx + 'avatar'}
                        />
                    </View>
                </View>
            </ModalBox>
        </View >
    );

    return [value, view];

}

const AvatarItem = ({ selected, index, setValue, item }) => {
    return (
        <TouchableOpacity onPress={() => setValue(index)} style={{ width: (width - 120) / 3, height: null, backgroundColor: selected == index ? '#FCEED5' : 'transparent', marginRight: 15, marginBottom: 15, alignItems: 'center', borderWidth: 2, borderColor: selected == index ? '#E7AC42' : COLOR.black(.1), borderRadius: 12, paddingVertical: 10 }}>
            <Image
                source={item.img}
                style={{ width: '100%', height: (width - 280) / 3, resizeMode: 'contain' }}
            />
            <Text numberOfLines={2} style={{ ...fontMaker({ weight: fontStyles.Regular }), color: '#616065', fontSize: 13, marginTop: 6, textAlign: 'center', }}>{item.name}</Text>
        </TouchableOpacity>
    );
}


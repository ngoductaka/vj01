import React, { memo, useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'native-base';
import Toast from 'react-native-simple-toast';
import { useSelector, useDispatch } from 'react-redux';

import Header from '../../component/Header';
import { helpers } from '../../utils/helpers';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { COLOR } from '../../handle/Constant';
import { useHookInput } from './component/HookInput';
import { DistrictModal } from './component/DistrictModal';
import { user_services } from '../../redux/services';
import { setUserInfo } from '../../redux/action/user_info';
import { saveItem, KEY } from '../../handle/handleStorage';
import { useHookAvatar } from './component/HookAvatar';
import { get } from 'lodash';

//  ========== show list subject class====================
const EditProfile = memo((props) => {

    const { navigation } = props;
    const dispatch = useDispatch();
    const userInfo = navigation.getParam('userInfo', null);
    const avatarIdx = useSelector(state => get(state, 'userInfo.user.avatar_id', 0));

    const [avatar, avatarView] = useHookAvatar({ initVal: avatarIdx });
    const [name, nameInput] = useHookInput({ initVal: userInfo.name });
    const [email, emailInput] = useHookInput({ initVal: (userInfo.email && !userInfo.email.includes('facebook')) ? userInfo.email : '', placeholder: 'vietjack@gmail.com', label: 'Email (*)' });
    const [phone, phoneInput] = useHookInput({ initVal: userInfo.phone ? userInfo.phone : '', placeholder: '096xxxxxxx', label: 'Số điện thoại (*)' });
    const [school, schoolInput] = useHookInput({ initVal: userInfo.school ? userInfo.school : '', placeholder: 'VD: Amsterdam', label: 'Trường' });

    const [show, setShow] = useState(false);
    const [province, setProvince] = useState(userInfo.city ? userInfo.city : '');

    const updateProfile = async () => {
        if (validateField(name, email, phone, school)) {
            const result = await user_services.updateProfile(userInfo.id, {
                name,
                email,
                phone,
                school,
                city: province,
            });

            if (result.data.name) {
                const temp = {
                    ...userInfo, ...result.data
                };
                dispatch(setUserInfo({ user: temp }));
                saveItem(KEY.saved_user, temp);
                Toast.show('Cập nhật thông tin cá nhân thành công');
            } else {
                Toast.show('Đã có lỗi xảy ra khi update thông tin cá nhân');
            }

        }
    }

    const selectDistrict = (item) => {
        setProvince(item);
        setShow(false);
    }

    const validateField = (name, email, phone, school) => {
        // console.log('validate field', name, email, phone, school);
        if (name.trim().length === 0) {
            Alert.alert(
                "Thông báo",
                `Vui lòng điền tên`,
                [{ text: "Đồng ý" }],
                { cancelable: false }
            );
            return false;
        }

        const validMail = helpers.checkValidMail(email);
        if (!validMail) {
            Alert.alert(
                "Thông báo",
                `Định dạng email không đúng`,
                [{ text: "Đồng ý" }],
                { cancelable: false }
            );
            return false;
        }

        const validPhone = helpers.checkValidPhone(phone);
        if (!validPhone) {
            Alert.alert(
                "Thông báo",
                `Định dạng số điện thoại không đúng`,
                [{ text: "Đồng ý" }],
                { cancelable: false }
            );
            return false;
        }
        return true;
    };

    return (
        <View style={{ flex: 1 }}>
            <Header
                leftIcon={<Icon name='ios-arrow-back' style={{ fontSize: 25, color: '#836AEE' }} />}
                title={`SỬA THÔNG TIN CÁ NHÂN`}
                navigation={props.navigation}
                leftAction={() => {
                    props.navigation.goBack();
                }}
                showSearch={false}
            />
            <SafeAreaView style={styles.container}>
                <KeyboardAwareScrollView>
                    <View style={{ padding: 15, paddingHorizontal: 30 }}>
                        {avatarView}
                        {nameInput}
                        {emailInput}
                        {phoneInput}
                        {schoolInput}
                        <Text style={styles.label}>Tỉnh / Thành phố</Text>
                        <TouchableOpacity onPress={() => setShow(true)} style={styles.touchable}>
                            {province.length == 0 ?
                                <Text style={styles.province}>VD: Hà Nội</Text>
                                :
                                <Text style={[styles.province, { color: COLOR.black(1) }]}>{province}</Text>
                            }
                            <Icon name='ios-arrow-down' style={styles.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={updateProfile}
                        >
                            <Text style={{ color: '#fff', ...fontMaker({ weight: 'Bold' }), fontSize: 16 }}>Lưu thay đổi</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
            <DistrictModal
                show={show}
                setShow={setShow}
                setSelect={selectDistrict}
            />
        </View>
    )
})


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    input: {
        paddingLeft: 12,
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 12,
        backgroundColor: COLOR.black(.03),
        marginTop: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLOR.black(.03),
        ...fontMaker({ weight: fontStyles.Regular })
    },
    input2: {
        padding: 12,
        backgroundColor: COLOR.black(.03),
        borderRadius: 8,
        marginTop: 20,
        borderWidth: 1,
        borderColor: COLOR.black(.03),
        ...fontMaker({ weight: fontStyles.Regular })
    },
    btn: {
        backgroundColor: 'orange',
        marginTop: 35,
        paddingVertical: 14,
        paddingHorizontal: 50,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ddc',
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 3, height: 10 },
    },
    label: {
        ...fontMaker({ weight: fontStyles.Regular }),
        color: COLOR.black(.3),
        marginTop: 20
    },
    touchable: {
        marginTop: 10,
        padding: 12,
        backgroundColor: COLOR.black(.03),
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLOR.black(.03),
        ...fontMaker({ weight: fontStyles.Regular }),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    province: {
        ...fontMaker({ weight: fontStyles.Regular }),
        fontSize: 16,
        color: COLOR.black(.3)
    },
    icon: {
        fontSize: 20,
        color: COLOR.black(.3)
    }
})
export default EditProfile;

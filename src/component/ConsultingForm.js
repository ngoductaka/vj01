

import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View, BackHandler, SafeAreaView, Text, StyleSheet, TouchableOpacity, Alert, Dimensions
} from 'react-native';
import { Icon, Card } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import ModalBox from 'react-native-modalbox';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';

import { useHookTextInput } from './UseHook/useForm';
import { fontMaker, fontStyles } from '../utils/fonts';
import { fontSize, blackColor, COLOR } from '../handle/Constant';
import { helpers } from '../utils/helpers';
import SimpleToast from 'react-native-simple-toast';
import { user_services } from '../redux/services';
import DropDownPicker from 'react-native-dropdown-picker';

// import Picker from './Picker/simplePicker';


const { width, height } = Dimensions.get('screen')

const ConsultingForm = ({ isOpen = false, onClose = () => { } }) => {

    const [name, nameInput] = useHookTextInput({});
    const [phone, phoneInput] = useHookTextInput({ placeholder: '096xxxxxxx', label: 'Số điện thoại (*)' });

    const grade_id = useSelector(state => state.userInfo.class);
    const [grade, setGrade] = useState(grade_id);


    const handleRegister = async () => {
        try {
            if (!(name.trim().length >= 3)) {
                Alert.alert(
                    "Chú ý",
                    'Tên của bạn cần có 3 ký tự trở lên',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
                return;
            }
            if (!helpers.checkValidPhone(phone)) {
                Alert.alert(
                    "Chú ý",
                    'Số điện thoại của bạn không đúng định dạng',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
                return;
            }
            const result = await user_services.getConsulting({
                name, phone, class: grade
            });

            if (result.status) {
                SimpleToast.show('Đã có lỗi khi đăng ký nhận tư vấn, mời bạn thử lại sau!');
            } else {
                SimpleToast.show('Đã đăng ký thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!');
            }
        } catch (err) {
            SimpleToast.show('Đã có lỗi khi đăng ký nhận tư vấn, mời bạn thử lại sau!');
        }

    }

    return (

        <ModalBox
            onClosed={onClose}
            isOpen={isOpen}
            animationDuration={300}
            coverScreen={true}
            backdropPressToClose={true}
            swipeToClose={false}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{ width: width, height: null, borderTopLeftRadius: 15, borderTopRightRadius: 15, overflow: 'hidden' }}
            position='bottom'
        >
            <View style={{ height: height * 2 / 3, paddingHorizontal: 10 }}>

                <Text style={{ marginTop: 10, paddingTop: 15, paddingBottom: 10, ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18, textAlign: 'center', marginTop: 5 }}>Đăng ký nhận tư vấn và học thử miễn phí</Text>
                <ScrollView>
                    <View style={{paddingBottom: 300}}>
                        <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), fontSize: 16, textAlign: 'center', color: '#999CA2', marginTop: 10 }}>Dựa vào kết quả bài kiểm tra, đội ngũ gia sư của chúng tôi sẽ gọi điện tư vấn phương pháp học hiệu quả nhất dành cho bạn!</Text>
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon type='Feather' name='check' style={{ color: COLOR.MAIN_GREEN, fontSize: 24 }} />
                                <Text style={{ marginLeft: 6 }}>Cam kết tăng 1-2 điểm thi</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon type='Feather' name='check' style={{ color: COLOR.MAIN_GREEN, fontSize: 24 }} />
                                <Text style={{ marginLeft: 6 }}>Học thử hoàn toàn
                    <Text style={{ color: COLOR.MAIN, fontWeight: 'bold' }}> miễn phí</Text>
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon type='Feather' name='check' style={{ color: COLOR.MAIN_GREEN, fontSize: 24 }} />
                                <Text style={{ marginLeft: 6 }}>Học online với đội ngũ gia sư
                    <Text style={{ color: COLOR.MAIN, fontWeight: 'bold' }}> chất lượng</Text>
                                </Text>
                            </View>
                        </View>
                        {nameInput}
                        {phoneInput}
                        <Text style={styles.label}>Lớp bạn đang học</Text>
                        {/* <TouchableOpacity style={styles.touchable}>
                            {grade.length == 0 ?
                                <Text style={styles.grade}>Chọn lớp</Text>
                                :
                                <Text style={[styles.grade, { color: COLOR.black(1) }]}>Lớp {12}</Text>
                            }
                            <Icon name='ios-arrow-down' style={styles.icon} />
                        </TouchableOpacity> */}
                        {/* <Picker /> */}

                        <DropDownPicker
                            items={[
                                { label: 'Giải thích chưa rõ ràng', value: '1' },
                                { label: 'Tài liệu học không giống sách giáo khoa', value: '2' },
                                { label: 'Nội dung câu hỏi/câu trả lời sai', value: '3' },
                                { label: 'Thiếu nội dung câu hỏi / câu trả lời', value: '4' },
                            ]}
                            defaultValue={1}
                            containerStyle={{ height: 40 }}
                            style={{ backgroundColor: '#fafafa' }}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            labelStyle={{
                                fontSize: 14,
                                ...fontMaker({ weight: fontStyles.Regular }),
                                textAlign: 'left',
                                color: '#000'
                            }}
                            dropDownStyle={{ backgroundColor: '#fafafa' }}
                        // onChangeItem={item => setCls(item.value)}
                        />

                    </View>
                </ScrollView>

                <TouchableOpacity onPress={handleRegister} style={{ alignSelf: 'center', marginTop: 10, marginBottom: 30 }}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ paddingHorizontal: 36, paddingVertical: 10, borderRadius: 24, minWidth: 150, justifyContent: 'center', alignItems: 'center' }} colors={['#febf6f', COLOR.MAIN]}>
                        <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: 'white', fontSize: fontSize.h3 }}>Đăng ký</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>
        </ModalBox>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appleButton: {
        width: '100%',
        paddingVertical: 20,
        marginTop: 15
    },
    backHeader: {
        width: 40, height: 40, borderRadius: 20, marginLeft: 10,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'white',

        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },

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
    grade: {
        ...fontMaker({ weight: fontStyles.Regular }),
        fontSize: 16,
        color: COLOR.black(.3)
    },
    icon: {
        fontSize: 20,
        color: COLOR.black(.3)
    },
    label: {
        ...fontMaker({ weight: fontStyles.Regular }),
        color: COLOR.black(.3),
        marginTop: 20
    },
})


export default ConsultingForm;
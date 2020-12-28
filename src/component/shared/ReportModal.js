import React, { useState, useCallback } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Alert
} from 'react-native';
import ModalBox from 'react-native-modalbox';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import Toast from 'react-native-simple-toast';
import DropDownPicker from 'react-native-dropdown-picker';

const { width } = Dimensions.get('window');

import { Icon, Card, Textarea } from 'native-base';
import { helpers } from '../../utils/helpers';
import { COLOR, blackColor } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import api from '../../handle/api';
// data = {
//     "type": "article|exam|video|question",
//     "id": string
// } 

export const FeedbackModal = ({ data }) => {
    // const [option, setOption] = useState(-1);
    const [show, onClose] = useState(false);
    const [val, selectVal] = useState('');


    const [err, setErr, clsChoosen] = useErrorChoosen({});
    const [des, setDes, desInput] = useDescriptionInput({});

    const _handleSubmit = () => {
        // console.log('asdfasfasd', data.id, val)
        if (des.trim().length >=15) {
            onClose(false);
            setDes('');
            api.post('feedback/create', {
                'feedback_content': des,
                'objects': data
            })
                .then((res) => {
                    selectVal('');
                    // setOption(-1);
                    setTimeout(() => {
                        Toast.showWithGravity('Cảm ơn bạn đã gửi phản hồi!', Toast.SHORT, Toast.CENTER);
                    }, 401);
                })
                .catch(err => {
                    Alert.alert(
                        "Oops!",
                        `Đã có lỗi xảy ra khi gửi đóng góp ý kiến`,
                        [
                            {
                                text: "Đồng ý", onPress: () => { }
                            }
                        ],
                        { cancelable: false }
                    );
                    // console.log('<err feedback>')
                });
        } else {
            Alert.alert(
                "Oops!",
                `Bạn cần nhập nội dung đóng góp ý kiến`,
                [
                    {
                        text: "Đồng ý", onPress: () => { }
                    }
                ],
                { cancelable: false }
            );
        }
    };

    return (
        <View>
            <TouchableOpacity
                onPress={() => onClose(true)}
                style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'flex-end' }}>
                <Icon type="MaterialIcons" name='report-problem' style={{ color: COLOR.MAIN, fontSize: 23 }} />
                <Text style={{ color: COLOR.MAIN, marginBottom: 1 }}>Báo cáo lỗi</Text>
            </TouchableOpacity>
            <ModalBox
                onClosed={() => {
                    setDes('');
                    onClose();
                }}
                isOpen={show}
                animationDuration={300}
                coverScreen={true}
                backdropColor='rgba(0, 0, 0, .7)'
                style={{ width: helpers.isTablet ? width * 4 / 5 : width, height: null, borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden' }}
                position='bottom'
            >
                <View style={{ paddingTop: 30, paddingHorizontal: 20, paddingBottom: 20, marginBottom: getBottomSpace() }}>
                    <Text style={{ ...fontMaker({ weight: fontStyles.Bold, }), fontSize: 18 }}>Báo cáo lỗi tài liệu</Text>
                    {/* <Text style={{ ...fontMaker({ weight: fontStyles.Regular, }), fontSize: 18, marginVertical: 10 }}>Vì sao bạn báo lỗi ?</Text> */}
                    <Text style={{ ...fontMaker({ weight: fontStyles.Regular, }), fontSize: 16, marginVertical: 10, color: COLOR.MAIN }}>Loại lỗi</Text>
                    {clsChoosen}
                    <Text style={{ ...fontMaker({ weight: fontStyles.Regular, }), fontSize: 16, color: COLOR.MAIN, marginBottom: 10, marginTop: 20 }}>Chi tiết lỗi</Text>
                    {desInput}
                    <TouchableOpacity disabled={!(des.trim().length >= 15)} onPress={_handleSubmit} style={{ width: '100%', paddingVertical: 12, marginTop: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: des.trim().length >= 15 ? COLOR.MAIN : COLOR.black(.5), borderRadius: 26 }}>
                        <Text style={{ color: COLOR.white(1), ...fontMaker({ weight: fontStyles.Bold }) }}>Gửi phản hồi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onClose(false)} style={{ position: 'absolute', top: 10, right: 10, padding: 10 }}>
                        <Icon name='ios-close' style={{ fontSize: 32, color: COLOR.black(.6) }} />
                    </TouchableOpacity>
                </View>
            </ModalBox>
        </View>
    );
}

const useErrorChoosen = ({ initVal = 1 }) => {

    const [cls, setCls] = useState(String(initVal));

    const view = (
        <DropDownPicker
            items={[
                { label: 'Giải thích chưa rõ ràng', value: '1' },
                { label: 'Tài liệu học không giống sách giáo khoa', value: '2' },
                { label: 'Nội dung câu hỏi/câu trả lời sai', value: '3' },
                { label: 'Thiếu nội dung câu hỏi / câu trả lời', value: '4' },
            ]}
            defaultValue={cls}
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
            onChangeItem={item => setCls(item.value)}
        />
    );

    return [cls, setCls, view];
}

const useDescriptionInput = () => {

    const [value, setValue] = useState('');

    const view = (
        <Textarea
            value={value}
            onChangeText={txt => setValue(txt)}
            placeholder='Ít nhất 15 ký tự'
            placeholderTextColor={COLOR.black(.4)}
            rowSpan={5}
            style={{ borderRadius: 12, borderWidth: 1, borderColor: COLOR.black(.1), ...fontMaker({ weight: fontStyles.Regular }) }}
        />
    );

    return [value, setValue, view];
}

const FeedbackOption = ({ selectVal, selected = -1, setSelect = () => { }, text = '', idx }) => {
    return (
        <TouchableOpacity onPress={() => { setSelect(idx); selectVal(text) }} style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingVertical: 12 }}>
            {selected == idx ?
                <View style={{ width: 22, height: 22, borderRadius: 11, justifyContent: 'center', borderWidth: 2, borderColor: '#03DDD0', alignItems: 'center' }}>
                    <View style={{ width: 11, height: 11, borderRadius: 5.5, backgroundColor: '#03DDD0' }} />
                </View>
                :
                <View style={{ width: 22, height: 22, borderRadius: 11, justifyContent: 'center', borderWidth: 2, borderColor: COLOR.black(.5), alignItems: 'center' }} />
            }
            {
                idx == 3 && selected == idx ? (
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <TextInput onChangeText={(textVal) => selectVal(textVal)} style={{ width: '100%', borderRadius: 24, paddingVertical: 10, paddingHorizontal: 15, borderWidth: 2, borderColor: blackColor(0.1) }} />
                    </View>
                ) : (

                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), fontSize: 15 }}>{text}</Text>
                        </View>
                    )
            }
        </TouchableOpacity >
    );
}


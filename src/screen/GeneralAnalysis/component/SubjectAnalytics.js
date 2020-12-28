import React, { useState } from 'react';
import {
    Text,
    View,
    Dimensions,
    Image,
    FlatList,
    ImageBackground
} from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { images } from '../../../utils/images';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { COLOR } from '../../../handle/Constant';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'native-base';
import { helpers } from '../../../utils/helpers';
const { width, height } = Dimensions.get('window');

const SubjectAnalytics = (props) => {

    const values = [15, 25, 35, 45, 55];
    const colors = ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff']

    const [state, setState] = useState({ labelWidth: 0, labelHeight: 0, selectedSlice: { label: '', value: '' } });

    const keys = ['google', 'facebook', 'linkedin', 'youtube', 'Twitter'];

    const data = keys.map((key, index) => {
        return {
            key,
            value: values[index],
            svg: { fill: colors[index] },
            arc: { outerRadius: (70 + values[index]) + '%', padAngle: state.selectedSlice.label === key ? 0.1 : 0 },
            onPress: () => setState({ ...state, selectedSlice: { label: key, value: values[index] } })
        }
    })


    return (
        <View style={{ flex: 1 }}>
            <PieChart
                style={{ height: 200, marginVertical: 20 }}
                outerRadius={'80%'}
                innerRadius={'45%'}
                data={data}
            />
            <Text
                onLayout={({ nativeEvent: { layout: { width, height } } }) => {
                    setState({ ...state, labelWidth: width, labelHeight: height });
                }}
                style={{
                    position: 'absolute',
                    left: (width - 30) / 2 - state.labelWidth / 2,
                    top: 120 - state.labelHeight / 2,
                    textAlign: 'center'
                }}
            >
                {`${state.selectedSlice.label} \n ${state.selectedSlice.value}`}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <AnalyzeItem
                    value='0/0'
                />
                <AnalyzeItem
                    label={'Bài thi\nđã làm'}
                    src={images.anal2}
                    value='0/0'
                />
                <AnalyzeItem
                    label={'Thời gian\ncâu'}
                    src={images.anal3}
                    value='10s'
                />
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: COLOR.black(.1), marginVertical: 25 }} />
            <View style={{ flex: 1 }}>
                <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18 }}>Bài thi gần đây</Text>
                <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), fontSize: 14, color: '#575757', marginTop: 3 }}>Thử luyện tập lại những bài thi gần đây</Text>
                <View style={{ marginTop: 10 }}>
                    {[1, 2, 3].map((item, index) => {
                        return <RecentlyExam key={'recently_exam' + index} />
                    })}
                </View>
                <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18, marginTop: 20 }}>Tài liệu đang học</Text>
                <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), fontSize: 14, color: '#575757', marginTop: 3 }}>Thử luyện tập lại những bài thi gần đây</Text>
                <View style={{ marginTop: 10 }}>
                    {[1, 2, 3].map((item, index) => {
                        return <RecentlyExam key={'recently_lesson' + index} />
                    })}
                </View>
                <Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18, marginTop: 20 }}>Video đang xem</Text>
                <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), fontSize: 14, color: '#575757', marginTop: 3 }}>Thử luyện tập lại những bài thi gần đây</Text>
                <View style={{ marginTop: 10 }}>
                    {[1, 2, 3].map((item, index) => {
                        return <RecentlyVideo key={'recently_video' + index} />
                    })}
                </View>
            </View>
        </View>
    )
}

const RecentlyExam = () => {
    return (
        <TouchableOpacity style={{ width: '100%', flexDirection: 'row', paddingVertical: 12, borderBottomColor: COLOR.black(.1), borderBottomWidth: 1, paddingHorizontal: 3, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ ...fontMaker({ weight: fontStyles.SemiBold }), color: '#5E5E5E', fontSize: 15 }}>Demo</Text>
                <Text numberOfLines={2} style={{ ...fontMaker({ weight: fontStyles.Thin }), fontSize: 12, marginTop: 3 }}>Sub title</Text>
            </View>
            <Icon type='AntDesign' name='caretright' style={{ color: COLOR.MAIN, fontSize: 18 }} />
        </TouchableOpacity>
    );
}

const RecentlyVideo = () => {
    return (
        <TouchableOpacity style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 3, alignItems: 'center', marginTop: 10 }}>
            <ImageBackground
                source={{ uri: 'https://www.indiewire.com/wp-content/uploads/2019/05/07956f40-77c4-11e9-9073-657a85982e73.jpg' }}
                style={{ width: 90, height: 50, borderRadius: 4, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}
            >
                <Icon type='Entypo' name='controller-play' style={{ fontSize: 30, color: COLOR.white(1) }} />
                <View style={{ position: 'absolute', bottom: 0, right: 0, borderTopLeftRadius: 4, backgroundColor: COLOR.black(.6), padding: 2 }}>
                    <Text style={{ color: COLOR.white(1), fontSize: 10, ...fontMaker({ weight: fontStyles.Regular }) }}>{helpers.convertTime(120)}</Text>
                </View>
            </ImageBackground>
            <View style={{ flex: 1, paddingVertical: 12, borderBottomColor: COLOR.black(.1), borderBottomWidth: 1, marginLeft: 10 }}>
                <Text numberOfLines={1} style={{ ...fontMaker({ weight: fontStyles.SemiBold }), color: '#5E5E5E', fontSize: 15 }}>Demo</Text>
                <Text numberOfLines={2} style={{ ...fontMaker({ weight: fontStyles.Thin }), fontSize: 12, marginTop: 3 }}>Sub title</Text>
            </View>
            {/* <Icon type='AntDesign' name='caretright' style={{ color: COLOR.MAIN, fontSize: 18 }} /> */}
        </TouchableOpacity>
    );
}

const AnalyzeItem = ({ label = `Câu trả lời\nđúng`, value = '', src = images.anal1 }) => {
    return (
        <View style={{ width: 100, alignItems: 'center' }}>
            <Image
                source={src}
                style={{ width: 40, height: 40 }}
            />
            <Text style={{ textAlign: 'center', ...fontMaker({ weight: fontStyles.Regular }), marginVertical: 5 }}>{label}</Text>
            <Text style={{ textAlign: 'center', ...fontMaker({ weight: fontStyles.Bold }), }}>{value}</Text>
        </View>
    );
}

export default SubjectAnalytics;
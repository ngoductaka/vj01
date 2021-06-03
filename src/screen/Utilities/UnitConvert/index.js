import React, { useState } from 'react';
import { Icon } from 'native-base';
import ModalBox from 'react-native-modalbox';
import { get } from 'lodash';
import convert from 'convert-units'


// import Picker from '@gregfrench/react-native-wheel-picker'
// var PickerItem = Picker.Item;

import {
    Text, View, SafeAreaView, StyleSheet,
    ScrollView, TouchableOpacity, TextInput, FlatList,
    Picker
} from 'react-native';
import { GradientText } from '../../../component/shared/GradientText';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { helpers } from '../../../utils/helpers';


const UnitConvert = (props) => {
    const [unitType, setUnitType] = useState('do_dai');
    const [isOpen, setOpen] = useState(true)
    const [result, setResult] = useState('')
    const [convertIndex, setConvertIndex] = useState([0, 1]);
    const onClose = () => {
        setOpen(false)

        setResult('')
    }
    const _handleInputChange = (val) => {
        try {

            if (val && !isNaN(val)) {
                const [fr, to] = convertIndex;
                const { key: fromUnit } = get(listType, `${unitType}.listOption[${fr}]`);
                const { key: toUnit } = get(listType, `${unitType}.listOption[${to}]`);
                console.log(fromUnit, toUnit, '------re')
                const re = convert(val).from(fromUnit).to(toUnit)
                setResult(re)
            } else {
                setResult('')
            }
        } catch (err) {
            console.log(err, '=======err')
            setResult('')

        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header goBack={() => props.navigation.goBack()} />
            <ScrollView style={styles.scrollView}>
                <TouchableOpacity onPress={() => setOpen('select_type')}
                    style={[styles.shadow, styles.chooseType]}>
                    <Text style={styles.text}>{listType[unitType].textShow}</Text>
                    <Icon name="down" type="AntDesign" style={{ fontSize: 17 }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', marginTop: 40, }}>
                    <View style={[styles.inputWapper]}>
                        <TextInput clearButtonMode="always"
                            onChangeText={_handleInputChange}
                            style={[styles.shadow, styles.inputTag]}
                            keyboardType="numeric" />
                        <TouchableOpacity
                            onPress={() => setOpen('select_unit_type')}
                            style={styles.inputTypeSelect}>
                            <Text>{get(listType, `${unitType}.listOption.${convertIndex[0]}.textShow`, '')}</Text>
                            <Icon name="down" type="AntDesign" style={{ fontSize: 17 }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.textEqual}>=</Text>
                    <View style={[styles.inputWapper]}>
                        <TextInput value={result + ''} editable={false} style={[styles.shadow, styles.inputTag]} />
                        <TouchableOpacity onPress={() => setOpen('select_unit_type')} style={styles.inputTypeSelect}>
                            <Text>{get(listType, `${unitType}.listOption.${convertIndex[1]}.textShow`, '')}</Text>
                            <Icon name="down" type="AntDesign" style={{ fontSize: 17 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <ModalBox
                onClosed={onClose}
                isOpen={isOpen}
                animationDuration={300}
                coverScreen={true}
                backdropPressToClose={true}
                swipeToClose={false}
                backdropColor='rgba(0, 0, 0, .7)'
                style={{
                    width: helpers.width, height: helpers.height / 2, borderTopLeftRadius: 15,
                    borderTopRightRadius: 15, overflow: 'hidden'
                }}
                position='bottom'
            >
                <View>
                    <View style={{ alignItems: 'center' }}>
                        <Icon name="down" type="AntDesign" style={{ fontSize: 17 }} />
                        <Text style={{ textAlign: 'center', marginTop: 8, fontSize: 20 }}>
                            {isOpen == 'select_unit_type' ? "Chọn đại lượng chuyển đổi" : "Chọn loại đơn vị"}
                        </Text>
                    </View>
                    {
                        isOpen == 'select_unit_type' ?
                            <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 100 }}>
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        // style={{ backgroundColor: 'red' }}
                                        data={get(listType, `${unitType}.listOption`, [])}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity onPress={() => {
                                                    convertIndex[0] = index;
                                                    setConvertIndex([...convertIndex])
                                                }} style={styles.itemType}>
                                                    <Text style={styles.textItem}>{item.textShow}</Text>
                                                    {
                                                        convertIndex[0] === index ?
                                                            <Icon
                                                                name="check" type="AntDesign"
                                                                style={{ color: 'green' }} /> :
                                                            null
                                                    }
                                                </TouchableOpacity>
                                            )
                                        }}
                                        keyExtractor={({ item }) => item + ''}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        data={get(listType, `${unitType}.listOption`, [])}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity onPress={() => {
                                                    convertIndex[1] = index;
                                                    setConvertIndex([...convertIndex])
                                                }} style={styles.itemType}>
                                                    <Text style={styles.textItem}>{item.textShow}</Text>
                                                    {
                                                        convertIndex[1] === index ?
                                                            <Icon
                                                                name="check" type="AntDesign"
                                                                style={{ color: 'green' }} /> :
                                                            null
                                                    }
                                                </TouchableOpacity>
                                            )
                                        }}
                                        keyExtractor={({ item }) => item + ''}
                                    />
                                </View>
                            </View>
                            :

                            <View style={{ marginTop: 20 }}>
                                <FlatList
                                    data={Object.keys(listType)}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity onPress={() => setUnitType(item)} style={styles.itemType}>
                                                <Text style={styles.textItem}>{listType[item].textShow}</Text>
                                                {
                                                    item === unitType ?
                                                        <Icon
                                                            name="check" type="AntDesign"
                                                            style={{ color: 'green' }} /> :
                                                        null
                                                }
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={({ item }) => item + ''}
                                />
                            </View>
                    }
                </View>
            </ModalBox>

        </SafeAreaView>
    )
}

let factors1 = new Array(1, 0.001, 0.000621, 3.28084, 1.09361);
let factors2 = new Array(1000, 1, 0.621, 3280.84, 1093.61);
let factors3 = new Array(1609.34, 1.60934, 1, 5280, 1760);
let factors4 = new Array(0.3048, 0.0003048, 0.000189394, 1, 0.333333);
let factors5 = new Array(0.9144, 0.0009144, 0.000568182, 3, 1);
let lengthFactors = new Array(factors1, factors2, factors3, factors4, factors5);

const listType = {
    do_dai: {
        textShow: 'Độ dài',
        listOption: [
            //             mm
            // cm
            // m
            // in
            // ft-us
            // ft
            // mi
            { textShow: "m", key: "m" },
            // { textShow: "km", key: "km" },
            // { textShow: "nm", key: "nm" },
            // { textShow: "μm", key: "μm" },
            { textShow: "mm", key: "mm" },
            { textShow: "cm", key: "cm" },
            { textShow: "in", key: "in" },
            // { textShow: "yd", key: "yd" },
            { textShow: "ft-us", key: "ft-us" },
            { textShow: "ft", key: "ft" },
            // { textShow: "fathom", key: "fathom" },
            // { textShow: "mi", key: "mi" },
            // { textShow: "nMi", key: "nMi" },
        ],
    },
    khoi_luong: {
        textShow: 'Khối lượng',
        listOption: [
            { textShow: "mcg", key: "mcg" },
            { textShow: "mg", key: "mg" },
            { textShow: "g", key: "g" },
            { textShow: "kg", key: "kg" },
            { textShow: "oz", key: "oz" },
            { textShow: "lb", key: "lb" },
            { textShow: "mt", key: "mt" },
            { textShow: "t", key: "t" },
        ]
    },
    thoi_gian: {
        textShow: 'Thời gian',
        listOption: [
            { textShow: "ns", key: "ns" },
            { textShow: "mu", key: "mu" },
            { textShow: "ms", key: "ms" },
            { textShow: "s", key: "s" },
            { textShow: "min", key: "min" },
            { textShow: "h", key: "h" },
            { textShow: "d", key: "d" },
            { textShow: "week", key: "week" },
            { textShow: "month", key: "month" },
            { textShow: "year", key: "year" },
        ]
    },
    nhieu_do: {
        textShow: 'Nhiệt độ',
        listOption: [
            { textShow: "C", key: "C" },
            { textShow: "F", key: "F" },
            { textShow: "K", key: "K" },
            { textShow: "R", key: "R" },
        ]
    },
    toc_do: {
        textShow: 'Tốc độ',
        listOption: [
            { textShow: "mm3/s", key: "mm3/s" },
            { textShow: "cm3/s", key: "cm3/s" },
            { textShow: "ml/s", key: "ml/s" },
            { textShow: "cl/s", key: "cl/s" },
            { textShow: "dl/s", key: "dl/s" },
            { textShow: "l/s", key: "l/s" },
            { textShow: "l/min", key: "l/min" },
            { textShow: "l/h", key: "l/h" },
            { textShow: "kl/s", key: "kl/s" },
            { textShow: "kl/min", key: "kl/min" },
            { textShow: "kl/h", key: "kl/h" },
            { textShow: "m3/s", key: "m3/s" },
            { textShow: "m3/min", key: "m3/min" },
            { textShow: "m3/h", key: "m3/h" },
            { textShow: "km3/s", key: "km3/s" },
            { textShow: "tsp/s", key: "tsp/s" },
            { textShow: "Tbs/s", key: "Tbs/s" },
            { textShow: "in3/s", key: "in3/s" },
            { textShow: "in3/min", key: "in3/min" },
            { textShow: "in3/h", key: "in3/h" },
            { textShow: "fl-oz/s", key: "fl-oz/s" },
            { textShow: "fl-oz/min", key: "fl-oz/min" },
            { textShow: "fl-oz/h", key: "fl-oz/h" },
            { textShow: "cup/s", key: "cup/s" },
            { textShow: "pnt/s", key: "pnt/s" },
            { textShow: "pnt/min", key: "pnt/min" },
            { textShow: "pnt/h", key: "pnt/h" },
            { textShow: "qt/s", key: "qt/s" },
            { textShow: "gal/s", key: "gal/s" },
            { textShow: "gal/min", key: "gal/min" },
            { textShow: "gal/h", key: "gal/h" },
            { textShow: "ft3/s", key: "ft3/s" },
            { textShow: "ft3/min", key: "ft3/min" },
            { textShow: "ft3/h", key: "ft3/h" },
            { textShow: "yd3/s", key: "yd3/s" },
            { textShow: "yd3/min", key: "yd3/min" },
            { textShow: "yd3/h", key: "yd3/h" },
        ]
    },
    the_tich: {
        textShow: "Thể tích",
        listOption: [
            { textShow: "mm3", key: "mm3" },
            { textShow: "cm3", key: "cm3" },
            { textShow: "ml", key: "ml" },
            { textShow: "l", key: "l" },
            { textShow: "kl", key: "kl" },
            { textShow: "m3", key: "m3" },
            { textShow: "km3", key: "km3" },
            { textShow: "tsp", key: "tsp" },
            { textShow: "Tbs", key: "Tbs" },
            { textShow: "in3", key: "in3" },
            { textShow: "fl-oz", key: "fl-oz" },
            { textShow: "cup", key: "cup" },
            { textShow: "pnt", key: "pnt" },
            { textShow: "qt", key: "qt" },
            { textShow: "gal", key: "gal" },
            { textShow: "ft3", key: "ft3" },
            { textShow: "yd3", key: "yd3" },
        ]

    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: '#fff'
        // backgroundColor: 'red'

    },
    text: {
        ...fontMaker({ weight: fontStyles.Light }),
        fontSize: 20
    },
    textItem: {
        ...fontMaker({ weight: fontStyles.Light }),
        fontSize: 18

    },
    closeBtn: { fontSize: 25, color: '#111' },
    backBtn: {
        height: 40, width: 40, justifyContent: 'center', alignItems: 'center',
        borderRadius: 40, shadowColor: 'rgba(0, 0, 0, 0.08)', marginLeft: 7
    },
    shadow: {
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },
    },
    chooseType: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#fefefe',
        borderRadius: 7,
        paddingHorizontal: 15,
        paddingVertical: 7,
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    textEqual: {
        marginHorizontal: 13,
        marginTop: 18,
        fontSize: 18

    },
    inputWapper: {
        // flexDirection: 'row',
        // borderWidth: 1,
        // borderColor: '#ddd',
        // paddingHorizontal: 15,
        // paddingVertical: 7,
        // justifyContent: 'space-between',
        // alignItems: 'center',
        justifyContent: 'center',
        flex: 1,

    },
    inputTag: {
        flex: 1,
        backgroundColor: '#E6E6E6',
        // borderRadius: 30,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        ...fontMaker({ weight: 'Light' })
    },
    inputTypeSelect: {
        marginTop: 10, alignItems: 'center', flexDirection: 'row',
        justifyContent: 'space-between', borderBottomColor: '#dadada',

        borderBottomWidth: 1, paddingVertical: 10, paddingLeft: 10
    },
    itemType: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderColor: '#dedede',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20, alignItems: 'center',
        marginHorizontal: 10,
        paddingVertical: 6,
    },

});

const Header = ({ goBack }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
                onPress={goBack}
                style={[styles.shadow, styles.backBtn]}>
                <Icon type='MaterialCommunityIcons'
                    name={'arrow-left'} style={{ fontSize: 26, color: '#836AEE' }} />
            </TouchableOpacity>
            <GradientText colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                style={{ fontSize: 26, marginTop: 4, ...fontMaker({ weight: fontStyles.Bold }) }}
            >Chuyển đổi đơn vị</GradientText>
            <View style={{ width: 40 }} />
        </View>
    )
}

export default UnitConvert;
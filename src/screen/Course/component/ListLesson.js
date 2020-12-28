import React from 'react';
import {
    View,
    FlatList,
    Picker,
    Dimensions,
    SafeAreaView, ScrollView,
    Text, StyleSheet, Linking, Platform, ImageBackground, TouchableOpacity, Image, Animated
} from 'react-native';
import { Icon } from 'native-base';


import StarRating from 'react-native-star-rating';


const { width, height } = Dimensions.get('window');
import { ImgCourse } from './ImgCourse';
import { COLOR, fontSize } from '../../../handle/Constant';
import { convertMoney, helpers } from '../../../utils/helpers';

const fakeListCourse = [
    1, 2, 3, 4, 5, 5
];
const BACON_IPSUM =
    'Bacon ipsum dolor amet chuck turducken landjaeger tongue spare ribs. Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';


const ListLesson = ({ listCourse = fakeListCourse, onPress, style }) => {
    return (
        <View style={[{ marginBottom: 40, width: width }, style]}>
            <FlatList
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
                horizontal={true}
                data={listCourse}
                renderItem={({ item, index }) => RenderLesson({ content: item, isLast: listCourse.length - 1 === index, onPress })}
                keyExtractor={(item, index) => index + 'subitem'}
            />
        </View>
    )
}


const RenderLesson = ({
    content = {}, props, currSubject, currSubjectName, style = {}, isLast, onPress,
    prePrice = '200.000 VND',
    price = 400000
}) => {
    return (
        <TouchableOpacity
            style={style}
            onPress={() => onPress(content)}
        >
            <View
                style={[lessonSt.container, { marginRight: isLast ? 30 : 12, overflow: 'hidden' }]}
            >
                <ImgCourse style={{
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    height: 150
                }} />
                <View style={{ paddingHorizontal: 10, }}>
                    <View style={{ paddingVertical: 10 }}>
                        <Text style={{ fontSize: fontSize.h4, fontWeight: '500' }} numberOfLines={2}>{BACON_IPSUM}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 5 }}>
                        <Icon type='FontAwesome5' name='user' style={{ color: '#666', fontSize: fontSize.h4 }} />
                        <Text style={{ fontWeight: 'bold', fontSize: fontSize.h5 }}> Snape Professor </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={3.8}
                            fullStarColor={COLOR.MAIN}
                            starSize={fontSize.h5}
                            disabled
                        />
                        <Text style={{ fontSize: fontSize.h5 }}> 4.9 (999)</Text>
                    </View>

                    <View style={[lessonSt.priceView, { justifyContent: 'flex-end', alignItems: 'center', marginTop: 8 }]}>
                        <Text style={lessonSt.prePrice}> {prePrice} </Text>
                        <Text style={lessonSt.price}> {convertMoney(price)}</Text>
                    </View>
                </View>

            </View>
        </TouchableOpacity>
    )
}

const lessonSt = StyleSheet.create({
    container: {
        width: helpers.isTablet ? width / 2.4 : width / 1.7,
        paddingBottom: 14,
        backgroundColor: '#fff',
        // height: 170,
        borderRadius: 15,
        justifyContent: 'space-between'
    },
    textLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    swapperLeft: {
        flex: 1,
        // borderRightColor: '#dedede',
        // borderRightWidth: 1,

    },
    textRight: {
        flex: 1,
        borderLeftColor: '#dedede',
        borderLeftWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    textBottom: {
        flexDirection: 'row',
    },
    priceView: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    prePrice: {
        textDecorationLine: 'line-through',
        fontSize: fontSize.h5
    },
    price: {
        color: COLOR.WRONG,
        fontWeight: 'bold',
        fontSize: fontSize.h4
    },
    header: {
        fontSize: 25,
        color: COLOR.MAIN,
        fontWeight: 'bold',
        textTransform: "capitalize",
        marginVertical: 15
    }
})

export {
    ListLesson
}
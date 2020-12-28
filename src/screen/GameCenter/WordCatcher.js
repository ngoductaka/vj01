import { remove } from 'lodash';
import React, { useState, useEffect, useRef } from 'react'
import { FlatList } from 'react-native';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    Animated,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { COLOR } from '../../handle/Constant';
import { images } from '../../utils/images';
import BackHeader from '../History/Component/BackHeader';

const WordCatcher = (props) => {

    const { navigation } = props;

    const [answer, setAnswer] = useState([]);
    const [option, setOption] = useState(['word 1', 'word2', 'word3', 'word4', 'word 5', 'word6', 'word7', 'word8']);

    useEffect(() => {

    }, []);

    const handleSelectOption = (item, index) => {
        setAnswer([...answer, item]);
        remove(option, function (it, idx) {
            return (idx == index && item == it);
        });
        setOption(option);
    }

    const handleSelectAnswer = (item, index) => {
        setOption([...option, item]);
        remove(answer, function (it, idx) {
            return (idx == index && item == it);
        });
        setAnswer(answer);
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <BackHeader
                title={'Nối từ'}
                showRight={false}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ padding: 10, flex: 1, justifyContent: 'space-between' }}>
                    {/* answer */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {answer.map((item, index) => {
                            return <TouchableOpacity key={index + 'answer'} onPress={() => handleSelectAnswer(item, index)} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: 'blue', marginRight: 8, marginBottom: 8 }}>
                                <Text style={{ color: COLOR.white(1) }}>{item}</Text>
                            </TouchableOpacity>
                        })}
                    </View>

                    {/* question */}
                    <View>
                        <Text style={{ marginBottom: 10 }}>Lựa chọn từ</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {option.map((item, index) => {
                                return <TouchableOpacity key={index + 'option'} onPress={() => handleSelectOption(item, index)} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: 'blue', marginRight: 8, marginBottom: 8 }}>
                                    <Text style={{ color: COLOR.white(1) }}>{item}</Text>
                                </TouchableOpacity>
                            })}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View >
    )
}

export default WordCatcher;


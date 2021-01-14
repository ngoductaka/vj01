import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { get } from 'lodash';
import { FlatList } from 'react-native-gesture-handler';
import { COLOR } from '../../../handle/Constant';


const ScoreTable = ({ data, onPress, style, refS, focus }) => {
    return (
        <View style={[styles.container, style]}>
            {/* header */}
            <Header />
            {/* content */}
            <ScrollView>
                <FlatList
                    ref={refS}
                    style={{ marginBottom: 50 }}
                    data={listSubject}
                    renderItem={({ item, index }) => {
                        return <RenderRow
                            onPress={onPress}
                            val={index}
                            key={index}
                            title={item.text}
                            data={data}
                            active={focus === index}
                        />
                    }}
                />
            </ScrollView>


        </View>
    )
};

const Day = [
    { text: 'Hệ số 1', key: 1 },
    { text: 'Hệ số 2', key: 2 },
    { text: 'Hệ số 3', key: 3 },
    { text: 'Tổng kết', key: 0 },];
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const RenderRow = ({ title = '', data, onPress = () => { }, val, active }) => {
    const tb = calScore(val, data)

    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: active ? "#D2EEFD" : "#fff", borderColor: '#dedede', borderWidth: 1, width: 80, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#111' }}>{title}</Text>
            </View>
            {/*  */}
            {
                Day.map(({ key }) => {
                    const score = get(data, `${key}-${val}`, '');
                    return (
                        <TouchableOpacity style={{
                            flex: 1,
                            backgroundColor: active ? '#D2EEFD' : (key & 1) ? '#f2f2f2' : '#fff'
                        }} onPress={() => onPress({ [`${key}-${val}`]: score })}>
                            <View style={{ flex: 1, borderColor: '#dedede', borderWidth: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#111', fontSize: 12, padding: 4 }}>{key == 0 ? tb : score.split('-').join('; ')}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }

        </View>
    )
}


const Header = () => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ borderColor: '#dedede', borderWidth: 1, width: 80, justifyContent: 'center', alignItems: 'center' }}>
            </View>
            {/*  */}
            {
                Day.map((content, index) => {
                    return (
                        <View style={{ flex: 1, borderColor: '#dedede', borderWidth: 1, }}>
                            <Pressable>
                                <Text style={{
                                    textAlign: 'center', paddingVertical: 10, fontWeight: '600',
                                    backgroundColor: content.key & 1 ? '#f2f2f2' : '#fff',
                                    color: index == 6 ? 'red' : '#000'
                                }}>{content.text}</Text>
                            </Pressable>
                        </View>
                    )
                })
            }

        </View>
    )
}

export default ScoreTable;



export const listSubject = [
    {
        text: "Toán",
        color: '#f72f28'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Văn",
        color: '#5ba978'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Ngoại ngữ",
        color: '#f45044'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Lý",
        color: '#ce6c34'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Hoá",
        color: '#d637ff'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Tin học",
        color: '#b7855f'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Sinh học",
        color: '#fe095b'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Giáo dục công dân",
        color: '#21863e'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Lịch sử",
        color: '#2892e1'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Địa lý",
        color: '#702252'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Công nghệ",
        color: '#224e6f'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Thể dục",
        color: '#6b8067'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Quân sự",
        color: '#7a435d'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Âm nhạc",
        color: '#47c2e0'
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Mỹ thuật",
        color: '#50de6e'
        //  "Văn", "Ngoại ng"
    },

]


export const calScore = (subject, data) => {
    let total = 0;
    let totalScore = 0;

    Day.map(({ key }) => {
        const score = get(data, `${key}-${subject}`, '');
        const listScore = score.split('-');
        // console.log('==================', listScore, score)
        if (score && listScore.length) {
            total += listScore.length * key;
        }
        totalScore += key * listScore.reduce((cal, cur) => {
            return cal + +cur
        }, 0)
    });
    return total ? (totalScore / total).toFixed(2) : ''



}


export const calAverage = (data) => {
    try {
        let total = 0;
        const result = listSubject.reduce((cal, cur, index) => {
            const scoreAverage = calScore(index, data);
            // console.log(scoreAverage, '=------', index, '====', parseFloat(scoreAverage))
            if (+scoreAverage > 0 && scoreAverage) total += 1

            return cal + (scoreAverage ? parseFloat(+scoreAverage) : 0)
        }, 0);
        // console.log('3-----', total, result)

        return total ? (result / total).toFixed(2) : '';

    } catch (err) {
        console.log(err, 'err cal ')
        return ''
    }

}
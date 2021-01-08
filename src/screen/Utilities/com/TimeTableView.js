import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { get } from 'lodash';


const TimetableView = ({ data, onPress }) => {
    return (
        <View style={styles.container}>
            {/* header */}
            <Header />
            {/* content */}
            <ScrollView>
                <View style={{ backgroundColor: '#7ee0b7' }}>
                    <Text style={{ paddingHorizontal: 7, paddingVertical: 5, fontWeight: 'bold', color: '#fff', }}>Sáng</Text>
                </View>
                {listTime.map(i => <RenderRow onPress={onPress} val={`s${i}`} key={i} title={"Tiết " + i} data={data} />)}
                <View style={{ backgroundColor: '#004bb9' }}>
                    <Text style={{ paddingHorizontal: 7, paddingVertical: 5, color: '#fff', fontWeight: 'bold' }}>Chiều</Text>
                </View>
                {listTime.map(i => <RenderRow onPress={onPress} val={`c${i}`} key={i} title={"Tiết " + i} data={data} />)}
                <View style={{ backgroundColor: '#868686' }}>
                    <Text style={{ paddingHorizontal: 7, paddingVertical: 5, color: '#fff', fontWeight: 'bold' }}>Tối</Text>
                </View>
                {
                    listTime.map(i => <RenderRow onPress={onPress} val={`t${i}`} key={i} title={"Tiết " + i} data={data} />)
                }
            </ScrollView>


        </View>
    )
};

const Day = [{ text: 'T2', day: 2 }, { text: 'T3', day: 3 }, { text: 'T4', day: 4 }, { text: 'T5', day: 5 }, { text: 'T6', day: 6 }, { text: 'T7', day: 7 }, { text: 'CN', day: 0 },]
const listTime = new Array(6).fill(0).map((_, index) => index + 1)

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const mapData = {

}


const RenderRow = ({ title = '', data, onPress = () => { }, val }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ borderColor: '#dedede', borderWidth: 1, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{fontSize: 11}}>{title}</Text>
            </View>
            {/*  */}
            {
                Day.map(({ day }) => {
                    const subject = get(data, `${day}${val}`, '');
                    return (
                        <Pressable style={{ flex: 1 }} onPress={() => onPress({ [`${day}${val}`]: subject })}>
                            <View style={{ flex: 1, borderColor: '#dedede', borderWidth: 1, height: 70, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#111', fontSize: 12, padding: 4 }}>{subject}</Text>
                            </View>
                        </Pressable>
                    )
                })
            }

        </View>
    )
}


const Header = () => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ borderColor: '#dedede', borderWidth: 1, width: 40, justifyContent: 'center', alignItems: 'center' }}>
            </View>
            {/*  */}
            {
                Day.map(content => {
                    return (
                        <View style={{ flex: 1, borderColor: '#dedede', borderWidth: 1,  }}>
                            <Pressable>
                                <Text style={{
                                    textAlign: 'center', paddingVertical: 10
                                }}>{content.text}</Text>
                            </Pressable>
                        </View>
                    )
                })
            }

        </View>
    )
}

export default TimetableView;


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
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Lý",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Hoá",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Tin học",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Sinh học",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Giáo dục công dân",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Lịch sử",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Địa lý",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Công nghệ",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Thể dục",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Quân sự",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Âm nhạc",
        color: ''
        //  "Văn", "Ngoại ng"
    },
    {
        text: "Mỹ thuật",
        color: ''
        //  "Văn", "Ngoại ng"
    },

]

var randomColor = () => '#'+Math.floor(Math.random()*16777215).toString(16)

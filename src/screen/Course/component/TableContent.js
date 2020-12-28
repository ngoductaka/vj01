import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    FlatList,
    Dimensions,
    SafeAreaView, ScrollView, Text, StyleSheet, Linking, Platform, ImageBackground, TouchableOpacity, Image
} from 'react-native';
import { Icon } from 'native-base';
import Collapsible from 'react-native-collapsible';


const TableContent = ({_navigateToCourse, listCourse = [] }) => {
    const [active, setActive] = useState(0);


    return (

        <View style={{ backgroundColor: '#fff', paddingHorizontal: 10, marginVertical: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 27 }}>Nội dung khoá học: </Text>

            {
                listCourse.map((chapter, index) => {
                    return (
                        <View>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row', justifyContent: 'space-between',
                                    marginTop: 10, paddingVertical: 8, paddingHorizontal: 7, borderRadius: 10
                                }}
                                onPress={() => setActive(index === active ? -1 : index)}>
                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={1} style={{ fontSize: 25, textTransform: 'capitalize' }}>{chapter.title}</Text>
                                </View>
                                <Icon type="AntDesign" name={index === active ? "minus" : "plus"} />
                            </TouchableOpacity>
                            <Collapsible collapsed={!(index === active)}>
                                <View style={{ marginHorizontal: 10 }}>
                                    {chapter.children.map((i, index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={_navigateToCourse}
                                                style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }} >
                                                <Text style={{ fontSize: 19, marginHorizontal: 15 }}>{index + 1}.</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 22, textTransform: 'capitalize' }} numberOfLines={2}>{i.title}</Text>
                                                    <Text style={{ marginTop: 4, color: '#222', fontSize: 12 }}>Video - 12:00 phút</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </Collapsible>
                        </View>
                    )
                })
            }

        </View>

    )
}



export default TableContent;
import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    FlatList,
    Dimensions,
    SafeAreaView, ScrollView, Text, StyleSheet, Linking, Platform, ImageBackground, TouchableOpacity, Image
} from 'react-native';
import { Icon } from 'native-base';
import Collapsible from 'react-native-collapsible';
import { get } from 'lodash';
import { helpers } from '../../../utils/helpers';


const TableContent = ({ _navigateToCourse, listCourse = [] }) => {
    const [active, setActive] = useState(0);

    return (
        <View style={{ backgroundColor: '#fff', paddingHorizontal: 10, marginVertical: 20, paddingVertical: 15, borderRadius: 10 }}>
            <Text style={{ fontSize: 27 }}>Nội dung khoá học: </Text>

            {
                listCourse.map((chapter = {}, index) => {
                    return (
                        <View>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row', justifyContent: 'space-between',
                                    marginTop: 10, paddingVertical: 8, paddingHorizontal: 7, borderRadius: 10
                                }}
                                onPress={() => setActive(index === active ? -1 : index)}>
                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={2} style={{ fontSize: 22, textTransform: 'capitalize' }}>{chapter.name}</Text>
                                </View>
                                <Icon type="AntDesign" name={index === active ? "minus" : "plus"} />
                            </TouchableOpacity>
                            <Collapsible collapsed={!(index === active)}>
                                <View style={{ marginHorizontal: 5 }}>
                                    {get(chapter, 'get_child_curriculum', []).map((course, index) => {
                                        const media = course.get_media;
                                        const videoData = media.find(m => m.type == "video/mp4");
                                        const listPdf = media.filter(m => m.type == "application/pdf");
                                        // "preview": "active",

                                        if (course.status !== 'active') return null;

                                        return (
                                            <View>
                                                <TouchableOpacity
                                                    onPress={() => _navigateToCourse({
                                                        videoData,
                                                        listPdf,
                                                        course
                                                    })}
                                                    style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}
                                                >
                                                    <Text style={{ fontSize: 16, marginHorizontal: 15 }}>{index + 1}.</Text>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontSize: 20, textTransform: 'capitalize' }} numberOfLines={2}>{course.name}</Text>
                                                        <Text style={{ marginTop: 4, color: '#222', fontSize: 12 }}>
                                                            Video - {helpers.convertTime(videoData.duration)} {listPdf.length ? `(${listPdf.length} tài liệu)` : ''}
                                                        </Text>
                                                    </View>
                                                    {course.preview === 'active' ? <View style={{ borderWidth: 1, borderColor: '#6992A8', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 }}>
                                                        <Text style={{ color: '#6992A8' }}>preview</Text>
                                                    </View> : null}
                                                </TouchableOpacity>
                                            </View>
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

const RenderCourse = ({ name, data, index }) => {


}



export default TableContent;
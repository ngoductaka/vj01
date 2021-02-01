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


const TableContent = ({ _navigateToCourse, listCourse = [], playPath = [] }) => {
    const [l1 = null, l2 = null] = playPath;
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (l1 !== null) {
            setActive(l1);
        }
    }, [l1]);

    return (
        <ScrollView style={{}}>
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
                                <RenderListLesson
                                    chapter={chapter} index={index}
                                    l1={l1} l2={l2} _navigateToCourse={_navigateToCourse}
                                    listCourse={listCourse}
                                />
                            </Collapsible>
                        </View>
                    )
                })
            }

        </ScrollView>

    )
}

export default TableContent;


const RenderListLesson = ({ chapter, index, l1, l2, _navigateToCourse, listCourse }) => {
    const refFlatlist = useRef(null);
    const [active, setActive] = useState(false);
    useEffect(() => {
        // if() {
        //     setActive(true)
        // }
        setTimeout(() => {
            if (index == l1 && refFlatlist && refFlatlist.current && refFlatlist.current.scrollToIndex) {
                refFlatlist.current.scrollToIndex({ animated: true, index: l2 });
            }
        }, 1000)
    }, [l1, l2])

    return (
        <View style={{ marginHorizontal: 5 }}>
            <FlatList
                ref={refFlatlist}
                data={get(chapter, 'get_child_curriculum', [])}
                // stickyHeaderIndices={[0,2,3]}
                renderItem={({ item: course, index: indexVideo }) => {

                    const media = course.get_media;
                    const videoData = media.find(m => m.type == "video/mp4") || {};
                    const listPdf = media.filter(m => m.type == "application/pdf");
                    // "preview": "active",

                    if (course.status !== 'active') return null;
                    return (
                        <View style={{ backgroundColor: (indexVideo == l2 && index == l1) ? 'rgba(252, 165, 3, 0.3)' : '#fff', borderRadius: 4, paddingRight: 3 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    _navigateToCourse({
                                        videoData,
                                        listPdf,
                                        listCourse,
                                        pathPlay: [index, indexVideo]
                                    })
                                }}
                                style={{ paddingTop: 5, flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}
                            >
                                <Text style={{ fontSize: 16, marginHorizontal: 10 }}>{indexVideo + 1}.</Text>
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

                }}
                keyExtractor={({ item, index }) => index + ''}
            />

            {/* {get(chapter, 'get_child_curriculum', []).map(
            )} */}
        </View>

    )
}
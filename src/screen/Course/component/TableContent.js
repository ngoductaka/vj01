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
import { fontMaker, fontStyles } from '../../../utils/fonts';


const TableContent = ({ _navigateToCourse, listCourse = [], 
    playPath = [], navigation, showConsoult = true, setShowConsultModal }) => {
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
                                    <Text numberOfLines={2} style={{ fontSize: 18, textTransform: 'capitalize', ...fontMaker({ weight: fontStyles.Regular }) }}>{chapter.name}</Text>
                                </View>
                                <Icon type="AntDesign" name={index === active ? "minus" : "plus"} />
                            </TouchableOpacity>
                            <Collapsible collapsed={!(index === active)}>
                                <RenderListLesson
                                    showConsoult={showConsoult} setShowConsultModal={setShowConsultModal}
                                    chapter={chapter} index={index}
                                    l1={l1} l2={l2} _navigateToCourse={_navigateToCourse}
                                    listCourse={listCourse} navigation={navigation}
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

// 

export const TableContentExpand = ({ _navigateToCourse, listCourse = [], playPath = [] }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        let dataConvert = [];
        listCourse.map(course => {
            dataConvert.push({
                name: course.name,
                type: 'c1'
            });
            course.get_child_curriculum.map((curriculumn, index) => {
                dataConvert.push({ ...curriculumn, index })
            })
        });

        console.log(listCourse, 'dataConvertdataConvertdataConvert', dataConvert)

        setData(dataConvert)

    }, [listCourse])
    if (!data[0]) return null;

    return (
        <FlatList
            data={data}
            keyExtractor={({ item, index }) => String(index)}
            renderItem={({ item, index }) => {
                if (item.type == 'c1') {
                    return (
                        <View>
                            <Text numberOfLines={2} style={{ fontSize: 18, textTransform: 'capitalize', ...fontMaker({ weight: fontStyles.SemiBold }) }}>{item.name}</Text>
                        </View>
                    )
                } else {
                    return (
                        <View>
                            <View>

                                <Text numberOfLines={2} style={{
                                    fontSize: 16, marginLeft: 15, paddingVertical: 6,
                                    ...fontMaker({ weight: fontStyles.Regular })
                                }}>{item.index + 1}.  {item.name}</Text>
                            </View>
                            {
                                item.get_media.map(media => {
                                    if (media.type == "video/mp4") return null
                                    return (
                                        <Text numberOfLines={2} style={{
                                            fontSize: 15, marginLeft: 20, paddingVertical: 6,
                                            ...fontMaker({ weight: fontStyles.Regular })
                                        }}>{media.name}</Text>
                                    )
                                })
                            }
                        </View>
                    )
                }
                //  else {

                //     return (
                //         <View>
                //             <Text numberOfLines={2} style={{
                //                 fontSize: 16, paddingVertical: 6,
                //                 marginLeft: 20, ...fontMaker({ weight: fontStyles.Regular })
                //             }}>{item.name}</Text>
                //         </View>
                //     )

                // }
            }}
        />

    )
}

// export const FreeCourse = ({data}) => {
//     return (
//         <V
//     )
// }


const RenderListLesson = ({ chapter, index, l1, l2, _navigateToCourse, 
    listCourse, navigation, showConsoult = true, setShowConsultModal }) => {
    const refFlatlist = useRef(null);
    // const [active, setActive] = useState(false);
    useEffect(() => {
        // if() {
        //     setActive(true)
        // }
        setTimeout(() => {
            try {
                if (index == l1 && refFlatlist && refFlatlist.current && refFlatlist.current.scrollToIndex) {
                    refFlatlist.current.scrollToIndex({ animated: true, index: l2 });
                }
            } catch (err) {
                console.log('eerr scroll', err)
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
                            <View style={{ paddingTop: 5, paddingBottom: 10 }} >
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ fontSize: 15, marginHorizontal: 10 }}>{indexVideo + 1}.</Text>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (videoData.duration) {
                                                    videoData.name = course.name
                                                    _navigateToCourse({
                                                        showConsoult,
                                                        videoData,
                                                        listPdf,
                                                        listCourse,
                                                        pathPlay: [index, indexVideo],
                                                    })
                                                } else {
                                                    if (get(listPdf, `[0].raw_url`)) {
                                                        console.log(setShowConsultModal && showConsoult, setShowConsultModal , showConsoult)
                                                        if(setShowConsultModal && showConsoult) {
                                                            setShowConsultModal(true);
                                                        } else {
                                                            // navigation.navigate('PdfView', { uri: listPdf[0].raw_url })
                                                        }
                                                    }
                                                }
                                            }}>
                                            <Text style={{ fontSize: 15, textTransform: 'capitalize', ...fontMaker({ weight: fontStyles.Regular }) }} numberOfLines={2}>{course.name}</Text>
                                            <Text style={{ marginTop: 4, color: '#222', fontSize: 12, }}>
                                                {videoData.duration ? `Video - ${helpers.convertTime(videoData.duration)}` : 'Tài liệu'}
                                            </Text>
                                        </TouchableOpacity>
                                        {
                                            listPdf.map(pdf => {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {

                                                    if (pdf.raw_url) {
                                                        console.log(setShowConsultModal && showConsoult, setShowConsultModal , showConsoult)
                                                        if(setShowConsultModal && showConsoult) {
                                                            setShowConsultModal(true);
                                                        } else {
                                                            // navigation.navigate('PdfView', { uri: listPdf[0].raw_url })
                                                            navigation.navigate('PdfView', { uri: pdf.raw_url })
                                                        }
                                                    }
                                                        }}
                                                        style={{ flexDirection: 'row', marginTop: 15, marginLeft: -25, alignItems: 'center' }}
                                                    >
                                                        <Icon style={{ fontSize: 15, marginRight: 12 }} name="file-pdf-o" type="FontAwesome" />
                                                        <View>
                                                            <Text style={{ fontSize: 15, textTransform: 'capitalize', ...fontMaker({ weight: fontStyles.Regular }) }} numberOfLines={2}>{pdf.name}</Text>
                                                            <Text style={{ marginTop: 4, color: '#222', fontSize: 12, }}> Tài liệu</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                    {course.preview === 'active' && showConsoult ? <View style={{
                                        borderWidth: 1, borderColor: '#6992A8', alignSelf: 'flex-start',
                                        paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3
                                    }}>
                                        <Text style={{ color: '#6992A8' }}>preview</Text>
                                    </View> : null}
                                </View>




                            </View>
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
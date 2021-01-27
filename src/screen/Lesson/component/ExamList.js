import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Card, Icon } from 'native-base';
import { isEmpty, get } from 'lodash';
import * as Animatable from 'react-native-animatable';

import { COLOR, fontSize, blackColor } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';

const ExcerciseItem = ({ data, advertParam = null, handleNavigate, book, lessonId, SeeMore }) => {
    const [expand, setExpand] = useState(true);
    return (
        <View style={{ overflow: 'hidden', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingRight: 10, }}>
                <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }) }}>Trắc nghiệm</Text>
                <Text style={{ fontSize: 19, marginLeft: 4, color: '#555', ...fontMaker({ weight: fontStyles.Regular }) }}>({data.length} bài)</Text>
            </View>
            <Animatable.View animation={expand ? "fadeIn" : "fadeOut"}>
                {!expand || isEmpty(data) ? null :
                    <View>
                        {
                            data.slice(0, 3).map((item, index) => {
                                return (
                                    <RenderItemExam handleNavigate={handleNavigate} advertParam={advertParam} item={item} book={book} lessonId={lessonId} />
                                )
                            })
                        }
                    </View>}
                {
                    data.length > 3 && <SeeMore
                        onPress={() => handleNavigate('ListDetailLesson', { title: "Trắc nghiệm", data, book, lessonId })}
                        count={data.length - 3}
                    />
                }
            </Animatable.View>
        </View>

    );
};


// component
const stylesComponent = StyleSheet.create({
    textItem: {
        flexDirection: 'row',
        borderRadius: 5,
        borderBottomColor: '#dedede',
        borderBottomWidth: 1,
        padding: 10, alignItems: 'center',
        paddingVertical: 20
    },
    textContent: {
        ...fontMaker({ weight: fontStyles.Regular }),
        fontSize: fontSize.h3, color: blackColor(0.6), flex: 1,
        fontSize: fontSize.h4
    },
    icon: {
        color: '#777',
        fontSize: 12,
        marginTop: 3,
        marginLeft: 2
    }
});

const RenderItemExam = ({ handleNavigate, advertParam = null, item, book, lessonId }) => {
    return (
        <TouchableOpacity
            onPress={() => handleNavigate('OverviewTest', {
                idExam: get(item, 'partable.id', ''),
                title: get(item, 'partable.title', ''),
                icon: get(book, 'icon_id'),
                subject: get(book, 'title'),
                lessonId: lessonId,
                time: get(item, 'partable.duration', 0),
                count: get(item, 'partable.questions_count', 0),
                source: 'LessonOverview',
                advert: advertParam
            })}
            style={[stylesComponent.textItem, { paddingLeft: 2 }]}
        >
            <View style={{ flexDirection: 'row', flex: 1, paddingRight: 25, alignItems: 'center' }}>
                {/* <Icon type='FontAwesome' name='check-square-o' style={{ fontSize: 25, color: 'green', marginRight: 6 }} /> */}

                <View
                    style={{
                        height: 30, width: 30, marginRight: 5, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
                        borderColor: COLOR.MAIN,
                        borderWidth: 1
                    }}
                >
                    <Icon type='Entypo' name='flash' style={{ color: COLOR.MAIN, fontSize: 18, marginLeft: 3 }} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={3} style={stylesComponent.textContent} >
                        {get(item, 'partable.title', '')}
                    </Text>
                    {get(item, 'partable.questions_count', 0) ? <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Icon type='AntDesign' name='infocirlceo' style={{ fontSize: 12, marginRight: 4, marginTop: 3, color: blackColor(0.8) }} />
                        <Text style={[stylesComponent.textContent, { fontSize: fontSize.h5, color: blackColor(0.4) }]}>
                            {`${get(item, 'partable.questions_count', 0)} câu hỏi `}
                        </Text>
                    </View> : null}
                </View>
            </View>
            {
                // !get(item, 'partable.user_exam', null) ?
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 7 }}>
                    <Text style={{
                        color: COLOR.MAIN,
                        fontSize: 12,
                        ...fontMaker({ weight: fontStyles.Regular })
                    }}> Bắt đầu </Text>
                    <Icon style={stylesComponent.icon} type="AntDesign" name="right" />
                </View>
                // :
                // <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 40 }}>
                //     <View style={{ paddingRight: 15, paddingVertical: 3, borderRightWidth: 1, borderRightColor: COLOR.black(.1) }}>
                //         <Icon type='AntDesign' name='reload1' style={{ fontSize: 17, color: COLOR.MAIN }} />
                //     </View>
                //     <TouchableOpacity
                //         onPress={() => handleNavigate('AnalyseTest', {
                //             examId: get(item, 'partable.id', ''),
                //             canGoBack: true,
                //             source: 'LessonOverview'
                //         })}
                //         style={{ paddingLeft: 15, paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                //         <Text style={{
                //             color: COLOR.MAIN,
                //             fontSize: 12,
                //             ...fontMaker({ weight: fontStyles.Regular })
                //         }}>Phân tích</Text>
                //         <Icon style={stylesComponent.icon} type="AntDesign" name="right" />
                //     </TouchableOpacity>
                // </View>

            }
        </TouchableOpacity>
    )
}

const RenderExamRelated = ({ handleNavigate, item, book, stopPlayer = () => { }, lessonId, style = {} }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                handleNavigate('OverviewTest', {
                    idExam: item.id,
                    title: get(item, 'title', ''),
                    icon: get(book, 'icon_id'),
                    subject: get(book, 'title'),
                    lessonId: lessonId,
                    time: get(item, 'duration', 0),
                    count: get(item, 'questions_count', 0),
                });
                stopPlayer();
            }}
            style={[stylesComponent.textItem, style, { paddingLeft: 3 }]}
        >
            <View style={{ flexDirection: 'row', flex: 1, marginRight: 25 }}>
                <View
                    style={{
                        height: 30, width: 30, marginRight: 5, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
                        borderColor: COLOR.MAIN,
                        borderWidth: 1
                    }}
                >
                    <Icon type='Entypo' name='flash' style={{ color: COLOR.MAIN, fontSize: 18, marginLeft: 3 }} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={3} style={stylesComponent.textContent} >
                        {get(item, 'title', '')}
                    </Text>
                    {get(item, 'questions_count', 0) ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Icon type='AntDesign' name='infocirlceo' style={{ fontSize: 12, marginRight: 4, marginTop: 3, color: blackColor(0.8) }} />

                            <Text style={[stylesComponent.textContent, { fontSize: fontSize.h5, color: blackColor(0.4) }]}>
                                {`${get(item, 'questions_count', 0)} câu hỏi `}
                            </Text>
                        </View> : null}
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{
                    color: COLOR.MAIN,
                    fontWeight: 'bold',
                    fontSize: 12,
                }}> Bắt đầu </Text>
                <Icon style={stylesComponent.icon} type="AntDesign" name="right" />
            </View>
        </TouchableOpacity>
    )
}
export {
    ExcerciseItem,
    RenderItemExam,
    RenderExamRelated
}
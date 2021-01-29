import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { get } from 'lodash';

import { RenderArticlRelated, RenderExamRelated } from '../../../component/shared/ItemDocument';
import { fontMaker } from '../../../utils/fonts';
import { COLOR } from '../../../handle/Constant';
import { delBookmarks } from './service';

export const ContentTabResult = ({ data, advert = null, navigate, maxItem = null, isSub = false, handleNavigate, reload = () => { } }) => {
    const handleDel = (body) => {
        Alert.alert(
            "Xoá bookmark",
            `Bạn muốn xoá bookmark?`,
            [
                {
                    text: 'Huỷ',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: "Xoá", onPress: () => {
                        delBookmarks(body)
                            .then(() => {
                                reload()
                            })
                    }
                },
            ],
        );
    }
    return (
        <ScrollView style={{ flex: 1, padding: 10 }}>
            {
                Object.keys(data).map((subject, index) => {
                    const mapData = maxItem ? data[subject].slice(0, maxItem) : data[subject];
                    return (
                        <View>
                            {handleNavigate ?
                                <TouchableOpacity
                                    onPress={() => {
                                        handleNavigate(index + 1)
                                    }}
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 7, marginTop: 15 }}>
                                    <Text style={{ ...styles.section }}>{subject}</Text>
                                    <Text style={{ color: COLOR.MAIN }}>Xem tất cả</Text>
                                </TouchableOpacity> : null
                            }
                            {
                                mapData.map((item, indexSub) => {
                                    const type = get(item, 'partable_type', '');
                                    if (type.includes('Video')) {
                                        return <RenderArticlRelated
                                            key={String(indexSub)}
                                            icon="play"
                                            title={get(item, 'partable.title', '')}
                                            onDelete={() => handleDel({
                                                bookmark_id: get(item, 'partable.id', ''),
                                                bookmark_type: 'video'
                                            })}
                                            onPress={() => { navigate('CoursePlayer', { lectureId: get(item, 'partable.id', '') }) }}
                                        />
                                    }
                                    else if (type.includes('Exam')) {
                                        const props = {
                                            title: get(item, 'partable.title', ''),
                                            time: get(item, 'partable.duration', ''),
                                            totalQues: get(item, 'partable.questions_count', ''),
                                        };
                                        return <RenderExamRelated
                                            key={String(indexSub)}
                                            onPress={() => {
                                                navigate('OverviewTest', {
                                                    title: get(item, 'partable.title', ''),
                                                    count: get(item, 'partable.questions_count', ''),
                                                    time: get(item, 'partable.duration', ''),
                                                    idExam: get(item, 'partable.id', ''),
                                                    lessonId: get(item, 'partable.lesson_id', ''),
                                                    advert
                                                })
                                            }}
                                            onDelete={() => handleDel({
                                                bookmark_id: get(item, 'partable.id', ''),
                                                bookmark_type: 'exam'
                                            })}
                                            {...props}
                                        />

                                    }
                                    return <RenderArticlRelated
                                        key={String(indexSub)}
                                        title={get(item, 'partable.title', '')}
                                        onPress={() => navigate("Lesson", { articleId: get(item, 'partable.id', ''), lesson_id: get(item, 'partable.lesson_id', ''), advert })}
                                        onDelete={() => handleDel({
                                            bookmark_id: get(item, 'partable.id', ''),
                                            bookmark_type: 'article'
                                        })}
                                    />
                                })
                            }
                        </View>

                    )
                })
            }
        </ScrollView>
    );
}

const styles = {
    section: { ...fontMaker({ weight: 'Bold' }), fontSize: 22, },
}
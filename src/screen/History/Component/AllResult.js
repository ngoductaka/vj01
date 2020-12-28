import React, { useCallback } from 'react';
import { View, Text, FlatList, ScrollView, Dimensions } from 'react-native';
import { get } from 'lodash';

import { fontMaker, fontStyles } from '../../../utils/fonts';
import { SeeMoreButton } from './SeeMoreButton';
import { RenderArticlSearch, RenderExamRelated, RenderVideoSearch } from '../../../component/shared/ItemDocument'
const { width, height } = Dimensions.get('window');

export const AllResult = (props) => {

    const {
        navigation,
        handleNavigate,
        articleState = [],
        videoState = [],
        examState = []
    } = props;

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10, paddingTop: 25 }}>
                {articleState.slice(0, 5).length > 0 || videoState.slice(0, 5).length > 0 || examState.slice(0, 5).length > 0 ?
                    <View>
                        {/* article */}
                        {articleState.slice(0, 5).length != 0 &&
                            <View>
                                <Text style={{ ...styles.section, marginTop: 5 }}>TÀI LIỆU</Text>
                                <View>
                                    <FlatList
                                        data={articleState.slice(0, 5)}
                                        renderItem={({ item, index }) => {
                                            const { title = '', grade = '', book = '', lesson_id = '', id: articleId = '' } = item
                                            return (
                                                <RenderArticlSearch
                                                    onPress={() => { navigation.navigate('Lesson', { articleId, lesson_id }) }}
                                                    {...{ title, grade, book }}
                                                />
                                            )
                                        }}
                                        keyExtractor={(item, index) => index + 'document_result'}
                                    />
                                </View>
                                <SeeMoreButton onPress={() => handleNavigate(1)} />
                            </View>
                        }

                        {/* video */}
                        {videoState.slice(0, 5).length != 0 &&
                            <View>
                                <Text style={{ ...styles.section, marginTop: 5 }}>VIDEO</Text>
                                <View>
                                    <FlatList
                                        data={videoState.slice(0, 5)}
                                        renderItem={({ item, index }) => {
                                            const {  preview_img, title, url, id, length, learn_type = 1 } = item;
                                            const grade = get(item, 'part.lesson.book.subject.grade_id');
                                            const subject = get(item, 'part.lesson.book.subject.title');
                                            return <RenderVideoSearch
                                                onPress={() => { navigation.navigate('CoursePlayer', { lectureId: id }) }}
                                                {...{ title, subject, grade, uri: preview_img, time: length, url, isLecture: learn_type }}
                                            />
                                        }}
                                        keyExtractor={(item, index) => index + 'video_result'}
                                    />
                                </View>
                                <SeeMoreButton onPress={() => handleNavigate(2)} />
                            </View>
                        }

                        {/* online exam */}
                        {examState.slice(0, 5).length != 0 &&
                            <View>
                                <Text style={{ ...styles.section, marginTop: 5 }}>THI ONLINE</Text>
                                <View>
                                    <FlatList
                                        data={examState.slice(0, 5)}
                                        renderItem={({ item, index }) => {
                                            const { title = '', questions_count = 0, duration = 0, id = '', subject, lesson_id } = item;
                                            return (
                                                <RenderExamRelated
                                                    onPress={() => {
                                                        navigation.navigate('OverviewTest', { title, subject, count: questions_count, time: duration, idExam: id, lessonId: lesson_id })
                                                    }}
                                                    {...{ title, time: duration, totalQues: questions_count }}
                                                />
                                            )
                                        }}
                                        keyExtractor={(item, index) => index + 'online_exam_result'}
                                    />
                                </View>
                                <SeeMoreButton onPress={() => handleNavigate(3)} />
                            </View>
                        }
                    </View>
                    :
                    <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), textAlign: 'center', fontSize: 15, marginTop: height / 2 - 150 }}>Rất tiếc không có kết quả nào được tìm thấy</Text>
                }
            </ScrollView>
        </View>
    );
}

const styles = {
    section: { ...fontMaker({ weight: 'Bold' }), fontSize: 18, marginVertical: 7, marginTop: 10 },
}
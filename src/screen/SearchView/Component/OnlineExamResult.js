import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { RenderArticlSearch, RenderExamRelated } from '../../../component/shared/ItemDocument'
import { get } from 'lodash';
import { helpers } from '../../../utils/helpers';

export const OnlineExamResult = ({ data, navigation }) => {

    const renderFooter = () => {
        if (!get(data, 'loading', false)) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
                size='large'
            />
        );
    };

    if (get(data, 'exam_data', []).length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), textAlign: 'center', fontSize: 15 }}>Rất tiếc không có kết quả nào được tìm thấy</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, }}>
            <Text style={styles.section}>KẾT QUẢ TÌM KIẾM</Text>
            <View style={{ flex: 1, marginTop: 10 }}>
                <FlatList
                    data={get(data, 'exam_data', [])}
                    style={{ paddingHorizontal: 10 }}
                    // onEndReachedThreshold={0.4}
                    // onEndReached={handleLoadMore}
                    renderItem={({ item, index }) => {
                        const { title = '', questions_count = 0, duration = 0, id = '', subject, lesson_id } = item;
                        return (
                            <RenderExamRelated
                                onPress={() => { navigation.navigate('OverviewTest', { title, subject, count: questions_count, time: duration, idExam: id, lessonId: lesson_id }) }}
                                {...{ title, time: duration, totalQues: questions_count }}
                            />
                        )
                    }}
                    keyExtractor={(item, index) => index + 'exam_result'}
                // ListFooterComponent={renderFooter}
                />
            </View>
        </View>
    );
}

const styles = {
    section: { ...fontMaker({ weight: 'Bold' }), fontSize: 18, marginVertical: 7, marginTop: 10, paddingLeft: 10, paddingTop: 10 },
}
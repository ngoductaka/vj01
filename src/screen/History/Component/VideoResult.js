import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { RenderArticlSearch, RenderVideoSearch } from '../../../component/shared/ItemDocument'
import { get } from 'lodash';
import { helpers } from '../../../utils/helpers';

export const VideoResult = ({ data, navigation }) => {

    const renderFooter = () => {
        if (!get(data, 'loading', false)) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
                size='large'
            />
        );
    };

    if (data.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ ...fontMaker({ weight: fontStyles.Regular }), textAlign: 'center', fontSize: 15 }}>Rất tiếc không có kết quả nào được tìm thấy</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, }}>
            {/* <Text style={styles.section}>KẾT QUẢ TÌM KIẾM</Text> */}
            <View style={{ flex: 1, marginTop: 10 }}>
                <FlatList
                    data={data}
                    style={{ paddingHorizontal: 10 }}
                    // onEndReachedThreshold={0.4}
                    // onEndReached={handleLoadMore}
                    renderItem={({ item, index }) => {
                        const { preview_img, title, id, url, length, learn_type = 1 } = item;
                        const grade = get(item, 'part.lesson.book.subject.grade_id');
                        const subject = get(item, 'part.lesson.book.subject.title');
                        return <RenderVideoSearch
                            onPress={() => { navigation.navigate('CoursePlayer', { lectureId: id }) }}
                            {...{ title, subject, grade, uri: preview_img, time: length, url, isLecture: learn_type }}
                        />
                    }}
                    keyExtractor={(item, index) => index + 'video_result'}
                // ListFooterComponent={renderFooter}
                />
            </View>
        </View>
    );
}

const styles = {
    section: { ...fontMaker({ weight: 'Bold' }), fontSize: 18, marginVertical: 7, marginTop: 10, paddingLeft: 10, paddingTop: 10 },
}
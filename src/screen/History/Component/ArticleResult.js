import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { RenderArticlSearch } from '../../../component/shared/ItemDocument'
import { get } from 'lodash';
import { helpers } from '../../../utils/helpers';

export const ArticleResult = ({ data, navigation }) => {

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
            {/* <Text style={styles.section}>TÀI LIỆU ĐÃ XEM</Text> */}
            <View style={{ flex: 1, marginTop: 10 }}>
                <FlatList
                    data={data}
                    style={{ paddingHorizontal: 10 }}
                    // onEndReachedThreshold={0.4}
                    // onEndReached={handleLoadMore}
                    renderItem={({ item, index }) => {
                        const { title = '', grade = '', book = '', lesson_id = '', id: articleId = '' } = item
                        return (
                            <RenderArticlSearch
                                onPress={() => { navigation.navigate('Lesson', { articleId, lesson_id }) }}
                                {...{ title, grade, book }}
                            />
                        )
                    }}
                    keyExtractor={(item, index) => index + 'artical_result'}
                    // ListFooterComponent={renderFooter}
                />
            </View>
        </View>
    );
}

const styles = {
    section: { ...fontMaker({ weight: 'Bold' }), fontSize: 18, marginVertical: 7, marginTop: 10, paddingLeft: 10, paddingTop: 10 },
}
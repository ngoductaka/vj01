import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View, SafeAreaView,
    FlatList,
    Dimensions, BackHandler
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import WhileHeader from '../../component/shared/WhileHeader';
import * as Animatable from 'react-native-animatable';

import { RenderItemExam } from './component/ExamList';
import { RenderArticle } from './component/ArticleList';
import { RenderVideoItem } from './component/VideosList';

const { width } = Dimensions.get('window');


const HEADER_MAX_HEIGHT = width * 9 / 16;
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const LessonOverview = (props) => {
    const { navigation } = props;
    const title = navigation.getParam('title', '');
    const data = navigation.getParam('data', '');
    const book = navigation.getParam('book', {});
    const lessonId = navigation.getParam('lessonId', {});

    const handleNavigate = useCallback((screen, params) => {
        navigation.navigate(screen, params)
    }, [navigation]);


    useEffect(() => {
        BackHandler.addEventListener(
            'hardwareBackPress',
            _handleBackButtonPressAndroid
        );

        return () => {
            BackHandler.removeEventListener(
                'hardwareBackPress',
                _handleBackButtonPressAndroid
            );
        }
    }, []);

    const _handleBackButtonPressAndroid = () => {
        navigation.goBack();
        return true;
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <WhileHeader title={title} />
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    style={{ padding: 10, flex: 1 }}
                    renderItem={({ item, index }) => {
                        if (item.type == 'exam') return (
                            <Animatable.View duration={320} animation='slideInRight' delay={50 * index}>
                                <RenderItemExam item={item} handleNavigate={handleNavigate} book={book} lessonId={lessonId} />
                            </Animatable.View>
                        )

                        if (item.type == 'article') return (
                            <Animatable.View duration={320} animation='slideInRight' delay={50 * index}>
                                <RenderArticle item={item} handleNavigate={handleNavigate} index={index} />
                            </Animatable.View>
                        )

                        if (item.type == 'video' || item.type == 'lecture') return (
                            <Animatable.View duration={320} animation='slideInRight' delay={50 * index}>
                                <RenderVideoItem item={item} handleNavigate={handleNavigate} index={index} />
                            </Animatable.View>
                        )

                        return null;
                    }}
                    keyExtractor={(item, index) => 'LessonCard' + index}
                />
            </SafeAreaView>
        </View>
    );
}

export default connect(
    (state) => ({ bookInfo: state.bookInfo }),
    null
)(React.memo(LessonOverview));

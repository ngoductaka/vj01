import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from 'react';
import { View, SafeAreaView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Icon, Tab, Tabs, ScrollableTab, TabHeading } from 'native-base';
import { isEmpty, get } from 'lodash';
import { connect, useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';

import { useRequest, Loading } from '../../handle/api';
import { COLOR } from '../../handle/Constant';
import { setBookInfo } from '../../redux/action/book_info';

import { Colors } from '../../utils/colors';
import { ContentTabResult } from './Component/ContentTabResult';
import { AllResult } from './Component/AllResult';
import { FilterModal, mapDoc } from './Component/FilterModal';
import BackHeader from './Component/BackHeader';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { ArticleResult } from './Component/ArticleResult';
import { VideoResult } from './Component/VideoResult';
import { OnlineExamResult } from './Component/OnlineExamResult';


//  ========== show list subject class====================
const Bookmark = memo((props) => {
    const { navigation } = props;
    const headerType = navigation.getParam('type', 'bookmarks');
    const [currentPage, setCurrentPage] = useState(0);
    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState({});
    const [data, setData] = useState(null);
    const currentClass = useSelector(state => state.userInfo.class);
    const [onFocus, setFocus] = useState(0);
    const [curClass, setCurrentClass] = useState(currentClass);


    const [currentTab, setCurrentTab] = useState(0);

    const [dataHistory, loading, err] = useRequest(`/users/history`, [onFocus]);
    // console.log('------dataHistory', dataHistory);
    useEffect(() => {
        if (props.navigation.isFocused()) {
            setFocus(onFocus + 1)
        }
    }, [props.navigation]);

    // useEffect(() => {
    //     const data = {}
    //     if (dataHistory && dataHistory.data) {
    //         dataHistory.data.map(subject => {
    //             subject.books.map(book => {
    //                 book.lessons.map(lesson => {
    //                     lesson.parts.map(part => {
    //                         // console.log('2', part);
    //                         // data[0].books[0].lessons[3].parts[0].partable.title
    //                         // docType
    //                         if (filter.cate && Object.keys(mapDoc).includes(filter.cate)) { //article
    //                             const type = get(part, 'partable_type', '');

    //                             if (type.includes(mapDoc[filter.cate])) {
    //                                 if (data[subject.title])
    //                                     data[subject.title].push(part)
    //                                 else data[subject.title] = [part]
    //                             }
    //                         } else {
    //                             const type = get(part, 'partable_type', '');
    //                             if (type.includes('Lecture')) {
    //                                 const partable = get(part, 'partable.videos[0]', null);

    //                                 if (partable) {
    //                                     if (data[subject.title])
    //                                         data[subject.title].push({ partable, partable_type: "App\Models\Video" })
    //                                     else data[subject.title] = [{ partable, partable_type: "App\Models\Video" }]
    //                                 }
    //                             } else {
    //                                 if (data[subject.title])
    //                                     data[subject.title].push(part)
    //                                 else data[subject.title] = [part]
    //                             }
    //                         }

    //                     })
    //                 })
    //             })
    //         });
    //         setData(data)
    //     } else {
    //         setData({})
    //     }
    // }, [dataHistory, filter])

    useEffect(() => {
        if (filter.cls && filter.cls != curClass) {
            setCurrentClass(filter.cls);
        }
        setCurrentPage(0);
    }, [filter, currentClass]);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <BackHeader
                title={'Lịch sử'}
                showRight={false}
            />
            <SafeAreaView style={styles.container}>
                {loading ?
                    <ActivityIndicator animating={true} size='large' style={{ marginTop: 50, alignSelf: 'center' }} />
                    :
                    (!isEmpty(dataHistory) ?
                        <Tabs onChangeTab={(e) => setCurrentTab(e.i)} page={currentTab} tabContainerStyle={{ height: 33, borderTopWidth: 0, borderTopColor: 'white', elevation: 0 }} tabBarUnderlineStyle={{ height: 2, backgroundColor: Colors.pri }} tabBarActiveTextColor={Colors.pri} tabBarBackgroundColor={Colors.white} >
                            <Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading="TẤT CẢ">
                                <AllResult
                                    navigation={navigation}
                                    handleNavigate={setCurrentTab}
                                    articleState={get(dataHistory, 'article', []) || []}
                                    examState={get(dataHistory, 'exam', []) || []}
                                    videoState={get(dataHistory, 'video', []) || []}
                                />
                            </Tab>
                            <Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading="TÀI LIỆU">
                                <ArticleResult
                                    data={get(dataHistory, 'article', []) || []}
                                    navigation={navigation}
                                />
                            </Tab>
                            <Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading="VIDEO">
                                <VideoResult
                                    data={get(dataHistory, 'video', []) || []}
                                    navigation={navigation}

                                />
                            </Tab>
                            <Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading="THI ONLINE">
                                <OnlineExamResult
                                    data={get(dataHistory, 'exam', []) || []}
                                    navigation={navigation}
                                />
                            </Tab>
                        </Tabs>
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                autoPlay
                                loop
                                style={{ width: 260, height: 260, alignSelf: 'center', marginTop: -70 }}
                                source={require('../../public/empty-notification.json')}
                            />
                            <Text style={{ fontSize: 16, textAlign: 'center', ...fontMaker({ weight: fontStyles.Regular }), marginTop: -100 }}>Không có dữ liệu bookmark!</Text>
                        </View>
                    )
                }
            </SafeAreaView>
            <FilterModal
                show={showFilter}
                onClose={setShowFilter}
                setFilter={setFilter}
                curClass={curClass}
            />
        </View >
    )
});

const styles = StyleSheet.create({
    container: { flex: 1 },
    tabContainerStyle: {
        backgroundColor: Colors.white,
    },
    activeTabStyle: {
        backgroundColor: Colors.white,
    },
    tabStyle: {
        backgroundColor: Colors.white,
    },
    textStyle: {
        fontSize: 14,
        color: '#000'
    },
    activeTextStyle: {
        fontSize: 14,
        paddingVertical: 3,
        color: Colors.pri,
        textTransform: 'none'
    },
    section: { ...fontMaker({ weight: 'Bold' }), fontSize: 18, marginVertical: 7, marginTop: 10 },

})
export default connect(
    ({ userInfo }) => ({ userInfo }),
    (dispatch) => ({ setBookInfo: bookInfo => dispatch(setBookInfo(bookInfo)) })
)(Bookmark);

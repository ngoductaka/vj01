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
import { FilterModal, mapDoc } from './Component/FilterModal';
import BackHeader from './Component/BackHeader';
import { fontMaker, fontStyles } from '../../utils/fonts';


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

    const [dataBookMark, loading, err] = useRequest(`/users/bookmarks${curClass == 13 ? '' : `?cl=${curClass}`}`, [curClass, onFocus]);
    // console.log('------dataBookmark', dataBookMark);
    useEffect(() => {
        if (props.navigation.isFocused()) {
            setFocus(onFocus + 1)
        }
    }, [props.navigation]);

    useEffect(() => {
        const data = {}
        if (dataBookMark && dataBookMark.data) {
            dataBookMark.data.map(subject => {
                subject.books.map(book => {
                    book.lessons.map(lesson => {
                        lesson.parts.map(part => {
                            // console.log('2', part);
                            // data[0].books[0].lessons[3].parts[0].partable.title
                            // docType
                            if (filter.cate && Object.keys(mapDoc).includes(filter.cate)) { //article
                                const type = get(part, 'partable_type', '');

                                if (type.includes(mapDoc[filter.cate])) {
                                    if (data[subject.title])
                                        data[subject.title].push(part)
                                    else data[subject.title] = [part]
                                }
                            } else {
                                const type = get(part, 'partable_type', '');
                                if (type.includes('Lecture')) {
                                    const partable = get(part, 'partable.videos[0]', null);

                                    if (partable) {
                                        if (data[subject.title])
                                            data[subject.title].push({ partable, partable_type: "App\Models\Video" })
                                        else data[subject.title] = [{ partable, partable_type: "App\Models\Video" }]
                                    }
                                } else {
                                    if (data[subject.title])
                                        data[subject.title].push(part)
                                    else data[subject.title] = [part]
                                }
                            }

                        })
                    })
                })
            });
            setData(data)
        } else {
            setData({})
        }
    }, [dataBookMark, filter])

    useEffect(() => {
        // console.log('--------', filter, curClass);
        // currentClass: class from store
        // curClass: class 
        if (filter.cls && filter.cls != curClass) {
            setCurrentClass(filter.cls);
        }
        setCurrentPage(0);
    }, [filter, currentClass]);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <BackHeader
                title={headerType === 'history' ? 'Lịch sử' : 'Bookmarks'}
                handleRightPress={() => setShowFilter(true)}
            />
            <SafeAreaView style={styles.container}>
                {loading ?
                    <ActivityIndicator animating={true} size='large' style={{ marginTop: 50, alignSelf: 'center' }} />
                    :
                    (!isEmpty(data) ?
                        <Tabs renderTabBar={() =>
                            <ScrollableTab
                                style={{ height: 36 }}
                                tabsContainerStyle={{ borderTopWidth: 0, borderTopColor: 'white', elevation: 0 }}
                                underlineStyle={{ height: 2, backgroundColor: Colors.pri }}
                                textStyle={{ color: COLOR.black(.6) }}
                            />
                        }
                            onChangeTab={(e) => setCurrentPage(e.i)}
                            page={currentPage}
                            tabBarActiveTextColor={COLOR.MAIN}
                            tabBarInactiveTextColor={COLOR.black(.6)}
                            tabBarBackgroundColor={Colors.white}
                        >
                            <Tab textStyle={styles.textStyle}
                                activeTextStyle={styles.activeTextStyle}
                                activeTabStyle={styles.activeTabStyle}
                                tabStyle={styles.tabStyle}
                                heading={<TabHeading style={{ backgroundColor: 'white' }}>
                                    <Text style={{ paddingHorizontal: 15, ...fontMaker({ weight: fontStyles.Regular }), color: currentPage == 0 ? COLOR.MAIN : COLOR.black(.55) }}>Tất cả</Text>
                                </TabHeading>}
                            >
                                {data ? <ContentTabResult
                                    handleNavigate={setCurrentPage}
                                    data={data}
                                    navigate={navigation.navigate}
                                    maxItem={3}
                                    reload={() => setFocus(onFocus + 1)}
                                /> : null}
                            </Tab>
                            {data && Object.keys(data).map((item, index) => (
                                <Tab
                                    textStyle={styles.textStyle}
                                    activeTextStyle={styles.activeTextStyle}
                                    activeTabStyle={styles.activeTabStyle}
                                    tabStyle={styles.tabStyle}
                                    heading={<TabHeading style={{ backgroundColor: 'white' }}>
                                        <Text style={{ paddingHorizontal: 15, ...fontMaker({ weight: fontStyles.Regular }), color: currentPage == index + 1 ? COLOR.MAIN : COLOR.black(.55) }}>{item}</Text>
                                    </TabHeading>}
                                >
                                    <ContentTabResult
                                        data={{ [item]: data[item] }}
                                        navigate={navigation.navigate}
                                        isSub
                                        reload={() => setFocus(onFocus + 1)}
                                    />
                                </Tab>
                            ))}
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

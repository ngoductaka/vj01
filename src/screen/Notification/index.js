import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, RefreshControl, FlatList, TouchableOpacity, Image, Text, SafeAreaView, ScrollView, ImageBackground, Dimensions, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Icon } from 'native-base';
import OptionsMenu from "react-native-option-menu";
import { useSelector, useDispatch } from 'react-redux';
import BackHeader from '../Bookmark/Component/BackHeader';
import { images } from '../../utils/images';
import { fontMaker, fontStyles } from '../../utils/fonts';
import api from '../../handle/api';
import { COLOR } from '../../handle/Constant';
import { get } from 'lodash';
import { helpers } from '../../utils/helpers';
import NavigationService from '../../Router/NavigationService';


const Notification = (props) => {

    const { navigation } = props;
    const getNumberOfUnseenNoti = get(navigation, 'state.params.getNumberOfUnseenNoti', null)
    const onMomentumScrollBeginRef = useRef(true);

    const dispatch = useDispatch();
    const [listNoti, setListNoti] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState({ currentPage: 1, totalPage: 1 });
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        getListNoti(page.currentPage);
        return () => {
            if (getNumberOfUnseenNoti) {
                // getNumberOfUnseenNoti();
            }
        }
    }, []);

    const getListNoti = async (currPage) => {
        try {
            await setLoading(true);
            const result = await api.get(`/notification/list?page=${currPage}`);
            // console.log('-a-sa-s-a-sas', result);
            if (result && result.data && Array.isArray(result.data)) {
                setListNoti(result.data);
                setPage({ ...page, totalPage: result.meta.last_page });
            }
            await setLoading(false);
            await setLoadingMore(false);
        } catch (error) {
            console.log('errrororo', error);
            await setLoading(false);
            await setLoadingMore(false);
        }
    }

    const updateSeenStatus = async (notiId) => {
        try {
            const result = await api.post(`/notification/${notiId}/update-seen`);
            getListNoti(0);
            console.log('updateSeenStatus', result);
        } catch (error) {
            console.log('1212121212', error);
        }
    }

    const deleteNotification = async (notiId) => {
        try {
            const result = await api.delete(`notification/${notiId}/delete`);
            getListNoti(0);
            console.log('updateSeenStatus', result);
        } catch (error) {
            console.log('1212121212', error);
        }
    }

    const renderEmpty = () => {
        if (loading) return <ActivityIndicator animating={true} size='large' color={'grey'} />
        return (
            <View style={{ alignItems: 'center', flex: 1, marginTop: helpers.isIpX ? 210 : 100 }}>
                <Image
                    source={images.no_item}
                    style={{ width: 120, height: 120 }}
                />
                <Text style={{ marginTop: 16, color: '#475461', fontSize: 14, ...fontMaker({ weight: fontStyles.Regular }) }}>Tạm thời chưa có thông báo!</Text>
            </View>
        );
    };

    const onRefresh = async () => {
        await setPage({ ...page, currentPage: 1 });
        getListNoti(1);
    }

    const onEndReached = async () => {
        // if (!onMomentumScrollBeginRef.current && !loading) {
        //     await setPage({ ...page, currentPage: +page.currentPage + 1 });
        //     getListNoti(page.currentPage + 1);
        //     onMomentumScrollBeginRef.current = true;
        // }
        if (page.currentPage < page.totalPage) {
            setLoadingMore(true);
            getListNoti(page.currentPage + 1);
            setPage({ ...page, currentPage: page.currentPage + 1 });
        }
    };

    // const handleScroll = useCallback(() => {
    //     onMomentumScrollBeginRef.current = false
    // }, []);

    const handleNavigateItem = (val) => {
        // const dataDoc = JSON.parse(val);
        const data = get(val, 'lesson.parts[0]', {});

        if (data.partable_type.includes('Article')) {
            const { id, title } = data.partable || {};
            NavigationService.navigate("LessonOverview", {
                lessonId: get(val, 'lesson.menu_item_id', ''),
            });

        } else if (data.partable_type.includes('Video')) {
            const { id, title } = data.partable || {};

            NavigationService.navigate('CoursePlayer', {
                lectureId: id,
            })

        } else if (data.partable_type.includes('Exam')) {
            const { id, title } = data.partable || {};
            NavigationService.navigate('OverviewTest', {
                idExam: id, title,
                lessonId: get(val, 'lesson.menu_item_id', ''),
            })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <BackHeader title='Thông báo' showRight={false} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={listNoti}
                        refreshControl={
                            <RefreshControl
                                onRefresh={onRefresh}
                                refreshing={refreshing}
                            />
                        }
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.5}
                        removeClippedSubviews
                        ListFooterComponent={
                            loadingMore ? <View style={{ backgroundColor: '#fff', paddingHorizontal: 10 }}>
                                <ActivityIndicator size="large" />
                            </View>
                                :
                                null
                        }
                        renderItem={({ item, index }) => {
                            return <NotificationItem handleNavigateItem={handleNavigateItem} deleteNotification={deleteNotification} updateSeenStatus={updateSeenStatus} index={index} data={item} />
                        }}
                        ListEmptyComponent={renderEmpty}
                        keyExtractor={(item, idx) => idx + 'notification_item'}
                    />
                </View>
            </SafeAreaView>
        </View >
    )
}

export default Notification;

const mapIcon = (icon) => {
    switch (icon) {
        //article|exam|video|common
        case 'article':
            return { name: 'file-document-edit', type: 'MaterialCommunityIcons' }
        case 'exam':
            return { name: 'flash', type: 'Entypo' }
        case 'video':
            return { name: 'ondemand-video', type: 'MaterialIcons' }
        default:
            return { name: 'ondemand-video', type: 'MaterialIcons' }
    }
}

const NotificationItem = ({ index, data, updateSeenStatus, deleteNotification, handleNavigateItem = () => { } }) => {
    return (
        <TouchableOpacity onPress={() => {
            const streaming_link = get(data, 'streaming_link', null);
            if (streaming_link) {
                helpers.openUrl(streaming_link);
            } else {
                const val = get(data, 'data_for_app.redirect_to', null);
                if (val) {
                    handleNavigateItem(val);
                }
            }
            if (data.seen == 0) {
                updateSeenStatus(data.id);
            }
        }} style={{ flexDirection: 'row', padding: 10, backgroundColor: get(data, 'seen', 0) == 0 ? '#E7F3FF' : 'transparent' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {(get(data, 'type', null) == null || get(data, 'type', null) == 'common') ?
                    <Image source={images.img1}
                        style={{ width: 56, height: 56, borderRadius: 40, resizeMode: 'contain' }}
                    />
                    :
                    <View style={{ width: 56, height: 56, justifyContent: 'center', alignItems: 'center', borderRadius: 40, borderWidth: 1, borderColor: COLOR.MAIN }}>
                        <Icon name={mapIcon(get(data, 'type', 'article')).name} type={mapIcon(get(data, 'type', 'article')).type} style={{ fontSize: 26, color: COLOR.MAIN }} />
                    </View>
                }

                <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {get(data, 'streaming_link', null) &&
                            <Image source={images.fblive}
                                style={{ width: 30, height: 12.307, resizeMode: 'contain', marginRight: 3 }}
                            />
                        }
                        <Text numberOfLines={1} style={{ fontSize: 16, ...fontMaker({ weight: fontStyles.Regular }) }}>{get(data, 'title', '')}</Text>
                    </View>
                    <Text numberOfLines={2} style={{ fontSize: 13, ...fontMaker({ weight: fontStyles.Regular }), color: '#7E868E' }}>{helpers.capitalizeFirstLetter(get(data, 'content', '').toLowerCase())}</Text>
                    <Text style={{ marginTop: 7, color: '#7E868E', fontSize: 13, ...fontMaker({ weight: fontStyles.Regular }) }}>{helpers.changeTimeView(get(data, 'created_at', '0'))}</Text>
                </View>
            </View>
            <OptionsMenu
                customButton={<Icon name='dots-three-horizontal' type='Entypo' style={{ fontSize: 16, color: '#040404', paddingLeft: 20, paddingBottom: 20 }} />}
                // destructiveIndex={1}
                options={["Đã xem", "Huỷ bỏ"]}
                actions={[() => {
                    if (data.seen == 0) {
                        updateSeenStatus(data.id);
                    }
                },
                    // () => {
                    //     deleteNotification(data.id);
                    // }
                ]} />
        </TouchableOpacity>
    );
}

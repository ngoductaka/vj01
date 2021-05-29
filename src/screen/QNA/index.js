import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, FlatList, Text, StyleSheet, Platform,
    TouchableOpacity, Dimensions, Image, ScrollView,
    SafeAreaView, ActivityIndicator, Pressable, ViewPropTypes
} from 'react-native';
import { Icon } from 'native-base';
import { withNavigationFocus } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { get, debounce } from 'lodash';
import OptionsMenu from "react-native-option-menu";
import ImageView from "react-native-image-viewing";

import { getDiffTime } from '../../utils/helpers';
import { fontSize, COLOR } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { GradientText } from '../../component/shared/GradientText';
import { FilterModal, mapTypeQestion } from './com/FilterModal';
import api from '../../handle/api';
// import { RenderDataJson } from '../../component/shared/renderHtmlNew';
import RenderData, { RenderDataJson, handleAvatarLink } from '../../component/shared/renderHtmlQuestion';

import { search_services } from './service';
import { images } from '../../utils/images';
import { endpoints } from '../../constant/endpoints';
import { RenderListImg } from '../../component/Image/renderListImg';
import { useDeepLink } from '../../utils/useDeeplink';
import { ViewWithBanner } from '../../utils/facebookAds';

const { height } = Dimensions.get('screen');

const QnA = (props) => {
    const onMomentumScrollBeginRef = useRef(true);
    const flatlistRef = useRef(null);
    const userInfo = useSelector(state => state.userInfo);
    const current_class = useSelector(state => state.userInfo.class);
    useDeepLink(props.navigation)

    const [filter, setFilter] = useState({ cls: current_class, popular: false });
    const [showFilter, setShowFilter] = useState(false);

    const hanldleClick = useCallback((params) => {
        props.navigation.navigate("QuestionDetail", params);
    }, []);

    const [listQestion, setListQuestion] = useState([]);
    const [page, setPage] = useState({
        loading: false,
        current_page: 0

    })
    // console.log('cls=========loading', page.loading);
    const requestQestion = ({ next_page = 0 } = {}) => {
        setPage({ ...page, loading: true });
        const { cls, currSub, popular } = filter;
        let endPoint = `/question?limit=${20}&page=${next_page}&popular=${popular ? 1 : 0}`;
        if (cls && cls < 13) {
            endPoint += `&grade=${cls}`
        }
        if (currSub && currSub.id) {
            endPoint += `&subject=${currSub.id}`
        }
        // if(popular)

        return api.get(endPoint)
            .then(({ data, meta }) => {
                // console.log(data, 'datadatadatadata')
                setPage({ loading: false, current_page: meta.current_page })
                if (data) {
                    if (next_page) {
                        const newData = listQestion.concat(data);
                        setListQuestion(newData);
                    } else {
                        setListQuestion(data)
                    }
                }
            })
            .catch((err) => {
                setTimeout(() => {
                    setPage({ ...page, loading: false })
                }, 500)
                console.log('get question failse', err)
            })

    };

    useEffect(() => { setPage(0); }, []);

    useEffect(() => {
        console.log('----filter009887===', filter)
        requestQestion();
    }, [filter])

    useEffect(() => {
        if (props.isFocused) {
            // if (flatlistRef && flatlistRef.current && flatlistRef.current.scrollToOffset)
            // flatlistRef.current.scrollToOffset({ animated: true, offset: 0 })
        }
    }, [props.isFocused])

    const onEndReached = () => {
        if (!onMomentumScrollBeginRef.current && !page.loading) {
            requestQestion({ next_page: +page.current_page + 1 });
            onMomentumScrollBeginRef.current = true;
        }
    };
    const [animatableView, setAni] = useState('')
    const hanldleScroll = useCallback(() => {
        onMomentumScrollBeginRef.current = false
        setAni('lightSpeedIn');
    }, []);
    const [refreshing, setRefreshing] = React.useState(false);

    const _handleNavigate = (id = '') => {
        props.navigation.navigate('UserQnA', { userId: id })
    }
    const _handleReport = (questionId) => {
    };
    const _handleFollow = (questionId, is_follow) => {
        search_services.handleFollow(questionId)
            .then(() => {
                Toast.showWithGravity(`${is_follow ? 'Bỏ theo' : "Theo"}  dõi  thành công`, Toast.SHORT, Toast.CENTER);
            })

    }
    const [showHeader, setShowHeader] = useState(false);
    const _handleScroll = (nativeEvent) => {
        if (nativeEvent && nativeEvent.contentOffset) {
            const { y } = nativeEvent.contentOffset || {};
            if (y > 250) {
                setShowHeader(true)
            } else {
                setShowHeader(false)
            }
        }
    }
    const delayedQuery = useCallback(debounce((q) => {
        _handleScroll(q)
    }, 50), []);

    const _renderHeader = useCallback(() => <RenderHead
        {...{
            filter,
            setFilter,
            setShowFilter,
            navigation: props.navigation,
            loading: page.loading,
            avatar: get(userInfo, 'user.photo', '')
        }}
    />, [filter, props.navigation, page.loading, userInfo]);

    const _renderItem = useCallback(({ item, index }) => {
        return <RenderQestion {...{
            item, index, hanldleClick, _handleNavigate,
            _handleReport, _handleFollow
        }} />
    }, []);

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* top */}
                <TollBar current_class={filter.cls} navigation={props.navigation} />
                <View style={{ flex: 1, position: 'relative' }}>
                    <FlatList
                        onScroll={({ nativeEvent }) => delayedQuery(nativeEvent)}
                        ref={flatlistRef}
                        data={listQestion}
                        onRefresh={() => {
                            setRefreshing(true);
                            setPage(0);
                            requestQestion()
                                .then(() => {
                                    setRefreshing(false)
                                });
                        }}
                        refreshing={refreshing}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={_renderHeader}
                        renderItem={_renderItem}
                        keyExtractor={(item) => '' + item.id}
                        style={{ flex: 1 }}
                        onEndReachedThreshold={0.5}
                        onMomentumScrollBegin={hanldleScroll}
                        onScrollToTop={() => setAni('lightSpeedOut')}
                        onEndReached={onEndReached}
                        removeClippedSubviews
                        enableEmptySections
                        Number={5}
                        ListEmptyComponent={
                            page.loading ? null : <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                                <Image source={images.no_item} />
                                <Text style={{ color: "#fff", fontWeight: 'bold', fontSize: 20 }}>Không có câu hỏi nào</Text>
                            </View>
                        }
                        ListFooterComponent={
                            page.loading ? <View style={{ backgroundColor: '#fff', paddingHorizontal: 10 }}>
                                <ActivityIndicator color="#000" size="large" />
                            </View> : null
                        }
                    />
                    <View style={{ position: 'absolute', height: 1, left: 0, right: 0 }}>
                        {showHeader && <FilterHeader loading={page.loading} filter={filter} setFilter={setFilter} show={showHeader} />}
                    </View>
                </View>
                {
                    animatableView ?
                        <Animatable.View
                            animation={animatableView}
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                opacity: 0.5
                            }}>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('MakeQuestion')}
                                style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 50,
                                    flex: 1,
                                    backgroundColor: COLOR.MAIN,
                                    justifyContent: 'center', alignItems: 'center',
                                    opacity: 0.8
                                }}>
                                <Icon name="plus" type="AntDesign" style={{ color: '#fff' }} />
                            </TouchableOpacity>
                        </Animatable.View> : null
                }
            </SafeAreaView>

            <FilterModal
                show={showFilter}
                onClose={() => setShowFilter(false)}
                setFilter={setFilter}
                filter={filter}
                showState={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingHorizontal: 10
    },
    headerText: {
        paddingVertical: 5,
        // textAlign: 'center',
        fontSize: 20,
        fontSize: 26,
        marginTop: 4,
        ...fontMaker({ weight: fontStyles.Bold })
    },
    head: {
        backgroundColor: '#fff',
    },
    filter: {
        flexDirection: 'row',
        paddingVertical: 10,
        backgroundColor: COLOR.MAIN,
        height: 40,
        // width: 40,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 20,
        paddingLeft: 15,
        // padding
    },
    iconFilter: {
        fontSize: 17,
        color: '#fff'
    },
    h2: {
        fontSize: 18,
        color: '#555',
        ...fontMaker({ weight: fontStyles.Bold })
    },
    itemQ: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        // padding: 10,
        // borderRadius: 10,
        marginBottom: 5,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomColor: '#ededed',
        borderBottomWidth: 2,
    },
    headItemQ: {
        flexDirection: 'row', alignItems: 'center',
        marginBottom: 10, justifyContent: 'space-between'
    },
    subjectQ: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
    subjectTextQ: {
        fontSize: 18,
        ...fontMaker({ weight: fontStyles.Light })
    },
    itemHead: {
        fontSize: 17,
        color: '#555',
        marginBottom: 5,
        ...fontMaker({ weight: fontStyles.Bold }),

    },
    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    largeImgWapper: {
        height: 35, width: 35,
        borderRadius: 35,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    userComment: {
        flexDirection: 'row',
        marginTop: 7,
    },
    headerTag: {
        alignItems: 'center', flexDirection: 'row',
        paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'baseline',
        backgroundColor: '#ffa154', borderRadius: 20
    },
    contentTag: {
        color: COLOR.white(1),
        ...fontMaker({ weight: fontStyles.SemiBold })
    },
})

export default withNavigationFocus(QnA);

const userStyle = StyleSheet.create({
    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },

    imgWapper: {
        height: 25, width: 25,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    userCount: {
        height: 25,
        // width: 25,
        paddingHorizontal: 5,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    img: { flex: 1, borderRadius: 25 },

    userComment: {
        flexDirection: 'row',
        // marginTop: 7,
    }
})

const RenderHead = ({ filter, setFilter, setShowFilter, navigation, loading, avatar }) => {
    return (
        <View style={styles.head}>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                marginTop: 20,
                borderBottomColor: '#ddd', borderBottomWidth: 1, paddingBottom: 10, paddingHorizontal: 10, alignItems: 'center'
            }}>
                <TouchableOpacity
                    // onPress={() => navigation.navigate('MakeQuestion')}
                    onPress={() => navigation.navigate('SearchQnA')}
                    style={{
                        flexDirection: 'row', alignItems: 'center', flex: 1
                    }}>
                    <View style={styles.largeImgWapper} >
                        <Image style={userStyle.img} source={{ uri: avatar }} />
                        {/* <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                            <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
                        </View> */}
                    </View>
                    <Text style={{ fontSize: 15, marginLeft: 10, fontWeight: '500', color: '#444' }}>Bạn muốn hỏi gì?</Text>
                </TouchableOpacity>
                <View>

                    <TouchableOpacity onPress={() => setShowFilter(true)} style={[styles.filter]}>
                        {
                            loading ? <ActivityIndicator color="#fff" /> :
                                <Icon style={styles.iconFilter} type="AntDesign" name="filter" />
                        }
                        <Text style={[styles.h2, { marginLeft: 7, color: '#fff' }]}>Lọc</Text>

                    </TouchableOpacity>
                </View>
            </View>
            <View>
                {/* <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ marginVertical: 10, paddingHorizontal: 10 }}>
                        <TouchableOpacity onPress={() => {
                            if (filter.cls != 13) {
                                setFilter({ cls: '13', currSub: null })
                            } else {
                                setShowFilter(true);
                            }
                        }} style={[styles.headerTag]}>
                            <Text style={styles.contentTag}>{filter.cls == 13 ? 'Tất cả các lớp' : `Lớp ${filter.cls}`}</Text>
                            {filter.cls != 13 &&
                                <View style={{ paddingLeft: 4, }}>
                                    <Icon type='AntDesign' name='close' style={{ fontSize: 12, color: 'white' }} />
                                </View>
                            }
                        </TouchableOpacity>
                        {filter.currSub && filter.currSub.title ?
                            <TouchableOpacity onPress={() => setFilter({ ...filter, currSub: null })} style={[styles.headerTag, { marginHorizontal: 15 }]}>
                                <Text style={styles.contentTag}>{filter.currSub.title}</Text>
                                <View style={{ paddingLeft: 4, }}>
                                    <Icon type='AntDesign' name='close' style={{ fontSize: 12, color: 'white' }} />
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => setShowFilter(true)} style={[styles.headerTag, { marginHorizontal: 15 }]}>
                                <Text style={styles.contentTag}>Tất cả các môn</Text>
                            </TouchableOpacity>
                        }
                        {filter.curType ?
                            <TouchableOpacity onPress={() => setFilter({ ...filter, currSub: Object.keys(mapTypeQestion)[0] })} style={styles.headerTag}>
                                <Text style={styles.contentTag}>{mapTypeQestion[filter.curType]}</Text>
                                <View style={{ paddingLeft: 4, }}>
                                    <Icon type='AntDesign' name='close' style={{ fontSize: 12, color: 'white' }} />
                                </View>
                            </TouchableOpacity>
                            :
                            <View />
                        }
                    </ScrollView>
                </View> */}
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 9 }}>
                    <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 18, borderBottomColor: COLOR.MAIN, borderBottomWidth: 2, marginVertical: 5 }}>
                        <Text style={{ fontWeight: '600', color: COLOR.MAIN }}>Phổ biến</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 18, borderBottomColor: COLOR.MAIN, borderBottomWidth: 2, marginVertical: 5 }}>
                        <Text style={{ fontWeight: '600', color: COLOR.MAIN }}>
                            Cần giải đáp
                        </Text>
                    </TouchableOpacity>
                </View> */}

                <PopularFilter filter={filter} setFilter={setFilter} />
            </View>
        </View>
    )
}

const FilterHeader = ({ show, filter = {}, setFilter, loading = false }) => {
    return (
        <Animatable.View
            animation={show ? 'fadeIn' : 'fadeOut'}
        >
            <PopularFilter filter={filter} setFilter={setFilter} loading={loading} />
        </Animatable.View>
    )
};

const PopularFilter = ({ filter, setFilter, loading = false }) => {
    return (
        <View
            style={{
                flexDirection: 'row', justifyContent: 'space-around', marginBottom: 9,
                backgroundColor: '#fff',
            }}>
            <TouchableOpacity
                onPress={() => setFilter({ ...filter, popular: true })}
                style={{
                    paddingVertical: 5,
                    paddingHorizontal: 18,
                    borderBottomColor: COLOR.MAIN,
                    borderBottomWidth: filter.popular ? 2 : 0,
                    marginVertical: 5,
                    height: 30,
                    justifyContent: 'center',
                }}>
                <Text style={{ fontWeight: '600', fontSize: 14, color: filter.popular ? COLOR.MAIN : '#333' }}>Phổ biến</Text>
            </TouchableOpacity>
            {
                loading ? <ActivityIndicator color={COLOR.MAIN} /> : null
            }
            <TouchableOpacity
                onPress={() => setFilter({ ...filter, popular: false })}
                style={{
                    paddingVertical: 5,
                    paddingHorizontal: 18,
                    borderBottomColor: COLOR.MAIN,
                    borderBottomWidth: filter.popular ? 0 : 2,
                    marginVertical: 5,
                    height: 30,
                    justifyContent: 'center',
                }}>
                <Text style={{ fontWeight: '600', fontSize: 14, color: filter.popular ? "#333" : COLOR.MAIN }}>
                    Cần giải đáp
                </Text>
            </TouchableOpacity>
        </View>
    )
}


const TollBar = ({ navigation, current_class }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, }}>
            <GradientText
                colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                style={styles.headerText}
            >Hỏi đáp {current_class < 13 ? `lớp ${current_class}` : ''}</GradientText>

            {/* <View style={{ flexDirection: 'row' }}> */}
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SearchQnA')}
                    style={{ padding: 8, borderRadius: 40, height: 40, width: 40, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginRight: 7 }}
                >
                    <Icon name="search" style={{ fontSize: 19 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('NotificationQnA')
                }} style={{ padding: 8, borderRadius: 40, height: 40, width: 40, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon style={{ fontSize: 19 }} name="bell" type="FontAwesome5" />
                </TouchableOpacity>
            </View>
        </View>
    )
}


const RenderQestion = ({ item, index, hanldleClick, _handleNavigate = () => { }, _handleFollow = () => { }, _handleReport = () => { } }) => {
    const {
        id = '',
        user: {
            name = '',
            avatar = '',
            role_id = 0
        } = {},
        userAnswer = [],
        path: {
            class_id = 9,
            subject = {}
        } = {},
        content = '',
        parse_content = '',
        viewCount = 1,
        commentCount = 3,
        likeCount = 3,
        timestamp = "2020-05-12T18:33:32.000000Z",
        image = [],
        is_follow = false,
    } = item;

    const [like, setLike] = useState(0);
    const [isFollow, setFollow] = useState(is_follow);

    const _handleLike = useCallback(() => {
        search_services.handleLike(id, { "rate": like ? -1 : 1 });
        setLike(!like);
    }, [like]);

    const [listImgShow, setVisible] = useState(false)

    return (
        <View style={styles.itemQ} >
            <View style={styles.headItemQ}>
                <View style={styles.subjectQ}>
                    <TouchableOpacity onPress={() => _handleNavigate(get(item, 'user.id', ''))} style={styles.largeImgWapper} >
                        <Image style={userStyle.img} source={{ uri: handleAvatarLink(avatar) }} />
                        {(role_id == 1 || role_id == 2) ? <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                            <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
                        </View> : null}
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.subjectTextQ}>{get(subject, 'subject_name', '') + ' • '} {getDiffTime(timestamp)}</Text>
                        <Text numberOfLines={1} style={{ ...fontMaker(fontStyles.Thin), color: '#777', fontSize: 13, marginTop: 4 }}>{name}</Text>
                    </View>

                </View>
                {/* select option */}
                <OptionsMenu
                    customButton={<Icon name='dots-three-vertical' type='Entypo' style={{ fontSize: 16, color: '#040404', paddingLeft: 20, marginLeft: 20 }} />}
                    destructiveIndex={1}
                    options={[isFollow ? "Bỏ theo dõi" : 'Theo dõi', "Báo cáo", "Huỷ bỏ"]}
                    actions={[() => { _handleFollow(id, isFollow); setFollow(!isFollow) }, () => _handleReport(id)]} />

            </View>
            {/* content */}
            <TouchableOpacity
                onPress={() => {
                    hanldleClick({
                        contentQuestion: parse_content,
                        questionId: id,
                    })
                }}
                style={{ paddingHorizontal: 8 }}>
                <RenderDataJson isShort indexItem={index} content={parse_content} />
                {(parse_content && get(parse_content, 'length', 0) > 1) ? < Text style={{ textAlign: 'left', marginTop: 8, color: COLOR.MAIN }}>... Xem thêm</Text> : null}
            </TouchableOpacity>
            <RenderListImg setVisible={setVisible} listImg={image} />
            {/* footer */}
            <View style={{
                flexDirection: 'row',
                //  borderTopColor: '#cecece',
                // borderTopWidth: 1, 
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                paddingTop: 8, marginTop: 5, paddingHorizontal: 8
            }}>
                {/* <ListUser /> */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            hanldleClick({
                                contentQuestion: parse_content,
                                questionId: id,
                            })
                        }}
                        style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 20 }} >
                        <Text style={{ color: '#74B2D6', fontWeight: 'bold' }}> {commentCount ? `${commentCount} câu trả lời` : "Chưa có câu trả lời"}</Text>
                    </TouchableOpacity>
                    {/* <ListUser /> */}
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 15 }} >
                        <Icon name="eye" type="Entypo" style={{ fontSize: 20, color: '#333', marginHorizontal: 4, }} />
                        <Text style={{ fontSize: 13, color: '#333' }}>
                            {/* {image[0] ? `${image.length} ảnh • ` : ''} */}
                            {viewCount}
                        </Text>

                        {/* <Icon name="star" type="AntDesign" style={{fontSize: 20, color: COLOR.MAIN, marginHorizontal: 4,}} />
                        <Text style={{ color: "#333", fontWeight: 'bold' }}>5.0</Text> */}

                    </View>
                    {/* <TouchableOpacity
                        onPress={_handleLike}
                        style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 10 }}
                    >
                        <Icon name="heart" type="Entypo"
                            style={{
                                fontSize: 20, marginHorizontal: 4,
                                color: "#FC786D"
                            }} />
                        <Text style={{ color: "#333", fontWeight: 'bold' }}>{likeCount + (like ? 1 : 0)}</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
            <ImageView
                images={get(listImgShow, 'data[0]', null) && get(listImgShow, 'data', []).map(img => ({ uri: `${endpoints.MEDIA_URL}${get(img, 'path', '')}` }))}
                imageIndex={+get(listImgShow, 'index', 0)}
                visible={!!listImgShow}
                onRequestClose={() => setVisible(false)}
            />
            {
                [3, 10, 20].includes(index) ? <View style={{ paddingTop: 10 }}>
                    <ViewWithBanner index={index} type="QNA_LIST" />
                </View>
                    : null
            }
        </View >
    )
}


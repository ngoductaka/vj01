import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, FlatList, Text, StyleSheet, Platform,
    TouchableOpacity, Dimensions, Image, ScrollView,
    SafeAreaView, ActivityIndicator
} from 'react-native';
import { Icon } from 'native-base';
import { withNavigationFocus } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { get } from 'lodash';
import OptionsMenu from "react-native-option-menu";
import ImageView from "react-native-image-viewing";

import { getDiffTime } from '../../utils/helpers';
import { fontSize, COLOR } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { GradientText } from '../../component/shared/GradientText';
import { FilterModal, mapTypeQestion } from './com/FilterModal';
import api from '../../handle/api';
import { RenderDataJson } from '../../component/shared/renderHtmlNew';
import { search_services } from './service';
import { images } from '../../utils/images';
import { endpoints } from '../../constant/endpoints';
import { RenderListImg } from '../../component/Image/renderListImg';


const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";
const { height } = Dimensions.get('screen');

const QnA = (props) => {
    const onMomentumScrollBeginRef = useRef(true);
    const flatlistRef = useRef(null);
    const current_class = useSelector(state => state.userInfo.class);

    const [filter, setFilter] = useState({ cls: current_class });
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
        const { cls, currSub } = filter;
        let endPoint = `/question?limit=${20}&page=${next_page}`;
        if (cls && cls < 13) {
            endPoint += `&grade=${cls}`
        }
        if (currSub && currSub.id) {
            endPoint += `&subject=${currSub.id}`
        }

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
    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* top */}
                <TollBar navigation={props.navigation} />
                <FlatList
                    // onScroll={(e) => { }}
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
                    ListHeaderComponent={() => renderHead({ filter, setFilter, setShowFilter, navigation: props.navigation, loading: page.loading })}
                    renderItem={({ item, index }) => {
                        return <RenderQestion {...{
                            item, index, hanldleClick, _handleNavigate,
                            _handleReport, _handleFollow
                        }} />
                    }}
                    keyExtractor={(item) => '' + item.id}
                    style={{ backgroundColor: '#CACCD1', flex: 1 }}
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
                // footter
                />
                {
                    animatableView ?
                        <Animatable.View
                            animation={animatableView}
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                            }}>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate('SearchQnA')}
                                style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 50,
                                    flex: 1,
                                    backgroundColor: COLOR.MAIN,
                                    justifyContent: 'center', alignItems: 'center',
                                }}>
                                <Icon name="search" style={{ color: '#fff' }} />
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
        backgroundColor: '#fff'
    },
    filter: {
        flexDirection: 'row',
        paddingVertical: 10,
        backgroundColor: COLOR.MAIN,
        height: 40,
        width: 40,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
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
        marginTop: 10
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

const renderHead = ({ filter, setFilter, setShowFilter, navigation, loading }) => {
    return (
        <View style={styles.head}>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                marginTop: 20,
                borderBottomColor: '#ddd', borderBottomWidth: 1, paddingBottom: 10, paddingHorizontal: 10, alignItems: 'center'
            }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SearchQnA')}
                    style={{
                        flexDirection: 'row', alignItems: 'center', flex: 1
                    }}>
                    <View style={styles.largeImgWapper} >
                        <Image style={userStyle.img} source={{ uri: userImg }} />
                        <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                            <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
                        </View>
                    </View>
                    <Text style={{ fontSize: 16, marginLeft: 10 }}>Bạn muốn hỏi gì?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowFilter(true)} style={styles.filter}>
                    {
                        loading ? <ActivityIndicator color="#fff" /> :
                            <Icon style={styles.iconFilter} type="AntDesign" name="filter" />
                    }
                    {/* <Text style={styles.h2}> Lọc câu hỏi</Text> */}
                </TouchableOpacity>
            </View>
            <View>
                <View>
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
                        {/* {filter.curType ?
                            <TouchableOpacity onPress={() => setFilter({ ...filter, currSub: Object.keys(mapTypeQestion)[0] })} style={styles.headerTag}>
                                <Text style={styles.contentTag}>{mapTypeQestion[filter.curType]}</Text>
                                <View style={{ paddingLeft: 4, }}>
                                    <Icon type='AntDesign' name='close' style={{ fontSize: 12, color: 'white' }} />
                                </View>
                            </TouchableOpacity>
                            :
                            <View />
                        } */}
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}


const TollBar = ({ navigation }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
            <GradientText
                colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                style={styles.headerText}
            >Hỏi đáp</GradientText>

            {/* <View style={{ flexDirection: 'row' }}> */}
            <TouchableOpacity onPress={() => {
                navigation.navigate('NotificationQnA')
            }} style={{ padding: 8, borderRadius: 40, height: 40, width: 40, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }}>
                <Icon style={{ fontSize: 19 }} name="bell" type="FontAwesome5" />
            </TouchableOpacity>
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
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                marginBottom: 10, justifyContent: 'space-between'
            }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                    <TouchableOpacity onPress={() => _handleNavigate(get(item, 'user.id', ''))} style={styles.largeImgWapper} >
                        <Image style={userStyle.img} source={{ uri: handleImgLink(avatar) || userImg }} />
                        {(role_id == 1 || role_id == 2) ? <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                            <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
                        </View> : null}
                    </TouchableOpacity>
                    <View style={{ marginLeft: 10 }}>
                        <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 16 }}>{name}</Text>
                        <Text style={{ fontSize: 13 }}>Lớp {class_id} • {get(subject, 'subject_name', '') + ' • '} {getDiffTime(timestamp)}</Text>
                    </View>
                </View>
                {/* select option */}
                <OptionsMenu
                    customButton={<Icon name='dots-three-vertical' type='Entypo' style={{ fontSize: 16, color: '#040404', paddingLeft: 20, paddingBottom: 20, marginLeft: 20 }} />}
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
                {(parse_content && get(parse_content, 'length', 0) > 5) ? < Text style={{ textAlign: 'left', marginTop: 8, color: COLOR.MAIN }}>... Xem thêm</Text> : null}
            </TouchableOpacity>
            <RenderListImg setVisible={setVisible} listImg={image} />
            {/* footer */}
            <View style={{
                flexDirection: 'row', borderTopColor: '#cecece',
                borderTopWidth: 1, alignItems: 'flex-end',
                paddingTop: 8, marginTop: 5, paddingHorizontal: 8
            }}>
                {/* <ListUser /> */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={_handleLike}
                        style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 10 }}
                    >
                        <Icon name="heart" type="EvilIcons"
                            style={{ fontSize: 24, marginHorizontal: 4, color: like ? COLOR.MAIN : "#333" }} />
                        <Text style={{ color: like ? COLOR.MAIN : "#333" }}>{likeCount + (like ? 1 : 0)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            hanldleClick({
                                contentQuestion: parse_content,
                                questionId: id,
                            })
                        }}
                        style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 10 }} >
                        <Icon name="comment" type="EvilIcons" style={{ fontSize: 24, marginHorizontal: 4, }} />
                        <Text>{commentCount}</Text>
                    </TouchableOpacity>
                    {/* <ListUser /> */}
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 15 }} >
                        <Text style={{ fontSize: 13, color: '#333' }}> {image[0] ? `${image.length} ảnh • ` : ''} {viewCount} lượt xem</Text>
                    </View>
                </View>
            </View>
            <ImageView
                images={get(listImgShow, 'data[0]', null) && get(listImgShow, 'data', []).map(img => ({ uri: `${endpoints.MEDIA_URL}${get(img, 'path', '')}` }))}
                imageIndex={+get(listImgShow, 'index', 0)}
                visible={!!listImgShow}
                onRequestClose={() => setVisible(false)}
            />
        </View >
    )
}


const handleImgLink = (link) => {
    try {
        if(!link) return "https://www.xaprb.com/media/2018/08/kitten.jpg"
        return link.includes('http') ? link : endpoints.BASE_HOI_DAP + link;
    } catch (err) {
        return link;
    }
}

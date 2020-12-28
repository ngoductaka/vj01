import React, { useState, useEffect } from 'react';
import {
    View, FlatList, Text, StyleSheet, Platform,
    TouchableOpacity, Dimensions, Image, ScrollView,
    SafeAreaView, TextInput
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { isEmpty } from 'lodash';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";
import { withNavigationFocus } from 'react-navigation';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-simple-toast';

import { fontSize, COLOR } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { GradientText } from '../../component/shared/GradientText';
// 
import { FilterModal, mapTypeQestion } from './com/FilterModal';
import QuestionFrom from '../../component/Search';
import { RenderQnASearch } from '../../component/shared/ItemDocument';

import { search_services } from './service';
import { images } from '../../utils/images';

const { width, height } = Dimensions.get('window');
const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";


const QnA = (props) => {
    const currentClass = useSelector(state => state.userInfo.class);

    const [filter, setFilter] = useState({ cls: currentClass });
    const [showFilter, setShowFilter] = useState(false);

    const hanldleClick = (params) => {
        props.navigation.navigate("QuestionDetail", params);
    }

    const [searchText, setSearchText] = useState();
    const [resultSearch, setResultSearch] = useState([])

    useEffect(() => {
        if (searchText && filter) {
            console.log(filter, 'filter====');
            const { cls, currSub } = filter;
            const query = { grade_id: cls == 13 ? '' : cls };
            if (currSub && currSub.id) {
                query.subject_id = currSub.id
            }

            search_services.handleSearch(searchText, query)
                .then(({ data }) => {
                    setResultSearch(data);
                })
                .catch(err => {
                    Toast.showWithGravity("Load câu hỏi lỗi!", Toast.SHORT, Toast.CENTER);
                })
        }

    }, [searchText, filter]);
    return (
        <View style={styles.container}>
            <SafeAreaView style={[styles.container]}>
                <TollBar
                    leftAction={() => props.navigation.goBack()}
                    text="Tìm câu hỏi"
                />
                <View style={{ flex: 1 }}>
                    <QuestionFrom
                        placeholder="Câu hỏi của bạn là gì?"
                        // handleSaveSearchingKey={() => (searchText)}
                        showFilter={() => setShowFilter(true)}
                        handleTypeKeyword={setSearchText}
                        setSearchText={setSearchText}
                        navigation={props.navigation}
                    />

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
                        </ScrollView>
                    </View>

                    <View style={{ flex: 1, paddingHorizontal: 15 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={resultSearch}
                            renderItem={({ item, index }) => {
                                const { title = '',
                                    class_id: grade = '',
                                    subject_id: book = '',
                                    id: questionId = '',
                                    subject_name = ""
                                } = item
                                return (
                                    <RenderQnASearch
                                        onPress={() => { props.navigation.navigate('QuestionDetail', { questionId }) }}
                                        {...{ title, grade: "Lớp " + grade, book: subject_name }}
                                    />
                                )
                            }}
                            keyExtractor={(item, index) => item.id}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={{ alignItems: 'center', marginTop: 30 }}>
                                        <Image source={images.no_item} />
                                        <Text style={{ fontSize: 20, color: '#666' }}>{"Không tìm thấy kết quả"}</Text>
                                    </View>
                                )
                            }}
                        />

                    </View>
                </View>


                <Animatable.View
                    duration={1500}
                    animation="lightSpeedIn"
                    delay={100}
                    style={{
                        position: 'absolute', bottom: 50, right: 0,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('MakeQuestion')}
                        style={{
                            // position: 'absolute', bottom: 60, right: 0,
                            flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,
                            paddingVertical: 10
                        }}>
                        <View
                            style={{ backgroundColor: COLOR.MAIN, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, position: 'relative' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}> Đặt câu hỏi mới</Text>
                            <View style={{
                                height: 12, width: 12, position: 'absolute', backgroundColor: COLOR.MAIN, right: -5, top: '50%', transform: [
                                    {
                                        rotate: "45deg"
                                    }
                                ]
                            }} />
                        </View>
                        <View style={{ backgroundColor: COLOR.MAIN, marginLeft: 10, padding: 5, borderRadius: 50, height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon style={{ color: '#fff', fontWeight: 'bold', marginTop: 5 }} type="AntDesign" name="plus" />
                        </View>
                    </TouchableOpacity>
                </Animatable.View>
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
        padding: 10,
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


export default QnA;



const ListUser = () => {
    return (
        <View style={userStyle.userComment}>
            <View style={userStyle.imgWapper} >
                <Image style={userStyle.img} source={{ uri: userImg }} />
                <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                    <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
                </View>
            </View>
            <View style={userStyle.imgWapper} >
                <Image style={userStyle.img} source={{ uri: userImg }} />
            </View>
            <View style={[userStyle.userCount, { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }]} >
                <Text>+3</Text>
            </View>
        </View>
    )
}

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

const renderHead = ({ filter, setFilter, setShowFilter }) => {
    return (
        <View style={styles.head}>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                marginTop: 20,
                borderBottomColor: '#ddd', borderBottomWidth: 1, paddingBottom: 10, paddingHorizontal: 10, alignItems: 'center'
            }}>
                <TouchableOpacity style={{
                    flexDirection: 'row', alignItems: 'center',
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
                    <Icon style={styles.iconFilter} type="AntDesign" name="filter" />
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
                </View>
            </View>
        </View>
    )
}



const TollBar = ({ text, leftAction }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={leftAction}>
                <Icon name={'ios-arrow-back'} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                <GradientText
                    colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                    style={styles.headerText}
                >{text}</GradientText>
            </View>
        </View>
    )
}


const RenderQestion = ({ item, index, hanldleClick }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                hanldleClick({
                    title: item.title,
                    content: item.content,
                })
                // props.navigation.navigate("QuestionDetail", {
                //     title: item.title,
                //     content: item.content,
                // });
            }}
            style={styles.itemQ}
        >
            <TouchableOpacity style={{
                flexDirection: 'row', alignItems: 'center',
                marginBottom: 10
            }}>
                <View style={styles.largeImgWapper} >
                    <Image style={userStyle.img} source={{ uri: userImg }} />
                    <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                        <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
                    </View>
                </View>
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>NGoc duc</Text>
                    <Text style={{ fontSize: 13 }}>Lớp 12 > toán * 17 phút trước</Text>
                </View>
            </TouchableOpacity>
            {/* content */}

            <Text style={styles.itemHead}>{item.content}</Text>
            {/* <Image s */}



            {/* footer */}

            <View style={{
                flexDirection: 'row', borderTopColor: '#cecece', borderTopWidth: 1, alignItems: 'flex-end', paddingTop: 8,
                // justifyContent: 'flex-end'
            }}>
                {/* <ListUser /> */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 10 }} >
                        <Icon name="heart" type="Entypo" style={{ fontSize: 17, marginHorizontal: 4, }} />
                        <Text>3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 10 }} >
                        <Icon name="chat" type="Entypo" style={{ fontSize: 17, marginHorizontal: 4, }} />
                        <Text>3</Text>
                    </TouchableOpacity>
                    <ListUser />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>

                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 10 }} >
                        {/* <Icon name="eye" type="Entypo" style={{fontSize: 16, marginHorizontal: 4}} /> */}
                        <Text style={{ fontSize: 13, color: '#333' }}>3 lượt xem</Text>
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    )
}


const fakeData = [
    {
        "id": 5650,
        "slug": "duong-tron-c-tam-i-43-va-tiep-xuc-voi-truc-tung-co-phu",
        "user_id": 268472,
        "editor_id": 0,
        "class_id": 10,
        "subject_id": 1,
        "chapter_id": null,
        "lesson_id": null,
        "content": "<p>Đường tròn (C) tâm I (-4;3) và tiếp xúc với trục tung có phương trình là? </p>",
        "parse_content": "[[{\"type\":\"text\",\"content\":\"\\u0110\\u01b0\\u1eddng tr\\u00f2n (C) t\\u00e2m I (-4;3) v\\u00e0 ti\\u1ebfp x\\u00fac v\\u1edbi tr\\u1ee5c tung c\\u00f3 ph\\u01b0\\u01a1ng tr\\u00ecnh l\\u00e0?\\u00a0\"}]]",
        "content_khong_dau": "pduong tron c tam i 43 va tiep xuc voi truc tung co phuong trinh la p",
        "point": 20,
        "status": 1,
        "type": 0,
        "origin_question_id": null,
        "origin_curriculum_id": null,
        "view": 16,
        "created_at": 1588450076,
        "updated_at": 1604308814,
        "seo_title": "Đường tròn (C) tâm I (-4;3) và tiếp xúc với trục tung có phương trì",
        "seo_description": "Đường tròn (C) tâm I (-4;3) và tiếp xúc với trục tung có phương trình là? ",
        "seo_keyword": "Đường tròn (C) tâm I (-4;3) và tiếp xúc với trục tung có phương trình là? ",
        "title": "Đường tròn (C) tâm I (-4;3) và tiếp xúc với trục tung có phương trình là? ",
        "grade_id": 10
    }
]
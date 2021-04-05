import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View, SafeAreaView, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { Card, Icon } from 'native-base';
import { isEmpty, get } from 'lodash';
import { COLOR, fontSize, blackColor } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';


const ArticleItem = ({ data, advertParam = null, handleNavigate, SeeMore, title = 'Giải bài tập' }) => {
    const [expand, setExpand] = useState(false);
    return (
        <View style={{ overflow: 'hidden', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingRight: 10, paddingBottom: 8, }}>
                <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }) }}>{title}</Text>
                <Text style={{ fontSize: 19, marginLeft: 4, color: '#555' }}>({data.length} bài)</Text>
            </View>
            {
                isEmpty(data) ? null :
                    <Animatable.View animation={"fadeIn"} style={{ marginBottom: 10 }}>

                        <View>
                            {
                                data.slice(0, expand ? 100 : 3).map((item, index) => {
                                    return (
                                        <RenderArticle
                                            handleNavigate={handleNavigate}
                                            item={item}
                                            index={index}
                                            relatedArticle={data}
                                            advertParam={advertParam}
                                        />
                                    )
                                })
                            }
                        </View>
                        {
                            data.length > 3 && <SeeMore
                                // onPress={() => handleNavigate('ListDetailLesson', { title, data })}
                                onPress={() => setExpand(!expand)}
                                expanded={expand}
                                count={data.length - 3}
                            />
                        }

                    </Animatable.View>
            }
        </View >
    );
}

const RenderChapterLesson = ({ data = null, advertParam = null, handleNavigate = () => { }, SeeMore }) => {
    console.log('datachapter', data.articles)
    const [expand, setExpand] = useState(false);
    if (!get(data, 'articles.length')) return null;

    return (
        <View style={{ overflow: 'hidden', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingRight: 10, paddingBottom: 8, }}>
                <Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Regular }) }}>Bài học theo chương</Text>
                <Text style={{ fontSize: 19, marginLeft: 4, color: '#555' }}>({data.articles.length} bài)</Text>
            </View>

            {
                !data.articles.length ? null :
                    <Animatable.View animation={"fadeIn"} style={{ marginBottom: 10 }}>
                        <View>
                            {
                                data.articles.slice(0, expand ? 100 : 3).map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => { 
                                                console.log('---'); 
                                                handleNavigate('Lesson', { articleId: get(item, 'id', ''), advert: advertParam, relatedArticle:[] }) }}
                                            style={stylesComponent.textItem}>
                                            <View style={{ flexDirection: 'row', paddingRight: 3 }}>
                                                <Text>{`${index + 1}.  `}</Text>
                                                <Text numberOfLines={3} style={stylesComponent.textContent}>
                                                    {get(item, 'title', '')}
                                                </Text>
                                            </View>
                                            <Icon style={[stylesComponent.icon, { color: COLOR.MAIN }]} type="AntDesign" name="right" />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                        {
                            data.articles.length > 3 && <SeeMore
                                // onPress={() => handleNavigate('ListDetailLesson', { title, data })}
                                onPress={() => setExpand(!expand)}
                                expanded={expand}
                                count={data.articles.length - 3}
                            />
                        }

                    </Animatable.View>
            }
        </View>
    )

}


const RenderArticle = ({ handleNavigate, advertParam = null, item, index, relatedArticle = [] }) => {
    return (
        <TouchableOpacity
            onPress={() => { handleNavigate('Lesson', { articleId: get(item, 'partable.id', ''), relatedArticle, advert: advertParam }) }}
            style={stylesComponent.textItem}>
            <View style={{ flexDirection: 'row', paddingRight: 3 }}>
                <Text>{`${index + 1}.  `}</Text>
                <Text numberOfLines={3} style={stylesComponent.textContent}>
                    {get(item, 'partable.title', '')}
                </Text>
            </View>
            <Icon style={[stylesComponent.icon, { color: COLOR.MAIN }]} type="AntDesign" name="right" />
        </TouchableOpacity>
    )
}

const RenderArticlRelated = ({ handleNavigate, advertParam = null, item, index, stopPlayer = () => { }, relatedArticle = [] }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                stopPlayer();
                handleNavigate('Lesson', { articleId: get(item, 'id', ''), advert: advertParam });
            }}
            style={[stylesComponent.textItem, { paddingLeft: 0, borderBottomWidth: 0 }]}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <LinearGradient
                    start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
                    colors={['#febf6f', COLOR.MAIN]} style={{ height: 30, width: 30, marginRight: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Icon type='MaterialCommunityIcons' name='file-document-edit' style={{ fontSize: 18, color: 'white', marginLeft: 3 }} />
                </LinearGradient> */}
                <View
                    style={{
                        height: 30, width: 30, marginRight: 15, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
                        borderColor: COLOR.MAIN,
                        borderWidth: 1
                    }}
                >
                    <Icon type='MaterialCommunityIcons' name='file-document-edit' style={{ color: COLOR.MAIN, fontSize: 18, marginLeft: 3 }} />
                </View>
                <Text numberOfLines={3} style={stylesComponent.textContent}>
                    {get(item, 'title', '')}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export {
    ArticleItem,
    RenderArticle,
    RenderArticlRelated,
    RenderChapterLesson
}



// component
const stylesComponent = StyleSheet.create({
    textItem: {
        flexDirection: 'row',
        borderRadius: 5,
        borderBottomColor: '#dedede',
        borderBottomWidth: 2,
        padding: 10, alignItems: 'center',
        paddingVertical: 15
    },
    textContent: {
        ...fontMaker({ weight: fontStyles.Regular }),
        color: blackColor(0.6), flex: 1,
        fontSize: fontSize.h4
    },
    icon: {
        color: '#777',
        fontSize: 12,
        marginTop: 3,
        // marginLeft: 2,
    }
})
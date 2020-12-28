import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View, SafeAreaView, Text, StyleSheet, TouchableOpacity,
    FlatList, ScrollView, Dimensions, Animated, Alert, BackHandler, Image
} from 'react-native';
import { Card, Icon } from 'native-base';
import { connect } from 'react-redux';
import { renderFooter } from './component/handleHtml';
import { helpers } from '../../utils/helpers';
import BackHeader from '../Subject/component/BackHeader';
import { COLOR } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { RenderRow } from '../../component/shared/renderHtmlNew';
const per_page = 30;

const Lesson = (props) => {
    const { navigation } = props;
    const title = navigation.getParam('title', '');
    const [isLoadMore, setLoadmore] = useState(true);

    const handleDelayRenderHtml = (totalPage, page, arrayHtmlContent, data) => {
        if (totalPage > page) {
            setTimeout(() => {
                const newData = arrayHtmlContent.concat(data.slice(page * per_page, (page + 1) * per_page));
                setDataHtml(newData);
                handleDelayRenderHtml(totalPage, page + 1, newData, data)
            }, 450)
        } else {
            setLoadmore(false);
        }
    }

    const [arrayHtmlContent, setDataHtml] = useState([]);

    useEffect(() => {
        BackHandler.addEventListener(
            'hardwareBackPress',
            _handleBack
        );

        return () => {
            BackHandler.removeEventListener(
                'hardwareBackPress',
                _handleBack
            );
        }
    }, []);

    const _handleBack = () => {
        props.navigation.goBack();
        return true;
    }

    const parsed_content = navigation.getParam('parsed_content', '');
    useEffect(() => {
        if (parsed_content) {
            try {
                const data = JSON.parse(parsed_content);

                const leng = data.length;
                const total = Math.ceil(leng / per_page);
                const initData = data.slice(0, per_page);
                setDataHtml(initData);
                setTimeout(() => {
                    handleDelayRenderHtml(total, 1, initData, data);
                }, 10);
            } catch (err) {
                return null;
            }
        }
    }, [parsed_content]);


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
        <BackHeader
            title={title}
            iconName="close"
        />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, paddingHorizontal: 10, }}>
                    {/* render html ============== */}
                    <FlatList
                        data={arrayHtmlContent}
                        extraData={arrayHtmlContent}
                        style={{ width: '100%', backgroundColor: '#fffcfa' }}
                        ListFooterComponent={() => renderFooter(isLoadMore)}
                        removeClippedSubviews={true}
                        renderItem={({ item, index }) => {
                            // return null;
                            return RenderRow({
                                indexItem: '',
                                row: item,
                                indexRow: index,
                                // setShowImg,
                                // itemLesson: item, index 
                            })
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </SafeAreaView>
            {/* <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: null, backgroundColor: '#fff' }}>

            </View> */}
        </View >
    );
}

const styles = StyleSheet.create({
    mainView: { flex: 1, padding: 15, backgroundColor: 'white' },
    htmlRender: { borderTopRightRadius: 16, borderTopLeftRadius: 16, overflow: 'hidden', backgroundColor: '#ff985a', },
    relatedView: { backgroundColor: '#5b9ef7', marginTop: 10, borderRadius: 16 },
    relatedTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', margin: 12, ...fontMaker({ weight: 'Bold' }) },
    relatedItemContainer: { marginLeft: 20, paddingTop: 15, marginRight: 10, flexDirection: 'row' },
    relatedTopItemContainer: {
        marginRight: 10,
        paddingTop: 20, flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    relatedItem: { color: '#73787b', marginLeft: 10, fontSize: 16, ...fontMaker({ weight: 'Regular' }), marginRight: 15 },
    dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
    flatlist: { backgroundColor: '#e6edfe', borderRadius: 15, paddingBottom: 15 },
    flatlistRelated: {
        // backgroundColor: '#FFE7D1',
        paddingTop: 350, paddingBottom: 10, marginTop: helpers.isIOS ? -295 : -290,
        borderBottomEndRadius: 10,
        borderBottomLeftRadius: 10
    },
    shadow: {
        shadowColor: 'rgba(0, 0, 0, 0.12)',
        shadowOpacity: 0.8,
        elevation: 3,
        shadowRadius: 2,
        shadowOffset: { width: 1, height: 7 },
    },

});

const RenderRelatedArticle = ({ item, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.relatedTopItemContainer}
            onPress={onPress}
        >
            <Text numberOfLines={2} style={[styles.relatedItem, { color: '#1C1C20' }]} >{`${item.title}`}</Text>
            <Icon name='ios-arrow-forward' style={{ color: COLOR.logo, fontSize: 20 }} />
        </TouchableOpacity>
    );
};

export default connect(
    (state) => ({ bookInfo: state.bookInfo }),
    null
)(React.memo(Lesson));


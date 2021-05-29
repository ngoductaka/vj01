import React, { memo, useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';

import { RenderListBook } from "../../component/BookContent";
import { setBookInfo } from '../../redux/action/book_info';
import { GradientText } from "../../component/shared/GradientText";
import { fontMaker, fontStyles } from "../../utils/fonts";
import ViewContainer from "../../component/shared/ViewContainer";
import { helpers } from "../../utils/helpers";
import api, { Loading, useRequest } from '../../handle/api';
import { ViewWithBanner } from "../../utils/facebookAds";


const Book = memo((props) => {
    const title_ = props.navigation.getParam('title', '');
    const subjectID = props.navigation.getParam('subjectID', '');
    const callback = props.navigation.getParam('_callback', null);

    const [listBook, isLoading, err] = useRequest(`/books?subject_id=${subjectID}`, [subjectID]);

    const [dataConvert, setDataConvert] = useState([]);

    useEffect(() => {
        if (listBook && listBook.data) {
            const valConvert = listBook.data.reduce((car, cur) => {
                if (cur.book_type) {
                    car[cur.book_type] = car[cur.book_type] ? [cur, ...car[cur.book_type]] : [cur]
                }
                return car;
            }, {});
            setDataConvert(valConvert);
        }
    }, [listBook]);

    useEffect(() => {
        return () => {
            if (callback) callback();
        };
    }, []);

    useEffect(() => {
        api.post(`subjects/${subjectID}/user`)
    }, [subjectID]);

    return (
        <View style={{ flex: 1 }}>
            <ViewContainer
                showRight={false}
                showLeft={true}
                title={`${title_}`}
                headerView={
                    <View style={{ flex: 1, marginTop: 70 + helpers.statusBarHeight }}>
                        <GradientText colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']} style={{ fontSize: 26, marginTop: 4, ...fontMaker({ weight: fontStyles.Bold }) }}>{title_}</GradientText>
                    </View>
                }
            >
                <View style={styles.listBook}>
                    <Loading isLoading={isLoading}
                        err={err}>
                        {
                            listBook && listBook.data &&
                            <RenderListBook
                                listBook={listBook.data.filter(i => !i.book_type)}
                                handleNavigation={(bookItem) => {
                                    const { icon_id, id, title } = bookItem;
                                    props.navigation.navigate('Subject', { icon_id, bookId: id, title, subject: subjectID })
                                }}
                            />
                        }
                        {
                            !isEmpty(dataConvert) ?
                                Object.keys(dataConvert).map(book => {
                                    return (
                                        <View>
                                            <GradientText
                                                colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                                                style={{
                                                    fontSize: 26,
                                                    // marginTop: 4,
                                                    marginVertical: 20,
                                                    ...fontMaker({ weight: fontStyles.Bold })
                                                }}>{book}</GradientText>
                                            {/* <Text>{book}</Text> */}
                                            <RenderListBook
                                                listBook={dataConvert[book]}
                                                handleNavigation={(bookItem) => {
                                                    const { icon_id, id, title } = bookItem;
        console.log(' { book: url, title }',  { icon_id, bookId: id, title, subject: subjectID })
                                                    
                                                    props.navigation.navigate('Subject', { icon_id, bookId: id, title, subject: subjectID })
                                                }}
                                            />

                                        </View>
                                    )
                                })

                                : null
                        }
                    </Loading>
                    <ViewWithBanner type="BOOK_BN" />
                </View>
            </ViewContainer>
        </View >
    );
});


const styles = StyleSheet.create({
    listBook: {
        flex: 1,
        marginTop: 40
    },
})

export default connect(
    (state) => ({ bookInfo: state.bookInfo, userInfo: state.userInfo }),
    (dispatch) => ({ setBookInfo: bookInfo => dispatch(setBookInfo(bookInfo)) })
)(Book);
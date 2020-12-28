import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, SafeAreaView, Text, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import api, { Loading } from '../../handle/api';
import NormalHeader from '../../component/shared/NormalHeader';
import { GradientText } from '../../component/shared/GradientText';
import TrendItem from '../../component/shared/TrendItem';
import { setBookInfo } from '../../redux/action/book_info';
import { setUserInfo } from '../../redux/action/user_info';
import { images } from '../../utils/images';

//  ========== show list subject class====================
const Trend = (props) => {

	const [page, setPage] = useState(1);
	const [trends, setTrends] = useState([]);
	const [err, setErr] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [recall, setRecall] = useState(0);
	const trendRef = useRef(null);


	useEffect(() => {
		async function loadTrends() {
			const response = await api.get(`trend-week/series_lop-${props.userInfo.class}?page=${page}`, {});
			if (page > 1) {
				setLoadingMore(true);
			}
			if (response) {
				setTrends([...trends, ...response]);
				setLoading(false);
				setLoadingMore(false);
			} else {
				setErr(response);
				setLoading(false);
				setLoadingMore(false);
			}
		}
		loadTrends();
	}, [page, props.userInfo.class, recall]);

	const scrollToTop = useCallback(() => {
		if (trendRef && trendRef.current) {
			trendRef.current.scrollToIndex({ index: 0 })
		}
	}, [trendRef])

	useEffect(() => {
		setTimeout(() => {
			if (trendRef && trendRef.current) {
				props.setUserInfo({
					trendScrollToTop: scrollToTop
				});
			}
		}, 2000)
	}, [trendRef])

	const onLoadMore = () => setPage(page + 1);

	const _handleNavigation = ({ topic_type, url: article_url = '', category_url = '', series_url = '', topic_id = '', topic_title = '', series_title = '' }) => {
		props.navigation.navigate("Lesson", {
			key: article_url,
			bookName: category_url,
			series_url,
			topic_id,
			// 
			iconType: topic_type,
			mainTitle: topic_title,
			subTitle: series_title
		});
	}

	return (
		<View style={{ flex: 1 }}>
			<ImageBackground
				source={images.bg_home}
				style={{ width: '100%', height: '100%' }}
			>
				<NormalHeader
					onPressSearch={() => props.navigation.navigate('SearchView', { searchText: '' })}
				/>
				<SafeAreaView style={styles.container}>
					<Loading isLoading={loading} err={err} setRecall={setRecall}>
						<GradientText style={{ paddingVertical: 10, alignSelf: 'center', fontSize: 26, fontWeight: '700' }}>XU HƯỚNG</GradientText>
						<View
							style={{ flex: 1, paddingBottom: 15 }}
						>
							{
								!isEmpty(trends) ?
									<FlatList
										ref={trendRef}
										style={{ paddingHorizontal: 20 }}
										data={trends}
										renderItem={({ item, index }) => _renderTrendItem(item, index, _handleNavigation, trends.length)}
										extraData={trends}
										onEndReached={onLoadMore}
										onEndReachedThreshold={0}
										ListFooterComponent={<ActivityIndicator animating={loadingMore} color='red' size='large' />}
										keyExtractor={(_, index) => 'trendItem' + index.toString()}
									/> :
									<View style={{ justifyContent: "center", alignItems: 'center', flex: 1 }}>
										<Text style={{ color: '#000', fontSize: 20 }}>
											Dữ liệu đang được cập nhật
										</Text>
									</View>
							}
						</View>
					</Loading>
				</SafeAreaView>
			</ImageBackground>
		</View>
	)
}

const _renderTrendItem = (menuItem, index, handleNavigation, maxLength) => {
	return (
		<TrendItem
			title={menuItem.title}
			subTitle={menuItem.topic_title}
			series={menuItem.series_title}
			img={menuItem.topic_type}
			showBorder={index % maxLength !== maxLength - 1}
			onPressItem={() => handleNavigation(menuItem)}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})

const mapDispatchToProps = dispatch => {
	return {
		setBookInfo: bookInfo => dispatch(setBookInfo(bookInfo)),
		setUserInfo: userInfo => dispatch(setUserInfo(userInfo))
	};
};

export default connect(
	(state) => ({
		userInfo: state.userInfo,
	}),
	mapDispatchToProps
)(Trend);

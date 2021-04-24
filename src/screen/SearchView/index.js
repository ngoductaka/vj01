import React, { useState, useEffect, memo, useRef, useCallback } from 'react';
import { View, FlatList, SafeAreaView, Text, TouchableOpacity, StyleSheet, Image, Keyboard, ScrollView, Alert } from 'react-native';
import { Tab, Tabs, Icon } from 'native-base';
import { isEmpty, get, throttle } from 'lodash';
import { connect, useSelector } from 'react-redux';

import { helpers } from '../../utils/helpers';
// import Header from '../../component/Header';
import Search from '../../component/Search';

import { KEY, insertItem, saveItem, getItem, useStorage } from '../../handle/handleStorage';
import { array_move, COLOR, unitIntertitialId } from '../../handle/Constant';
import HistoryItem from '../../component/HistoryItem';
import { setBookInfo } from '../../redux/action/book_info';

import RenderItemResult from '../../component/shared/TrendItem';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { Colors } from '../../utils/colors';
import { AllResult } from './Component/AllResult';
import { ArticleResult } from './Component/ArticleResult';
import { VideoResult } from './Component/VideoResult';
import { OnlineExamResult } from './Component/OnlineExamResult';
import { FilterModal } from './Component/FilterModal';
import { SeeMoreButton } from './Component/SeeMoreButton';
import { search_services } from '../../redux/services/search.service';
import AutoComplete from './AutoComplete';
import api, { useRequest } from '../../handle/api';
import { saveKeyword } from './services';

/**-------------interstitial ad----------------- */
import firebase from 'react-native-firebase';
const AdRequest = firebase.admob.AdRequest;
let advert;
let request;

//  ========== show list subject class====================
const SearchView = memo((props) => {

	const { navigation } = props;
	const tabRef = useRef();
	const [currentTab, setCurrentTab] = useState(0);
	const [showFilter, setShowFilter] = useState(false);
	const [filter, setFilter] = useState({ cls: get(props, 'userInfo.class', null) });
	const [searchText, setSearchText] = useState('');
	const [isShowAuto, setIsShowAuto] = useState(false);
	const [isBlank, setIsBlank] = useState(true);
	const [searchHistory, setSearchHistory] = useState([]);

	const [expanded, setExpanded] = useState(false);

	// tab content
	const [articleState, setArticleState] = useState({ article_total_page: 1000, article_data: [], loading: false });
	// const [articleCurrPage, setArticleCurrPage] = useState(0);

	const [videoState, setVideoState] = useState({ video_total_page: 1000, video_data: [], loading: false });
	// const [videoCurrPage, setVideoCurrPage] = useState(0);

	const [examState, setExamState] = useState({ exam_total_page: 1000, exam_data: [], loading: false });
	// const [examCurrPage, setExamCurrPage] = useState(0);

	// const [ hostKeySearch, loadingHost, errHost ] = useRequest(`search/top?class_id=${}`, )
	const [hotKeySearch, setHotKey] = useState([]);

	const _recordSearch = useCallback((text) => {
		console.log('==========asdfadvaefasd=====', { grade_id: filter.cls, q: text });
		saveKeyword({ grade_id: filter.cls, q: text })
			.catch(console.log)
	}, [filter])

	useEffect(() => {
		if (filter.cls && filter.cls != 13) {
			api.get(`search/top?class_id=${filter.cls}`)
				.then(({ data }) => {
					setHotKey(data);
				})
				.catch(err => {
					console.log('-err hot key', err)
				})
		}
	}, [filter])
	// 
	useEffect(() => {
		// get search history
		async function getSearchHistory() {
			const value = await getItem(KEY.history_search);
			if (typeof (value) === 'object') {
				setSearchHistory(value);
			}
		}
		getSearchHistory();

		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				if (isShowAuto) {
					setIsShowAuto(false);
				}
			},
		);
		return () => {
			keyboardDidHideListener.remove()
		}
	}, []);

	const learningTimes = useSelector(state => state.timeMachine.learning_times);
	useEffect(() => {
		console.log('---Search advert');
		advert = firebase.admob().interstitial(unitIntertitialId);
		request = new AdRequest();
		request.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');
		advert.loadAd(request.build());
	}, [learningTimes]);

	const clearSearchHistory = async () => {
		saveItem(KEY.history_search, null);
		setSearchHistory([]);
	}

	const showClearHistoryAlert = () => {
		Alert.alert(
			"Xoá lịch sử?",
			`Tất cả lịch sử tìm kiếm sẽ bị xoá`,
			[
				{ text: "Huỷ bỏ", onPress: () => { } },
				{ text: "Đồng ý", onPress: () => { clearSearchHistory() } },
			],
			{ cancelable: false }
		);
	}

	const handleSaveSearchingKey = (searchText) => {
		if (searchText) {
			_recordSearch(searchText)
			getItem(KEY.history_search)
				.then(val => {
					if (!isEmpty(val)) {
						const checkSave = val.indexOf(searchText);
						if (checkSave === -1) {
							if (val.length >= 20) {
								let temp = [...val];
								temp.pop();
								const newData = [
									searchText,
									...temp
								];
								setSearchHistory(newData);
								saveItem(KEY.history_search, newData);
							} else {
								setSearchHistory([searchText, ...val]);
								insertItem(KEY.history_search, searchText);
							}
						} else {
							const newData = array_move(val, checkSave, searchText);
							setSearchHistory(newData);
							saveItem(KEY.history_search, newData);
						}
					} else {
						setSearchHistory([searchText, ...val]);
						insertItem(KEY.history_search, searchText);
					}
				})
				.catch(e => {
					// console.log('err', e);
					setSearchHistory([searchText]);
					insertItem(KEY.history_search, searchText);
				});
		}
	}

	const _handleSetKeyword = (text) => {
		// setArticleState({ ...articleState, article_data: [] });
		// setArticleCurrPage(0);
		setSearchText(text);
	}

	const handleSearch = async (text, type = 'articles') => {
		const param = {
			type,
			page: 0
		}
		if (filter.cls && filter.cls != 13) param.grade_id = filter.cls;
		if (filter.currSub && filter.currSub.id) param.subject_id = filter.currSub.id;
		const search_result = await search_services.handleSearch(text, param);
		// console.log(search_result);
		if (type === 'articles') {
			// console.log('----article', search_result);
			// setArticleState({ ...articleState, article_data: search_result.data, article_total_page: Math.floor(search_result.info.total / 20) + 1 });
			setArticleState({ ...articleState, article_data: search_result.data });
		} else if (type === 'video') {
			// console.log('----video', search_result);
			setVideoState({ ...videoState, video_data: search_result.data });
		} else if (type === 'exam') {
			// console.log('----exam', search_result);
			setExamState({ ...examState, exam_data: search_result.data });
		}

	}

	// const handleLoadMore = async (type = 'articles') => {
	// 	if (articleCurrPage > 0 && articleCurrPage < articleState.article_total_page) {
	// 		const param = {
	// 			type,
	// 			page: articleCurrPage
	// 		}
	// 		if (filter.cls) param.grade_id = filter.cls;
	// 		if (filter.currSub) param.subject_id = filter.currSub;
	// 		const search_result = await search_services.handleSearch(searchText, param);
	// 		setArticleState({ ...articleState, article_data: [...articleState.article_data, ...search_result.data], loading: false });
	// 	}
	// }

	useEffect(() => {
		if (searchText.trim().length > 0) {
			handleSearch(searchText, 'articles');
			handleSearch(searchText, 'video');
			handleSearch(searchText, 'exam');
			// setArticleState({ ...articleState, article_data: [] });
			// setVideoState({ ...videoState, video_data: [] });
			// setExamState({ ...examState, exam_data: [] });
			// setArticleCurrPage(0);
			// setVideoCurrPage(0);
			// setExamCurrPage(0);
		} else {

		}
	}, [searchText, filter]);

	// useEffect(() => {
	// 	if (currentTab == 1) {
	// 		if (articleCurrPage > 0) {
	// 			handleLoadMore('articles');
	// 		}
	// 	} else if (currentTab == 2) {
	// 		if (articleCurrPage > 0) {
	// 			handleLoadMore('video');
	// 		}
	// 	} else if (currentTab == 3) {
	// 		if (articleCurrPage > 0) {
	// 			handleLoadMore('exam');
	// 		}
	// 	}
	// }, [articleCurrPage, videoCurrPage, examCurrPage]);

	// console.log('asdfasfasdfasf', filter)

	return (
		<View style={{ flex: 1, backgroundColor: Colors.white }}>
			<View style={{ height: null }}>

				<View style={{ alignItems: 'center', flexDirection: 'row', marginTop: helpers.isIOS ? (helpers.isIpX ? helpers.statusBarHeight : 10) : 2, paddingVertical: 15, paddingBottom: 10 }}>
					{/* <TouchableOpacity onPress={() => {
						navigation.goBack()
					}} style={{}}><Icon type="AntDesign" name="left" /></TouchableOpacity> */}
					<TouchableOpacity onPress={() => navigation.goBack()}
						style={[styles.backHeader]}>
						<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 26, color: '#F86087' }} />
					</TouchableOpacity>
					<View style={{ flex: 1 }}>
						<Search
							setIsBlank={setIsBlank}
							handleSaveSearchingKey={() => handleSaveSearchingKey(searchText)}
							showFilter={() => setShowFilter(true)}
							setIsShowAuto={setIsShowAuto}
							handleTypeKeyword={_handleSetKeyword}
							initKey={searchText}
							setSearchText={setSearchText}
							navigation={navigation} />
					</View>
				</View>
			</View>

			<SafeAreaView style={styles.container}>
				<View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ marginVertical: 6, }}>
						<TouchableOpacity onPress={() => {
							if (filter.cls != 13) {
								setFilter({ cls: '13', currSub: null })
							} else {
								setShowFilter(true);
							}
						}} style={[styles.headerTag, { marginHorizontal: 15 }]}>
							<Text style={styles.contentTag}>{filter.cls == 13 ? 'Tất cả các lớp' : `Lớp ${filter.cls}`}</Text>
							{filter.cls != 13 &&
								<View style={{ paddingLeft: 10, }}>
									<Icon type='AntDesign' name='close' style={{ fontSize: 12, color: 'white' }} />
								</View>
							}
						</TouchableOpacity>
						{filter.currSub && filter.currSub.title ?
							<TouchableOpacity onPress={() => setFilter({ ...filter, currSub: null })} style={styles.headerTag}>
								<Text style={styles.contentTag}>{filter.currSub.title}</Text>
								<View style={{ paddingLeft: 10, }}>
									<Icon type='AntDesign' name='close' style={{ fontSize: 12, color: 'white' }} />
								</View>
							</TouchableOpacity>
							:
							<TouchableOpacity onPress={() => setShowFilter(true)} style={styles.headerTag}>
								<Text style={styles.contentTag}>Tất cả các môn</Text>
							</TouchableOpacity>
						}
					</ScrollView>
				</View>
				{isBlank ?
					<View style={{ flex: 1, }}>
						<ScrollView style={{ flex: 1, paddingLeft: 10, paddingVertical: 10 }}>
							{searchHistory && searchHistory.length > 0 &&
								<View>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
										<Text style={styles.section}>LỊCH SỬ TÌM KIẾM</Text>
										<TouchableOpacity onPress={showClearHistoryAlert} style={{ paddingHorizontal: 15, paddingVertical: 7 }}>
											<Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: COLOR.MAIN, fontSize: 16 }}>Xoá</Text>
										</TouchableOpacity>
									</View>
									<View style={{ paddingVertical: 10, marginTop: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
										{
											(searchHistory ? searchHistory.slice(0, expanded ? 20 : 8) : []).map((item, index) => {
												return (<HistoryItem
													key={index + 'history_item'}
													title={item}
													onPressItem={() => {
														setIsBlank(false);
														setSearchText(item);
														handleSaveSearchingKey(item);
														_recordSearch(item)
													}}
												/>)
											})
										}
									</View>

									{searchHistory && searchHistory.length > 10 &&
										<SeeMoreButton status={expanded} onPress={() => {
											setExpanded(!expanded);
										}} style={{ marginTop: -10, marginBottom: 10 }} />
									}
								</View>
							}

							<Text style={styles.section}>HOT KEY</Text>
							<View style={{ paddingVertical: 10, marginTop: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
								{hotKeySearch[0] ?
									hotKeySearch.map(({ keyword = '' }, index) => {
										return (<HistoryItem
											key={index + 'hot_key'}
											title={keyword}
											onPressItem={() => {
												setIsBlank(false);
												setSearchText(keyword);
												_recordSearch(keyword)
											}}
										/>)
									}) : null
								}
							</View>
						</ScrollView>
					</View>
					:
					<View style={{ flex: 1 }}>
						<Tabs ref={tabRef} onChangeTab={(e) => setCurrentTab(e.i)} page={currentTab} tabContainerStyle={{ height: 33, borderTopWidth: 0, borderTopColor: 'white', elevation: 0 }} tabBarUnderlineStyle={{ height: 2, backgroundColor: Colors.pri }} tabBarActiveTextColor={Colors.pri} tabBarBackgroundColor={Colors.white} >
							<Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading="TẤT CẢ">
								<AllResult
									navigation={navigation}
									handleNavigate={setCurrentTab}
									articleState={get(articleState, 'article_data', [])}
									examState={get(examState, 'exam_data', [])}
									videoState={get(videoState, 'video_data', [])}
									advert={advert}
								/>
							</Tab>
							<Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading="TÀI LIỆU">
								<ArticleResult
									data={articleState}
									navigation={navigation}
									advert={advert}
								// handleLoadMore={() => {
								// 	setArticleState({ ...articleState, loading: true });
								// 	setArticleCurrPage(articleCurrPage + 1);
								// }}
								/>
							</Tab>
							<Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading="VIDEO">
								<VideoResult
									data={videoState}
									navigation={navigation}
								// handleLoadMore={() => {
								// 	setArticleState({ ...articleState, loading: true });
								// 	setArticleCurrPage(articleCurrPage + 1);
								// }}
								/>
							</Tab>
							<Tab textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle} tabStyle={styles.tabStyle} heading="THI ONLINE">
								<OnlineExamResult
									data={examState}
									navigation={navigation}
									advert={advert}
								// handleLoadMore={() => {
								// 	setArticleState({ ...articleState, loading: true });
								// 	setArticleCurrPage(articleCurrPage + 1);
								// }}
								/>
							</Tab>
						</Tabs>
						{isShowAuto &&
							<TouchableOpacity activeOpacity={1} onPress={() => {
								setIsShowAuto(false);
								Keyboard.dismiss();
							}} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLOR.black(.1) }}>
								<View>
									<AutoComplete
										setShowAutoText={setIsShowAuto}
										searchText={searchText}
										gradeId={filter.cls}
										setSearchText={setSearchText}
										handleSaveSearchingKey={handleSaveSearchingKey}
									/>
								</View>
							</TouchableOpacity>
						}
					</View>
				}
			</SafeAreaView>
			<FilterModal
				show={showFilter}
				onClose={setShowFilter}
				setFilter={setFilter}
				filter={filter}
			/>
		</View >
	)
});

const renderItemBook = (item, setBookInfo, navigation, index) => {
	// const {url, category_url} = item;
	// 	series_title: "Lớp 3",
	// topic_title: "Môn Toán",
	const {
		type,
		levels,
		title = '',
		topic_type = 1,
		series_title = null,
		topic_title = null,
		group_index = -1,
	} = item;
	let navigateResult = () => {
		Keyboard.dismiss();
		if (typeof levels == 'string') {

			if (type == 1) { //series hoac mon hoc
				const [series_url = '', topic_id = ''] = levels.split(',');
				if (topic_id && series_url) {
					navigation.navigate("Book", { series_url, topic_id });
				} else if (series_url) {
					navigation.navigate("Class", { series_url });
				}
			} else if (type == 2) { // trong muc luc
				const title = (item.series_title ? item.series_title : '') + '-' + (item.topic_title ? item.topic_title : '');
				setBookInfo({
					title,
					src_img_book: topic_type
				});
				const [series_url = '', topic_id = '', category_url = '', ...level] = levels.split(',');
				if (category_url && level) {
					navigation.navigate("Subject", { book: category_url, title, activeLevel: level });
				}
			} else if (type == 3) { // lesson
				const listLevels = levels.split(',');
				const article_url = listLevels[listLevels.length - 1];
				const [series_url = '', topic_id = '', category_url = ''] = listLevels;

				if (article_url) {
					navigation.navigate("Lesson", {
						key: article_url,
						bookName: category_url,
						series_url,
						topic_id,
						backTo: 'Tìm kiếm'
					});
				}
			}
		}
	};
	return (
		<RenderItemResult
			title={title}
			img={topic_type}
			showBorder={index % 6}
			onPressItem={navigateResult}
			series={series_title}
			subTitle={topic_title}
			subIcon={group_index}
		/>
		// <TouchableOpacity
		// 	style={styles.baseItem}
		// 	onPress={navigateResult}>
		// 	<View style={{ width: '90%' }}>
		// 		<Text style={styles.lesson} numberOfLines={2}>
		// 			{title}
		// 		</Text>
		// 	</View>
		// 	<View style={{ width: '10%', alignItems: 'center' }}>
		// 		<Icon name="md-arrow-dropright" />
		// 	</View>
		// </TouchableOpacity>
	)
}


const styles = StyleSheet.create({
	backHeader: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginLeft: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		shadowColor: "rgba(0,0,0,0.3)",
		shadowOffset: {
			width: 1,
			height: 2,
		},
		shadowOpacity: 0.37,
		shadowRadius: 10.49,

		elevation: 12,

	},
	tag: {
		paddingHorizontal: 12,
		borderWidth: 1,
		minWidth: 60,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: COLOR.MAIN,
		paddingVertical: 7,
		borderRadius: 12,
		marginRight: 10,
		marginBottom: 7
	},
	headerTag: {
		alignItems: 'center', flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 24, alignSelf: 'baseline', backgroundColor: '#ffa154', borderRadius: 30
	},
	contentTag: {
		color: COLOR.white(1), ...fontMaker({ weight: fontStyles.SemiBold })
	},
	notFound: {
		flex: 1,
		justifyContent: 'center',
		alignItems: "center",
	},
	container: { flex: 1 },
	list: {
		flex: 1,
		paddingHorizontal: 10,
		paddingBottom: 0,
	},
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	baseItem: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: "center",
		paddingVertical: 5,
		borderBottomColor: '#ddd',
		borderBottomWidth: 1,
		backgroundColor: '#fff',
	},
	lesson: {
		paddingLeft: 10,
	},
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
		color: Colors.pri
	},
	section: { ...fontMaker({ weight: 'Bold' }), fontSize: 18, marginVertical: 7, marginTop: 10 },

})
export default connect(
	({ userInfo }) => ({ userInfo }),
	(dispatch) => ({ setBookInfo: bookInfo => dispatch(setBookInfo(bookInfo)) })
)(SearchView);

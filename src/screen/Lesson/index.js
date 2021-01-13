import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
	View, SafeAreaView, Text, StyleSheet, TouchableOpacity,
	FlatList, ScrollView, Dimensions, Animated, Alert, BackHandler, Image
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { Card, Icon } from 'native-base';
import { isEmpty, get } from 'lodash';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import ImageZoom from 'react-native-image-pan-zoom';

import { useRequest } from '../../handle/api';
import ErrorView from './component/ErrorsView';
import { ExtendFeature, renderFooter } from './component/handleHtml';
import { saveHistory, saveArticle, saveOfflineArticle } from './component/handleSave';
import { scrollToTop, helpers } from '../../utils/helpers';
import BackHeader from '../Subject/component/BackHeader';
import { COLOR, unitIntertitialId } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { RenderVideosRelated } from './component/VideosList';
import { RenderExamRelated } from './component/ExamList';
import { FeedbackModal } from '../../component/shared/ReportModal';
import { RenderRow } from '../../component/shared/renderHtmlNew';
import { user_services } from '../../redux/services';
const per_page = 30;
const { width, height } = Dimensions.get("window")

const TAG = 'lesson';

/**-------------interstitial ad----------------- */
import firebase from 'react-native-firebase';
import { setLearningTimes } from '../../redux/action/user_info';
const AdRequest = firebase.admob.AdRequest;
let advert;
let request;

const Lesson = (props) => {
	const { navigation } = props;
	const dispatch = useDispatch();
	const articleId = navigation.getParam('articleId', '');
	const lesson_id = navigation.getParam('lesson_id', '');
	const htmlView = useRef(null);
	const [showImg, setShowImg] = useState(false);

	const [visible, setVisible] = useState(false);
	const [offVisible, setOffVisible] = useState(false);

	const showFullAds = navigation.getParam('showFullAds', true);

	const scrollY = new Animated.Value(0)
	const diffClamp = Animated.diffClamp(scrollY, 0, 100)
	const translateY = diffClamp.interpolate({
		inputRange: [-100, 0],
		outputRange: [-100, 0]
	})

	useEffect(() => {
		setTimeout(() => {
			scrollToTop(htmlView);
		}, 50)
	}, [articleId])

	// const [closeBar, handleCloseBar, handleOBar] = useHandleRightBar();
	const [dataLesson, isLoading, err, isNoNet] = useRequest(`/articles/${articleId}`, [articleId]);
	const {
		article_relation: topRelatedLesson = [],
	} = dataLesson || {};

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
			setTimeout(() => {
				setShowLazy(true)
			}, totalPage > 4 ? 2000 : 500)
		}
	}

	const [arrayHtmlContent, setDataHtml] = useState([]);
	const [isShowLazy, setShowLazy] = useState(false);

	const screenAds = useSelector(state => get(state, 'subjects.screens', null));
	const frequency = useSelector(state => get(state, 'subjects.frequency', 6));
	// console.log('-----asdasjdjasd-----', screenAds, frequency);

	// interstial ad
	const learningTimes = useSelector(state => state.timeMachine.learning_times);
	useEffect(() => {
		if (showFullAds) {
			if (screenAds && screenAds[TAG] == "1") {
				if (learningTimes % frequency === 0) {
					advert = firebase.admob().interstitial(unitIntertitialId);
					request = new AdRequest();
					request.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');

					advert.loadAd(request.build());

					advert.on('onAdLoaded', () => {
						// console.log('----------Advert ready to show.--------');
						// if (navigation.isFocused() && advert.isLoaded()) {
						if (advert.isLoaded()) {
							advert.show();
						} else {
							// console.log('---------interstitial fail---------', navigation.isFocused());
						}
					});
				}
			}
		}
	}, [learningTimes]);

	useEffect(() => {
		BackHandler.addEventListener(
			'hardwareBackPress',
			_handleBack
		);

		return () => {
			dispatch(setLearningTimes());
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

	useEffect(() => {

	}, []);

	useEffect(() => {
		if (dataLesson && dataLesson.data.parsed_content) {
			try {
				const data = JSON.parse(dataLesson.data.parsed_content);

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
	}, [dataLesson]);
	// const [saved, setSaved] = useState(false);
	const [savedOff, setSavedOff] = useState(false);
	useEffect(() => {
		// setTimeout(() => {
		// 	getItem(KEY.saved_article)
		// 		.then(val => {
		// 			if (val && val.find(i => i.articleId == articleId)) {
		// 				setSaved(true);
		// 			} else {
		// 				setSaved(false)
		// 			}
		// 		})
		// 	getItem(KEY.saved_offline_article)
		// 		.then(val => {
		// 			if (val && val.find(i => i.articleId == articleId)) {
		// 				setSavedOff(true);
		// 			} else {
		// 				setSavedOff(false)
		// 			}
		// 		})

		// }, 3000)
	}, [dataLesson]);

	const handleBookmark = async () => {
		const result = await user_services.bookmarkLesson({
			'bookmark_id': articleId,
			'bookmark_type': 'article',
		});
		if (typeof (result.status) === 'undefined') {
			setVisible(true);
		} else {
			setTimeout(() => {
				Alert.alert(
					"Oops!",
					`Đã có lỗi xảy ra khi bookmark bài học`,
					[
						{ text: "OK" }
					],
					{ cancelable: false }
				);
			}, 451);
		}
	}

	const _handleBookmarkArticle = useCallback(() => {
		if (dataLesson) {
			handleBookmark();
		}
	}, [dataLesson])

	const _handleSaveOffArticle = useCallback(() => {
		if (dataLesson) {
			saveOfflineArticle({
				title: get(dataLesson, 'data.title', ''),
				articleId,
				parsed_content: get(dataLesson, 'data.parsed_content', ''),
			})
				.then(_ => {
					// setSavedOff(true);
					setOffVisible(true);
				}).catch(err => {
					alert('Đã có lỗi xảy ra');
				})
		}
	}, [dataLesson])

	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<SafeAreaView style={{ flex: 1 }}>
				{(!err && !isNoNet) ? (
					<ScrollView
						ref={htmlView}
						contentContainerStyle={{ paddingTop: isEmpty(topRelatedLesson) || topRelatedLesson.length === 0 ? (helpers.isIOS ? 72 : 82) : (helpers.isIOS ? 2 : 12), paddingBottom: 10 }}
						scrollEventThrottle={16}
						onScroll={(e) => {
							scrollY.setValue(e.nativeEvent.contentOffset.y)
						}}
					>
						{/* related article */}
						{!isEmpty(topRelatedLesson) ? <FlatList
							style={[styles.flatlistRelated]}
							data={topRelatedLesson}
							renderItem={({ item }) => <RenderRelatedArticle
								item={item}
								onPress={() => navigation.navigate('Lesson', { articleId: get(item, 'id', '') })}
							/>}
							keyExtractor={(_, index) => index.toString() + 'related_lesson'}
						/> : null}
						{/* <BannerAd type={0} isShow={!isLoadMore} /> */}
						<View style={{ flex: 1, paddingHorizontal: 10 }}>
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
										setShowImg,
										// itemLesson: item, index 
									})
								}}
								keyExtractor={(item, index) => index.toString()}
							/>

							{/* render video and exam */}
							{
								isShowLazy ?
									<View style={{ marginBottom: 50 }}>
										<View style={{ alignItems: 'flex-end', marginBottom: 20, marginTop: 10 }}>
											<FeedbackModal data={{ type: 'article', id: articleId }} />
										</View>

										<ExtendFeature
											handleBookmark={_handleBookmarkArticle}
											handleSaveOffline={_handleSaveOffArticle}
										/>

										{
											!dataLesson || (isEmpty(dataLesson.videos) && isEmpty(dataLesson.lectures)) ? null : (
												<View style={{ borderTopColor: '#ddd', borderTopWidth: 2, marginTop: 20, paddingTop: 10 }}>
													<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingBottom: 10, alignItems: 'flex-end' }}>
														<Text style={{ fontSize: 20, ...fontMaker({ weight: fontStyles.Regular }) }}>Các Videos liên quan</Text>
													</View>

													{/* <ScrollView horizontal> */}
													{[...dataLesson.videos, ...dataLesson.lectures].map((item, index) => {
														return <RenderVideosRelated
															handleNavigate={props.navigation.navigate}
															item={item}
															index={index}
															setVisible={setVisible}
														/>
													})}
													{/* </ScrollView> */}
												</View>
											)
										}
										{
											dataLesson && !isEmpty(dataLesson.exams) ? (
												<View style={{ borderTopColor: '#ddd', borderTopWidth: 2, marginTop: 20, paddingTop: 10 }}>
													<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10, paddingBottom: 10, alignItems: 'flex-end' }}>
														<Text style={{ fontSize: 20, ...fontMaker({ weight: fontStyles.Regular }) }}>Các bài thi liên quan</Text>
													</View>
													{dataLesson.exams.map((item, index) => {
														return <RenderExamRelated
															handleNavigate={props.navigation.navigate}
															item={item}
															index={index}
															book={dataLesson.lesson}
															lessonId={get(dataLesson, 'lesson.id', '')}
														/>
													})}
												</View>
											) : null
										}
									</View> :
									null}
						</View>
					</ScrollView>
				) : (
						<ErrorView err={err} onPress={() => navigation.goBack()} isNoData={!articleId} isNoNet={isNoNet} />
					)
				}
				{
					lesson_id && isShowLazy ?
						<Animated.View
							style={{
								position: 'absolute', bottom: helpers.isIOS ? 40 : 30, right: 10,
								transform: [
									{ translateX: translateY }
								],
							}}
						>
							<Animatable.View delay={1200} animation="slideInRight" style={{ padding: 10, paddingHorizontal: 12, borderRadius: 66, backgroundColor: COLOR.MAIN, }}>
								<TouchableOpacity onPress={() => navigation.navigate('LessonOverview', { lesson_id: lesson_id })}>
									<Icon style={{ color: COLOR.white(1) }} name="menufold" type="AntDesign" />
								</TouchableOpacity>
							</Animatable.View>
						</Animated.View>
						:
						null
				}
			</SafeAreaView>
			<View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: null, backgroundColor: '#fff' }}>
				<BackHeader
					title={get(dataLesson, 'data.title', '')}
					iconName="close"
				// handleRightPress={_handleBookmarkArticle}
				// isSave={saved}
				// isSaveOff={savedOff}
				// handleSaveOffline={_handleSaveOffArticle}
				/>
			</View>
			<Snackbar
				visible={visible}
				duration={5000}
				wrapperStyle={{ padding: 0 }}
				style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, borderRadius: 0 }}
				onDismiss={() => setVisible(false)}
				action={{
					label: 'Xem ngay',
					onPress: () => {
						navigation.navigate('Bookmark');
					},
				}}>
				Đã thêm vào "Bookmarks"
            </Snackbar>
			<Snackbar
				visible={offVisible}
				duration={5000}
				wrapperStyle={{ padding: 0 }}
				style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, borderRadius: 0 }}
				onDismiss={() => setOffVisible(false)}
				action={{
					label: 'Xem ngay',
					onPress: () => {
						navigation.navigate('SavedArticle');
					},
				}}>
				Đã thêm vào "Bài học đã lưu"
            </Snackbar>
			{!!showImg ?
				<TouchableOpacity style={{ flex: 1, position: 'absolute', width, height }} >
					<ImageZoom
						onClick={() => setShowImg(false)}
						cropWidth={width}
						cropHeight={height}
						imageWidth={width}
						imageHeight={get(showImg, 'size.height', '')}
						style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
						pinchToZoom={false}
					>
						<Image
							resizeMode="contain"
							style={{ flex: 1, height: undefined, width: undefined }}
							source={{
								uri: get(showImg, 'uri', ''),
								// priority: FastImage.priority.normal,
							}}
						// resizeMode={FastImage.resizeMode.contain}
						/>
						{/* <Image style={{ width: 200, height: 200 }}
								source={{ uri: get(showImg, 'uri', '') }}
								 /> */}
					</ImageZoom>
				</TouchableOpacity>
				: null}
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
			<View style={{ flex: 1 }}>
				<Text numberOfLines={2} style={[styles.relatedItem, { color: '#1C1C20' }]} >{`${item.title}`}</Text>
			</View>
			<Icon name='ios-arrow-forward' style={{ color: COLOR.logo, fontSize: 20 }} />
		</TouchableOpacity>
	);
};

export default connect(
	(state) => ({ bookInfo: state.bookInfo }),
	null
)(React.memo(Lesson));


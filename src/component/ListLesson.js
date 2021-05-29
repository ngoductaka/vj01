import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
	Dimensions, StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity,
	ScrollView,
	Pressable
} from 'react-native';
import { Icon } from "native-base";
import {
	Placeholder,
	PlaceholderMedia,
	PlaceholderLine,
	Fade,
} from "rn-placeholder";
import { isEmpty, get } from 'lodash';
import * as Animatable from 'react-native-animatable';

import { useRequest, Loading } from '../handle/api';
import { fontSize, COLOR, blackColor, unitIntertitialId } from '../handle/Constant';
import LinearGradient from 'react-native-linear-gradient';
import { fontMaker, fontStyles } from '../utils/fonts';
import { LargeVideo } from '../screen/Lesson/component/VideosList';
import { RenderExamRelated, RenderArticlRelated } from './shared/ItemDocument';
const { height, width } = Dimensions.get('window');

/**-------------interstitial ad----------------- */
import firebase from 'react-native-firebase';
import { useSelector } from 'react-redux';
import { setArticleLearningTimes } from '../redux/action/user_info';
import { ViewWithBanner } from '../utils/facebookAds';
const AdRequest = firebase.admob.AdRequest;
let advert;
let request;

// http://103.28.37.214:8080/categories-url/soan-van-7_index
// main function 
const ListLesson = (props) => {

	const [showContent, setShowContent] = useState(false);
	const [itemExpanded, setItemExpanded] = useState(null);

	const {
		subjectID = '',
		bookId = "",
		navigation,
		isBar = false,
		closeBar = () => { },
		activeLevel = [],
		subject,
		setVisible
	} = props;
	const [level1 = null, ...activeDetail] = activeLevel;
	let endPoint = ``;
	if (bookId) endPoint = `/books/${bookId}`;
	if (subjectID) endPoint = `/subjects/${subjectID}/first-book`;


	const [allBookData, loading, err] = useRequest(endPoint, [endPoint]);
	const [hostLesson, hostLoading, errHost] = useRequest(`/subjects/${subjectID || subject}/parts-data`, [subjectID || subject])

	let bookData = {};
	if (allBookData) bookData = allBookData.data;

	// interstial ad
	const learningTimes = useSelector(state => state.timeMachine.learning_times);
	const frequency = useSelector(state => get(state, 'subjects.frequency', 6));
	useEffect(() => {
		if (learningTimes % frequency === 0) {
			// console.log('kajskjadkasjdksj');
			advert = firebase.admob().interstitial(unitIntertitialId);
			request = new AdRequest();
			request.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');
			advert.loadAd(request.build());
		}
	}, [learningTimes]);

	useEffect(() => {
		setTimeout(() => {
			setShowContent(true);
		}, 5000);
	}, []);

	useEffect(() => {
		setTimeout(() => {
			// setItemExpanded(0);
		}, 1500);
		// if (subjectID) {
		// 	if (level1 && bookData.children) {
		// 		const indexActive = bookData.children.findIndex(i => i._id == level1);
		// 		if (indexActive !== undefined) setItemExpanded(indexActive)
		// 	} else {
		// 		setItemExpanded(null);
		// 	}
		// }
	}, [subjectID, bookId]);

	// 
	const _handleSelectLesson = (item, chapterData) => {
		// navigation.navigate("Lesson", { key: item.url, subjectID, title: item.title });
		navigation.navigate("LessonOverview", {
			// key: item.url, subjectID, title: item.title
			lessonId: item.id,
			advert, chapterData
		});
		if (isBar) closeBar();
	}

	const propsItem = { isBar, itemExpanded, setItemExpanded, _handleSelect: _handleSelectLesson, activeDetail }

	const handleShowToast = () => {
		setTimeout(() => {
			setVisible(true);
		}, 501)
	};
	return (
		<SafeAreaView style={styles.base}>

			<Loading isLoading={loading} err={err} com={LoadingCom}>
				{isEmpty(bookData) || isEmpty(bookData.children) ?
					<Pressable onPress={() => navigation.goBack()}>
						<Text style={{ textAlign: 'center', fontSize: 20 }}>Tài liệu lỗi vui lòng thử lại</Text>
					</Pressable>
					:
					<FlatList
						data={bookData.children}
						style={{}}
						keyExtractor={(item) => `${item.id}_header`}
						extraData={itemExpanded}
						renderItem={({ item: lessonItem, index: indexLesson }) =>
							_renderListLesson({ lessonItem, indexLesson, ...propsItem })}
					/>}
			</Loading>
			{/* {} */}

			{showContent &&
				<View>
					{
						hostLesson && !isEmpty(hostLesson.exams) ?
							<View>
								<View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 35, marginBottom: 15, }}>
									<Text style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Đang thi nhiều </Text>
									<TouchableOpacity onPress={() => navigation.navigate('TestStack')}>
										<Text style={{ ...fontMaker({ weight: fontStyles.Regular }), fontSize: 16, color: COLOR.MAIN }}>Xem thêm</Text>
									</TouchableOpacity>
								</View>
								{
									// RenderExamRelated
									get(hostLesson, 'exams').map(item => {
										return <RenderExamRelated
											title={get(item, 'title', '')}
											time={get(item, 'duration', 0)}
											totalQues={get(item, 'questions_count', 0)}
											onPress={() => {
												navigation.navigate('OverviewTest', {
													idExam: get(item, 'id', ''),
													title: get(item, 'title', ''),
													// icon: get(book, 'icon_id'),
													// subject: get(book, 'title'),
													// lessonId: lessonId,
													time: get(item, 'duration', 0),
													count: get(item, 'questions_count', 0),
													advert
												})
											}}
										/>
									})}
							</View> : null
					}

					<Text style={{ fontSize: 22, marginTop: 35, marginBottom: 15, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Gợi ý cho bạn </Text>
					{
						isEmpty(hostLesson) ? null :
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								{hostLesson.videos.map(item => {
									return <VideoContinue
										navigate={navigation.navigate}
										setVisible={handleShowToast}
										videos={item}
										style={{ marginRight: 20, width: width * 4 / 5 }}
									/>
								})}
							</ScrollView>

					}
					<View>
						<ViewWithBanner type="LESSON_TREE" />
					</View>
					{
						hostLesson && !isEmpty(hostLesson.articles) ?
							get(hostLesson, 'articles', []).map(item => {
								const { title = '', id: articleId = '', view_count = 0, content_type, lesson_id } = item || {};
								return (
									// RenderArticlRelated
									<RenderArticlRelated
										title={title}
										viewCount={view_count}
										contentType={content_type}
										onPress={() => navigation.navigate("Lesson", { articleId, lesson_id, advert })}
									/>
								)
							})
							: null
					}

				</View>
			}

		</SafeAreaView>
	)
};
//  sub function ===============================================================================
const _renderListLesson = (props) => {
	const { lessonItem, isBar, _handleSelect, indexLesson, itemExpanded, activeDetail } = props;
	return (
		<Animatable.View animation="fadeIn" delay={500 * indexLesson}>
			{_renderTitleLesson({ ...props })}
			{indexLesson == itemExpanded && <RenderDetailLesson lessonItem={lessonItem} isBar={isBar} _handleSelect={_handleSelect} activeDetail={activeDetail} />}
		</Animatable.View>
	)
}

const _renderTitleLesson = (props) => {
	const { lessonItem, isBar = false, setItemExpanded, indexLesson, itemExpanded, _handleSelect } = props;
	const expanded = indexLesson == itemExpanded;
	return (
		<TouchableOpacity
			style={stylesMainItem.wrapper}
			activeOpacity={0.95}
			onPress={() => {
				setItemExpanded(expanded ? null : indexLesson);
				if (!lessonItem.children[0]) {
					_handleSelect(lessonItem);
				}
			}}
		>
			<View style={stylesMainItem.numberContent}>
				<Text style={[stylesMainItem.textContent, { fontSize: isBar ? 18 : 20 }]}>{String(indexLesson + 1)}</Text>
			</View>
			<LinearGradient
				colors={expanded ? ['#F07D22', "#febf6f"] : ['#fefefe', '#fefefe']}
				start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
				style={[stylesMainItem.contentView, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
			>
				<View style={[stylesMainItem.contentView, { marginLeft: 15, flex: 1 }]}>
					<Text numberOfLines={2} style={[stylesMainItem.content, { color: expanded ? '#fff' : '#767676' }]}>
						{lessonItem.title}
					</Text>
				</View>
				{/* <View style={{ backgroundColor: '#Fa9f3f', justifyContent: 'center', alignItems: 'center' }}> */}
				<Icon style={[stylesMainItem.iconLeft, { color: expanded ? '#fff' : '#767676' }]} name={expanded ? "remove-circle" : "add-circle"} />
				{/* </View> */}
			</LinearGradient>
		</TouchableOpacity>
	)
}

const RenderDetailLesson = ({ lessonItem, isBar, _handleSelect, activeDetail }) => {
	const [expandedDetail, setExpandedDetail] = useState(null);
	const flatRef = useRef(null);

	useEffect(() => {
		if (activeDetail && lessonItem && lessonItem.children) {
			if (lessonItem.children && lessonItem.children[0]) {
				// setTimeout(() => {
				// setExpandedDetail(0)
				// }, 1500)
			}

		}
	}, [activeDetail, lessonItem]);
	if (!lessonItem) return null;

	return (
		<FlatList
			ref={flatRef}
			data={lessonItem.children}
			keyExtractor={(item, index) => `${item.id}-${index}_detail`}
			extraData={expandedDetail}
			renderItem={({ item: itemDetailLesson, index }) => {
				return _renderItemDetailListLesson({
					itemDetailLesson, isBar, _handleSelect,
					expandedDetail, setExpandedDetail, index, activeDetail,
					chapterData: get(lessonItem, 'chapters', [])
				})
			}}
		/>
	)
}

const _renderItemDetailListLesson = ({ activeDetail, itemDetailLesson, isBar = false, _handleSelect, expandedDetail, setExpandedDetail, index, chapterData }) => {
	if (isEmpty(itemDetailLesson.children)) { // return end ==================
		return (
			<TouchableOpacity style={styles.contentMenu} onPress={() => _handleSelect(itemDetailLesson, chapterData)} >
				<View style={styles.textLessonWapper}>
					<Text numberOfLines={2} style={styles.detailLesson} >{itemDetailLesson.title} </Text>
				</View>
				<Icon type="AntDesign" name="right" style={styles.iconLesson} />
			</TouchableOpacity>
		)
	} else {
		let expandedItem = index == expandedDetail;
		if (activeDetail && itemDetailLesson && itemDetailLesson.children) {
			const activeIndex = itemDetailLesson.children.findIndex(i => activeDetail.includes(i._id));
			if (activeIndex !== -1) {
				setExpandedDetail(activeIndex)
				expandedItem = true;
			}
		}
		return (
			<View style={[styles.viewSub]}>
				<TouchableOpacity
					style={[styles.subMenu]}
					onPress={() => setExpandedDetail(expandedItem ? null : index)}
				>
					<View style={styles.textContent}>
						<Text style={styles.textLeftIcon} >- </Text>
						<Text style={[styles.textContentCenter, { color: expandedItem ? '#e06D12' : '#555' }]} numberOfLines={2}>{itemDetailLesson.title}</Text>
					</View>
					<Icon
						style={[styles.icon, styles.mgIcon, { color: expandedItem ? '#F07D22' : '#555' }]}
						// name={expandedItem ? "md-arrow-dropup" : "md-arrow-dropdown"} 
						name={expandedItem ? "remove-circle" : "add-circle"}
					/>
				</TouchableOpacity>
				{expandedItem ?
					<View style={styles.basePadding}>
						<RenderDetailLesson lessonItem={itemDetailLesson} isBar={isBar} _handleSelect={_handleSelect} activeDetail={activeDetail} />
					</View> :
					null
				}
			</View>
		);
	}
}


const styles = StyleSheet.create({
	base: {
		flex: 1,
		marginTop: 40
	},
	viewSub: {
		borderLeftColor: '#F07D22',
		borderLeftWidth: 1,
	},
	basePadding: {
		marginLeft: 10
	},
	textLessonWapper: { flex: 1, paddingRight: 5 },
	contentMenu: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: "center",
		padding: 10,
		// backgroundColor: '#FCD6BF',
		marginTop: 10,
		borderRadius: 10,
	},
	iconLesson: { color: COLOR.MAIN, fontSize: 14 },
	mgIcon: {
		marginLeft: 8, marginRight: 5,
		fontSize: 25, marginRight: 10,
	},
	subMenu: {
		borderColor: '#ddd',
		borderBottomWidth: 1,
		paddingVertical: 14,
		flexDirection: 'row',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: "center"
	},
	imgTitle: { height: "100%", width: '100%' },
	header: { fontWeight: "600" },
	headerList: {
		flexDirection: "row",
		padding: 14,
		marginTop: 5,
		justifyContent: "space-between",
		alignItems: "center",
		borderLeftColor: '#F07D22',
		borderLeftWidth: 2,
		borderBottomColor: '#ddd',
		borderBottomWidth: 2,
		backgroundColor: "#FFF"
	},
	icon: { fontSize: 18 },
	detailLesson: {
		color: blackColor(0.6),
		textTransform: 'capitalize',
		overflow: 'hidden',
		lineHeight: 20,
		fontSize: 14,
		...fontMaker({ weight: 'Regular' })
	},
	wrapperItem: {
		borderRadius: 10,
		borderWidth: 5,
		borderColor: '#fef070',
		marginTop: 10,

	},
	textLeftIcon: { fontSize: 28, color: '#F07D22', marginLeft: -1 },
	textContentCenter: { fontSize: 16, flex: 1, flexWrap: 'wrap', fontWeight: '600' },
	textContent: { display: 'flex', flexDirection: 'row', overflow: 'hidden', justifyContent: 'flex-start', alignItems: "center", width: '90%' }

});


const stylesMainItem = StyleSheet.create({
	wrapper: {
		marginTop: 15,
		width: '100%',
		flexDirection: 'row',
		borderRadius: 10,
		overflow: 'hidden',
		borderColor: COLOR.MAIN,
		borderWidth: 0.4,
	},
	numberContent: {
		backgroundColor: '#F07D22',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 15, paddingRight: 30, width: 70,
	},
	textContent: {
		color: '#fff', textAlign: 'center', flex: 1, ...fontMaker({ weight: 'SemiBold' })
	},
	contentView: {
		justifyContent: 'center',
		flex: 1,
		marginLeft: -15,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		overflow: 'hidden'
	},
	content: {
		fontSize: fontSize.h3,
		textTransform: 'uppercase',
		overflow: 'hidden',
		...fontMaker({ weight: 'Bold' })
	},
	iconLeft: {
		paddingHorizontal: 5
	}
});
export default ListLesson;

const LoadingCom = () => {
	return (
		<View style={{ flex: 1, padding: 20, width: width }}>
			{
				new Array(Math.floor(height / 125)).fill(null).map((i, index) => {
					return (
						<Placeholder
							style={{ marginBottom: 30 }}
							key={String(index)}
							Animation={Fade}
							Left={PlaceholderMedia}
						>
							<PlaceholderLine width={80} />
							<PlaceholderLine />
							<PlaceholderLine width={30} />
						</Placeholder>
					)
				})
			}

		</View>
	)
}


const VideoContinue = ({ navigate, setVisible = () => { }, videos = {}, style = {}, widthImg = width * 3 / 4 }) => {
	const propsVideo = {
		isLecture: !!videos.preview_img,
		setVisible,
		widthImg,
		item: {
			imgLecture: get(videos, 'preview_img', ''),
			lectureId: get(videos, 'id', ''),
			videoUrl: get(videos, 'url', 'https://www.youtube.com/watch?v=L3NKVP92WPM'),
			duration: get(videos, 'length', 0),
			title: get(videos, 'title', ''),
			viewCount: get(videos, 'view_count', '')
		},
		_handlePress: () => {
			navigate('CoursePlayer', { lectureId: get(videos, 'id', ''), view_count: get(videos, 'view_count', '') })
		},
	};
	return (
		<LargeVideo {...propsVideo} style={style} />
	)
}
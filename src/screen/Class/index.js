import React, { memo, useState, useEffect, useRef, useCallback, useSelector } from 'react';
import {
	View, BackHandler, FlatList, SafeAreaView, ScrollView, Text, StyleSheet, Linking,
	Platform, Dimensions, TouchableOpacity, Image, StatusBar, Alert, ActivityIndicator
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import Share from 'react-native-share';
import { get, isEmpty } from 'lodash';
import * as Animatable from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
import SimpleToast from 'react-native-simple-toast';
import { Snackbar } from 'react-native-paper';
import firebase from 'react-native-firebase';
import moment from 'moment';

import MenuItem, { NUMBER_COLUMS } from '../../component/menuItem';
import api, { Loading, useRequest, handleTimeInfo } from '../../handle/api';
import { Icon, Card } from 'native-base';
import { setRatingStatus, setUserInfo, setDeviceInfo } from '../../redux/action/user_info';
import { RatingModal } from '../../component/RatingModal';
import { images } from '../../utils/images';
import { setBookInfo } from '../../redux/action/book_info';
import { fontSize, blackColor, COLOR, avatarIndex, HOT_SUBJECT_CLASS, GAME_CENTERS, LIST_UTILITIES } from '../../handle/Constant';
import { helpers } from '../../utils/helpers';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { GradientText } from '../../component/shared/GradientText';
import LinearGradient from 'react-native-linear-gradient';
import ViewContainer from '../../component/shared/ViewContainer';
import { LargeVideo } from '../Lesson/component/VideosList';
import { makeOptionShare } from '../../constant';
import { actGetAllScreensForAds, actGetListSubjects } from '../../redux/action/class';
import {
	RenderArticlRelated,
	RenderExamRelated,
} from '../../component/shared/ItemDocument';
import { LoadingCom } from './component/LoadingCom';
import { saveItem, KEY, getItem } from '../../handle/handleStorage';
import { common_services, user_services } from '../../redux/services';
import { _createNotificationListeners } from '../../utils/notificationHandler';
import { localNotificationService } from '../../utils/notificationServices';
import { GameItem } from '../GameCenter';
import { UtilitiesItem } from '../Utilities';

const { width } = Dimensions.get('window');

const TAG = 'lesson';

//  ========== show list subject class====================
const Class = memo((props) => {
	const { navigation } = props;

	const [visible, setVisible] = useState(false);
	const [showRating, setShowRating] = useState(false);
	const [noti, setNoti] = useState(0);
	const [hotSubIdx, setHotSubIdx] = useState('');

	const [hostLesson, hostLoading, errHost] = useRequest(`/subjects/${hotSubIdx}/parts-data`, [hotSubIdx]);
	// console.log('---as-a-s-as-a-sa-s', hostLesson);

	useEffect(() => {
		if (get(HOT_SUBJECT_CLASS, `[${props.userInfo.class}]['0'].id`, ''))
			setHotSubIdx(HOT_SUBJECT_CLASS[props.userInfo.class]['0'].id);
	}, [props.userInfo.class]);

	const classRef = useRef(null);

	const dispatch = useDispatch();

	const checkLowDevice = async () => {
		try {
			if (helpers.isIOS) {
				const deviceId = await DeviceInfo.getDeviceId();
				const iosNumber = parseInt(deviceId.slice(6));
				dispatch(setDeviceInfo(iosNumber < 9));
			} else {
				const apiLevel = await DeviceInfo.getApiLevel();
				dispatch(setDeviceInfo(apiLevel <= 25));
			}
		} catch (error) {
			dispatch(setDeviceInfo(true));
		}
	}

	const scrollToTop = useCallback(() => {
		if (classRef && classRef.current) {
			classRef.current.scrollTo({ y: 0 })
		}
	}, [classRef])

	useEffect(() => {
		setTimeout(() => {
			if (classRef && classRef.current) {
				props.setUserInfo({
					classScrollToTop: scrollToTop
				});
			}
		}, 2000)
	}, [classRef])

	let currentCount = 0;

	const _handleBackButtonPressAndroid = () => {
		if (!props.navigation.isFocused()) {
			return false;
		}
		if (currentCount < 1) {
			currentCount += 1;
			SimpleToast.show("Nhấn lần nữa để thoát", 3);
		} else {
			BackHandler.exitApp();
		}
		setTimeout(() => {
			currentCount = 0;
		}, 2000);

		return true;
	}

	const _callback = () => {
		const { setRatingStatus, time, rated } = props;
		if (rated != 2) {
			if (Date.now() - time > 5 * 60 * 1000) { //5 * 60 * 1000
				setRatingStatus(2);
				setTimeout(() => {
					setShowRating(true);
				}, 500);
			}
		}
	}

	// useEffect(() => {
	// 	// if (props.rated === 0) {
	// 	handleTimeInfo();
	// 	console.log('asajhsajhskjahskjas');
	// 	// }
	// }, [props.rated]);

	const [dataAllBook, isLoading, err] = useRequest(`/subjects?grade_id=${props.userInfo.class}`, [props.userInfo.class]);

	const _handleNavigation = (dataBook) => {
		const {
			icon_id,
			id,
			title,
			books_count = null
		} = dataBook || {};
		// {"books_count": 1, "grade_id": 9, "icon_id": 2, "id": 65, "title": "Ngữ văn"}
		if (books_count == 1) {
			props.navigation.navigate('Subject', {
				icon_id,
				id,
				title,
				_callback
			});
		} else
			props.navigation.navigate('Book', {
				icon_id,
				subjectID: id,
				title,
				_callback
			});
	}

	const getNumberOfUnseenNoti = async () => {
		try {
			const result = await api.get('/notification/unseen');
			console.log('getNumberOfUnseenNoti', result);
			setNoti(get(result, 'count_unseen_notification', 0));
		} catch (error) {
			console.log(error);
			setNoti(0);
		}

	}

	const _goToStore = () => {
		saveItem(KEY.rating_vietjack_app, 2);
		setShowRating(false);
		Linking.openURL(Platform.OS === 'ios' ?
			'https://apps.apple.com/us/app/vietjack/id1490262941?ls=1'
			:
			'https://play.google.com/store/apps/details?id=com.jsmile.android.vietjack');
	}

	//1
	const _checkPermission = async () => {
		firebase.messaging().hasPermission()
			.then(enabled => {
				if (enabled) {
					_getToken();
				} else {
					_requestPermission();
				}
			});
	}

	//2
	const _requestPermission = async () => {
		firebase.messaging().requestPermission()
			.then(() => {
				_getToken();
			})
			.catch(error => {
				// console.log('permission rejected');
			});
	}

	//3
	const _getToken = async () => {
		const fcmToken = await firebase.messaging().getToken();
		if (fcmToken) {
			// console.log('fcmToken22222-------', fcmToken);
			const saved_firebase_token = await getItem(KEY.firebase_token);
			if (saved_firebase_token != fcmToken) {
				saveItem(KEY.firebase_token, fcmToken);
				try {
					const result = await common_services.updateDeviceToken(fcmToken, saved_firebase_token);
					console.log('result-------', result);
				} catch (error) {
					console.log(error);
				}
			}
		}
	}

	const _createAndroidNotificationChannel = () => {
		const channel = new firebase.notifications.Android.Channel('vietjack-jsmile-channel-stg-test', 'Test Channel', firebase.notifications.Android.Importance.Max)
			.setDescription('My apps test channel');

		firebase.notifications().android.createChannel(channel);
	}

	const [loadingNoti, setLoadNoti] = useState(false)

	const _checkFirebase = async () => {
		try {
			setLoadNoti(true)
			await _checkPermission();
			await _createAndroidNotificationChannel();
			if (Platform.OS === 'ios') {
				// PushNotification.configure({
				//   onNotification: handleNotificationClick,
				// });
				await _createNotificationListeners();
			} else {
				await _createNotificationListeners();
				localNotificationService.configure({
					onNotification: (notification) => {
						console.log('onNotification123', notification);
					},
					onAction: (notification) => {
						console.log("ACTION123:", notification.action);
						console.log("NOTIFICATION:1234", notification);
					}
				});
			}

			setLoadNoti(false)
		} catch (err) {
			setLoadNoti(false)

		}

		// localNotificationService.configure();
	}


	useEffect(() => {

		async function getListScreenForAds() {
			const data = await user_services.getListScreensForAds();
			console.log('--------', data);
			dispatch(actGetAllScreensForAds(data.data));
		}

		getListScreenForAds();

		async function postActiveDaily() {
			const date = moment().format('YYYY-MM-DD');
			const result = await common_services.postActiveDaily({
				date
			});
			console.log('--postActiveDaily--', result);
		}

		setTimeout(() => {
			// checkLowDevice();
			postActiveDaily();
			getNumberOfUnseenNoti();
		}, 1500);
		handleTimeInfo();
		// setTimeout(() => {
		_checkFirebase();
		// }, 5000);
		BackHandler.addEventListener(
			'hardwareBackPress',
			_handleBackButtonPressAndroid
		);

		setTimeout(() => {
			api.post('users/sync', {})
		}, 3000)

		return () => {
			BackHandler.removeEventListener(
				'hardwareBackPress',
				_handleBackButtonPressAndroid
			);
		}
	}, []);

	useEffect(() => {
		if (!props.userInfo.class) {
			props.navigation.navigate('AccountStack');
		}

		if (dataAllBook && dataAllBook.data) {
			dispatch(actGetListSubjects(dataAllBook.data));
		}
	}, [props.userInfo.class, dataAllBook]);

	const [dataContinue] = useRequest('/lessons/continue/learn', [1]);
	const [dataRecommend] = useRequest('/lessons/recommend/learn', [1]);

	return (
		<View style={{ flex: 1 }}>
			<ViewContainer
				LoadingCom={LoadingCom}
				isLoading={isLoading}
				err={err}
				isHome={true}
				percent={'100%'}
				headerView={HeaderView(props, noti, getNumberOfUnseenNoti, get(props.userInfo, 'user.avatar_id', 0))}
				contentStyle={{ padding: 0 }}
			>
				<View style={{ flex: 1, padding: 10 }}>
					<FlatList
						style={{ marginVertical: 20, marginTop: 25 }}
						data={get(dataAllBook, 'data', [])}
						renderItem={({ item, index }) => _renderMenuItem(item, index, _handleNavigation)}
						numColumns={NUMBER_COLUMS}
						keyExtractor={(_, index) => 'book_item' + index.toString()}
					/>
					{/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, }}>
						<Text style={{ fontSize: 18, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Kho trò chơi</Text>
						<TouchableOpacity onPress={() => navigation.navigate('GameCenter')} style={{}}>
							<Text style={{ fontSize: 14, ...fontMaker({ weight: fontStyles.Regular }), textDecorationColor: COLOR.MAIN, color: COLOR.MAIN }}>Xem tất cả</Text>
						</TouchableOpacity>
					</View> */}
					<View style={{ marginBottom: 30 }}>
						{/* <FlatList
							style={{}}
							data={GAME_CENTERS.slice(0, 3)}
							numColumns={3}
							renderItem={({ item, index }) => {
								return (
									<GameItem src={item.src} name={item.name} slogan={item.slogan} navigation={navigation} route={item.route} />
								);
							}}
							keyExtractor={(item, index) => index + 'game_item'}
						/> */}
						{/* utiliti */}
						<View style={{
							flexDirection: 'row', alignItems: 'center',
							justifyContent: 'space-between', marginVertical: 10,

						}}>
							<Text style={{ fontSize: 18, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Kho Tiện ích</Text>
							{/* <TouchableOpacity
								onPress={() => navigation.navigate('GameCenter')}
								style={{}}>
								<Text style={{ fontSize: 14, ...fontMaker({ weight: fontStyles.Regular }), textDecorationColor: COLOR.MAIN, color: COLOR.MAIN }}>Xem tất cả</Text>
							</TouchableOpacity> */}
						</View>
						<FlatList
							style={{}}
							data={LIST_UTILITIES.slice(0, 3)}
							numColumns={3}
							renderItem={({ item, index }) => {
								return (
									<UtilitiesItem src={item.src} name={item.name} slogan={item.slogan} navigation={navigation} route={item.route} />
								);
							}}
							keyExtractor={(item, index) => index + 'game_item'}
						/>

						{/* hot exam */}
						<HotExam classId={props.userInfo.class} loading={hostLoading} hotSubIdx={hotSubIdx} setHotSubIdx={setHotSubIdx} hotExamData={get(hostLesson, 'exams', [])} navigation={navigation} />
						{/* continue learning */}
						<ContinueLearn setVisible={setVisible} dataContinue={dataContinue} navigate={navigation.navigate} />
						{/* fanpage */}
						{/* <FanpageBanner /> */}
						{/* resume learning */}
						<RecommendCoure dataRecommend={dataRecommend} dataContinue={dataContinue} setVisible={setVisible} navigate={navigation.navigate} />

						{/* share app */}
						<Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18, marginTop: 20, marginBottom: 5, }}>Chia sẻ ứng dụng</Text>
						<RecommendShareCard
							onPress={() => Share.open(makeOptionShare())}
						/>
					</View>
				</View>
			</ViewContainer>
			<RatingModal
				show={showRating}
				onCancel={() => {
					setShowRating(false);

				}}
				onConfirm={_goToStore}
			/>
			<Snackbar
				visible={visible}
				duration={5000}
				wrapperStyle={{ padding: 0 }}
				style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, borderRadius: 0 }}
				onDismiss={() => setVisible(false)}
				action={{
					label: 'Xem ngay',
					onPress: () => {
						props.navigation.navigate('Bookmark');
					},
				}}>
				Đã thêm vào "Bookmarks"
            </Snackbar>
			{
				loadingNoti ?
					<View style={{
						position: 'absolute', top: '50%', left: width / 2 - 18
					}}>
						< ActivityIndicator size="large" color={COLOR.MAIN} />
					</View> : null
			}
		</View >
	)
})

const _renderMenuItem = (menuItem, index, handleNavigation) => {
	return (
		<MenuItem
			title={menuItem.title}
			icon={menuItem.icon_id}
			index={index}
			container_width={(Dimensions.get('window').width - 50) / NUMBER_COLUMS}
			style={{ marginRight: 10 }}
			onPressItem={() => handleNavigation(menuItem)}
		/>
	)
}

const styles = StyleSheet.create({
	appleButton: {
		width: '100%',
		paddingVertical: 20,
		marginTop: 15
	},
	container: {
		flex: 1,
	},
	searchHeader: {
		width: 40, height: 40,
		borderRadius: 20,
		justifyContent: 'center', alignItems: 'center',
		backgroundColor: 'white',
	},
	shadow: {
		backgroundColor: '#FFFFFF',
		shadowColor: 'rgba(0, 0, 0, 0.2)',
		shadowOpacity: 0.5,
		elevation: 4,
		shadowRadius: 10,
		shadowOffset: { width: 12, height: 3 },
	},
	btn: { marginTop: 20, flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 20, borderRadius: 25, },
})

const mapDispatchToProps = dispatch => {
	return {
		setRatingStatus: (status) => dispatch(setRatingStatus(status)),
		setUserInfo: userInfo => dispatch(setUserInfo(userInfo)),
		setBookInfo: bookInfo => dispatch(setBookInfo(bookInfo)),
	};
};

export default connect(
	(state) => ({
		userInfo: state.userInfo,
		time: state.timeMachine.time,
		rated: state.timeMachine.rated,
	}),
	mapDispatchToProps
)(Class);

const RecommendShareCard = ({ onPress, img = images.share_app, title = 'Chia sẻ với bạn bè', subtitle = 'Chia sẻ ứng dụng với bạn bè và đồng hành cùng VietJack nhé' }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{ flex: 1, marginTop: 10 }}
			activeOpacity={helpers.isIOS ? 0 : 0.95}
		>
			<View style={[{ marginBottom: 15, borderRadius: 8, height: 90, width: '100%', flexDirection: 'row' }, styles.shadow]}>
				<View style={{ width: 90, height: 90, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, overflow: 'hidden' }}>
					<Image
						source={img}
						style={{ flex: 1, width: null, height: null }}
					/>
				</View>
				<View style={{ flex: 1, paddingVertical: 10 }}>
					<GradientText style={{ fontSize: 18 }}>
						{title}
					</GradientText>
					<Text numberOfLines={2} style={{ marginTop: 7, color: COLOR.black(.7), ...fontMaker({ weight: fontStyles.Regular }) }}>{subtitle}</Text>
				</View>
				<LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ alignSelf: 'center', overflow: 'hidden', borderRadius: 20, marginRight: 15, marginLeft: 10 }} colors={['#F5576F', '#F580CE']}>
					<View style={{ width: 30, height: 30, borderRadius: 20, justifyContent: 'center', alignItems: 'center', }}>
						<Icon type='AntDesign' name='arrowright' style={{ fontSize: 24, color: 'white' }} />
					</View>
				</LinearGradient>
			</View>
		</TouchableOpacity>
	)
}

const today = new Date();
const GetTime = () => {
	const hours = today.getHours();
	return hours >= 17 ? "Chào buổi tối" : (hours >= 12 ? "Chào buổi chiều" : "Chào buổi sáng")
}

const HotExam = ({ navigate, hotExamData, classId = null, setHotSubIdx = () => { }, hotSubIdx, loading, navigation }) => {
	// if (!helpers.objNoData(dataContinue) || !dataContinue) return null;
	return (
		<View style={{}}>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, marginBottom: 10, }}>
				<Text style={{ fontSize: 18, ...fontMaker({ weight: fontStyles.SemiBold }) }}>
					Đang thi nhiều
				</Text>
				<TouchableOpacity onPress={() => navigation.navigate('TestStack')}>
					<Text style={{ fontSize: 14, ...fontMaker({ weight: fontStyles.Regular }), textDecorationColor: COLOR.MAIN, color: COLOR.MAIN }}>Xem thêm</Text>
				</TouchableOpacity>
			</View>
			{classId &&
				<View>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
						{HOT_SUBJECT_CLASS[classId].map((item, idx) => {
							return (
								<TouchableOpacity
									onPress={() => setHotSubIdx(item.id)}
									style={{ marginRight: 10, borderRadius: 30, paddingHorizontal: 26, paddingVertical: 6, borderWidth: 1, borderColor: item.id == hotSubIdx ? '#f7b463' : COLOR.black(.1), backgroundColor: item.id == hotSubIdx ? '#f7b463' : 'transparent' }}
									key={idx + item.id}
								>
									<Text style={{ ...fontMaker({ weight: item.id == hotSubIdx ? fontStyles.SemiBold : fontStyles.Regular }), color: item.id == hotSubIdx ? COLOR.white(1) : COLOR.black(1) }}>{item.title}</Text>
								</TouchableOpacity>
							);
						})}
					</ScrollView>
					<View>
						{hotExamData.length > 0 ?
							<ScrollView horizontal contentContainerStyle={{ marginTop: 12 }} showsHorizontalScrollIndicator={false}>
								{hotExamData.map((item, idx) => {
									return (
										<TouchableOpacity
											onPress={() => {
												navigation.navigate('OverviewTest', {
													idExam: get(item, 'id', ''),
													title: get(item, 'title', ''),
													time: get(item, 'duration', 0),
													count: get(item, 'questions_count', 0),
												})
											}}
											style={{ width: helpers.isTablet ? width * 2 / 5 : width * 4 / 5, height: 130, marginRight: idx != hotExamData.length - 1 ? 10 : 0, borderWidth: 1, borderColor: '#DFE5EA', borderRadius: 8, }} key={'hot_exam' + idx}
										>
											<View style={{ width: (helpers.isTablet ? width * 2 / 5 : width * 4 / 5) - 1, height: 15, backgroundColor: '#DFE5EA', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}></View>
											<View style={{ padding: 10, flex: 1, marginTop: -9, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, backgroundColor: COLOR.white(1), }}>
												<View style={{ flex: 1 }}>
													<Text numberOfLines={2} style={{ ...fontMaker({ weight: fontStyles.Regular, }), fontSize: 15, lineHeight: 20, }}>{item.title}</Text>
												</View>
												<View style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: COLOR.MAIN, borderRadius: 6, alignSelf: 'baseline', marginBottom: 10 }}>
													<Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), color: COLOR.white(1), fontSize: 12 }}>FREE</Text>
												</View>
												<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
													<Text style={{ fontSize: 12, color: '#474B4E', alignSelf: 'flex-start', textAlign: 'left' }}>{item.questions_count} câu hỏi - {Math.floor(item.duration / 60)} phút</Text>
													<View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
														<Icon type='Entypo' name='pencil' style={{ fontSize: 12, color: '#2FA880', }} />
														<Text numberOfLines={4} style={{ fontSize: 12, color: '#2FA880', textAlign: 'right', marginLeft: 2 }}>{item.view_count} lượt thi</Text>
													</View>
												</View>
											</View>
										</TouchableOpacity>
									);
								})
								}
							</ScrollView>
							:
							<View style={{ width: '100%', height: 130, marginTop: 12, justifyContent: 'center', alignItems: 'center' }}>
								{loading ?
									<ActivityIndicator animating={true} color={COLOR.black(.6)} size='small' />
									:
									<View style={{ justifyContent: 'center', alignItems: 'center' }}>
										<Icon name='tag-faces' type='MaterialIcons' style={{ color: COLOR.black(.4), fontSize: 32 }} />
										<Text style={{ color: COLOR.black(.4), ...fontMaker({ weight: fontStyles.Regular }), marginTop: 10 }}>Không có dữ liệu nào</Text>
									</View>
								}
							</View>
						}
					</View>
				</View>
			}

		</View>
	)

}


const ContinueLearn = ({ navigate, dataContinue, setVisible }) => {
	if (!helpers.objNoData(dataContinue) || !dataContinue) return null;
	return (
		<View style={{ marginTop: 15 }}>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, marginBottom: 5, }}>
				<Text style={{ fontSize: 18, ...fontMaker({ weight: fontStyles.SemiBold }) }}>
					Tiếp tục học
				</Text>
				<TouchableOpacity onPress={() => navigate('History')}>
					<Text style={{ fontSize: 14, ...fontMaker({ weight: fontStyles.Regular }), textDecorationColor: COLOR.MAIN, color: COLOR.MAIN }}>Xem thêm</Text>
				</TouchableOpacity>
			</View>
			{
				isEmpty(dataContinue.video) ? null :
					<VideoContinue navigate={navigate} videos={dataContinue.video || {}} setVisible={setVisible}
						widthImg={width - 20} />
			}
			{
				!isEmpty(dataContinue.article) ?
					<RenderArticlRelated
						title={get(dataContinue, 'article.title', '')}
						onPress={() => navigate("Lesson", { articleId: dataContinue.article.id, lesson_id: dataContinue.article.lesson_id })}
						contentType={get(dataContinue, 'article.content_type', 0)}
						viewCount={get(dataContinue, 'article.view_count', '1')}
					/>
					: null
			}{
				get(dataContinue, 'exam.id', '') ?
					<RenderExamRelated
						// img={images.recommend}
						title={get(dataContinue, 'exam.title', 'Bài tập trắc nghiệm')}
						time={get(dataContinue, 'exam.duration', 900)}
						totalQues={get(dataContinue, 'exam.questions_count', 0)}
						// subtitle={get(dataContinue, 'exam.title', 'ASasaSAS')}
						onPress={() => {
							navigate('OverviewTest', {
								idExam: get(dataContinue, 'exam.id', ''),
								title: get(dataContinue, 'exam.title', ''),
								// icon: get(book, 'icon_id'),
								// subject: get(book, 'title'),
								// lessonId: lessonId,
								time: get(dataContinue, 'exam.duration', 0),
								count: get(dataContinue, 'exam.questions_count', 0),
							})
						}}
					/>
					: null
			}

		</View>
	)

}

const FanpageBanner = () => {
	return (
		<View style={{ width: '100%', marginTop: 25, marginBottom: 15, borderRadius: 8, ...styles.shadow }}>
			<View style={{ flexDirection: 'row', alignItems: 'center', borderTopLeftRadius: 8, borderTopRightRadius: 8, overflow: 'hidden' }}>
				<View style={{ width: 180, height: 140 }}>
					<Image
						source={images.banner4}
						style={{ flex: 1, height: null, width: null, resizeMode: 'stretch' }}
					/>
				</View>
				<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
					<Text style={{ ...fontMaker({ weight: fontStyles.Regular }) }}>Fanpage Góc học tập</Text>
					<GradientText
						colors={['#aaa4f5', '#955DF9']}
						style={{ fontSize: 22, ...fontMaker({ weight: fontStyles.Bold }), marginVertical: 6 }}>VIETJACK</GradientText>
					<TouchableOpacity onPress={() => helpers.openUrl('https://www.facebook.com/hoc.cung.vietjack')} style={{ paddingHorizontal: 20, paddingVertical: 6, backgroundColor: COLOR.MAIN, justifyContent: 'center', alignItems: 'center', borderRadius: 24 }}>
						<Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.SemiBold }) }}>JOIN NGAY</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={{ width: '100%', padding: 10 }}>
				<Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 16 }}>THAM GIA FANPAGE CỦA VIETJACK TRÊN FACEBOOK: GÓC HỌC TẬP VIETJACK</Text>
				<Text style={{ ...fontMaker({ weight: fontStyles.Thin }), fontSize: 13, marginTop: 6 }}>Cùng VIETJACK thoả sức học hỏi, chia sẻ những kiến thức bổ ích</Text>
			</View>
		</View>
	);
}

const VideoContinue = ({ navigate, setVisible, videos = {}, style = {}, widthImg = width * 3 / 4 }) => {

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

const RecommendCoure = ({ dataRecommend, navigate, dataContinue, setVisible }) => {
	if (!helpers.objNoData(dataRecommend) || !dataContinue) return null;
	return (
		<View>
			<Text style={{ fontSize: 18, marginTop: 15, marginBottom: 10, ...fontMaker({ weight: fontStyles.SemiBold }) }}>
				Gợi ý cho bạn
			</Text>
			{
				isEmpty(dataRecommend.video) ? null :
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{dataRecommend.video.map(item => {
							return <VideoContinue
								navigate={navigate}
								setVisible={setVisible}
								videos={item}
								style={{ marginRight: 20, width: width * 4 / 5 }}
							/>
						})}
					</ScrollView>

			}
			{
				!isEmpty(dataRecommend.article) ?
					get(dataRecommend, 'article', []).map(item => {
						const { title = '', id: articleId = '', view_count = 0, content_type = -1, lesson_id } = item || {};
						return (
							<RenderArticlRelated
								title={title}
								viewCount={view_count}
								contentType={content_type}
								onPress={() => navigate("Lesson", { articleId, lesson_id })}
							/>
						)
					})
					: null
			}
			{
				!isEmpty(dataRecommend.exam) ?
					// <View>
					// 	<Text
					// 		style={{ fontSize: 18, marginTop: 15, marginBottom: 5, ...fontMaker({ weight: fontStyles.SemiBold }) }}
					// 	>Bài kiểm tra liên quan</Text>
					// 	{
					get(dataRecommend, 'exam').map((item, index) => {
						return <RenderExamRelated
							title={get(item, 'title', '')}
							time={get(item, 'duration', 0)}
							totalQues={get(item, 'questions_count', 0)}
							onPress={() => {
								navigate('OverviewTest', {
									idExam: get(dataContinue, 'exam.id', ''),
									title: get(dataContinue, 'exam.title', ''),
									time: get(dataContinue, 'exam.duration', 0),
									count: get(dataContinue, 'exam.questions_count', 0),
								})
							}}
						/>
					})
					// 		}
					// </View> 
					: null
			}

		</View>
	)
}


const HeaderView = (props, noti = 0, getNumberOfUnseenNoti = () => { }, avatarIdx) => {

	return (
		<View style={{}}>
			<View style={{ flex: 1, }}>
				<View style={{ paddingTop: (helpers.isIpX ? 15 : 0) + helpers.statusBarHeight, paddingHorizontal: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', paddingBottom: 20 }}>

					<TouchableOpacity onPress={() => props.navigation.navigate('AccountStack')} style={{ width: 38, height: 38, padding: 4, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: COLOR.black(.08) }}>
						<Image
							source={avatarIndex[avatarIdx || 0].img}
							style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
						/>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => props.navigation.navigate('SearchView')} style={{ flex: 1, borderRadius: 38, flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingLeft: 10, backgroundColor: 'white', backgroundColor: '#F3F3F3', }}>
						<Icon name='search' type='Feather' style={{ fontSize: 20, color: '#888888' }} />
						<Text numberOfLines={1} style={{ ...fontMaker({ weight: fontStyles.Regular }), marginHorizontal: 10, color: '#888888', flex: 1 }}>Tìm kiếm bài tập, đề thi, bài giảng...</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => props.navigation.navigate('Notification', { getNumberOfUnseenNoti })} style={{ alignItems: 'center', paddingLeft: 10, }}>
						<Icon name='bell' type='Entypo' style={{ fontSize: 28, color: noti > 0 ? COLOR.MAIN_GREEN : COLOR.black(.6), alignSelf: 'center' }} />
						{noti > 0 &&
							<View style={{ width: 18, height: 18, borderRadius: 10, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 8, right: -2, backgroundColor: 'red' }}>
								<Text style={{ fontSize: 12, color: COLOR.white(1) }}>{noti}</Text>
							</View>
						}
					</TouchableOpacity>
				</View>
				<View style={{ paddingHorizontal: 10, paddingTop: 10 }} >
					<Animatable.Text duration={2000} animation="bounceInLeft" style={{ ...fontMaker({ weight: fontStyles.Light }), color: '#777BF0', fontSize: 26, }}>{GetTime()}</Animatable.Text>
					<Animatable.View duration={2500} animation="bounceInLeft" delay={200}>
						<GradientText
							colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
							style={{ fontSize: 26, marginTop: 4, ...fontMaker({ weight: fontStyles.Bold }) }}
						>{get(props, 'userInfo.user.name', '')}</GradientText>
					</Animatable.View>
				</View>
			</View>
		</View>)
}


// const notification = {
// 	"_android": {
// 		"_actions": [],
// 		"_autoCancel": undefined,
// 		"_badgeIconType": undefined,
// 		"_bigPicture": {
// 			"largeIcon": null,
// 			"picture": "https://apps.vietjack.com:8081/logo_icon.png"
// 		}, "_bigText": undefined, "_category": undefined, "_channelId": undefined, "_clickAction": undefined, "_color": undefined, "_colorized": undefined, "_contentInfo": undefined, "_defaults": undefined, "_group": "campaign_collapse_key_1301470110662546743", "_groupAlertBehaviour": undefined, "_groupSummary": undefined, "_largeIcon": "https://apps.vietjack.com:8081/logo_icon.png", "_lights": undefined, "_localOnly": undefined, "_notification": [Circular], "_number": undefined, "_ongoing": undefined, "_onlyAlertOnce": undefined, "_people": [], "_priority": undefined, "_progress": undefined, "_remoteInputHistory": undefined, "_shortcutId": undefined, "_showWhen": undefined, "_smallIcon": {
// 			"icon": "ic_launcher"
// 		}, "_sortKey": undefined, "_tag": "campaign_collapse_key_1301470110662546743", "_ticker": undefined, "_timeoutAfter": undefined, "_usesChronometer": undefined, "_vibrate": undefined, "_visibility": undefined, "_when": undefined
// 	},
// 	"_body": "Nỗ lực không ngừng cùng Vietjack nhé",
// 	"_data": { },
// 	"_ios": {
// 		"_attachments": [], "_notification": [Circular]
// 	},
// 	"_notificationId": "0:1603179081129495%22ff5bc322ff5bc3",
// 	"_sound": undefined,
// 	"_subtitle": undefined,
// 	"_title": "Vui học cùng vietjack"
// }


const dataMes = {
	"_collapseKey": "org.jsmile.native.vietjack",
	"_data": {
		"redirect_to": "{\"lesson\": {\"id\": 5178, \"parts\": [{\"id\": 439942, \"partable\": {\"id\": 6547, \"title\": \"Giải SGK - Unit 2 City life - Getting started\", \"author\": {\"id\": 144993, \"name\": \"Cô Đỗ Lê Diễm Ngọc\"}, \"author_id\": 144993}, \"lesson_id\": 5178, \"partable_id\": 6547, \"partable_type\": \"App\\\\Models\\\\Video\"}], \"title\": \"Unit 2: City life\", \"book_id\": 61, \"menu_item_id\": 5191}}", "time": "2020-10-20 11:40:14", "logo_right_side": "http://app-vietjack-server-v2.deve/logo_icon.png", "score": "850"
	}, "_from": "62511586249", "_messageId": "-MK3IgGUwBXBkUBmbefp", "_ttl": 3600
}

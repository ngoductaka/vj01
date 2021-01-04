import React, { useState, useEffect, useRef } from 'react'
import {
	Text,
	View,
	Dimensions,
	TouchableOpacity,
	Image,
	Animated,
	StyleSheet,
	StatusBar,
	SafeAreaView,
	ScrollView
} from 'react-native';
import LottieView from 'lottie-react-native';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon, Tab, Tabs, ScrollableTab } from 'native-base';
import { get } from "lodash";


import { fontMaker, fontStyles } from '../../utils/fonts'
import { fontSize, COLOR, blackColor } from '../../handle/Constant'
import { helpers } from '../../utils/helpers'
import { images } from '../../utils/images';
import { Colors } from '../../utils/colors'
import { useRequest, Loading } from '../../handle/api';
const windowHeight = Dimensions.get('window').height
import SubjectAnalytics from './component/SubjectAnalytics';

const { event, ValueXY } = Animated
const scrollY = new ValueXY()

const GeneralAnalysis = (props) => {

	const { navigation } = props;
	const ref = useRef();

	const [dataAnalyse, isLoading, err] = useRequest('/subjects/dashboard', [true]);
	// console.log('dataAnalysedataAnalyse', dataAnalyse)

	useEffect(() => {
		
	}, []);

	const renderContent = x => (
		<View style={styles.contentContainer}>
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<SubjectAnalytics />
			</View>
		</View>
	)

	const RenderEmpty = () => {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

				<LottieView
					autoPlay
					loop
					style={{ width: 400, height: 400, marginTop: -50 }}
					source={require('../../public/empty-notification.json')}
				/>
				<View style={{ paddingHorizontal: 30, marginTop: -150, alignItems: 'center' }}>
					<Text style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 16 }}>Không có dữ liệu học!</Text>
					<TouchableOpacity onPress={() => navigation.navigate('TestStack')}>
						<Text style={{ textAlign: 'center', marginTop: 10, lineHeight: 24, ...fontMaker({ weight: fontStyles.Regular }), color: COLOR.black(.5) }}>
							Hãy trải nghiệm tính năng
						<Text style={{ color: COLOR.MAIN }}> "Thi Online" </Text>
						để VietJack giúp bạn thống kê quá trình học tập.
					</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={() => { navigation.goBack() }} style={[styles.backBtn, styles.shadow, { position: 'absolute', top: 10 + helpers.statusBarHeight, left: 10 }]}>
					<Icon type='MaterialCommunityIcons' name={'arrow-left'} style={{ fontSize: 26, color: '#836AEE' }} />
				</TouchableOpacity>
			</View >
		);
	}

	const heightAnim = scrollY.y.interpolate({
		inputRange: [0, 200, 300],
		outputRange: [0, 0, 40 + helpers.statusBarHeight],
		extrapolate: 'clamp',
	});

	const opacity = scrollY.y.interpolate({
		inputRange: [0, 200, 300],
		outputRange: [0, 0, 1],
		extrapolate: 'clamp',
	});

	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar
				backgroundColor='white'
				barStyle="dark-content"
			/>
			{get(dataAnalyse, 'subjects', [1]).length > 0 ?
			// {true ?
				<View style={{ flex: 1 }}>
					<Animated.View style={{ width: '100%', height: heightAnim, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
					</Animated.View>
					<Loading loading={isLoading} err={err} >

						<StickyParallaxHeader
							ref={ref}
							headerType="TabbedHeader"
							backgroundImage={images.header3}
							headerStyle={{ backgroundColor: 'white' }}
							backgroundColor={'white'} //#F580CE
							title={'Thống kê và Phân tích'}
							titleStyle={styles.titleStyle}
							foregroundImage={{
								uri: ''
							}}
							tabs={
								// get(dataAnalyse, 'subjects', [1]).map(i => {
								[1].map(i => {
									return {
										title: i.id + '',
										content: renderContent(i)
									}
								})
							}

							tabTextContainerStyle={styles.tabTextContainerStyle}
							tabTextContainerActiveStyle={styles.tabTextContainerActiveStyle}
							tabTextStyle={styles.tabTextStyle}
							tabTextActiveStyle={styles.tabTextActiveStyle}
							tabWrapperStyle={styles.tabWrapperStyle}
							tabsContainerStyle={styles.tabsContainerStyle}
							scrollEvent={event(
								[{ nativeEvent: { contentOffset: { y: scrollY.y } } }],
								{ useNativeDriver: false }
							)}
						/>
					</Loading>
					<View style={styles.backHeader}>
						<TouchableOpacity onPress={() => { navigation.goBack() }} style={[styles.backBtn]}>
							<Icon type='MaterialCommunityIcons' name={'arrow-left'} style={{ fontSize: 26, color: '#836AEE' }} />
						</TouchableOpacity>
						<Animated.Text style={[styles.headerText, { opacity: opacity }]}>
							Thống kê và Phân tích
						</Animated.Text>
						<View style={{ width: 40 }} />
					</View>
				</View>
				:
				<RenderEmpty />
			}
		</View >
	)
}

const renderContent = (exam = {}) => {
	const {
		total_exam = '3',  //# tổng số đề thi đã làm trong môn
		total_question = '15', //# tổng số câu hỏi trong môn
		total_answer = '105', //# tổng số câu trả lời trong môn
		total_correct_answer = '75', //# tổng số câu trả lời đúng của người dùng
		total_timedo = '0' //# tổng số thời gian đã làm
	} = exam;
	const examPercent = parseFloat(total_correct_answer / total_answer).toFixed(2);
	return (
		<View style={styles.contentContainer}>
			<SafeAreaView style={{ flex: 1 }}>
				{/* <Text style={styles.contentText}>{x}</Text> */}
				<AnimatedCircularProgress
					size={120}
					width={5}
					duration={1000}
					fill={examPercent}
					rotation={0}
					tintColor="#494DCB"
					// onAnimationComplete={() => console.log('onAnimationComplete')}
					backgroundColor="#D5CFCD">
					{
						(fill) => (
							<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
								<Text style={{ ...fontMaker({ weight: fontStyles.Bold }), fontSize: 18 }}>{examPercent}</Text>
								<Text style={{ ...fontMaker({ weight: fontStyles.Regular }), color: '#756964' }}>%</Text>
							</View>
						)
					}
				</AnimatedCircularProgress>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	backHeader: {
		position: 'absolute',
		width: '100%',
		top: 10 + helpers.statusBarHeight,
		left: 0,
		paddingHorizontal: 15,
		flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
	},
	backBtn: {
		width: 40, height: 40,
		borderRadius: 20,
		backgroundColor: 'white',
		justifyContent: 'center', alignItems: 'center',
	},
	headerText: {
		color: 'black',
		paddingLeft: 20,
		fontSize: fontSize.h3,
		...fontMaker({ weight: fontStyles.Regular })
	},
	titleStyle: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 26, ...fontMaker({ weight: fontStyles.Bold })
	},
	tabTextContainerStyle: {
		borderBottomColor: 'white',
		borderBottomWidth: 1
	},
	tabTextContainerActiveStyle: {
		borderBottomColor: '#FFC106',
		borderBottomWidth: 1
	},
	tabTextStyle: {
		fontSize: 16,
		lineHeight: 20,
		paddingHorizontal: 12,
		paddingVertical: 8,
		color: blackColor(.6),
		...fontMaker({ weight: fontStyles.Regular })
	},
	tabTextActiveStyle: {
		fontSize: 16,
		lineHeight: 20,
		paddingHorizontal: 12,
		paddingVertical: 8,
		color: 'black',
	},
	tabWrapperStyle: {
		paddingVertical: 10,
		alignItems: 'flex-start'
	},
	tabsContainerStyle: {
		paddingHorizontal: 10,
		// width: '100%',
	},
	contentContainer: {
		height: 1.5 * windowHeight,
		padding: 15,
		backgroundColor: 'white'
	},
	contentText: {
		fontSize: 16,
	},
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	},
	shadow: {
		backgroundColor: '#FFFFFF',
		shadowColor: 'rgba(0, 0, 0, 0.1)',
		shadowOpacity: 0.5,
		elevation: 4,
		shadowRadius: 10,
		shadowOffset: { width: 12, height: 13 },
	},

	// tab
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
})

export default GeneralAnalysis
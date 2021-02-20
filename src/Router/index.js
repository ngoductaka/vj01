import React, { useState, useEffect } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { View, Text, Dimensions, Image, Animated, TouchableOpacity, Linking } from 'react-native';

import Store from '../redux/store';
import Intro from '../screen/Intro';
import Auth from '../screen/Auth';

import ClassScreen from '../screen/Class';
import Subject from '../screen/Subject';
import Book from '../screen/Book';
import FeedBack from '../screen/FeedBack';
import SavedArticle from '../screen/Lesson/SavedArticle';
import WatchLater from '../screen/Lesson/WatchLater';
import EditProfile from '../screen/EditProfile';
import SavedOffline from '../screen/SavedOffline';
import LessonOffline from '../screen/Lesson/saved';
import SearchView from '../screen/SearchView';
import HistoryArticle from '../screen/Lesson/HistoryArticle';
import Test from '../screen/Test/Test';
import HomeTest from '../screen/Test';
import ListExams from '../screen/Test/ListExams';
import ExamFormat from '../screen/Test/ExamFormat';
import Lesson from '../screen/Lesson';
import LessonOverview from '../screen/Lesson/LessonOverview';
import ShowOfflineLesson from '../screen/Lesson/ShowOfflineLesson';
import Profile from '../screen/Profile';
import Course from '../screen/Course';
import History from '../screen/History';
import CourseDetail from '../screen/Course/CourseDetail';
import ConsultingForm from '../screen/Course/ConsultingForm';
import TopicCourse from '../screen/Course/TopicCourse';
import CoursePlayer from '../screen/Course/CoursePlayer';
import { fontMaker } from '../utils/fonts';
import { helpers } from '../utils/helpers';
import OverviewTest from '../screen/Test/OverviewTest';
import AnalyseTest from '../screen/Test/AnalyseTest';
import PracticeExam from '../screen/Test/PracticeExam';
import Login from '../screen/Login';
import ListDetailLesson from '../screen/Lesson/ListDetailLesson';
import { Icon } from 'native-base';
import { Colors } from '../utils/colors';
import ListTest from '../screen/Test/ListTest';
import GeneralAnalysis from '../screen/GeneralAnalysis';
import PracticeRanking from '../screen/Test/PracticeRanking';
import ViewAnswer from '../screen/Test/ViewAnswer';
import Bookmark from '../screen/Bookmark';
import XVideo from '../screen/XVideo';
import Notification from '../screen/Notification';
import QnA from '../screen/QNA';
import QuestionDetail from '../screen/QNA/Detail';
import Comment from '../screen/QNA/Comment';
import MakeQuestion from '../screen/QNA/makeQuestion';
import SearchQnA from '../screen/QNA/SearchQnA';
import NotificationQnA from '../screen/QNA/Notification';
import UserQnA from '../screen/QNA/Profile';
import GameCenter from '../screen/GameCenter';
import WhoIsMillionaire from '../screen/GameCenter/WhoIsMillionarie';
import Sudoku from '../screen/GameCenter/Sudoku/index';
import Tetris from '../screen/GameCenter/Tetris/index';
import NewTetris from '../screen/GameCenter/NewTetris/containers/NewTetris';
import SnakeApp from '../screen/GameCenter/Snake/Main';
import SnakeGameCenter from '../screen/GameCenter/Snake/index';
import WordCatcher from '../screen/GameCenter/WordCatcher';
import Game2048 from '../screen/GameCenter/Game2048';
import FlappyBird from '../screen/GameCenter/FlappyBird';
import TimeTable from '../screen/Utilities/TimeTable';
import ScroreAnalyse from '../screen/Utilities/ScroreAnalyse';
import Calculator from '../screen/Utilities/Calculator';
import SudokuInstruction from '../screen/GameCenter/Sudoku/containers/Instruction';

const NUMBER_OF_TABS = 4;

const TestStack = createStackNavigator({
	HomeTest: HomeTest,
	ListExams: ListExams,
	// OverviewTest: OverviewTest,
	// AnalyseTest: AnalyseTest,
	// Test: Test,
	ExamFormat: ExamFormat,
}, {
	headerMode: 'none',
	navigationOptions({ navigation }) {
		let tabBarVisible = true;
		for (let i = 0; i < navigation.state.routes.length; i++) {
			if (navigation.state.routes[i].routeName == "Test" || navigation.state.routes[i].routeName == "ListExams") {
				tabBarVisible = false;
			}
		}
		return {
			tabBarVisible
		};
	},
	defaultNavigationOptions: {
		...TransitionPresets.SlideFromRightIOS,
		gestureEnabled: false
		// cardOverlayEnabled: true,
	}

});

const CustomBottomBar = (props) => {

	const { index } = props.navigation.state;
	// console.log('indexindexindex==', index)

	useEffect(() => {
		animate(width - (NUMBER_OF_TABS - index) * width / NUMBER_OF_TABS, null);
	}, [index]);

	const { width } = Dimensions.get('screen')

	const [position] = useState(new Animated.ValueXY())

	const animStyles = {
		height: 2,
		width: width / NUMBER_OF_TABS,
		backgroundColor: '#FB9A4B',
		transform: position.getTranslateTransform()
	}

	const animate = (value, route) => {
		if (route) {
			props.navigation.navigate(route);
		}

		Animated.timing(position, {
			toValue: { x: value, y: 0 },
			duration: 300,
			useNativeDriver: true
		}).start()
	}

	return (
		<View style={{ backgroundColor: '#fff' }}>
			<Animated.View style={animStyles} />
			<BottomTabBar {...props} onTabPress={({ route, defaultHandler }) => {
				const { userInfo = {} } = Store.getState() || {};
				switch (route.key) {
					case 'ClassScreen':
						if (userInfo && userInfo.classScrollToTop) {
							userInfo.classScrollToTop();
						}
						props.navigation.popToTop();
						animate(0, route.key);
						break;
					// case 'CourseScreen':
					// 	animate(width - (NUMBER_OF_TABS - 1) * width / NUMBER_OF_TABS, route.key);
					// 	props.navigation.popToTop();
					// 	break;
					case 'TestStack':
						animate(width - (NUMBER_OF_TABS - 1) * width / NUMBER_OF_TABS, route.key);
						props.navigation.popToTop();
						break;
					case 'QnA':
						animate(width - (NUMBER_OF_TABS - 2) * width / NUMBER_OF_TABS, route.key);
						break;
					case 'AccountStack':
						animate(width - (NUMBER_OF_TABS - 3) * width / NUMBER_OF_TABS, route.key);
						props.navigation.popToTop();
						break;
				}
			}} style={{ borderTopWidth: 0, borderTopColor: '#fff' }} />
		</View>
	)
}

const MainContent = createBottomTabNavigator({
	ClassScreen: {
		screen: ClassScreen, // TableContent ////
		path: ':/id'
	},
	// SearchStack: {
	// 	screen: SearchView
	// },
	// CourseScreen: {
	// 	screen: Course,
	// },
	TestStack: {
		screen: TestStack,
	},
	QnA: {
		screen: QnA,
	},
	AccountStack: {
		screen: Profile,
	},
}, {
	tabBarComponent: (props) => <CustomBottomBar {...props} />,
	defaultNavigationOptions: ({ navigation }) => ({
		tabBarIcon: ({ focused, horizontal, tintColor }) => {
			const { routeName } = navigation.state;
			let text = 'Trang chủ';
			let src = 'home';
			let type = "AntDesign";

			if (routeName === 'CourseScreen') {
				// src = 'search1';
				// text = "Tìm kiếm";
				src = 'chalkboard-teacher';
				text = "Khoá học";
				type = "FontAwesome5"

			} else if (routeName === 'TestStack') {
				src = 'form';
				text = "Thi online";
			} else if (routeName === 'AccountStack') {
				src = 'user';
				text = "Tài khoản";
			} else if (routeName === 'QnA') {
				type = 'MaterialCommunityIcons';
				src = 'comment-question';
				text = "Hỏi đáp";
			}

			return (
				<View style={{
					alignItems: 'center',
					justifyContent: 'center',
					width: Dimensions.get('window').width / NUMBER_OF_TABS,
					height: '100%',
				}}>
					{/* <View style={{ width: 21, height: 21 }}>
						<Image
							source={src}
							style={{ flex: 1, width: null, height: null }}
						/>
					</View> */}
					<Icon type={type} name={src} style={{ color: tintColor, fontSize: 20 }} />
					<Text style={{ color: tintColor, fontSize: 11, marginTop: 2, ...fontMaker({ weight: 'Regular' }) }}>{text}</Text>
				</View>
			)
		},
		tabBarOnPress: ({ navigation, defaultHandler }) => {
			try {
				const { userInfo = {} } = Store.getState() || {};
				if (navigation.state.routeName == 'Class' && userInfo && userInfo.classScrollToTop) {
					userInfo.classScrollToTop()
				} else if (navigation.state.routeName == 'Trend' && userInfo && userInfo.trendScrollToTop) {
					userInfo.trendScrollToTop()
				}
				// else if (navigation.state.routeName == 'Test') {
				// 	navigation.navigate('HomeTest')
				// }
				defaultHandler()
			} catch (err) {
				// console.log('err press tab bar', err)
			}
		},
	}),
	lazy: true,
	swipeEnabled: true,
	tabBarOptions: {
		style: {
			height: helpers.isTablet ? Dimensions.get('window').height / 14 : Dimensions.get('window').height / 16.5,
			minHeight: 50,
			backgroundColor: '#ffffff',
		},
		showLabel: false,
		activeTintColor: Colors.pri,
		inactiveTintColor: '#666666',
	},
});


const InAppStack = createStackNavigator({
	MainContent: {
		screen: MainContent,
		path: 'lesson/',
	},
	Subject: Subject,
	Book: Book,
	// Course: {
	// 	screen: Course
	// },
	HomeTest: {
		screen: HomeTest,
		path: 'test/:name'
	},
	ListExams: {
		screen: ListExams
	},
	OverviewTest: {
		screen: OverviewTest
	},
	AnalyseTest: {
		screen: AnalyseTest
	},
	GeneralAnalysis: {
		screen: GeneralAnalysis
	},
	Test: {
		screen: Test
	},
	ListTest: ListTest,
	ExamFormat: {
		screen: ExamFormat
	},
	CourseDetail: {
		screen: CourseDetail
	},
	TopicCourse: TopicCourse,
	CoursePlayer: {
		screen: CoursePlayer
	},
	LessonOverview: {
		screen: LessonOverview
	},
	ShowOfflineLesson: {
		screen: ShowOfflineLesson
	},
	ListDetailLesson: ListDetailLesson,
	PracticeExam: {
		screen: PracticeExam
	},
	PracticeRanking: {
		screen: PracticeRanking
	},
	Lesson: {
		screen: Lesson,
		navigationOptions: {
			...TransitionPresets.ModalSlideFromBottomIOS,
		}
	},
	Profile: {
		screen: Profile,
	},
	FeedBack: {
		screen: FeedBack
	},
	EditProfile: {
		screen: EditProfile
	},
	SavedArticle: {
		screen: SavedArticle
	},
	WatchLater: WatchLater,
	SavedOffline: {
		screen: SavedOffline,
	},
	LessonOffline: {
		screen: LessonOffline
	},
	Notification: {
		screen: Notification
	},
	SearchView: {
		screen: SearchView,
		navigationOptions: {
			...TransitionPresets.ModalSlideFromBottomIOS,
		}
	},
	HistoryArticle: {
		screen: HistoryArticle,
	},
	ViewAnswer: ViewAnswer,
	Bookmark: Bookmark,
	History,
	QuestionDetail: QuestionDetail,
	Comment: Comment,
	SearchQnA: SearchQnA,
	MakeQuestion: {
		screen: MakeQuestion,
		// navigationOptions: {
		// 	...TransitionPresets.ModalPresentationIOS,
		// }
	},
	NotificationQnA: {
		screen: NotificationQnA,
		navigationOptions: {
			...TransitionPresets.ModalPresentationIOS,
		}

	},
	UserQnA: {
		screen: UserQnA,
		navigationOptions: {
			...TransitionPresets.ModalPresentationIOS,
		}
	},
	GameCenter: {
		screen: GameCenter,
		navigationOptions: {
			// ...TransitionPresets.ModalPresentationIOS,
		}
	},
	WhoIsMillionarie: {
		screen: WhoIsMillionaire,
		navigationOptions: {
			// ...TransitionPresets.ModalPresentationIOS,
		}
	},
	Sudoku: {
		screen: Sudoku,
		navigationOptions: {
			// ...TransitionPresets.ModalPresentationIOS,
		}
	},
	SudokuInstruction: {
		screen: SudokuInstruction,
		navigationOptions: {
			...TransitionPresets.ModalPresentationIOS,
		}
	},
	SnakeGameCenter: {
		screen: SnakeGameCenter,
		navigationOptions: {
			// ...TransitionPresets.ModalPresentationIOS,
		}
	},
	SnakeApp: {
		screen: SnakeApp,
		navigationOptions: {
			// ...TransitionPresets.ModalPresentationIOS,
		}
	},
	Tetris: {
		screen: Tetris,
		navigationOptions: {
			// ...TransitionPresets.ModalPresentationIOS,
		}
	},
	WordCatcher: {
		screen: WordCatcher,
		navigationOptions: {
			// ...TransitionPresets.ModalPresentationIOS,
		}
	},
	Game2048: {
		screen: Game2048,
		navigationOptions: {
			// ...TransitionPresets.ModalPresentationIOS,
		}
	},
	FlappyBird: {
		screen: FlappyBird,
		navigationOptions: {
			// ...TransitionPresets.ModalPresentationIOS,
		}
	},
	ConsultingForm: {
		screen: ConsultingForm,
		navigationOptions: {
			...TransitionPresets.ModalPresentationIOS,
		}
	},
	TimeTable: TimeTable,
	ScroreAnalyse: ScroreAnalyse,
	Calculator: Calculator,
	// ConsultingForm:ConsultingForm,
}, {
	// defaultNavigationOptions: {
	// ...TransitionPresets.SlideFromRightIOS,
	// gesturesEnabled: true,
	// },
	headerMode: 'none',
});
// const prefix = Linking.createURL('/');
/* create app container */
export const CreateRootNavigator = createAppContainer(
	createSwitchNavigator(
		{
			Auth: {
				screen: Auth
			},
			Intro: {
				screen: Intro
			},
			Login: {
				screen: Login
			},
			// Classify: {
			// 	screen: Classify
			// },
			InAppStack: {
				screen: InAppStack,
				path: 'inapp',
			},
		}, {
		// initialRouteName: screen,
	}
	));


export default CreateRootNavigator;

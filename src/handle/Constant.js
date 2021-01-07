import { Platform } from 'react-native';
import { images } from '../utils/images';
/**
 * Color
 */
const COLOR = {
	MAIN: '#f7941d',
	TAG: '#fa995d',
	MAIN_GREEN: '#69B175',
	SUB_GREEN: '#A9CF8C',
	CORRECT: "rgb(91, 195, 53)",
	WRONG: '#F04465',
	statusBar: '#0C353B',
	logo: '#f5720c',
	C1: '#27AE60',
	C2: '#117A65',
	C3: '#5DADE2',
	bgLeft: '#feefc8',
	black: (opa = 1) => `rgba(0, 0, 0, ${opa})`,
	white: (opa = 1) => `rgba(255, 255, 255, ${opa})`,
};

const blackColor = (opa = 1) => {
	return `rgba(0, 0, 0, ${opa})`;
}

const whiteColor = (opa = 1) => {
	return `rgba(255, 255, 255, ${opa})`;
}

const array_move = (arr, position, newItem) => {
	let temp = [...arr];
	temp.splice(position, 1);
	temp.unshift(newItem);
	return temp;
};

/**
 * CONSTANT_KEY
 */
const FIRST_TIME = "FIRST_TIME";

/**
 * ADMOB BANNER KEY
 */
const unitId =
	Platform.OS === 'ios'
		? 'ca-app-pub-4508913343091330/2061090976'
		: 'ca-app-pub-4508913343091330/9522802115';

/**
 * ADMOB INTERTITAIL KEY
 */
const unitIntertitialId =
	Platform.OS === 'ios'
		? 'ca-app-pub-4508913343091330/9354963926'
		: 'ca-app-pub-4508913343091330/4960724660';

export const TIMES_SHOW_FULL_ADS = 8;
export const CORRECT_POINT = 100;
export const BONUS_TIME_POINT = 50;
export const TIME_PER_QUESTION = 1000000;

const h1 = 24;
const h2 = 18;
const h3 = 16;
const h4 = 14;
const h5 = 12;

export const fontSize = {
	h1, h2, h3, h4, h5
};

export const GAME_CENTERS = [
	{ src: images.game1, name: 'Ai là triệu phú', slogan: 'Vui mà học, học mà chơi', route: 'WhoIsMillionarie' },
	{ src: images.game2, name: 'Nối từ', slogan: 'Vui mà học, học mà chơi', route: 'WordCatcher' },
	{ src: images["2048_logo"], name: '2048', slogan: 'Vui mà học, học mà chơi', route: 'Game2048' },
	{ src: images.flappybird, name: 'Flappy Bird', slogan: 'Vui mà học, học mà chơi', route: 'FlappyBird' },
];
export const LIST_UTILITIES = [
	{
		src: { uri: 'https://cdn2.iconfinder.com/data/icons/e-learning-17/96/timetable_classes_school_schedule-512.png' },
		name: 'Thời gian biểu',
		slogan: 'Lên lịch học tập',
		route: 'TimeTable'
	},
	{ src: images.game2, name: 'Nối từ', slogan: 'Vui mà học, học mà chơi', route: 'WordCatcher' },
	{ src: images["2048_logo"], name: '2048', slogan: 'Vui mà học, học mà chơi', route: 'Game2048' },
	{ src: images.flappybird, name: 'Flappy Bird', slogan: 'Vui mà học, học mà chơi', route: 'FlappyBird' },
];

export const avatarIndex = [
	{ img: images.avatar1, name: 'Jack tinh nghịch' }, { img: images.avatar2, name: 'Jack cần cù' },
	{ img: images.avatar3, name: 'Jack cool ngầu' }, { img: images.avatar4, name: 'Jack yêu đời' },
	{ img: images.avatar5, name: 'Jack mơ mộng' }, { img: images.avatar6, name: 'Jack giỏi giang' },
	{ img: images.avatar7, name: 'Jack nhiệt huyết' }, { img: images.avatar8, name: 'Jack hồn nhiên' },
	{ img: images.avatar9, name: 'Jack siêng năng' }, { img: images.avatar10, name: 'Jack năng động' },
	{ img: images.avatar11, name: 'Jack chăm chỉ' },];


export const Constants = {
	REFRESH_TOKEN: 'refresh_token',
	ACCESS_TOKEN: 'access_token',
	SOCIAL_TOKEN: 'social_token',
	APPLE_PAYLOAD: 'apple_payload',
	TYPE_LOGIN: 'type_login',
	USER_INFO: 'user_info',
	ACCOUNT_ID: 'account_id',
};

export const TIMEOUT = 20000;

export const provinces = ["Hà Nội", "Hồ Chí Minh", "Bắc Giang", "Bắc Kạn", "Cao Bằng", "Hà Giang", "Lạng Sơn", "Phú Thọ", "Quảng Ninh", "Thái Nguyên", "Tuyên Quang", "Lào Cai", "Yên Bái", "Điện Biên", "Hòa Bình", "Lai Châu", "Sơn La", "Bắc Ninh", "Hà Nam", "Hải Dương", "Hưng Yên", "Nam Định", "Ninh Bình", "Thái Bình", "Vĩnh Phúc", "Hải Phòng", "Hà Tĩnh", "Nghệ An", "Quảng Bình", "Quảng Trị", "Thanh Hóa", "Thừa Thiên–Huế", "Đắk Lắk", "Đắk Nông", "Gia Lai", "Kon Tum", "Lâm Đồng", "Bình Định", "Bình Thuận", "Khánh Hòa", "Ninh Thuận", "Phú Yên", "Quảng Nam", "Quảng Ngãi", "Đà Nẵng", "Bà Rịa–Vũng Tàu", "Bình Dương", "Bình Phước", "Đồng Nai", "Tây Ninh", "An Giang", "Bạc Liêu", "Bến Tre", "Cà Mau", "Đồng Tháp", "Hậu Giang", "Kiên Giang", "Long An", "Sóc Trăng", "Tiền Giang", "Trà Vinh", "Vĩnh Long", "Cần Thơ"];
export const mapScreenName = {
	ClassScreen: 'Trang chủ',
	Subject: 'Mục lục',
	ChapterContent: 'Nội dung chương',
	Book: 'Danh mục sách',
	FeedBack: 'FeedBack',
	SavedArticle: 'Bài học đã lưu',
	WatchLater: 'Xem sau',
	EditProfile: 'Chỉnh sửa thông tin user',
	SavedOffline: 'Lưu offline',
	LessonOffline: 'Bài học lưu offline',
	SearchView: 'Tìm kiếm',
	HistoryArticle: 'Tài liệu đã xem',
	Test: 'Thi online',
	HomeTest: 'Trang chủ thi online',
	ListExams: 'Danh sách bài thi',
	// ExamFormat: 'ExamFormat',
	Lesson: 'Xem tài liệu',
	LessonOverview: 'Tài liệu bài học',
	Profile: 'Thông tin user',
	// Course: 'Course',
	History: 'Lịch sử',
	// CourseDetail: 'CourseDetail',
	CoursePlayer: 'Xem video',
	OverviewTest: 'Giới thiệu bài test',
	AnalyseTest: 'Thống kê thi online',
	PracticeExam: 'Ôn tập thì online',
	Login: 'Đăng nhập',
	ListDetailLesson: 'Tất cả tài liệu',
	ListTest: 'Danh sách bài test',
	GeneralAnalysis: 'Thống kê học tập',
	ViewAnswer: 'Xem đáp án thi',
	Bookmark: 'Bookmark'
};

const HOT_SUBJECT_CLASS = {
	'3': [
		{ id: 11, grade_id: 3, icon_id: 1, title: "Tiếng Việt" },
		{ id: 12, grade_id: 3, icon_id: 3, title: "Toán" },
		{ id: 13, grade_id: 3, icon_id: 4, title: "Tiếng Anh" }
	],
	'4': [
		{ id: 17, grade_id: 4, icon_id: 1, title: "Tiếng Việt" },
		{ id: 18, grade_id: 4, icon_id: 3, title: "Toán", },
		{ id: 19, grade_id: 4, icon_id: 4, title: "Tiếng Anh" },
	],
	'5': [
		{ id: 24, grade_id: 5, icon_id: 1, title: "Tiếng Việt" },
		{ id: 25, grade_id: 5, icon_id: 3, title: "Toán" },
		{ id: 26, grade_id: 5, icon_id: 4, title: "Tiếng Anh" },
	],
	'6': [
		{ id: 31, grade_id: 6, icon_id: 2, title: "Ngữ văn" },
		{ id: 32, grade_id: 6, icon_id: 3, title: "Toán" },
		{ id: 33, grade_id: 6, icon_id: 11, title: "Vật lí" },
		{ id: 36, grade_id: 6, icon_id: 4, title: "Tiếng anh" },
	],
	'7': [
		{ id: 42, grade_id: 7, icon_id: 2, title: "Ngữ văn" },
		{ id: 43, grade_id: 7, icon_id: 3, title: "Toán" },
		{ id: 44, grade_id: 7, icon_id: 11, title: "Vật lí" },
		{ id: 45, grade_id: 7, icon_id: 12, title: "Sinh học" },
		{ id: 47, grade_id: 7, icon_id: 4, title: "Tiếng Anh" },
	],
	'8': [
		{ id: 53, grade_id: 8, icon_id: 2, title: "Ngữ văn" },
		{ id: 54, grade_id: 8, icon_id: 3, title: "Toán" },
		{ id: 55, grade_id: 8, icon_id: 11, title: "Vật lí" },
		{ id: 56, grade_id: 8, icon_id: 15, title: "Hóa học" },
		{ id: 57, grade_id: 8, icon_id: 12, title: "Sinh học" },
		{ id: 59, grade_id: 8, icon_id: 4, title: "Tiếng Anh" },
	],
	'9': [
		{ id: 65, grade_id: 9, icon_id: 2, title: "Ngữ văn" },
		{ id: 66, grade_id: 9, icon_id: 3, title: "Toán" },
		{ id: 67, grade_id: 9, icon_id: 11, title: "Vật lí" },
		{ id: 68, grade_id: 9, icon_id: 15, title: "Hóa học" },
		{ id: 69, grade_id: 9, icon_id: 12, title: "Sinh học" },
		{ id: 71, grade_id: 9, icon_id: 4, title: "Tiếng Anh" },
	],
	'10': [
		{ id: 76, grade_id: 10, icon_id: 2, title: "Ngữ văn" },
		{ id: 77, grade_id: 10, icon_id: 3, title: "Toán" },
		{ id: 78, grade_id: 10, icon_id: 11, title: "Vật lí" },
		{ id: 79, grade_id: 10, icon_id: 15, title: "Hóa học" },
		{ id: 80, grade_id: 10, icon_id: 12, title: "Sinh học" },
		{ id: 82, grade_id: 10, icon_id: 4, title: "Tiếng Anh" },
		{ id: 84, grade_id: 10, icon_id: 7, title: "Tin học", }
	],
	'11': [
		{ id: 98, grade_id: 12, icon_id: 2, title: "Ngữ văn", },
		{ id: 99, grade_id: 12, icon_id: 3, title: "Toán", },
		{ id: 100, grade_id: 12, icon_id: 11, title: "Vật lí", },
		{ id: 101, grade_id: 12, icon_id: 15, title: "Hóa học", },
		{ id: 102, grade_id: 12, icon_id: 12, title: "Sinh học", },
		{ id: 104, grade_id: 12, icon_id: 4, title: "Tiếng Anh", },
		{ id: 106, grade_id: 12, icon_id: 7, title: "Tin học", books_count: 3 }
	],
	'12': [
		{ id: 98, grade_id: 12, icon_id: 2, title: "Ngữ văn" },
		{ id: 99, grade_id: 12, icon_id: 3, title: "Toán" },
		{ id: 100, grade_id: 12, icon_id: 11, title: "Vật lí" },
		{ id: 101, grade_id: 12, icon_id: 15, title: "Hóa học" },
		{ id: 102, grade_id: 12, icon_id: 12, title: "Sinh học" },
		{ id: 104, grade_id: 12, icon_id: 4, title: "Tiếng Anh" },
		{ id: 106, grade_id: 12, icon_id: 7, title: "Tin học" }
	],
};

export {
	COLOR,
	blackColor,
	whiteColor,
	FIRST_TIME,
	array_move,
	unitId,
	unitIntertitialId,
	HOT_SUBJECT_CLASS
}
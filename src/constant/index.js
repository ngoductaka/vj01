
import {
	Platform,
} from 'react-native';

const url = 'https://play.google.com/store/apps/details?id=com.jsmile.android.vietjack';
const urlIos = 'https://apps.apple.com/us/app/vietjack/id1490262941';
const title = 'Học cùng vietjack';

export const makeOptionShare = (msg = Platform.OS === 'ios' ? urlIos : url) => {
	return {
		title,
		subject: title,
		message: msg,
	};
}

export const MAP_SUBJECT = {
	"1": "Toán",
	"2": "Văn",
	"3": "Vật lý",
	"4": "Hóa học",
	"5": "tiếng anh",
	"6": "Lịch sử",
	"7": "Địa lý",
	"8": "Sinh học",
	"9": "Âm nhạc",
	"10": "Giáo dục công dân",
	"11": "Tiếng Việt",
}

export const mapBooktype = [
	'Sách giáo khoa',
	'Sách bài tập',
	'Vở bài tập',
	'Tài liệu',
	'Soạn văn',
	"Lý thuyết",
	"Tác giả-tác phẩm",
]

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


export const mapBooktype = [
	'Sách giáo khoa',
	'Sách bài tập',
	'Vở bài tập',
	'Tài liệu',
	'Soạn văn',
	"Lý thuyết",
	"Tác giả-tác phẩm",
]
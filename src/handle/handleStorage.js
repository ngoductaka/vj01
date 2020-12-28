import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

// AsyncStorage.removeItem('article');
const KEY = {
	// luu link bai hoc
	saved_article: 'article',
	saved_offline_article: 'saved_offline_article',
	// luu offline
	saved_lesson: 'lesson_save_offline',
	// 
	userID: 'userID',
	saved_user: 'saved_user',
	history_seen: 'history_seen',
	ARTICLE_SAVED: 'ARTICLE_SAVED',
	history_search: 'history_search',
	rating_vietjack_app: 'rating_vietjack_app',
	firebase_token: 'new_firebase_token_2',
	saved_video: 'saved_video',
	soundOn: 'soundOn'
};

const saveItem = (key, value) => {
	const convertValue = typeof value == 'object' ? JSON.stringify(value) : String(value)
	AsyncStorage.setItem(key, convertValue);
};

const getItem = async (key) => {
	const result = await AsyncStorage.getItem(key);
	try {
		const dataParse = JSON.parse(result)
		return dataParse;
	} catch (e) {
		return result;
	}
}

const insertItem = async (key, value) => {
	try {
		const valLocal = await getItem(key);

		if (valLocal) {
			const newData = [
				value,
				...valLocal
			]
			saveItem(key, newData)
		} else {
			saveItem(key, [value])
		}
	} catch (err) {
		// console.log('err insert local storage', err)
	}

}


const useStorage = (key = '', context = []) => {
	const [value, setValue] = useState('');

	useEffect(() => {
		getItem(key).then(val => {
			// console.log({ val })
			setValue(val)
		})
	}, context)

	useEffect(() => {
		saveItem(key, value);
	}, [value, ...context]);

	return [value, setValue];
};


export {
	KEY,
	useStorage,
	saveItem,
	getItem,
	insertItem,
};


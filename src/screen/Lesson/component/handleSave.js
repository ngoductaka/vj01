import React, { useState, useEffect, useCallback, memo } from 'react';
import {
	Keyboard, View, FlatList, SafeAreaView, Text,
	StatusBar, StyleSheet, TouchableOpacity, TextInput, ImageBackground
} from 'react-native';
import { Icon } from 'native-base';
import { isEmpty, findIndex } from 'lodash';

import { insertItem, KEY, getItem, saveItem } from '../../../handle/handleStorage';
import { array_move, blackColor, fontSize } from '../../../handle/Constant';
import useDebounce from '../../../utils/useDebounce';
import { removeDiacritics } from '../../../utils/helpers';
import { COLOR } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { RenderVideo } from './VideosList';
// 

const handleSaveData = (data, type, count, key = 'articleId') => {
	return getItem(KEY[type])
		.then(val => {
			if (!isEmpty(val)) {
				const checkSave = findIndex(val, [key, data[key]]);
				if (checkSave === -1) {
					if (val.length >= count) {
						let temp = [...val];
						temp.pop();
						const newData = [
							data,
							...temp
						]
						saveItem(KEY[type], newData);
					} else {
						insertItem(KEY[type], data);
					}
				} else {
					const newData = array_move(val, checkSave, data);
					saveItem(KEY[type], newData);
				}
			} else {
				insertItem(KEY[type], data);
			}
		})
		.catch(e => {
			// console.log('err KEY[type]', e);
			insertItem(KEY[type], data);
		});
}

export const saveHistory = (article) => {
	return handleSaveData(article, 'history_seen', 30)
}

export const saveArticle = (article) => {
	return handleSaveData(article, 'saved_article', 20)
}

export const saveOfflineArticle = (article) => {
	return handleSaveData(article, 'saved_offline_article', 20)
}

export const saveVideo = (dataVideo) => {
	handleSaveData(dataVideo, 'saved_video', 20)
}

// component

const useData = (key = '', defaultVal) => {
	const [value, setValue] = useState(defaultVal);
	const [valueOrg, setValueOrg] = useState(defaultVal);

	useEffect(() => {
		getItem(key)
			.then(val => {
				setValue(val);
				setValueOrg(val)
			})
	}, []);

	const handleSearch = (text) => {
		let listResult = [];
		if (text !== ' ') {
			if (valueOrg) {
				listResult = valueOrg.filter((item = {}) => {
					const { title = '' } = item;
					return removeDiacritics(title).includes(removeDiacritics(text));
				})
			}
			setValue(listResult);
		} else {
			setValue(valueOrg);
		}
	}

	const deleteItem = (keyItem) => {
		const listResult = valueOrg.filter(({ articleId = '' }) => {
			return articleId != keyItem;
		});
		setValueOrg(listResult);
		setValue(listResult);
		saveItem(key, listResult)
	}

	return [value, handleSearch, deleteItem]
}


const SearchInput = ({ handleSearch }) => {
	const [value, setValue] = useState('');
	const valueDebounce = useDebounce(value, 500);

	useEffect(() => {
		if (valueDebounce && value) {
			handleSubmit();
		}
	}, [valueDebounce]);

	const handleSubmit = () => {
		if (value) handleSearch(value.trim())
	}

	return (
		<View style={[stylesSearch.container]} >
			<View style={stylesSearch.inputForm} >
				<TextInput
					value={value === ' ' ? '' : value}
					autoCorrect={false}
					placeholder='Nhập từ khóa tìm kiếm...'
					onChangeText={(text) => {
						if (text === '') {
							setValue(' ');
						} else {
							setValue(text)
						}
					}}
					onEndEditing={() => { Keyboard.dismiss() }}
					style={stylesSearch.inputTag}
				/>
				<TouchableOpacity style={stylesSearch.icon} onPress={handleSubmit}>
					<Icon name='search' style={{ fontSize: 20, color: "black" }} />
				</TouchableOpacity>
			</View>
		</View >
	)
}


const stylesSearch = StyleSheet.create({
	container: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 2,
		borderWidth: 1,
		borderColor: blackColor(.1),
		borderRadius: 8,
	},
	inputForm: {
		flexDirection: 'row',
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingLeft: 10,
	},
	inputTag: {
		width: '90%',
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingLeft: 10,
		paddingVertical: 10,
		color: 'black',
		...fontMaker({ weight: fontStyles.Regular })
	},
	icon: {
		width: '10%',
		justifyContent: 'center',
		alignItems: 'center'
	},
})

const RenderListLesson = ({ data, navigation, handleSearch, deleteItem }) => {

	return (
		<View style={styles.list}>
			<SearchInput handleSearch={handleSearch} />
			{
				isEmpty(data) ? (
					<NotFound />
				) : (
						<FlatList
							style={{ marginTop: 15 }}
							data={data}
							renderItem={({ item }) => renderItemBook(item, navigation, deleteItem)}
							keyExtractor={(_, index) => index.toString()}
						/>
					)
			}
		</View>
	)

}

const NotFound = () => {
	return (
		<View style={styles.notFound}>
			<Text style={{ ...fontMaker({ weight: fontStyles.Regular }) }}>
				Không tìm thấy dữ liệu
			</Text>
		</View>
	)
}

const renderItemBook = (item, navigation, deleteItem) => {
	const { title, articleId, parsed_content = '' } = item;

	return (
		<TouchableOpacity
			onPress={() => {
				if(parsed_content) {
					navigation.navigate("ShowOfflineLesson", {title, articleId, backTo: 'Bài viết đã xem', parsed_content })
				} else {
					deleteItem(articleId)
				}
			}}
			style={[stylesComponent.textItem, { paddingLeft: 0, borderBottomWidth: 0, borderBottomWidth: 1, borderColor: 'white' }]}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View
					style={{
						height: 30, width: 30, marginRight: 15, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
						borderColor: COLOR.MAIN,
						borderWidth: 1
					}}
				>
					<Icon type='MaterialCommunityIcons' name={'file-document-edit'} style={{ fontSize: 18, color: COLOR.MAIN, marginLeft: 3 }} />
				</View>
				<View style={{ flex: 1 }}>
					<Text numberOfLines={2} style={stylesComponent.textContent}>
						{title}
					</Text>
				</View>
				{
					deleteItem ?
						<TouchableOpacity onPress={() => deleteItem(articleId)}>
							<Icon type='MaterialCommunityIcons' name={'delete'} style={{ fontSize: 18, color: COLOR.WRONG, marginLeft: 3 }} />
						</TouchableOpacity> :
						null
				}
			</View>
		</TouchableOpacity >
	)
}

const stylesComponent = StyleSheet.create({
	textItem: {
		flexDirection: 'row',
		borderRadius: 5,
		borderBottomColor: '#dedede',
		borderBottomWidth: 2,
		padding: 10, alignItems: 'center',
		paddingVertical: 15
	},
	textContent: {
		...fontMaker({ weight: fontStyles.Regular }),
		color: blackColor(0.9), flex: 1,
		fontSize: fontSize.h3
	},
	icon: {
		color: '#777',
		fontSize: 12,
		marginTop: 3,
	},
	iconType: {
		fontSize: 13,
		color: '#777',
		marginRight: 5,
	},
	subText: {
		fontSize: fontSize.h5,
		color: '#777'
	},
});


const styles = StyleSheet.create({
	notFound: {
		marginTop: 100,
		alignItems: "center",
	},
	list: {
		flex: 1,
		padding: 10,
		marginTop: 10,
		paddingBottom: 0,
	},
	titleText: {
		fontSize: 20,
		// fontWeight: 'bold',
		...fontMaker({ weight: 'Black' }),
		marginBottom: 7
	},
	baseItem: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: "center",
		borderBottomColor: '#ddd',
		borderBottomWidth: 1,
		marginBottom: 10,
		paddingTop: 10,
		paddingVertical: 6,
		// backgroundColor: '#fff',
	},
	lesson: {
		paddingLeft: 10,
		...fontMaker({ weight: fontStyles.Regular })
	}

})


const HeaderSafeView = ({ title = 'Bài học đã xem', leftAction }) => {
	return (

		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<TouchableOpacity onPress={leftAction} style={{ width: 50, alignItems: 'center' }}>
				<Icon name='ios-arrow-back' style={{ fontSize: 25, color: '#222' }} />
			</TouchableOpacity>
			<View style={{ flex: 1, alignItems: 'center', marginRight: 50 }}>
				<Text style={{ color: '#111', ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 18 }}>{title}</Text>
			</View>
		</View>
	)
}
// handle video 
const RenderListVideo = ({ data, navigation, handleSearch, deleteItem }) => {

	return (
		<View style={styles.list}>
			{/* <Text style={styles.titleText}> Danh sách bài học:</Text> */}
			<SearchInput handleSearch={handleSearch} />
			{
				isEmpty(data) ? (
					<NotFound />
				) : (
						<FlatList
							style={{ marginTop: 25 }}
							data={data}
							renderItem={({ item }) => renderItemVideo(item, navigation, deleteItem)}
							keyExtractor={(_, index) => index.toString()}
						/>
					)
			}
		</View>
	)
}
const renderItemVideo = (item, navigation, deleteItem) => {
	const { isLecture, lectureId, viewCount } = item;
	const props = {
		isLecture,
		item,
		_handlePress: () => {
			navigation.navigate('CoursePlayer', { lectureId, view_count: viewCount })
		},
		_hanldeDel: () => deleteItem(lectureId)
	}
	return (
		<RenderVideo {...props} />
	)
}


export {
	useData,
	SearchInput,
	stylesSearch,
	RenderListLesson,
	NotFound,
	renderItemBook,
	RenderListVideo,
	styles,
	HeaderSafeView
}
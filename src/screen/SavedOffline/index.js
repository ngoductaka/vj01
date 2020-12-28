// saved_lesson ====== luu offline
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Keyboard, View, FlatList, SafeAreaView, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Icon } from 'native-base';
import { isEmpty } from 'lodash';

import Header from '../../component/Header';
import { KEY, getItem, saveItem } from '../../handle/handleStorage';
import useDebounce from '../../utils/useDebounce';
import { ConfirmBox } from '../../component/ModalConfirm';
import { removeDiacritics } from '../../utils/helpers';

const SaveItem = memo((props) => {
	const { navigation } = props;
	const [value, handleSearch, deleteItem] = useData(KEY.saved_lesson, []);

	const [keyDel, setKeyDel] = useState('');
	const onConfirm = () => {
		deleteItem(keyDel);
		setKeyDel('')
	}

	return (
		<View style={{ flex: 1 }}>
			<Header
				leftIcon={<Icon name='ios-arrow-back' style={{ fontSize: 25, color: '#fff' }} />}
				title={`Bài học lưu offline`}
				leftAction={() => {
					navigation.goBack();
				}}
				showSearch={false}
				navigation={props.navigation}
			/>
			<SafeAreaView style={styles.container}>
				<View style={{ flex: 1 }}>
					<RenderListLesson
						data={value}
						navigation={navigation}
						handleSearch={handleSearch}
						deleteItem={setKeyDel}
					/>
				</View>
				<ConfirmBox
					show={keyDel !== ''}
					text="Xóa bài học này?"
					onCancel={() => setKeyDel('')}
					onConfirm={onConfirm}
				/>
			</SafeAreaView>
		</View>
	)
});


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
					const { titleLesson = '' } = item;
					return removeDiacritics(titleLesson).includes(removeDiacritics(text));
				})
			}
			setValue(listResult);
		} else {
			setValue(valueOrg);
		}

	}

	const deleteItem = (keyItem) => {
		const listResult = valueOrg.filter(({ key = '' }) => {
			return key != keyItem;
		});
		setValueOrg(listResult);
		setValue(listResult);
		saveItem(KEY.saved_lesson, listResult)
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
					value={value === ' '? '' : value}
					placeholder='Nhập từ khóa tìm kiếm...'
					autoCorrect={false}
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
		// borderBottomColor: '#ddd',
		// borderBottomWidth: 1,
		marginTop: 2
	},
	inputForm: {
		flexDirection: 'row',
		width: '90%',
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingLeft: 10,
	},
	inputTag: {
		width: '90%',
		backgroundColor: '#fff',
		color: '#343434',
		borderRadius: 10,
		paddingLeft: 10,
		paddingVertical: 10
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
			<Text style={styles.titleText}> Danh sách bài học:</Text>
			<SearchInput handleSearch={handleSearch} />
			{
				isEmpty(data) ? (
					<NotFound />
				) : (
						<FlatList
							data={data}
							style={{ marginTop: 15 }}
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
			<Text>
				Không tìm thấy dữ liệu
			</Text>
		</View>
	)
}

const renderItemBook = (item, navigation, deleteItem) => {
	const {
		titleLesson = '',
		key = '',
		backTo = 'Bài viết lưu offline' ,
	} = item;
	return (
		<View
			style={styles.baseItem}>
			<TouchableOpacity
				onPress={() => {
					navigation.navigate("LessonOffline", item);
				}}
				style={{ width: '90%' }}>
				<Text style={styles.lesson} numberOfLines={2}>
					{titleLesson}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => {
					deleteItem(key);
				}}
				style={{ width: '10%', alignItems: 'center' }}>
				<Icon name="ios-trash" />
			</TouchableOpacity>
		</View>
	)
}


const styles = StyleSheet.create({
	notFound: {
		flex: 1,
		justifyContent: 'center',
		alignItems: "center",
	},
	container: { flex: 1, backgroundColor: '#f5f5f5' },
	list: {
		flex: 1,
		padding: 20,
		paddingBottom: 0,
	},
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 7
	},
	baseItem: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: "center",
		borderColor: '#ddd',
		borderWidth: 1,
		marginBottom: 10,
		paddingVertical: 7,
		backgroundColor: '#fff',
	},
	lesson: {
		paddingLeft: 10,
	}

})
export default SaveItem;

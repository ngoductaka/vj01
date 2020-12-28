//saved_article ---
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Keyboard, View, FlatList, SafeAreaView, Text, StatusBar, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { KEY } from '../../handle/handleStorage';
import { ConfirmBox } from '../../component/ModalConfirm';
import {
	useData,
	RenderListLesson,
	HeaderSafeView
} from './component/handleSave';

const SaveArticle = memo((props) => {
	const { navigation } = props;
	const [value, handleSearch, deleteItem] = useData(KEY.saved_offline_article, []);
	const [keyDel, setKeyDel] = useState('');
	const onConfirm = () => {
		deleteItem(keyDel);
		setKeyDel('')
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<HeaderSafeView title="Bài học đã lưu" leftAction={() => navigation.goBack()} />
			<KeyboardAwareScrollView style={{ flex: 1 }}>
				<RenderListLesson
					data={value}
					navigation={navigation}
					handleSearch={handleSearch}
					deleteItem={setKeyDel}
				/>
			</KeyboardAwareScrollView>
			<ConfirmBox
				show={keyDel !== ''}
				text="Xoá bài học đã lưu?"
				onCancel={() => setKeyDel('')}
				onConfirm={onConfirm}
			/>
		</SafeAreaView>
	)
});
export default SaveArticle;

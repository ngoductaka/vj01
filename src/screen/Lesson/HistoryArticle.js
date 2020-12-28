//history_seen ---luu lich su bai hoc
import React, { useState, useEffect, useCallback, memo } from 'react';
import { SafeAreaView, } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KEY } from '../../handle/handleStorage';
import { ConfirmBox } from '../../component/ModalConfirm';

import {
	useData,
	RenderListLesson,
	HeaderSafeView
} from './component/handleSave';

const HistoryArticle = memo((props) => {
	const { navigation } = props;
	const [value, handleSearch, deleteItem] = useData(KEY.history_seen, [], 'history_seen');
	const [keyDel, setKeyDel] = useState('');
	const onConfirm = () => {
		deleteItem(keyDel);
		setKeyDel('')
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<HeaderSafeView leftAction={() => navigation.goBack()} />
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
				text="Xoá bài học đã xem?"
				onCancel={() => setKeyDel('')}
				onConfirm={onConfirm}
			/>
		</SafeAreaView>
	)
});
export default HistoryArticle;
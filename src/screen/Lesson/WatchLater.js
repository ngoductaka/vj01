//saved_article ---
import React, { useState, useEffect, useCallback, memo } from 'react';
import { 
    SafeAreaView, 
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { KEY } from '../../handle/handleStorage';
import { ConfirmBox } from '../../component/ModalConfirm';
import {
	useData,
	RenderListLesson,
    HeaderSafeView,
    RenderListVideo
} from './component/handleSave';

const SaveArticle = memo((props) => {
	const { navigation } = props;
	const [value, handleSearch, deleteItem] = useData(KEY.saved_video, []);
	const [keyDel, setKeyDel] = useState('');
	const onConfirm = () => {
		deleteItem(keyDel);
		setKeyDel('')
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<HeaderSafeView title="Video xem sau" leftAction={() => navigation.goBack()} />
			<KeyboardAwareScrollView style={{ flex: 1 }}>
				<RenderListVideo
					data={value}
					navigation={navigation}
					handleSearch={handleSearch}
					deleteItem={setKeyDel}
				/>
			</KeyboardAwareScrollView>
			<ConfirmBox
				show={keyDel !== ''}
				text="Xoá video xem sau?"
				onCancel={() => setKeyDel('')}
				onConfirm={onConfirm}
			/>
		</SafeAreaView>
	)
});
export default SaveArticle;

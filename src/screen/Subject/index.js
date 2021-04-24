import React, { useEffect, useState } from "react";
import { View, StatusBar, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';

import SubjectContent from '../../component/ListLesson';
import ViewContainer from "../../component/shared/ViewContainer";
import { GradientText } from "../../component/shared/GradientText";
import { fontMaker, fontStyles } from "../../utils/fonts";
import { helpers } from "../../utils/helpers";
import { SafeAreaView } from "react-navigation";
import api from '../../handle/api';
import { Snackbar } from "react-native-paper";

const Subject = (props) => {
	// 	books_count: 1
	// grade_id: 9
	// icon_id: 2
	// id: 65
	// title: "Ngữ văn"
	const currentClass = useSelector(state => state.userInfo.class);
	const [visible, setVisible] = useState(false);

	const subjectID = props.navigation.getParam('id', '');
	const subject = props.navigation.getParam('subject', '');
	const bookTitle = props.navigation.getParam('title', '');
	const activeLevel = props.navigation.getParam('activeLevel', []);
	const bookId = props.navigation.getParam('bookId', '');
	const source = props.navigation.getParam('source', '');

	useEffect(() => {
		if (subjectID)
			api.post(`subjects/${subjectID}/user`)
	}, [subjectID]);

	useEffect(() => {
		BackHandler.addEventListener(
			'hardwareBackPress',
			_handleBack
		);

		return () => {
			BackHandler.removeEventListener(
				'hardwareBackPress',
				_handleBack
			);
		}
	}, []);

	const _handleBack = () => {
		if (source == 'dic') {
			props.navigation.goBack()
		} else if (subject) {
			props.navigation.navigate('Book', {
				subjectID: subject,
			});
		} else {
			props.navigation.navigate('ClassScreen');
		}
		return true;
	}

	return (
		<View style={{ flex: 1 }}>
			<ViewContainer
				showRight={false}
				showLeft={true}
				onLeft={_handleBack}
				title={`${bookTitle}`}
				headerView={
					<View style={{ flex: 1, marginTop: 70 + helpers.statusBarHeight }}>
						<GradientText colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']} style={{ fontSize: 26, marginTop: 4, ...fontMaker({ weight: fontStyles.Bold }) }}>{bookTitle} {currentClass}</GradientText>
					</View>
				}
			>
				<SubjectContent navigation={props.navigation} visible={visible} setVisible={setVisible} subject={subject} subjectID={subjectID} navigation={props.navigation} activeLevel={activeLevel} bookId={bookId} />
			</ViewContainer>
			<SafeAreaView />
			<Snackbar
				visible={visible}
				duration={5000}
				wrapperStyle={{ padding: 0 }}
				style={{ marginBottom: 0, marginLeft: 0, marginRight: 0, borderRadius: 0, borderRadius: 0 }}
				onDismiss={() => setVisible(false)}
				action={{
					label: 'Xem ngay',
					onPress: () => {
						props.navigation.navigate('Bookmark');
					},
				}}>
				Đã thêm vào "Bookmarks"
            </Snackbar>
		</View>
	);
}

export default connect(
	(state) => ({ bookInfo: state.bookInfo }),
	null
)(Subject);
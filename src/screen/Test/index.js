import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import {
	View, FlatList, Text, StyleSheet, Platform,
	TouchableOpacity, Dimensions, Linking
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { get, isEmpty } from 'lodash';
import {
	Placeholder,
	PlaceholderMedia,
	PlaceholderLine,
	Fade,
} from "rn-placeholder";
import { withNavigationFocus } from 'react-navigation';
import { useSelector, useDispatch } from 'react-redux';

import { setUserInfo } from '../../redux/action/user_info';
import { Loading, useRequest } from '../../handle/api';
import { useRequest as useRequest_ } from '../../handle/api';

import RenderLesson from './component/RenderLesson';
import { SubjectChoosenModal } from '../../component/shared/SubjectChoosenModal';
import { fontSize, unitIntertitialId } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { helpers } from '../../utils/helpers';
import { GradientText } from '../../component/shared/GradientText';

import SubjectContent from './component/ListLesson';
import ViewContainer from '../../component/shared/ViewContainer';

const { width, height } = Dimensions.get('window');


/**-------------interstitial ad----------------- */
import firebase from 'react-native-firebase';
import { setLearningTimes } from '../../redux/action/user_info';
import { useDeepLink } from '../../utils/useDeeplink';
const AdRequest = firebase.admob.AdRequest;
let advert;
let request;

//  ========== show list subject class====================
const Test = (props) => {
	const currSubjectNameParams = props.navigation.getParam('currSubjectName', null);

	const [currSubject, setCurrSubject] = useState({ id: '', title: '' });
	const [isShowSubjectModal, setShowSubjectModal] = useState(false);
	// url detail class for subject 

	const userInfo = useSelector(state => state.userInfo);
	// 
	const currentClass = useSelector(state => state.userInfo.class);

	const detailClass = `subjects?grade_id=${currentClass}`;
	const [classData, isLoadingClass, errLoadingClass] = useRequest_(detailClass, [currentClass, 0]);


	let listSubjectInClass = [];

	if (classData) {
		listSubjectInClass = classData.data;
	}
	useEffect(() => {
		if (classData && classData.data && classData.data[0]) {
			const { id = '', title = '' } = classData.data[0];
			setCurrSubject({ id, title })
		}
	}, [classData])
	// handle deeplink
	useDeepLink(props.navigation);

	// interstial ad
	useEffect(() => {
		advert = firebase.admob().interstitial(unitIntertitialId);
		request = new AdRequest();
		request.addKeyword('facebook').addKeyword('google').addKeyword('instagram').addKeyword('zalo').addKeyword('google').addKeyword('pubg').addKeyword('asphalt').addKeyword('covid-19');
		advert.loadAd(request.build());
		if (!props.isFocused) {
			setShowSubjectModal(false);
		}
	}, []);

	useEffect(() => {
		if (props.isFocused && userInfo.class) {
			setTimeout(() => {
				setShowSubjectModal(true);
			}, 600);
		}
	}, [userInfo.class]);
	useEffect(() => {
		if (currSubjectNameParams !== null && !subjectTest) {
			setShowSubjectModal(true);
		}
	}, [currSubjectNameParams])

	const _onCloseSubject = () => { setShowSubjectModal(false) }
	const handleSelectSubject = (item) => {
		const { id = '', title = '' } = item;
		setCurrSubject({ id, title });
		setShowSubjectModal(false)
	};

	return (
		<ViewContainer
			style={styles.container}
			contentStyle={{ padding: 0 }}
			title='Thi online'
			showRight={false}
			headerView={
				<View style={{ padding: 10 }}>
					<View style={{ marginTop: 40 + helpers.statusBarHeight }}>
						<GradientText colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']} style={{ fontSize: 26, marginTop: 4, ...fontMaker({ weight: fontStyles.Bold }) }}>Thi online</GradientText>
					</View>
					{/* choose class and subject */}
					<View style={styles.chooseClass}>
						<TouchableOpacity
							onPress={() => setShowSubjectModal(true)}
							style={[styles.selectForm, styles.shadow]}
						>
							<Text style={{ color: '#000', ...fontMaker({ weight: 'Bold' }), fontSize: fontSize.h2, }}>{(`${currSubject.title} ${currentClass}`) || "Chọn môn"}</Text>
							<Icon type='FontAwesome5' style={{ color: '#646263', fontSize: 22, marginBottom: 7, marginRight: -3, marginLeft: 5 }} name='sort-down' />
						</TouchableOpacity>
					</View>
				</View>
			}
		>
			{/* bai hocj */}
			<Loading isLoading={isLoadingClass} err={errLoadingClass} com={LoadingCom}>
				<SubjectContent
					subjectID={currSubject.id}
					navigation={props.navigation}
					advert={advert}
				/>
			</Loading>

			{/* choose subject  */}
			<SubjectChoosenModal
				show={isShowSubjectModal}
				showCancel={isEmpty(listSubjectInClass) || currSubject.id !== ''}
				onClose={_onCloseSubject}
				isLoadingClass={isLoadingClass}
				onCloseSubject={() => { }}
				errLoadingClass={errLoadingClass}
				listSubjectInClass={listSubjectInClass}
				handleSelectSubject={handleSelectSubject}
			/>

		</ViewContainer >
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	selectForm: {
		// width: '50%',
		borderRadius: 10,
		backgroundColor: 'white',
		paddingHorizontal: 15,
		paddingVertical: 5,
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
	},
	chooseClass: {
		flexDirection: 'row',
		// justifyContent: 'space-around',
		marginTop: 15,
		marginBottom: 15,
	},
	listClass: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 20,
		padding: 10,

		borderRightWidth: 5,
		borderRightColor: '#dadede',
		borderLeftWidth: 1,
		borderLeftColor: '#dadede',
		borderBottomWidth: 3,
		borderBottomColor: '#dadada',

		borderBottomLeftRadius: 10
	},
	itemClass: {
		width: '45%',
		borderWidth: 2.5,
		borderColor: '#fdb55f',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: Platform.OS === 'ios' ? 6 : 4,
		// margin: index > 7 ? 0 : 24,
		borderRadius: 20
	},
	shadow: {
		backgroundColor: '#FFFFFF',
		shadowColor: 'rgba(0, 0, 0, 0.1)',
		shadowOpacity: 0.8,
		elevation: 6,
		shadowRadius: 10,
		shadowOffset: { width: 12, height: 13 },
	},
	searchHeader: {
		width: 40, height: 40,
		borderRadius: 20,
		justifyContent: 'center', alignItems: 'center',
		backgroundColor: 'white',
	},
})

const mapDispatchToProps = dispatch => {
	return {
		setUserInfo: (userInfo) => dispatch(setUserInfo(userInfo)),
	};
};

export default connect(
	(state) => ({
		userInfo: state.userInfo,
	}),
	mapDispatchToProps
)(withNavigationFocus(Test));

const RenderTableContent = (content, props, currSubject, currSubjectName) => {
	return (
		<View style={tblContentStyle.container}>
			<TouchableOpacity
				onPress={() => props.navigation.navigate('ExamFormat', { idDetail: content.id, currSubjectName: currSubjectName })}
				style={tblContentStyle.header}>
				<View style={[tblContentStyle.title]}>
					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
						<Icon name='book-open' type='MaterialCommunityIcons' style={{ fontSize: 30, color: '#FC652B' }} />
						<View style={tblContentStyle.textSwapper}>
							<Text style={tblContentStyle.textTitle}>{content.name} </Text>
						</View>
					</View>
					<Icon name='chevron-right' type='MaterialCommunityIcons' style={{ fontSize: 30, color: '#FC652B' }} />
				</View>
			</TouchableOpacity>
			{(content.courses && content.courses.length) ?
				(<View style={{ marginTop: 8, marginLeft: 10 }}>
					<FlatList
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ alignItems: 'center' }}
						horizontal={true}
						data={content.courses}
						renderItem={({ item }) => RenderLesson({ content: item, props, currSubject, currSubjectName, style: { marginRight: 10, width: (Dimensions.get('window').width - 55) / (helpers.isTablet ? 3 : 2) } })}
						keyExtractor={(item, index) => index + 'subitem'}
					/>
				</View>) : (
					<View style={{ marginVertical: 20, alignItems: "center", justifyContent: 'center', marginTop: 25 }}>
						<Text style={{ fontSize: 18, ...fontMaker({ weight: 'Regular' }), }}> Tài liệu đang được biên soạn ... </Text>
					</View>
				)
			}
		</View>
	)
}

const tblContentStyle = StyleSheet.create({
	container: { marginBottom: 10 },
	header: {
		paddingBottom: 5,
		paddingLeft: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		flexDirection: 'row',
		flex: 1,
		paddingRight: 5,
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	iconLeft: { color: 'black', fontSize: 30 },
	textSwapper: {
		justifyContent: "center",
		paddingRight: 25,
		paddingLeft: 10,
	},
	textTitle: { marginLeft: 10, color: '#000', fontSize: fontSize.h2, ...fontMaker({ weight: 'Black' }), },
	rightIcon: { color: 'black', fontSize: 19, marginRight: 10, color: "#444" }

})
const fullColor = [
	['#ff7e5f', '#feb47b'],
	['#799f0c', '#acbb78'],
	['#ffe000', '#799f0c'],
	['#f7941d', '#f7c85d'],
	['#5433ff', '#20bdff'],
	['#20bdff', '#a5fecb'],
	['#a5fecb', '#5433ff'],
	// ['#00416a', '#799f0c'],
	['#799f0c', '#ffe000'],
	// ['#ffe000', '#00416a'],
]

// const handleColor = () => {
// 	const index = Math.floor(Math.random() * (fullColor.length - 1))
// 	return fullColor[index]
// }
const LoadingCom = () => {
	return (
		<View style={{ flex: 1, padding: 20, width: width }}>
			{
				new Array(Math.floor(height / 125)).fill(null).map((i, index) => {
					return (
						<Placeholder
							style={{ marginBottom: 30 }}
							key={String(index)}
							Animation={Fade}
							Left={PlaceholderMedia}
						>
							<PlaceholderLine width={80} />
							<PlaceholderLine />
							<PlaceholderLine width={30} />
						</Placeholder>
					)
				})
			}

		</View>
	)
}
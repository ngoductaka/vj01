import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import {
	View,
	FlatList,
	SafeAreaView, ScrollView, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import { Icon, Card } from 'native-base';
import DropdownAlert from 'react-native-dropdownalert';
import { get } from 'lodash';
import {
	SCLAlert,
	SCLAlertButton
} from 'react-native-scl-alert';
import appleAuth, {
	AppleButton
} from '@invertase/react-native-apple-authentication';
import * as Animatable from 'react-native-animatable';

const isSupported = appleAuth.isSupported;
import { user_services } from '../../redux/services';

import { Loading, useRequest } from '../../handle/api';
import { actionLoginWithGoogle, actLoginWithFacebook, actLoginWithApple } from '../../redux/action/user_info';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { fontSize } from '../../handle/Constant';
import { GradientText } from '../../component/shared/GradientText';
import { handleSrc } from '../../component/menuItem';
import { handleImgSrc, handleImgTest, images } from '../../utils/images';
import { helpers } from '../../utils/helpers';
// import { ViewWithBanner } from '../../utils/facebookAds';

const Test = (props) => {

	const alertRef = useRef();

	const [showHeader, setShowHeader] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);

	useEffect(() => {
		if (isSupported) {
			user_services.fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
				updateCredentialStateForUser(`Error: ${error.code}`),
			);

			return appleAuth.onCredentialRevoked(async () => {
				user_services.fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
					updateCredentialStateForUser(`Error: ${error.code}`),
				);
			});
		}
	}, []);

	// const course = props.navigation.getParam('course', '');
	const course = 53;
	const currSubject = props.navigation.getParam('currSubject', '');
	const currSubjectName = props.navigation.getParam('currSubjectName', '');

	// console.log('--------', course);

	const apiGetCourses = `/multiple-choice/course/${course}`;
	const [listCourses, isLoadingListCourse, errLoadingListCourse] = useRequest(apiGetCourses, [course]);

	let dataCoursesConvert = get(listCourses, 'data.curriculum', null);

	const courseName = get(listCourses, 'data.name', '');
	// navigate
	const handleNavigate = useCallback((item) => {
		if (props.logged_in) {
			props.navigation.navigate('OverviewTest', { courseName, lessonName: item.name, currSubject, curriculum: item.id, title: `${currSubjectName} - LỚP ${props.userInfo.class}` });
		} else {
			setShowLogin(true);
		}
	}, [listCourses, props.logged_in]);

	const onAnalyseTest = useCallback((item) => {
		if (props.logged_in) {
			props.navigation.navigate('AnalyseTest', { courseName, lessonName: item.name, currSubject, curriculum: item.id, title: `${currSubjectName} - LỚP ${props.userInfo.class}` });
		} else {
			setShowLogin(true);
		}
	}, [listCourses, props.logged_in]);

	useEffect(() => {
		if (props.logged_in) {
			alertRef.current.alertWithType('success', `Chào mừng "${props.userInfo.user.first_name}"`, 'Hãy thử sức với bài kiểm tra của VietJack nhé!');
		}
	}, [props.logged_in]);

	const _signinWithApple = () => {
		setShowLogin(false);
		props.signinWithApple(updateCredentialStateForUser);
	}

	const _onScroll = (event) => {
		const currentOffset = event.nativeEvent.contentOffset.y;
		if (currentOffset > 60) {
			if (!showHeader) setShowHeader(true);
		} else {
			if (showHeader) setShowHeader(false);
		}
	}

	return (
		// <ImageBackground style={styles.container} source={images.bg}>
		<View style={{ backgroundColor: 'white', flex: 1 }}>
			<StatusBar backgroundColor={'#fff'} barStyle='dark-content' />
			<SafeAreaView style={{ flex: 1 }}>
				<Loading>
					<ScrollView
						style={{ flex: 1 }}
						scrollEventThrottle={120}
						onScroll={_onScroll}
					>
						<View style={{ paddingHorizontal: 15, flexDirection: 'row' }}>
							<View style={{ flex: 1, marginRight: 20, marginTop: 45 + helpers.statusBarHeight }}>
								<Text style={{ ...fontMaker({ weight: fontStyles.Light }) }}>Thi thử</Text>
								<GradientText style={{ fontSize: 22, marginTop: 4 }}>{courseName.trim()}</GradientText>
							</View>
							<Image
								source={handleSrc(currSubject)}
								style={{ width: 60, height: 60, marginTop: 35 }}
							/>
						</View>
						{dataCoursesConvert &&
							<FlatList
								style={{ marginTop: 20 }}
								data={dataCoursesConvert}
								renderItem={({ item, index }) => ListExams(item, index, handleNavigate, onAnalyseTest)}
								keyExtractor={(item, index) => index + 'subitem'}
							/>
						}
					</ScrollView>
					<View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', backgroundColor: showHeader ? 'white' : 'transparent', width: '100%', paddingVertical: 8 }}>
						<TouchableOpacity onPress={() => props.navigation.goBack()} style={[stylesListExams.backHeader, showHeader && { shadowColor: 'white' }]}>
							<Icon type='MaterialIcons' name='arrow-back' style={{ fontSize: 26, color: '#F86087' }} />
						</TouchableOpacity>
						{showHeader ?
							<Animatable.View animation='fadeIn' style={{ flex: 1, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
								<Text numberOfLines={1} style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: fontSize.h3 }}>{courseName.trim()}</Text>
							</Animatable.View>
							:
							<Animatable.View animation='fadeOut' duration={200} style={{ flex: 1, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
								<Text numberOfLines={1} style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: fontSize.h3 }}>{courseName.trim()}</Text>
							</Animatable.View>
						}
					</View>
				</Loading>
				<SCLAlert
					theme="warning"
					show={showLogin}
					headerIconComponent={<Icon type='FontAwesome5' name='user-graduate' style={{ color: 'white' }} />}
					title="VietJack"
					titleStyle={{ fontSize: 22, fontWeight: '700' }}
					subtitle="Học cùng bạn!"
					subtitleStyle={{ fontSize: 18 }}
					onRequestClose={() => {
						setShowLogin(false);
					}}
				>
					<AlertButton
						bgColor='#4368ad'
						icon='logo-facebook'
						iconSize={isSupported ? 16 : 26}
						style={{ paddingVertical: isSupported ? 12 : 6 }}
						text='Đăng nhập với Facebook'
						action={() => {
							setShowLogin(false);
							props.loginWithFacebook();
						}}
					/>
					<AlertButton
						bgColor='#d34e38'
						icon='logo-google'
						iconSize={isSupported ? 16 : 26}
						style={{ paddingVertical: isSupported ? 12 : 6 }}
						text='Đăng nhập với Google'
						action={() => {
							setShowLogin(false);
							props.loginWithGoogle();
						}}
					/>
					{isSupported &&
						<AppleButton
							style={styles.appleButton}
							cornerRadius={5}
							buttonStyle={AppleButton.Style.BLACK}
							buttonType={AppleButton.Type.SIGN_IN}
							onPress={_signinWithApple}
						/>
					}

					<SCLAlertButton containerStyle={{}} onPress={() => {
						setShowLogin(false);
					}}>
						<View style={{ flexWrap: 'wrap', borderBottomWidth: 1, alignSelf: 'center', borderBottomColor: 'rgba(0, 0, 0, 0.2)', paddingHorizontal: 4 }}>
							<Text style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.6)' }}>Để sau</Text>
						</View>
					</SCLAlertButton>

				</SCLAlert>
			</SafeAreaView>
			<DropdownAlert ref={alertRef} />
			{/* </ImageBackground> */}
		</View>
	)
};

const ListExams = (item, index, handleNavigate, onAnalyseTest) => {
	return (
		<View style={stylesListExams.contentMenu}>
			<View style={{ flex: 1 }}>
				<Text
					numberOfLines={3}
					style={{
						textTransform: 'capitalize',
						color: '#575757',
						lineHeight: 22,
						fontSize: fontSize.h3,
						...fontMaker({ weight: fontStyles.SemiBold })
					}}
				>
					{item.name}
				</Text>
			</View>
			{index === 0 &&
				<TouchableOpacity onPress={() => onAnalyseTest(item)} style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
					<GradientText colors={['#1A66C3', '#29C3AB', '#29C3AB', '#29C3AB']} style={{ ...fontMaker({ weight: fontStyles.Regular }) }}>Phân tích</GradientText>
					<Icon name='ios-stats' style={{ color: '#29C3AB', fontSize: 20, marginLeft: 8, marginTop: 3 }} />
				</TouchableOpacity>
			}
			<TouchableOpacity onPress={() => handleNavigate(item)} style={{ marginLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
				<GradientText style={{ ...fontMaker({ weight: fontStyles.Regular }) }}>Bắt đầu</GradientText>
				<Icon name='ios-arrow-forward' style={{ color: '#F580CE', fontSize: 20, marginLeft: 8, marginTop: 3 }} />
			</TouchableOpacity>
		</View>
	)
}

const stylesListExams = StyleSheet.create({
	contentMenu: {
		borderBottomColor: '#D9D9D9',
		borderBottomWidth: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingHorizontal: 15,
		paddingVertical: 18,
		alignItems: 'center'
	},
	backHeader: {
		width: 40, height: 40, borderRadius: 20, marginLeft: 10,
		justifyContent: 'center', alignItems: 'center',
		backgroundColor: 'white',
		shadowColor: "#000",
		shadowOffset: {
			width: 2,
			height: 6,
		},
		shadowOpacity: 0.37,
		shadowRadius: 10.49,

		elevation: 12,

	}
})

const AlertButton = (props) => {
	const { bgColor = '#d34e38', action = () => { }, icon, text = '', iconSize = 26, style } = props;
	return (
		<SCLAlertButton containerStyle={{ backgroundColor: bgColor, paddingVertical: 6, borderRadius: 5, ...style }} onPress={action}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				{icon &&
					<Icon name={icon} style={{ color: 'white', marginRight: 7, fontSize: iconSize }} />
				}
				<Text style={{ color: 'white', fontSize: 14 }}>{text}</Text>
			</View>
		</SCLAlertButton>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	appleButton: {
		width: '100%',
		paddingVertical: 20,
		marginTop: 15
	},
})

const mapDispatchToProps = dispatch => {
	return {
		loginWithGoogle: () => dispatch(actionLoginWithGoogle()),
		loginWithFacebook: () => dispatch(actLoginWithFacebook()),
		signinWithApple: (data) => dispatch(actLoginWithApple(data)),
	};
};

export default connect(
	(state) => ({
		userInfo: state.userInfo,
		logged_in: state.userInfo.logged_in
	}),
	mapDispatchToProps
)(Test);

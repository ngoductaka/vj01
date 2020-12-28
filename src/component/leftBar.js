import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Keyboard, ScrollView, Platform, Linking, ImageBackground } from 'react-native';
import { Icon } from 'native-base';
import { LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import { connect } from 'react-redux';
import { useNetInfo } from "@react-native-community/netinfo";
import appleAuth, {
	AppleButton
} from '@invertase/react-native-apple-authentication';

import { images } from '../utils/images';
import { actionLoginWithGoogle, actLoginWithFacebook, actLogout, actLoginWithApple } from '../redux/action/user_info';
import { saveItem, KEY } from '../handle/handleStorage';

import { ConfirmBox as ModalInfoBox } from './ModalConfirm';
import { user_services } from '../redux/services';

const { height } = Dimensions.get('window');

const convertHeight = i => i * 683 / height;
const isSupported = appleAuth.isSupported;

const LeftContent = (props) => {

	const [show, setShow] = useState(false);
	const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);

	useEffect(() => {
		if (isSupported) {
			user_services.fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
				updateCredentialStateForUser(`Error: ${error.code}`),
			);
		}
		return () => { };
	}, []);

	useEffect(() => {
		if (isSupported) {
			return appleAuth.onCredentialRevoked(async () => {
				console.warn('Credential Revoked');
				user_services.fetchAndUpdateCredentialState(updateCredentialStateForUser).catch(error =>
					updateCredentialStateForUser(`Error: ${error.code}`),
				);
			});
		}
	}, []);

	const _signinWithApple = () => {
		props.signinWithApple(updateCredentialStateForUser);
	}

	const { navigation, userInfo, loginWithGoogle, loginWithFacebook, logout } = props;
	return (
		<ImageBackground
			source={images.bg_menu}
			style={{ width: '100%', height: '100%' }}
		>
			<SafeAreaView style={stylesGlobal.safeView}>
				<User setShow={() => setShow(true)} logout={logout} loginWithFacebook={loginWithFacebook} loginWithGoogle={loginWithGoogle} signinWithApple={_signinWithApple} userInfo={userInfo} navigation={navigation} />
				<ListFunction data={listFunction} navigation={navigation} />
				<ModalInfoBox show={show} onCancel={() => setShow(false)} text="Không có internet !" cancelText="Back" isInfo={true} />
				<Version />
			</SafeAreaView>
		</ImageBackground>
	);

};


const Version = () => {
	return (
		<View style={verStyles.versionInf}>
			<Text style={[verStyles.text]}>Phiên bản 1.2.5</Text>
			{/* <Text style={[verStyles.text]}>Phiên bản Stg 1.1.0</Text> */}
		</View>
	)
};

const verStyles = StyleSheet.create({
	versionInf: {
		borderTopWidth: 1,
		borderColor: '#ddd',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10
	},
	text: {
		color: 'white'
	}

});

const User = (props) => {
	const netInfo = useNetInfo();

	const _loginWithGoogle = () => {
		if (!netInfo.isConnected) {
			props.setShow()
		} else props.loginWithGoogle();
	}

	const _loginWithFacebook = () => {
		if (!netInfo.isConnected) {
			props.setShow()
		} else props.loginWithFacebook();
	}

	const _signinWithApple = () => {
		if (!netInfo.isConnected) {
			props.setShow()
		} else props.signinWithApple();
	}

	const _logout = () => {
		if (!netInfo.isConnected) {
			props.setShow()
		} else {
			if (GoogleSignin.isSignedIn) {
				GoogleSignin.signOut()
					// .then(() => console.log('user signed out. do your job!'))
					.catch(err => console.error('sum tim wong', err));
			}
			LoginManager.logOut();
			saveItem(KEY.saved_user, null);
			props.logout();
		}
	}

	return (
		props.userInfo.logged_in ?
			<View style={{ height: null, width: '100%', display: 'flex', flexDirection: 'row', borderBottomColor: '#ddd', borderBottomWidth: 1, padding: 8 }}>
				<View style={{ height: convertHeight(75), width: convertHeight(75), borderRadius: convertHeight(75) / 2, overflow: 'hidden' }}>
					<Image
						source={{ uri: props.userInfo.user.thumbnail }}
						style={{ flex: 1, width: null, height: null }}
					/>
				</View>
				<View style={{ flex: 1, height: convertHeight(75), justifyContent: "space-around", alignItems: 'flex-start', marginLeft: 8 }}>
					<Text style={[stylesGlobal.text]}>{props.userInfo.user.first_name}</Text>
					<TouchableOpacity onPress={_logout} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, backgroundColor: '#1f72b2', }}>
						<Text style={{ color: 'white' }}>Đăng xuất</Text>
					</TouchableOpacity>
				</View>
			</View>
			:
			<View style={{ paddingHorizontal: 12, borderBottomColor: '#ddd', borderBottomWidth: 1, marginBottom: 1, paddingBottom: 20, paddingTop: 15 }}>
				{isSupported ?
					<View>
						<Text style={{ textAlign: 'center', fontWeight: '500', fontSize: 15 }}>Học cùng VietJack!</Text>
						<TouchableOpacity onPress={_loginWithFacebook} style={{ ...stylesGlobal.loginBtn, backgroundColor: '#1f72b2' }}>
							<Icon name='logo-facebook' style={{ color: 'white', fontSize: 26, }} />
							<Text style={{ color: 'white', fontWeight: '700', marginLeft: 10 }}>Đăng nhập với Facebook</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={_loginWithGoogle} style={{ ...stylesGlobal.loginBtn, backgroundColor: '#d34e38' }}>
							<Icon name='logo-googleplus' style={{ color: 'white', fontSize: 26, }} />
							<Text style={{ color: 'white', fontWeight: '700', marginLeft: 10 }}>Đăng nhập với Google</Text>
						</TouchableOpacity>
						<AppleButton
							style={stylesGlobal.appleButton}
							cornerRadius={5}
							buttonStyle={AppleButton.Style.WHITE}
							buttonType={AppleButton.Type.SIGN_IN}
							onPress={_signinWithApple}
						/>
					</View>
					:

					<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
						<Image
							source={images.vietjack}
							style={{ width: 90, height: 90, resizeMode: 'contain' }}
						/>
						<View style={{ flex: 1 }}>
							<Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 15, color: 'white' }}>Đăng nhập với</Text>
							<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 15 }}>
								<TouchableOpacity onPress={_loginWithFacebook} style={{ ...stylesGlobal.socialBtn, ...stylesGlobal.shadowStyle, backgroundColor: '#4368ad', marginRight: 30 }}>
									<Icon name='logo-facebook' style={{ color: 'white', fontSize: 20, }} />
								</TouchableOpacity>
								<TouchableOpacity onPress={_loginWithGoogle} style={{ ...stylesGlobal.socialBtn, ...stylesGlobal.shadowStyle, backgroundColor: '#d34e38', }}>
									<Icon name='logo-googleplus' style={{ color: 'white', fontSize: 20, }} />
								</TouchableOpacity>
							</View>
						</View>
					</View>
				}
			</View>
	)
}

const ListFunction = ({ data = [1, 2, 3, 4, 3, 3], navigation }) => {
	return (
		<View style={{ flex: 1 }}>
			<ScrollView style={{ flex: 1 }}>
				{data.map((item, index) => <ItemFunction data={item} showBorder={index !== data.length - 1} key={`${index}`} navigation={navigation} />)}
			</ScrollView>
		</View>
	)
}

const _goToStore = () => {
	Linking.openURL(Platform.OS === 'ios' ?
		'https://apps.apple.com/us/app/vietjack/id1490262941?ls=1'
		:
		'https://play.google.com/store/apps/details?id=com.jsmile.android.vietjack');
}

const ItemFunction = ({ data = {}, navigation, showBorder }) => {
	const { icon = 'icon_doi_lop', title = "ddddddddddddddddddd", navigation: screen, out } = data;
	const handleOnPress = () => {
		navigation.closeDrawer();
		if (out) {
			_goToStore();
		} else {
			navigation.navigate(screen);
		}
		Keyboard.dismiss();
	}
	return (
		<TouchableOpacity onPress={handleOnPress} style={[{ alignItems: 'center' }, stylesGlobal.baseItem, { borderBottomWidth: showBorder ? 0.5 : 0 }]}>
			<View style={{
				marginLeft: 16,
				marginRight: 8,
				alignItems: 'center',
			}}>
				<Image
					style={stylesGlobal.image}
					resizeMode="contain"
					source={images[icon]}
				/>
			</View>
			<Text numberOfLines={1} style={{ color: 'white', fontWeight: '600' }}>{title}</Text>
		</TouchableOpacity>
	)
}

const stylesGlobal = StyleSheet.create({
	loginBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', paddingVertical: 5, borderRadius: 5, marginTop: 15 },
	appleButton: {
		width: '100%',
		paddingVertical: 20,
		marginTop: 15
	},
	shadowStyle: { shadowColor: 'black', shadowOffset: { width: -2, height: 2 }, shadowOpacity: 0.6, elevation: 2 },
	textBtn: { color: 'white', marginLeft: 8 },
	socialBtn: { justifyContent: 'center', alignItems: 'center', width: convertHeight(45), height: convertHeight(45), borderRadius: convertHeight(45) / 2, },
	image: {
		marginRight: 7,
		width: 20,
		height: 20,
		tintColor: 'white'
	},
	safeView: {
		flex: 1,
	},
	baseItem: { width: '100%', flexDirection: 'row', borderBottomColor: '#ddd', paddingVertical: 15 },
	text: { fontSize: 16, fontWeight: '600' }
})


const listFunction = [
	// {
	// 	title: 'Đổi môn',
	// 	icon: 'icon_doi_mon',
	// 	navigation: 'MainContent',
	// 	out: false
	// },
	// {
	// 	title: 'Đổi Lớp',
	// 	icon: 'icon_doi_lop',
	// 	navigation: 'Home',
	// 	out: false
	// },
	{
		title: 'Bài viết đã lưu',
		icon: 'icon_save_article',
		navigation: 'SavedArticle',
		out: false
	},
	{
		title: 'Lưu offline',
		icon: 'icon_save_offline',
		navigation: 'SavedOffline',
		out: false
	},
	{
		title: 'Bài viết đã xem',
		icon: 'icon_seen',
		navigation: 'HistoryArticle',
		out: false
	},
	{
		title: 'Bình chọn 5+',
		icon: 'icon_vote',
		navigation: '',
		out: true
	},
	// {
	// 	title: 'Chia sẻ ứng dụng',
	// 	icon: 'icon_share',
	// 	navigation: '',
	// },
	// {
	// 	title: 'Góp ý',
	// 	icon: 'icon_comment',
	// 	navigation: 'FeedBack',
	// 	out: false
	// },
	// {
	// 	title: 'Thông báo',
	// 	icon: 'icon_thong_bao',
	// 	navigation: '',
	// },
];

const mapStateToProps = state => {
	const { userInfo } = state;
	return { userInfo };
};

const mapDispatchToProps = dispatch => {
	return {
		loginWithGoogle: () => dispatch(actionLoginWithGoogle()),
		loginWithFacebook: () => dispatch(actLoginWithFacebook()),
		signinWithApple: (updateCredentialStateForUser) => dispatch(actLoginWithApple(updateCredentialStateForUser)),
		logout: () => dispatch(actLogout()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LeftContent);

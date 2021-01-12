import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { withNavigation } from 'react-navigation';
import { connect, useDispatch } from 'react-redux';
import Toast from 'react-native-simple-toast';

import { saveItem, getItem, KEY } from './handleStorage';
import uuidv4 from 'uuid/v4';
import Store from '../redux/store';
import { setUserInfo, setRatingStatus, setCurrentTime } from '../redux/action/user_info';
import NavigationService from '../Router/NavigationService';
import { endpoints } from '../constant/endpoints';
import { Constants, TIMEOUT } from './Constant';

const { height, width } = Dimensions.get('window');
const defaultHeader = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
};

const request = axios.create({
	// for stg
	// baseURL: 'http://192.168.2.172:80/api',
	// for product
	baseURL: endpoints.BASE_URL,
	// baseURL: 'http://192.168.2.172/api/',
	timeout: TIMEOUT,
	headers: defaultHeader,
});

// Add a request interceptor
request.interceptors.request.use(
	async config => {
		const { userInfo = {} } = Store.getState() || {};
		const { imei = "" } = userInfo;
		const token = await getItem(Constants.ACCESS_TOKEN);
		// console.log('---------token--', token, '----------------');
		if (token) config.headers['Authorization'] = `Bearer ${token}`;
		if (imei) config.headers['imei'] = imei;
		if (!token) NavigationService.navigate('Login');
		return config;
	},
	error => {
		Promise.reject(error)
	});

// Add a response interceptor
request.interceptors.response.use((response) => {
	return response;
}, async function (error) {
	if (!error.response) {
		return Promise.reject(error);
	}
	// console.log('<error_ request.interceptors.response>', error.response)
	const originalRequest = error.response.config;
	// console.log('-----ssssss', originalRequest);

	// refresh token expired
	if (error.response.status === 401 && originalRequest.url === `${endpoints.SOCIAL_LOGIN}`) {
		NavigationService.navigate('Login');
		return Promise.reject(error);
	}

	if (error.response.status === 401 && !originalRequest._retry) {
		originalRequest._retry = true;
		// const refreshToken = await getItem(Constants.REFRESH_TOKEN);
		// const accountId = await getItem(Constants.ACCOUNT_ID);
		const loginType = await getItem(Constants.TYPE_LOGIN);
		// console.log('----asa-sa-s-a-sa-s-as', loginType);
		if (loginType != 2) {
			const socialToken = await getItem(Constants.SOCIAL_TOKEN);
			// console.log('-1-21-2-12-12', socialToken);
			return request.post(endpoints.SOCIAL_LOGIN,
				{
					token: socialToken,
					type: loginType
				}).then(res => {
					// console.log('----new--token--acc----', res);
					if (res.status === 200) {
						// console.log('originalRequest', originalRequest);
						saveItem(Constants.ACCESS_TOKEN, res.data.access_token);
						request.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
						return request(originalRequest);
					}
				})
				.catch(err => {
					NavigationService.navigate('Login');
					// console.log('eeeeeee', err)
				});
		} else { // apple login
			const applePayload = await getItem(Constants.APPLE_PAYLOAD);
			return request.post(`${endpoints.SOCIAL_LOGIN}`,
				{
					...applePayload
				}).then(res => {
					// console.log('----new--token--acc----', res);
					if (res.status === 200) {
						// console.log('originalRequest', originalRequest);
						saveItem(Constants.ACCESS_TOKEN, res.data.data.access_token);
						request.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.access_token}`;
						return request(originalRequest);
					}
				})
				.catch(err => {
					NavigationService.navigate('Login');
					// console.log('eeeeeee', err)
				});
		}
	}

	return Promise.reject(error.response);
});

const api = {
	get: (url, baseURL = endpoints.BASE_URL) => {
		console.log('<get_url>', url)
		return request({
			method: 'get',
			baseURL,
			url: url
		})
			.then(response => {
				return response.data;
			})
			.catch(err => {
				// console.log('----error------', err);
				throw err;
			});
	},
	// post: (url, data, header = {}) => {
	// 	console.log('<--post-->', url, data, header);
	post: (url, data, header = {}, baseURL = endpoints.BASE_URL) => {
		console.log('post ', { url }, { data });
		return request({
			method: 'post',
			url: url,
			baseURL,
			data: data,
			headers: {
				...defaultHeader,
				...header
			},
		})
			.then(response => {
				// console.log('=====response', response)
				return response && response.data;
			})
			.catch(err => {
				// if (err.response) {
				// 	console.log('error1', err.response.data);
				// 	console.log('error2', err.response.status);
				// 	console.log('error3', err.response.headers);
				// } else if (err.request) {
				// 	console.log('error4', err.request);
				// } else {
				// 	console.log('Error==', err.message);
				// }
				// return err;
				throw err;
			});
	},
	delete: (url, data, baseURL = endpoints.BASE_URL) => {
		return request({
			method: 'delete',
			url: url,
			baseURL,
			data: data,
		})
			.then(response => {
				return response;
			})
			.catch(err => {
				return err;
			})
	},
	put: (url, data, baseURL = endpoints.BASE_URL) => {
		return request({
			method: 'put',
			url: url,
			baseURL,
			data: data,
		})
			.then(response => {
				return response;
			})
			.catch(err => {
				return err;
			})
	}
};

export const handleUserID = async () => {
	const userId = await getItem(KEY.userID);

	if (userId) {
		Store.dispatch(setUserInfo({ imei: userId }))
	} else {
		const userIdNew = uuidv4();
		saveItem(KEY.userID, `${userIdNew}`);
		Store.dispatch(setUserInfo({ imei: userIdNew }))
	}
}

export const handleTimeInfo = async () => {
	const ratingStatus = await getItem(KEY.rating_vietjack_app);

	if (ratingStatus && ratingStatus == 2) {
		Store.dispatch(setRatingStatus(2));
	} else {
		const currentTime = Date.now();
		Store.dispatch(setCurrentTime(currentTime));
		Store.dispatch(setRatingStatus(0));
	}
}

const useRequest = (url, context = [], delay = 0, method = 'get', header, payload) => {
	const [data, setData] = useState(null);
	const [err, setErr] = useState(null);
	const [isNoNet, netNoInternet] = useState(false);
	const netInfo = useNetInfo();
	const [recall, setRecall] = useState(0);

	const dispatch = useDispatch();

	let clear = () => { };

	useEffect(() => {
		const keyRecall = new Date().getTime();
		if (context[0]) {
			if (data !== null) setData(null);
			if (err !== null) setErr(null);
			api[method](url, header, payload)
				.then(data => {
					netNoInternet(false);
					if (data === null) {
						setErr('no_data')
					} else {
						setData(data);
					}
				})
				.catch(err => {
					if (!netInfo.isConnected) { // no internet
						Toast.showWithGravity("Mất kết nối internet", Toast.SHORT, Toast.TOP);
						netNoInternet(true);
						// console.log('<no internet>')
						const listPreRecall = Store.getState().userInfo.reCall || {};
						const listRecall = {
							...listPreRecall,
							[keyRecall]: setRecall,
						}
						dispatch(setUserInfo({ reCall: listRecall }))
						clear = NetInfo.addEventListener(state => {
							if (state.isConnected) {
								setRecall(() => new Date());
								clear();
							}
						});
					} else {
						netNoInternet(false);
						// console.log('<errors useRequest> ', err)
						const listRecall = Store.getState().userInfo.reCall || {};
						delete listRecall[keyRecall];
						dispatch(setUserInfo({ reCall: listRecall }))
						setErr(err);
					}
				})
		}
		return () => {
			const listRecall = Store.getState().userInfo.reCall || {};
			delete listRecall[keyRecall];
			Store.dispatch(setUserInfo({ reCall: listRecall }))
			clear();
		}
	}, [...context, recall]);
	return [data, data === null && err === null, err, isNoNet];
}



const UseAnimation = (loaded) => {

	const [animation] = useState(new Animated.Value(0));
	const rotage = () => {
		Animated.loop(
			Animated.timing(animation, {
				toValue: 1,
				duration: 2500
			})
		).start();
	}
	if (loaded) rotage();

	const backdrop = {
		transform: [
			{
				rotate: animation.interpolate({
					inputRange: [0, 0.4, 1],
					outputRange: [`0deg`, `360deg`, '720deg'],
				}),
			},
		],
		backgroundColor: animation.interpolate({
			inputRange: [0, 0.2, 0.6, 1],
			outputRange: ['#f7941d', '#f7941d', `green`, 'red'],
		}),
	};

	return [backdrop];
}

export const Loading_animation = (props) => {
	const { isLoading, err } = props;
	const [animationStyle] = UseAnimation(props.isLoading);

	const LoadingAnimated = () => {
		return (
			<View style={styles.containerAnimation}>
				<Animated.View style={[styles.loadIcon, animationStyle]}>
					<View style={styles.top}>
						<View style={styles.inTop} />
					</View>
					<View style={styles.bottom}>
						<View style={styles.inBottom} />
					</View>
				</Animated.View>
			</View>
		)
	}
	if (err) {
		let message = 'some thing wrong';
		if (err.message == "Network Error") {
			message = "can't connect to server... "
		}
		return (
			<View style={styles.containerAnimation}>
				<Text> {message} </Text>
			</View>
		)
	}

	return isLoading ?
		<LoadingAnimated /> :
		props.children;
}

const LoadingD = (props) => {
	const { isLoading, err, com = null } = props;
	const netInfo = useNetInfo();
	const [showLogin, setShowLogin] = useState(false);
	const [isConnected, setConnect] = useState(true);

	useEffect(() => {
		let t = null;
		if (!netInfo.isConnected) {
			t = setTimeout(() => {
				setConnect(netInfo.isConnected)
			}, 10000)
		} else {
			setConnect(netInfo.isConnected)
		}
		return () => {
			clearTimeout(t);
		}
	}, [netInfo.isConnected])

	if (err) {
		// console.log('err loading ------ : ', err)
		let message = 'Hệ thống đang bảo trì!';
		if (!isConnected) {
			message = "Vui lòng kiểm tra kết nối internet"
		} else if (err === 'no_data') {
			message = "Tài liệu đang được biên soạn ..."
		}
		return (
			<TouchableOpacity
				onPress={() => {
					if (err === 'no_data') props.navigation.goBack()
					else if (props.userInfo && props.userInfo.reCall) {
						Object.keys(props.userInfo.reCall).map(key => {
							// alert(key+isConnected)
							props.userInfo.reCall[key](new Date())
						})
					} else if (props.setRecall) {
						props.setRecall(new Date())
					} else {
						if (props.navigation && props.navigation.goBack)
							props.navigation.goBack()
					}
				}} style={styles.base}>
				<LottieView
					autoPlay
					loop
					style={{ width: width, height: 250 }}
					// 5401-loading-19-satellite-dish
					source={err === 'no_data' ? require('../public/8026-taking-notes.json') : require('../public/5401-loading-19-satellite-dish.json')}
				/>
				<Text style={{ fontWeight: '500', fontSize: 18 }}> {message} </Text>
				<View
					onPress={() => {
						if (props.userInfo && props.userInfo.reCall) {
							Object.keys(props.userInfo.reCall).map(key => {
								// alert(key+isConnected)
								props.userInfo.reCall[key](new Date())
							})
						} else if (props.setRecall) {
							props.setRecall(new Date())
						} else {
							if (props.navigation && props.navigation.goBack)
								props.navigation.goBack()
						}
					}}
					style={{
						padding: 7, paddingHorizontal: 15, borderRadius: 10,
						//  backgroundColor: '#dedede'
					}}
				>
					{err === 'no_data' ? null : <Text> Vui lòng thử lại sau</Text>}
				</View>
			</TouchableOpacity>
		)
	}
	if (isLoading) {
		return (
			<View style={styles.base}>
				{com && isConnected ? com()
					:
					<LottieView
						autoPlay
						loop
						style={{ width: 250, height: 250 }}
						source={!isConnected ?
							require('../public/5401-loading-19-satellite-dish.json') :
							require('../public/201-simple-loader.json')
						}
					/>
				}
				{
					!isConnected &&
					(
						<TouchableOpacity
							onPress={() => {
								if (props.userInfo && props.userInfo.reCall) {
									Object.keys(props.userInfo.reCall).map(key => {
										props.userInfo.reCall[key](new Date())
									})
								}
								if (props.setRecall) {
									props.setRecall(new Date())
								}
							}}
							style={{
								justifyContent: "flex-start",
								alignItems: "center",
							}}>
							<Text style={{ fontSize: 18, fontWeight: '400' }}>Vui lòng kiểm tra kết nối internet</Text>
							{/* <Button
								light
								style={{ padding: 7, paddingHorizontal: 15, borderRadius: 10, backgroundColor: '#fff', marginTop: 5 }}
							> */}
							<Text>Thử lại</Text>
							{/* </Button> */}
							{/* <Text>Thử lại</Text>
							</View> */}
						</TouchableOpacity>
					)
				}
			</View>
		)
	} else {
		return (
			<View style={{ flex: 1 }}>
				{props.children}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	base: { flex: 1, justifyContent: 'center', alignItems: 'center', },
	loadIcon: {
		height: 100,
		width: 100,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 100,
	},
	containerAnimation: {
		height: height * 0.8,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	top: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: 51,
		width: 100,
		borderTopRightRadius: 50,
		borderTopLeftRadius: 50,
	},
	inTop: {
		height: 40,
		width: 80,
		backgroundColor: '#fff',
		borderTopRightRadius: 50,
		borderTopLeftRadius: 50
	},
	bottom: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: 51,
		width: 100,
		backgroundColor: '#fff',
		borderBottomRightRadius: 50,
		borderBottomLeftRadius: 50
	},
	inBottom: {
		height: 40,
		width: 80,
		backgroundColor: '#fff',
		borderBottomRightRadius: 50,
		borderBottomLeftRadius: 50
	}
})

const Loading = connect(
	({ userInfo }) => ({ userInfo }),
	() => ({})
)(withNavigation(LoadingD));

export default api;
export {
	Loading,
	useRequest
}
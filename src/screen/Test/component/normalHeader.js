import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, Image, StatusBar } from 'react-native';
import { Icon } from 'native-base';
import { useSelector } from 'react-redux';
import { withNavigation } from 'react-navigation';

import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { isIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper'
import { images, mapImg } from '../../../utils/images';
import { COLOR } from '../../../handle/Constant';
import { helpers, getCurrentDate } from '../../../utils/helpers';

// #1.2.6

const listGradient = [
	['#f48e37', '#ffefc1', '#ffefc1',],
]

const NormalHeader = (props) => {
	const {
		title = '',
		subtitle = '',
		navigation,
		isMenu = false,
		showRight = true,
		leftAction = () => navigation.goBack(),
	} = props;

	const userInfo = useSelector(state => state.userInfo.user);

	return (
		// <SafeAreaView style={{ height: isIphoneX() ? 86: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
		// 	<StatusBar
		// 		backgroundColor={COLOR.statusBar}
		// 		barStyle="light-content"
		// 	/>

		// 	<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
		// 		<View style={{ marginBottom: isIphoneX() ? 2: 0}} >
		// 			{!isMenu ?
		// 				<TouchableOpacity onPress={() => leftAction()} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
		// 					<View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.7)' }}>
		// 						<Icon type='MaterialCommunityIcons' name='arrow-left' style={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.7)' }} />
		// 					</View>
		// 				</TouchableOpacity>
		// 				:
		// 				<TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'white' }} onPress={() => navigation.navigate('Profile')}>
		// 					{userInfo.thumbnail ?
		// 						(
		// 							userInfo.first_name ?
		// 								<FastImage
		// 									style={{ flex: 1, width: null, height: null }}
		// 									source={{
		// 										uri: userInfo.thumbnail,
		// 										priority: FastImage.priority.normal,
		// 									}}
		// 									resizeMode={FastImage.resizeMode.cover}
		// 								/>
		// 								:
		// 								<View style={{ backgroundColor: '#97928F', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
		// 									<Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>{userInfo.first_name && userInfo.first_name.charAt(0).toUpperCase()}</Text>
		// 								</View>
		// 						)
		// 						:
		// 						(
		// 							<View style={{ flex: 1, backgroundColor: 'white', padding: 3 }}>
		// 								<Image
		// 									source={images.logo_ios}
		// 									style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
		// 								/>
		// 							</View>
		// 						)
		// 					}
		// 				</TouchableOpacity>
		// 			}
		// 		</View>
		// 		<View style={{ flex: 7 }}>
		// 			<Text style={{ color: "#54a4c4", fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>{title}</Text>
		// 		</View>
		// 		{
		// 			showRight ?
		// 				<TouchableOpacity
		// 					style={{ alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}
		// 				>
		// 					<Icon name="search" style={{ fontSize: 26, color: 'white' }} />
		// 				</TouchableOpacity>
		// 				:
		// 				<View style={{ flex: 1 }} />
		// 		}
		// 	</View>
		// </SafeAreaView>
		<View style={{ height: (helpers.isIpX ? 100 : 80) + helpers.statusBarHeight }}>
			
			<StatusBar backgroundColor={'#fff'} barStyle='dark-content' />
			<LinearGradient
				colors={['#D34026', '#FB862B']}
				style={{ flex: 1, borderBottomLeftRadius: 42, borderBottomRightRadius: 42 }}
				start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
			>
				<View style={{ flex: 1, marginTop: helpers.isIpX ? helpers.statusBarHeight : 10, justifyContent: 'space-around', paddingVertical: 6 }}>
					<View style={{ paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', }}>
						<TouchableOpacity style={{ width: 48, height: 48, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'white' }} onPress={leftAction}>
							{userInfo.thumbnail ?
								(
									userInfo.first_name ?
										<FastImage
											style={{ flex: 1, width: null, height: null }}
											source={{
												uri: userInfo.thumbnail,
												priority: FastImage.priority.normal,
											}}
											resizeMode={FastImage.resizeMode.cover}
										/>
										:
										<View style={{ backgroundColor: '#97928F', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
											<Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>{userInfo.first_name && userInfo.first_name.charAt(0).toUpperCase()}</Text>
										</View>
								)
								:
								(
									<View style={{ flex: 1, backgroundColor: 'white', padding: 3 }}>
										<Image
											source={images.logo_ios}
											style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
										/>
									</View>
								)
							}
						</TouchableOpacity>
						<View style={{ flex: 7 }}>
							<Text style={{ color: "white", fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>{title}</Text>
						</View>
						{
							showRight ?
								<TouchableOpacity
									style={{ alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}
								>
									<Icon name="search" style={{ fontSize: 26, color: 'white' }} />
								</TouchableOpacity>
								:
								<View style={{ flex: 1 }} />
						}
					</View>
					<View style={{ justifyContent: 'center', alignItems: 'center' }}>
						<Text style={{ fontSize: 15, color: 'white', fontWeight: '600' }}>{getCurrentDate()}</Text>
					</View>
				</View>
			</LinearGradient>
		</View>
	)
};

export default withNavigation(NormalHeader);


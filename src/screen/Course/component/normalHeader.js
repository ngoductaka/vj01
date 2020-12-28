import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Platform, Image } from 'react-native';
import { Icon } from 'native-base';
import { useSelector } from 'react-redux';
import { withNavigation } from 'react-navigation';

import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { isIphoneX } from 'react-native-iphone-x-helper'
import { images, mapImg } from '../../../utils/images';


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
		// <LinearGradient
		// 	colors={listGradient[0]}
		// 	style={{ width: '100%' }}
		// >
		<SafeAreaView style={{ width: '100%', height: isIphoneX() ? 86 : 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
			<View style={{ flex: 1 }}>
				{!isMenu ?
					<TouchableOpacity onPress={() => leftAction()} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, flex: 1.5 }}>
						<View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.7)' }}>
							<Icon type='MaterialCommunityIcons' name='arrow-left' style={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.7)' }} />
						</View>
					</TouchableOpacity>
					:
					<TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', marginLeft: 11, borderWidth: 1, borderColor: 'white' }} onPress={() => navigation.navigate('Profile')}>
						{userInfo.thumbnail ?
							(
								userInfo.first_name ?
									<Image
										resizeMode="contain"
										style={{ flex: 1, width: null, height: null }}
										source={{
											uri: userInfo.thumbnail,
											// priority: FastImage.priority.normal,
										}}
										// resizeMode={FastImage.resizeMode.cover}
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
				}
			</View>
			<View style={{ flex: 7 }}>
				<Text style={{ color: "#54a4c4", fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>{title}</Text>
			</View>
			{
				showRight ?
					<TouchableOpacity
						style={{ alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}
					>
						<Icon name="search" style={{ fontSize: 26, color: 'white' }} />
						{/* <View style={{ marginRight: 6 }}>
						<Text style={{ color: 'white', fontSize: 15 }}>Nộp bài</Text>
					</View> */}
					</TouchableOpacity>
					:
					<View style={{ flex: 1 }} />
			}

		</SafeAreaView>
		// </LinearGradient>
	)
};

export default withNavigation(NormalHeader);


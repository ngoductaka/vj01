import React from 'react';
import {
	View, Text, TouchableOpacity, Image,
} from 'react-native';
import {
	Placeholder,
	PlaceholderMedia,
	Fade
} from "rn-placeholder";
import { images } from '../../../utils/images';
import { helpers } from '../../../utils/helpers';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { GradientText } from '../../../component/shared/GradientText';


const today = new Date();
const GetTime = () => {
	const hours = today.getHours();
	return hours >= 17 ? "Chào buổi tối" : (hours >= 12 ? "Chào buổi chiều" : "Chào Buổi sáng")
}

const PlaceholderRow = () => {
	return (
		<Placeholder
			style={{
				justifyContent: 'center',
				marginBottom: 30,
				alignItems: 'center',
			}}
			Animation={Fade}
		>
			<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
				<PlaceholderMedia style={{
					height: 70,
					marginTop: 20,
					width: 70,
					// marginLeft: 10
				}} />
				<PlaceholderMedia style={{
					height: 70,
					marginTop: 20,
					width: 70,
					marginLeft: 10
				}} />
				<PlaceholderMedia style={{
					height: 70,
					width: 70,
					marginTop: 20,
					marginLeft: 10
				}} />
				<PlaceholderMedia style={{
					height: 70,
					width: 70,
					marginTop: 20,
					marginLeft: 10
				}} />
			</View>
		</Placeholder>
	)
}

const LoadingCom = () => {
	return (
		<View style={{ flex: 1 }}>
			<View style={{ padding: 10, marginTop: 8, width: '100%' }}>
				<View style={{ marginTop: 17 + helpers.statusBarHeight }}>
					<Text style={{ ...fontMaker({ weight: fontStyles.Light }), color: '#777BF0', fontSize: 26, }}>{GetTime()}</Text>
					<GradientText colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']} style={{ fontSize: 26, marginTop: 4, ...fontMaker({ weight: fontStyles.Bold }) }}> </GradientText>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
					<TouchableOpacity style={{ width: 40, height: 40, marginTop: 10 }}>
						<Image
							source={images.statitics}
							style={{ flex: 1, width: null, height: null }}
						/>
					</TouchableOpacity>
				</View>
				<View style={{ width: '100%' }}>
					{
						[1, 2, 3].map((item) => {
							return (
								<PlaceholderRow key={String(item)} />
							)
						})
					}
				</View>
			</View>
			<Placeholder
				style={{ padding: 15 }}
				Animation={Fade}
			>
				<PlaceholderMedia style={{
					height: 106,
					width: '100%'
				}} />
				<PlaceholderMedia style={{
					height: 500,
					width: '100%',
					marginTop: 20
				}} />
			</Placeholder>
		</View>
	)
}

export {
    LoadingCom
}
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

const ErrorView = ({ err, onPress = () => { }, isNoData = false, isNoNet }) => {
	const isUpdate = isNoData || err === 'no_data';
	let text = isUpdate ? "Tài liệu đang được biên soạn... " : 'Không thể kết nối server';
	if(isNoNet) text = "Vui lòng kiểm tra kết nối internet";
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}
		>
			<LottieView
				autoPlay
				loop
				style={{ width: 250, height: 250 }}
				source={isUpdate ? require('../../../public/8026-taking-notes.json') : require('../../../public/5401-loading-19-satellite-dish.json')}
			/>
			<Text style={{ fontSize: 20 }}>{text}</Text>
			{!isUpdate ? <Text>Vui lòng thử lại sau</Text> : null}
		</TouchableOpacity>
	)
}
export default ErrorView;
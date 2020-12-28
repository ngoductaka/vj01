import React from 'react';
import {
	Text,
	Image,
	View,
	Platform,
	TouchableOpacity
} from 'react-native';
import ModalBox from 'react-native-modalbox';

import { blackColor } from '../handle/Constant';

export const ConfirmBox = ({ show, onCancel = () => { }, onConfirm = () => { }, text = "", cancelText = "Hủy bỏ", confirmText = "Đồng ý", isInfo = false }) => {
	return (
		<ModalBox
			isOpen={show}
			backdropPressToClose={false}
			swipeToClose={false}
			style={{ width: 320, height: null, borderRadius: 8, overflow: 'hidden' }}
			position='center'
		>
			<View style={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 18, justifyContent: 'center', alignItems: 'center' }}>
				<Text style={{ textAlign: 'center', marginTop: 8, fontSize: 15 }}>{text}</Text>
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderTopColor: blackColor(0.1), borderTopWidth: 1 }}>
				<TouchableOpacity onPress={onCancel} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRightColor: blackColor(0.1), borderRightWidth: 1 }}>
					<Text style={{ color: blackColor(0.6), fontSize: 17 }}>{cancelText}</Text>
				</TouchableOpacity>
				{!isInfo &&
					<TouchableOpacity onPress={onConfirm} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 14 }}>
						<Text style={{ fontWeight: '700', color: '#ff7620', fontSize: 17 }}>{confirmText}</Text>
					</TouchableOpacity>
				}
			</View>

		</ModalBox>
	);
}
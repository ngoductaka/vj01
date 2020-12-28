import React, { memo } from "react";
import { Icon } from "native-base";
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

import { COLOR } from '../handle/Constant';

const SwitchPage = memo(({ title, icon, navigation = () => { }, switchTo = 'Home' }) => {
	const handleOnPress = () => {
		navigation.navigate(switchTo);
	}
	return (
		<TouchableOpacity onPress={handleOnPress} style={[styles.baseItem]}>
			<View style={styles.iconStyle}>
				<Icon name={icon} />
			</View>
			<Text numberOfLines={1}>{title}</Text>
		</TouchableOpacity>
	)
})

const styles = StyleSheet.create({
	safeView: {
		flex: 1,
		backgroundColor: COLOR.bgLeft,
	},
	iconStyle: {
		height: 50,
		width: 50,
		marginLeft: 8,
		marginRight: 8,
		justifyContent: 'center',
		alignItems: 'center'
	},
	baseItem: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		borderTopColor: COLOR.MAIN,
		borderTopWidth: 1,
		height: 50,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: { fontSize: 14 }
})

export default SwitchPage;

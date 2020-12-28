import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { isEmpty, get } from 'lodash';

const RenderPow = ({ data }) => {
	try {
		const dataConvert = JSON.parse(data);
		if (dataConvert && !isEmpty(dataConvert)) {
			return (
				<View style={stylesPow.container}>
					{dataConvert.map((subItem, index) => {
						return <RenderItemPow key={`RenderItemPow` + index} item={subItem} />
					})}
				</View>
			)
		}
	} catch (err) {
		// console.log('------ err render pow data', err);
	}
}

export const RenderItemPow = ({ content = '' , indexRow}) => {
	return content.split(' ').map((i, indexP) => <Text key={indexRow + 'row1' + indexP} style={styleItem.text}>{' ' + i}</Text>);
}
const styleItem = StyleSheet.create({
	text: { fontSize: 20, color: '#000' },
})

const stylesPow = {
	container: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 10,
		flexWrap: 'wrap',
		paddingX: 10,
		alignSelf: 'flex-start'
	},

}
export default RenderPow;
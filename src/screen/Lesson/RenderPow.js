import React from 'react';
import { View, Text } from 'react-native';
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

const RenderItemPow = ({ item: { type = '', content = '' } }) => {
	switch (type) {
		case 'p':
			return content.split(' ').map((i, index) => <Text key={'p_index'+index} style={{ fontSize: 20 }}>{' ' + i}</Text>);
		// ============================
		case 'sup':
			return <Text style={{ fontSize: 13, lineHeight: 20 }}>{content[0]}</Text>
		case 'sub':
			return <Text style={{ fontSize: 13, lineHeight: 34 }}>{content[0]}</Text>
		// ==============================
		case 'sup_sub':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 20 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 11, lineHeight: 25 }}>{get(content, '[1]', '')}</Text>
				</View>
			)
		case 'sup_sup':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 18 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 10, lineHeight: 14 }}>{get(content, '[1]', '')}</Text>
				</View>
			)
		case 'sub_sup':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 34 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 11, lineHeight: 25 }}>{get(content, '[1]', '')}</Text>
				</View>
			)
		case 'sub_sub':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 34 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 9, lineHeight: 36 }}>{get(content, '[1]', '')}</Text>
				</View>
			)
		// ============================================
		// sub_sup_sup 34 28 24
		// sub_sup_sub 34 28 28
		// sub_sub_sub 34 34 34 
		// sub_sub_sup 34 34 28

		case 'sub_sup_sup':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 34 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 9, lineHeight: 28 }}>{get(content, '[1]', '')}</Text>
					<Text style={{ fontSize: 7, lineHeight: 24 }}>{get(content, '[2]', '')}</Text>
				</View>
			)
		case 'sub_sup_sub':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 34 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 9, lineHeight: 28 }}>{get(content, '[1]', '')}</Text>
					<Text style={{ fontSize: 7, lineHeight: 28 }}>{get(content, '[2]', '')}</Text>
				</View>
			)
		case 'sub_sub_sub':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 34 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 9, lineHeight: 34 }}>{get(content, '[1]', '')}</Text>
					<Text style={{ fontSize: 7, lineHeight: 34 }}>{get(content, '[2]', '')}</Text>
				</View>
			)
		case 'sub_sub_sup':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 34 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 9, lineHeight: 34 }}>{get(content, '[1]', '')}</Text>
					<Text style={{ fontSize: 7, lineHeight: 28 }}>{get(content, '[2]', '')}</Text>
				</View>
			)
		// sup_sup_sup 20 16 13
		// sup_sup_sub 20 16 16
		// sup_sub_sub 20 20 20
		// sup_sub_sup 20 20 16
		case 'sup_sup_sup':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 20 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 9, lineHeight: 16 }}>{get(content, '[1]', '')}</Text>
					<Text style={{ fontSize: 7, lineHeight: 13 }}>{get(content, '[2]', '')}</Text>
				</View>
			)
		case 'sup_sup_sub':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 20 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 9, lineHeight: 16 }}>{get(content, '[1]', '')}</Text>
					<Text style={{ fontSize: 7, lineHeight: 16 }}>{get(content, '[2]', '')}</Text>
				</View>
			)
		case 'sup_sub_sub':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 20 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 9, lineHeight: 20 }}>{get(content, '[1]', '')}</Text>
					<Text style={{ fontSize: 7, lineHeight: 20 }}>{get(content, '[2]', '')}</Text>
				</View>
			)
		case 'sup_sub_sup':
			return (
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Text style={{ fontSize: 13, lineHeight: 20 }}>{get(content, '[0]', '')}</Text>
					<Text style={{ fontSize: 9, lineHeight: 20 }}>{get(content, '[1]', '')}</Text>
					<Text style={{ fontSize: 7, lineHeight: 16 }}>{get(content, '[2]', '')}</Text>
				</View>
			)
		default:
			return null
	}
}

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
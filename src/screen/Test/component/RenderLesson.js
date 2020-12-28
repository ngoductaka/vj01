import React, { memo, useState, useEffect, useCallback } from 'react';
import { View, FlatList, SafeAreaView, ScrollView, Text, StyleSheet, Linking, Platform, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Icon, Card } from 'native-base';
import { fontMaker } from '../../../utils/fonts';

// d3cce3
// → 
// #e9e4f0
const { width, height } = Dimensions.get('window');
const RenderLesson = ({ content, props, currSubject, currSubjectName, style = {} }) => {
	return (
		<Card style={{ borderRadius: 10, ...style }}>
			<TouchableOpacity
				onPress={() => props.navigation.navigate('ListExams', { course: content.id || '', currSubject: currSubject, currSubjectName })}
			>
				<View
					style={lessonSt.container}
				>
					<Text style={{ color: 'rgba(0, 0, 0, 0.75)', ...fontMaker({ weight: 'Regular' }), fontSize: 18 }} numberOfLines={5}>
						{content.name}
					</Text>
					<View style={lessonSt.textBottom}>
						<View style={lessonSt.textLeft}>
							<Icon type='FontAwesome5' name="file" style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: 13 }} />
							<Text style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: 12, ...fontMaker({ weight: 'Light' }) }}> {`${content.curriculum_count} đề`} </Text>
						</View>
						<View style={lessonSt.textRight}>
							<Icon name="eye" style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: 13 }} />
							<Text style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: 12, textAlign: 'right', ...fontMaker({ weight: 'Light' }) }}> {convertView(content.view)} </Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</Card>
	)
}
const convertView = (view) => {
	if (view < 1000) {
		return view
	} else if (view < 10000) {
		const k = Number(view / 1000).toFixed(2);
		return `${k}k`
	} else if (view < 100000) {
		const k = Number(view / 1000).toFixed(1);
		return `${k}k`
	} else {
		const k = Number(view / 1000).toFixed(0);
		return `${k}k`
	}
}

const lessonSt = StyleSheet.create({
	container: {
		margin: 10,
		height: 160,
		borderRadius: 15,
		justifyContent: 'space-between',
	},
	textLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	textRight: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	textBottom: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	}
})


export default RenderLesson;
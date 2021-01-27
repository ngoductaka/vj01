import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Icon, Card } from "native-base";
import {
	Placeholder,
	PlaceholderMedia,
	PlaceholderLine,
	Fade,
} from "rn-placeholder";
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import * as Animatable from 'react-native-animatable'


import { useRequest, Loading } from '../../../handle/api';
import { fontSize, COLOR } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { helpers } from '../../../utils/helpers';

const { height, width } = Dimensions.get('window');

const ListLesson = (props) => {
	const {
		subjectID = '',
		navigation,
		advert = null
	} = props;
	let endPoint = ``;
	const currentClass = useSelector(state => state.userInfo.class);
	if (subjectID) endPoint = `/subjects/${subjectID}/first-book-menuTest`;
	const [chapterData, loading, err] = useRequest(endPoint, [subjectID, currentClass]);

	return (
		<SafeAreaView style={[styles.base]}>
			<Loading isLoading={loading} err={err} com={LoadingCom}>
				<View style={[styles.base]}>
					<FlatList
						data={get(chapterData, 'data.children', [])}
						style={{ marginBottom: 10, marginTop: 15 }}
						keyExtractor={(item) => `${item._id}_header`}
						extraData={chapterData}
						renderItem={({ item: lessonItem, index }) =>
							_renderTitleLesson({ lessonItem, navigation, subjectID, index, advert })}
					/>
				</View>
			</Loading>
		</SafeAreaView>
	)
};


const _renderTitleLesson = (props) => {
	const { lessonItem, navigation, subjectID, index, advert = null } = props;
	const {
		title = '',
		id,
	} = lessonItem;
	const test_count = get(lessonItem, 'children', []).length;

	return (
		<Animatable.View
			animation='zoomIn'
			delay={index * 150} >
			<TouchableOpacity
				onPress={() => { navigation.navigate('ListTest', { chapter_id: id, advert, subject_id: subjectID, title, subject_title: lessonItem["subject_title "] }) }}
				style={[{
					height: null,
					width: '100%',
					paddingHorizontal: 15,
					paddingVertical: 10,
					alignItems: 'center',
					borderBottomColor: '#E5E5E5',
					borderBottomWidth: 1
				}]}>
				<View
					style={{ flex: 1, flexDirection: 'row' }}
				>
					<View style={{ width: 70, height: 70, borderRadius: 40, borderWidth: 3, borderColor: '#E5E5E5', justifyContent: 'center', alignItems: 'center' }}>
						<Text style={styles.index}>{helpers.convertIndex(index + 1)}</Text>
					</View>
					<View style={{ flex: 1, paddingLeft: 15, justifyContent: 'space-evenly' }}>
						<Text numberOfLines={2} style={styles.title}>{title}</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Icon type='Feather' name='book-open' style={styles.subIcon} />
							<Text numberOfLines={1} style={styles.subTitle}>{test_count} Bộ đề</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</Animatable.View>
	)
}

const styles = StyleSheet.create({
	base: {
		flex: 1,
	},
	viewSub: {
		borderLeftColor: '#F07D22',
		borderLeftWidth: 1,
	},
	index: {
		...fontMaker({ weight: fontStyles.Bold }),
		color: COLOR.MAIN,
		fontSize: 27
	},
	title: {
		...fontMaker({ weight: fontStyles.SemiBold }),
		color: '#35395A',
		fontSize: 16
	},
	subTitle: {
		...fontMaker({ weight: fontStyles.Regular }),
		color: '#aaa',
		fontSize: 12
	},
	subIcon: {
		color: '#aaa',
		fontSize: 14,
		marginRight: 8
	},
	basePadding: {
		marginLeft: 10
	},
	textLessonWapper: { flex: 1, paddingRight: 5 },
	contentMenu: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: "center",
		padding: 10,
		backgroundColor: '#FCD6BF',
		marginTop: 10,
		borderRadius: 10,
	},
	iconLesson: { color: '#666', fontSize: 14 },
	mgIcon: {
		marginLeft: 8, marginRight: 5,
		fontSize: 25, marginRight: 10,
	},
	subMenu: {
		borderColor: '#ddd',
		borderBottomWidth: 1,
		paddingVertical: 14,
		flexDirection: 'row',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: "center"
	},
	imgTitle: { height: "100%", width: '100%' },
	header: { fontWeight: "600" },
	headerList: {
		flexDirection: "row",
		padding: 14,
		marginTop: 5,
		justifyContent: "space-between",
		alignItems: "center",
		borderLeftColor: '#F07D22',
		borderLeftWidth: 2,
		borderBottomColor: '#ddd',
		borderBottomWidth: 2,
		backgroundColor: "#FFF"
	},
	icon: { fontSize: 18 },
	detailLesson: {
		fontSize: 12,
		textTransform: 'capitalize',
		overflow: 'hidden',
		lineHeight: 20,
		fontSize: 14,
		...fontMaker({ weight: 'Regular' })
	},
	wrapperItem: {
		borderRadius: 10,
		borderWidth: 5,
		borderColor: '#fef070',
		marginTop: 10,
	},
	shadow: {
		backgroundColor: '#FFFFFF',
		shadowColor: 'rgba(0, 0, 0, 0.1)',
		shadowOpacity: 0.8,
		elevation: 6,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 13 },
	},
	textLeftIcon: { fontSize: 28, color: '#F07D22', marginLeft: -1 },
	textContentCenter: { fontSize: 16, flex: 1, flexWrap: 'wrap', fontWeight: '600' },
	textContent: { display: 'flex', flexDirection: 'row', overflow: 'hidden', justifyContent: 'flex-start', alignItems: "center", width: '90%' }

});


const stylesMainItem = StyleSheet.create({
	wrapper: {
		marginTop: 15,
		width: '100%',
		flexDirection: 'row',
		borderRadius: 10,
		overflow: 'hidden'
	},
	numberContent: {
		backgroundColor: '#F07D22',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 15, paddingRight: 30, width: 70,
	},
	textContent: {
		color: '#fff', textAlign: 'center', flex: 1, ...fontMaker({ weight: 'SemiBold' })
	},
	contentView: {
		justifyContent: 'center',
		flex: 1,
		marginLeft: -15,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		overflow: 'hidden'
	},
	content: {
		fontSize: fontSize.h4,
		// textTransform: 'uppercase',
		overflow: 'hidden',
		...fontMaker({ weight: 'SemiBold' })
	},
	iconLeft: {
		paddingHorizontal: 5
	}
});
export default ListLesson;

const LoadingCom = () => {
	return (
		<View style={{ flex: 1, padding: 20, width: width }}>
			{
				new Array(Math.floor(height / 125)).fill(null).map((i, index) => {
					return (
						<Placeholder
							style={{ marginBottom: 30 }}
							key={String(index)}
							Animation={Fade}
							Left={PlaceholderMedia}
						>
							<PlaceholderLine width={80} />
							<PlaceholderLine />
							<PlaceholderLine width={30} />
						</Placeholder>
					)
				})
			}

		</View>
	)
}
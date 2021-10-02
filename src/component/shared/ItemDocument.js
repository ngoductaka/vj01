import React from 'react';
import {
	View, Text, StyleSheet, TouchableOpacity, Dimensions, Image
} from 'react-native';
import MathJax from 'react-native-mathjax';
import { Icon } from 'native-base';
import { isNumber } from 'lodash';
import { Thumbnail } from 'react-native-thumbnail-video';
import HTML from 'react-native-render-html';

import { fontSize, blackColor, COLOR } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { mapBooktype } from '../../constant';
import FastImage from 'react-native-fast-image';
import { helpers } from '../../utils/helpers';
import { RenderHtmlCustom } from '../../screen/Lesson/saved';

const { width } = Dimensions.get('window');


const RenderArticlRelated = ({ title, onPress, viewCount, contentType, subTitle, icon = 'file-document-edit', onDelete }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[stylesComponent.textItem, { paddingLeft: 0, borderBottomWidth: 0, borderBottomWidth: 1, borderColor: '#ddd' }]}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View
					style={{
						height: 30, width: 30, marginRight: 15, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
						borderColor: COLOR.MAIN,
						borderWidth: 1
					}}
				>
					<Icon type='MaterialCommunityIcons' name={icon} style={{ fontSize: 18, color: COLOR.MAIN, marginLeft: 3 }} />
				</View>
				<View style={{ flex: 1 }}>
					<Text numberOfLines={2} style={stylesComponent.textContent}>
						{title}
					</Text>

					{isNumber(contentType) && contentType > -1 ? <Text style={{ fontSize: 12, color: '#777', textAlign: 'right', marginTop: 7 }}>{mapBooktype[contentType]}</Text> : null}
					{subTitle ? <Text style={{ fontSize: 12, color: '#777', textAlign: 'right', marginTop: 7 }}>{subTitle}</Text> : null}
				</View>
				{
					onDelete ?
						<TouchableOpacity onPress={onDelete}>
							<Icon type='MaterialCommunityIcons' name={'delete'} style={{ fontSize: 18, color: COLOR.WRONG, marginLeft: 3 }} />
						</TouchableOpacity> :
						null
				}
			</View>
		</TouchableOpacity>
	)
}

const RenderArticlSearch = ({ title, onPress, viewCount, index, book, grade }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[stylesComponent.textItem, { paddingLeft: 0, borderBottomWidth: 0, borderBottomWidth: 1, borderColor: '#ddd' }]}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View
					style={{
						height: 30, width: 30, marginRight: 15, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
						borderColor: COLOR.MAIN,
						borderWidth: 1
					}}
				>
					<Icon type='MaterialCommunityIcons' name='file-document-edit' style={{ color: COLOR.MAIN, fontSize: 18, marginLeft: 3 }} />
				</View>
				<View style={{ flex: 1 }}>
					<Text numberOfLines={2} style={stylesComponent.textContent}>
						{title}
					</Text>

					<Text style={{ fontSize: 12, color: '#777', textAlign: 'right', marginTop: 7 }}>{book} - {grade}</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const RenderExamRelated = ({ title, onPress, time, totalQues, onDelete }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[stylesComponent.textItem, { paddingLeft: 0, borderBottomWidth: 0, borderBottomWidth: 1, borderColor: '#ddd' }]}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View
					style={{
						borderColor: COLOR.MAIN,
						borderWidth: 1,
						height: 30, width: 30, marginRight: 15, borderRadius: 20, justifyContent: 'center', alignItems: 'center'
					}}
				>
					<Icon type='Entypo' name='flash' style={{ color: COLOR.MAIN, fontSize: 18, marginLeft: 3 }} />
				</View>
				<View style={{ flex: 1 }}>
					<Text numberOfLines={2} style={stylesComponent.textContent}>
						{title}
					</Text>
					<Text style={{ fontSize: 12, color: '#777', textAlign: 'right', marginTop: 7 }}>{totalQues} câu hỏi - {Math.floor(time / 60)} phút</Text>
				</View>
				{
					onDelete ?
						<TouchableOpacity onPress={onDelete}>
							<Icon type='MaterialCommunityIcons' name={'delete'} style={{ fontSize: 18, color: COLOR.WRONG, marginLeft: 3 }} />
						</TouchableOpacity> :
						null
				}
			</View>
		</TouchableOpacity>
	)
}

const RenderVideoSearch = ({ uri, title, url, onPress, grade, subject, time, isLecture, style }) => {
	return (
		<TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', marginTop: 10, ...style }}>
			<View style={{ width: 5 * width / 16, height: 45 * width / 256, borderRadius: 8, overflow: 'hidden' }}>
				{uri ?
					<Image
						resizeMode="contain"
						style={{ width: null, height: null, flex: 1 }}
						source={{
							uri,
							// priority: FastImage.priority.normal,
						}}
					// resizeMode={FastImage.resizeMode.cover}
					/>
					:
					<View style={{ flex: 1 }}>
						<Thumbnail
							onPress={onPress}
							iconStyle={{
								height: 22,
								width: 22,
							}}
							imageWidth={5 * width / 16}
							imageHeight={45 * width / 256}
							url={url}
						/>
					</View>
				}
				{uri ?
					<Icon type='Entypo' name='controller-play' style={{ position: 'absolute', alignSelf: 'center', fontSize: 42, top: 15, color: 'white' }} />
					: null
				}
				<View style={{ position: 'absolute', bottom: 0, right: 0, paddingHorizontal: 7, paddingVertical: 4, borderTopLeftRadius: 8, backgroundColor: COLOR.black(.6) }}>
					<Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.Regular }), fontSize: 12 }}>{helpers.convertTime(time)}</Text>
				</View>
			</View>
			<View style={{ flex: 1, justifyContent: 'space-between', height: 72, paddingVertical: 2, paddingLeft: 10 }}>
				<View style={{}}>
					<Text numberOfLines={2} style={{ ...fontMaker({ weight: 'Regular' }) }}>{title || 'Tên bài học'}</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
						<Icon style={stylesComponent.iconType} name={isLecture ? "book-open" : "file-text"} type='Feather' />
						<Text style={stylesComponent.subText} numberOfLines={1}>
							{isLecture ? 'Bài giảng' : 'Giải bài tập'}
						</Text>
					</View>
				</View>
				<Text style={{ textAlign: 'right', justifyContent: 'flex-end', fontSize: 12, ...fontMaker({ weight: 'Light' }) }}>{`Môn ${subject} - ${grade}`}</Text>
			</View>
		</TouchableOpacity>
	)
}


const RenderQnASearch = ({ title, onPress, viewCount, index, book, grade, answers_count = 0, answers = [] }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[stylesComponent.textItem, { paddingLeft: 0, borderBottomWidth: 0, borderBottomWidth: 2, borderColor: '#555' }]}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				{/* <View
					style={{
						height: 30, width: 30, marginRight: 15, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
						borderColor: COLOR.MAIN,
						borderWidth: 1
					}}
				>
					<Icon type='FontAwesome' name='question' style={{ color: COLOR.MAIN, fontSize: 18 }} />
				</View> */}
				<View style={{ flex: 1 }}>
					<Text numberOfLines={2} style={stylesComponent.textContent}>
						<Text style={{ fontWeight: 'bold', fontSize: 20 }}>{index + 1}.</Text> {title}
					</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
						{/* <Text style={{ fontSize: 12, color: '#777', textAlign: 'right', marginTop: 7 }}>{answers_count ? `${answers_count} câu trả lời` : 'Chưa có câu trả lời'} </Text> */}
						<Text style={{ fontSize: 12, color: '#777', textAlign: 'right', marginTop: 7 }}>{book} • {grade}</Text>
					</View>
					<View style={{ marginLeft: 20 }}>
						<Text style={{ fontSize: 18 }}>Câu trả lời gần nhất :</Text>
						{
							answers && answers[0] ?
								answers.map(((a, index) => {
									return <RenderHtmlCustom content={a.content} />
								})) : null
						}
					</View>

				</View>
			</View>
		</TouchableOpacity>
	)
}
const RenderQnAForImg = ({ title, onPress, viewCount, index, book, grade, answers_count = 0, answers = [] }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[stylesComponent.textItem, { paddingLeft: 0, backgroundColor: '#fff' }]}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View style={{ flex: 1 }}>
					<Text style={{ fontSize: 22, color: '#5396CD', fontWeight: 'bold' }}>Câu hỏi :</Text>
					<MathJax html={title || ''} />
					{/* <MathJax html={'<p> <b>1. Định nghĩa: </b> Căn bậc ba của một số a, kí hiệu là <img src="https://vietjack.com/toan-lop-9/images/can-bac-ba.PNG" style="margin: 0 10px"> là số x sao cho $x^3 = a.$ </p>'} /> */}
					<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
						<Text style={{ fontSize: 12, color: '#777', textAlign: 'right', marginTop: 7 }}>{book} • {grade}</Text>
					</View>
					<Text style={{ fontSize: 22, color: '#5396CD', fontWeight: 'bold' }}>Câu trả lời gần nhất :</Text>
					{
						answers && answers[0] ?
							answers.map(((a, index) => {
								return <RenderHtmlCustom content={a.content} />
							})) : null
					}
					{/* </View> */}

				</View>
			</View>
		</TouchableOpacity>
	)
}

// component
const stylesComponent = StyleSheet.create({
	textItem: {
		flexDirection: 'row',
		borderRadius: 5,
		borderBottomColor: '#dedede',
		borderBottomWidth: 2,
		padding: 10, alignItems: 'center',
		paddingVertical: 15
	},
	textContent: {
		...fontMaker({ weight: fontStyles.Regular }),
		color: blackColor(1), flex: 1,
		fontSize: 18
	},
	icon: {
		color: '#777',
		fontSize: 12,
		marginTop: 3,
	},
	iconType: {
		fontSize: 13,
		color: '#777',
		marginRight: 5,
	},
	subText: {
		fontSize: fontSize.h5,
		color: '#777'
	},
});

export {
	RenderArticlRelated,
	RenderExamRelated,
	RenderArticlSearch,
	RenderVideoSearch,
	RenderQnASearch,
	RenderQnAForImg,
}
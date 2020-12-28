
import React, { useState, useEffect, memo } from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import HTML from 'react-native-render-html';
import { Icon } from 'native-base';
import { without, isEmpty } from 'lodash';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-simple-toast';

// import BarContent from '../../../component/ListLesson';
import Sound from '../../../component/Sound';
// import SwitchPage from '../../../component/SwitchPage';
import { insertItem, KEY, getItem, saveItem } from '../../../handle/handleStorage';
import BannerAd from '../../../component/shared/BannerAd';
import RenderPow from '../RenderPow';
import FastImg from './FastImg';
import { fontMaker } from '../../../utils/fonts';

const { width } = Dimensions.get('window')

const tagsStyles = {
	p: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', lineHeight: 30, marginBottom: 5, fontSize: 18 },
};

const classesStyles = {
};

const useHandleRightBar = () => {
	const [closeBar, setCloseBar] = useState(false);

	const handleCloseBar = () => {
		setCloseBar(true);
	};

	const handleOBar = () => {
		setCloseBar(false);
	};
	return [closeBar, handleCloseBar, handleOBar];
};
// render table =============================================
const tags = without(IGNORED_TAGS,
	'table', 'caption', 'col', 'colgroup', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr'
)

const tableDefaultStyle = {
	flex: 1,
	justifyContent: 'flex-start',
}

const tableColumnStyle = {
	...tableDefaultStyle,
	flexDirection: 'column',
	alignItems: 'stretch',
	borderWidth: 1,
	borderColor: '#ddd',
}

const tableRowStyle = {
	...tableDefaultStyle,
	flexDirection: 'row',
	alignItems: 'stretch',
	borderWidth: 1,
	borderColor: '#ddd',
}

const tdStyle = {
	...tableDefaultStyle,
	padding: 2,
	borderWidth: 1,
	borderColor: '#ddd',
}

const thStyle = {
	...tdStyle,
	backgroundColor: '#CCCCCC',
	alignItems: 'center',
	fontSize: 14,
}
let i = 0;
const renderers = {
	table: (x, c) => {
		return <View key={x + (++i)} style={tableColumnStyle}>{c}</View>
	},
	col: (x, c) => <View key={x + (++i)} style={tableColumnStyle}>{c}</View>,
	colgroup: (x, c) => <View key={x + (++i)} style={tableRowStyle}>{c}</View>,
	tbody: (x, c) => <View key={x + (++i)} style={tableColumnStyle}>{c}</View>,
	tfoot: (x, c) => <View key={x + (++i)} style={tableRowStyle}>{c}</View>,
	th: (x, c) => <View key={x + (++i)} style={thStyle}>{c}</View>,
	thead: (x, c) => <View key={x + (++i)} style={tableRowStyle}>{c}</View>,
	caption: (x, c) => <View key={x + (++i)} style={tableColumnStyle}>{c}</View>,
	tr: (x, c) => <View key={x + (++i)} style={tableRowStyle}>{c}</View>,
	td: (x, c) => <View key={x + (++i)} style={tdStyle}>{c}</View>,
	sup: (x, c) => {
		return <Text key={x + (++i)} style={{
			textAlignVertical: 'top',
			alignSelf: 'flex-start',
			alignItems: 'flex-start',
			padding: 10,
			fontSize: 10
		}}>
			{c}
		</Text>
	}
}

const ToggleView = ({ title, content, renderHtml }) => {
	const [isOpent, setIsOpent] = useState(false)
	return (
		<View style={styleToggle.container}>
			<TouchableOpacity onPress={() => setIsOpent(!isOpent)} style={styleToggle.btn}>
				<Text style={styleToggle.text}>{title}</Text>
				<Icon name={isOpent ? "md-arrow-dropup" : "md-arrow-dropdown"} />
			</TouchableOpacity>
			{isOpent && <View style={styleToggle.viewDetail}>
				{renderHtml(content)}
			</View>}
		</View>
	)
};

const styleToggle = StyleSheet.create({
	container: { width: '100%', marginBottom: 5 },
	btn: {
		width: '100%',
		backgroundColor: '#c2c2f3',
		paddingHorizontal: 10,
		paddingVertical: 2,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
	},
	text: { fontWeight: '600' },
	viewDetail: { width: '100%', paddingBottom: 10, borderColor: '#ddd', borderWidth: 1, paddingHorizontal: 2 }
})

const _renderHtml = (content, key = '') => {
	return (
		<HTML
			key={key}
			ignoredStyles={['font-size']}
			tagsStyles={tagsStyles}
			html={content}
			imagesMaxWidth={Dimensions.get('window').width - 45}
			onLinkPress={(evt, href) => _handleOnPressLink(href)}
			// containerStyle={{ paddingLeft: 10, paddingRight: 10 }}
			listsPrefixesRenderers={{ ul: () => null }}
			ignoredTags={[...tags, 'hr']}
			renderers={renderers}
		/>
	);
}

const _handleOnPressLink = (href) => {
	const linkSplit = href.split('/');
	let lessonName = linkSplit[linkSplit.length - 1].replace('.jsp', '').replace(/-/g, '_');
	navigation.push("Lesson", { key: lessonName, bookName });
}



const listExtendFeature = [
	{
		bg: 'rgb(91, 216, 182)',
		text: 'BOOKMARK',
		textHandled: 'ĐÃ LƯU',
		type: 'Entypo',
		icon: 'bookmark',
	},
	{
		bg: 'rgb(67, 196, 251)',
		text: 'TẢI OFFLINE',
		textHandled: 'ĐÃ TẢI VỀ',
		type: 'MaterialIcons',
		icon: 'file-download'
	}
]

const ExtendFeature = memo(({ handleBookmark = () => { }, handleSaveOffline = () => { } }) => {

	return (
		<View style={styleExtendFeature.container}>
			{listExtendFeature.map((item, index) => {
				return (
					<TouchableOpacity
						key={String(index)}
						// activeOpacity={1}
						onPress={() => index == 0 ? handleBookmark() : handleSaveOffline()}
						style={[
							styleExtendFeature.itemStyle,
							{
								backgroundColor: item.bg,
								opacity: 1
							}
						]}
					>
						<Icon type={item.type} style={styleExtendFeature.icon} name={item.icon} />
						<Text style={styleExtendFeature.text}> {item.text}</Text>
					</TouchableOpacity>
				)
			})}

		</View>
	)
})

const styleExtendFeature = StyleSheet.create({
	container: {
		width: '100%', flexDirection: 'row', height: 44, alignItems: 'center', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, overflow: 'hidden'
	},
	icon: { color: 'white', fontSize: 22 },
	text: { color: 'white', marginLeft: 10, fontSize: 14, ...fontMaker({ weight: 'Bold' }) },
	itemStyle: {
		flexDirection: 'row', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'center'
	}

})


const RenderItem = ({ itemLesson, index }) => {
	{
		if (itemLesson.type == 0) return _renderHtml(itemLesson.content)
		else if (itemLesson.type == 1) return <Sound url={itemLesson.content} />
		else if (itemLesson.type == 2) {
			const { title, content } = JSON.parse(itemLesson.content);
			return <ToggleView
				title={title}
				content={content}
				renderHtml={_renderHtml}
			/>
		}
		else if (itemLesson.type === 3) { //
			return null;
			// return <BannerAd type={index} />
		}
		// else if (itemLesson.type === 4) {
		// return <MathJax html={itemLesson.content} />
		// } 
		else if (itemLesson.type === 5) {
			return <RenderPow data={itemLesson.content} />
		}
		else if (itemLesson.type === 6) {
			const { src, height = 0, width: wImg = 0 } = JSON.parse(itemLesson.content);
			if (!src || !height || !wImg) return null;
			return <FastImg
				height={height * (Math.min(wImg, width - 20) / wImg)}
				width={Math.min(wImg, width - 20)}
				uri={src} index={index} />
		}
	}
}

const renderFooter = (show) => {
	if (!show) return null
	return (
		<ActivityIndicator
			size="large"
			style={{ color: '#000' }}
		/>
	);
};

export {
	renderFooter,
	RenderItem,
	ExtendFeature
}
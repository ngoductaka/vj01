import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Dimensions, View, SafeAreaView, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import HTML from 'react-native-render-html';
import { Icon } from 'native-base';
import { without } from 'lodash';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';

import Sound from '../../component/Sound';
import BackHeader from '../../component/shared/BackHeader';
import RenderPow from './RenderPow';

const Lesson = (props) => {
	// input props
	const { navigation } = props;

	const arrayHtmlContent = navigation.getParam('arrayHtmlContent', '');
	const title = navigation.getParam('title', '');
	const subtitle = navigation.getParam('subtitle', '');
	const icon = navigation.getParam('icon', '');

	const ContentHtml = useCallback(() => {
		return arrayHtmlContent.map((itemLesson, index) => {
			if (itemLesson.type == 0) return _renderHtml(itemLesson.content, index)
			else if (itemLesson.type == 1) return <Sound url={itemLesson.content} key={`${index}ff`} />
			else if (itemLesson.type == 2) {
				const { title, content } = JSON.parse(itemLesson.content);
				return <ToggleView
					key={`${index}toggle`}
					title={title}
					content={content}
					renderHtml={_renderHtml}
				/>
			} else if (itemLesson.type === 3) {
				// return <Advertisement type={index} key={`${index}ff`} />
			} else if (itemLesson.type === 4) {
				// return <MathJax html={itemLesson.content} />
			} else if (itemLesson.type === 5) {
				return <RenderPow data={itemLesson.content} />
			}
		})
	}, [arrayHtmlContent])

	return (
		<View style={{ flex: 1 }}>
			<BackHeader
				icon={icon}
				// title={title}
				// subtitle={subtitle}
				title={"Quay lại"}
				subtitle={"Bài học lưu offline"}
			/>
			<SafeAreaView style={{ flex: 1 }}>
				<ScrollView>
					{/*  */}
					<View style={styles.mainView}>
						{/* render html */}
						<View style={styles.htmlRender}>
							<ContentHtml />
						</View>
						{/* switch page */}
					</View>
				</ScrollView>
				{/*  */}
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	mainView: { flex: 1, padding: 20, backgroundColor: 'rgb(245, 245, 245)' },
	htmlRender: { backgroundColor: '#fff', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
	relatedView: { backgroundColor: '#fff', marginTop: 20, paddingBottom: 10 },
	relatedTitle: { fontSize: 14, fontWeight: 'bold', marginLeft: 10, marginBottom: 10, marginTop: 10 },
	relatedItem: { marginLeft: 30, marginTop: 10, marginRight: 10, color: 'orange' }

})


const tagsStyles = {
	p: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', lineHeight: 30, marginBottom: 5, fontSize: 20 },
};
const classesStyles = {
	// 'sub-title': { textAlign: 'center', fontWeight: '800', color: 'red' },
	// 'toggle-content': { backgroundColor: 'red' }
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
}

const ToggleView = ({ title, content, renderHtml }) => {
	const [isOpent, setIsOpent] = useState(false)
	return (
		<View style={{ width: '100%' }}>
			<TouchableOpacity onPress={() => setIsOpent(!isOpent)} style={{ width: '100%', height: 30, backgroundColor: '#c2c2f3', paddingLeft: 10, paddingRight: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
				<Text>{title}</Text>
				{isOpent ?
					<Icon name="md-arrow-dropup" /> :
					<Icon name="md-arrow-dropdown" />
				}
			</TouchableOpacity>
			{isOpent && <View style={{ width: '100%', backgroundColor: '#ddd' }}>
				{renderHtml(content)}
			</View>}
		</View>
	)
}

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		// console.log(error)
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		// console.log(error)
		// Customized error handling goes here!
	}

	render() {
		if (this.state.hasError) {
			return (
				<View>
					<Text>Meteorite Explorer encountered an error! Oh My!</Text>
				</View>
			);
		}

		return this.props.children;
	}
}

export const _renderHtml = (content, key = '') => {
	return (
		<HTML
			key={key}
			classesStyles={classesStyles}
			ignoredStyles={['font-size', 'font-family', 'font-weight']}
			tagsStyles={tagsStyles}
			html={content}
			imagesMaxWidth={Dimensions.get('window').width - 45}
			onLinkPress={(evt, href) => _handleOnPressLink(href)}
			containerStyle={{ paddingLeft: 10, paddingRight: 10 }}
			listsPrefixesRenderers={{ ul: () => null }}
			ignoredTags={[...tags, 'hr']}
			renderers={renderers}
		/>
	);
}

const tagsStylesCustom = {
	p: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', lineHeight: 30, marginBottom: 5, fontSize: 9 },
};

export const RenderHtmlCustom = ({ content, styleTag = tagsStylesCustom }) => {
	return (
		<HTML
			classesStyles={classesStyles}
			ignoredStyles={['font-size', 'font-family', 'font-weight',
				'text-decoration-style', 'text-decoration-color', 'height', 'width',
				'font-family', 'letter-spacing', 'font-style',
				'font-variant', 'font-weight', 'font-stretch', 'line-height'
			]}
			// ignoredStyles={["*"]}
			tagsStyles={tagsStyles}
			html={content}
			imagesMaxWidth={Dimensions.get('window').width - 45}
			onLinkPress={(evt, href) => _handleOnPressLink(href)}
			containerStyle={{ paddingLeft: 10, paddingRight: 10 }}
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

export default React.memo(Lesson);

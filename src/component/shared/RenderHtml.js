import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { Dimensions, View, SafeAreaView, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

import HTML from 'react-native-render-html';
import { without, isEmpty, findIndex, get } from 'lodash';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';

const def = `<h1 class="title">Tr&#x1EA3; l&#x1EDD;i c&#xE2;u h&#x1ECF;i To&#xE1;n 9 T&#x1EAD;p 2 B&#xE0;i 1 trang 29</h1><h2 class="sub-title">B&#xE0;i 1: H&#xE0;m s&#x1ED1; y = ax2 (a # 0)</h2>`;
const RenderHTML = ({ content = def }) => {
	return (
		<HTML
			// classesStyles={classesStyles}
			ignoredStyles={['font-size']}
			tagsStyles={tagsStyles}
			html={content}
			imagesMaxWidth={Dimensions.get('window').width - 45}
			// onLinkPress={(evt, href) => _handleOnPressLink(href)}
			containerStyle={{ paddingLeft: 10, paddingRight: 10 }}
			listsPrefixesRenderers={{ ul: () => null }}
			ignoredTags={[...tags, 'hr']}
			renderers={renderers}
		/>
	);
}

export default RenderHTML;

const tagsStyles = {
	p: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', lineHeight: 30, marginBottom: 5, fontSize: 20 },
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



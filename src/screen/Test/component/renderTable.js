import React from 'react';
import { ScrollView, View } from 'react-native';
import HTML from 'react-native-render-html';
import { IGNORED_TAGS, alterNode, makeTableRenderer } from 'react-native-render-html-table-bridge';
import WebView from 'react-native-webview'; // <-- Instructions might defer depending on your setup

const config = {
	WebViewComponent: WebView
};

const renderers = {
	table: makeTableRenderer(config)
};

const htmlConfig = {
	alterNode,
	renderers,
	ignoredTags: IGNORED_TAGS
};

const RenderTable = (props) => {

	return (
		<View style={props.style}>
			<ScrollView style={props.style}>
				<HTML html={props.content} {...htmlConfig} />
			</ScrollView>
		</View>
	)
}
export default RenderTable;
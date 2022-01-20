import React from 'react';
import { View, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

const screen = Dimensions.get('window');

const defaultOptions = {
	messageStyle: 'none',
	extensions: ['tex2jax.js'],
	jax: ['input/TeX', 'output/HTML-CSS'],
	tex2jax: {
		inlineMath: [['$', '$'], ['\\(', '\\)']],
		displayMath: [['$$', '$$'], ['\\[', '\\]']],
		processEscapes: true,
	},
	TeX: {
		extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
	}
};

class MathJax extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			height: 1,
			// width: 1
		};
	}

	handleMessage(message) {

		const { width, height } = JSON.parse(message.nativeEvent.data);
		this.setState({
			width,
			height,
			realWidth: screen.width
		});
		setTimeout(() => {
			this.setState({
				width,
				height,
				realWidth: width
			});
			setTimeout(() => {
				this.setState({
					width,
					height,
					realWidth: screen.width
				});
	
			}, 1000)

		}, 1000)
	}

	wrapMathjax(content) {
		const options = JSON.stringify(
			Object.assign({}, defaultOptions, this.props.mathJaxOptions)
		);

		return `
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
			<script type="text/x-mathjax-config">
				MathJax.Hub.Config(${options});

				MathJax.Hub.Queue(function() {
					var width = document.documentElement.scrollWidth;
					var height = document.documentElement.scrollHeight;
					window.ReactNativeWebView.postMessage(JSON.stringify({width: width, height: height}));
					document.getElementById("formula").style.visibility = '';
				});
			</script>

			<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"></script>
			<div id="formula" style="font-size: 13px">
				${content}
			</div>
		`;
	}
	render() {
		const html = this.wrapMathjax(this.props.html);

		// Create new props without `props.html` field. Since it's deprecated.
		const props = Object.assign({}, this.props, { html: undefined });

		return (
			<View style={{ width: this.state.width, height: this.state.height, ...props.style }}>
				<WebView
					scrollEnabled={false}
					onMessage={this.handleMessage.bind(this)}
					source={{ html }}
					{...props}
				/>
				{/* <TouchableOpacity onPress={() => this.setState({
					...this.state,
					realWidth: this.state.width,
					scrollEnabled: true
				})}>
					<Text>detail</Text>
				</TouchableOpacity> */}
			</View>
		);
	}
}

export default MathJax;

import React from 'react';
import { View, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

const screen = Dimensions.get('window');

const defaultOptions = {
	messageStyle: 'none',
	extensions:
		['mml2jax.js', 'MathMenu.js', 'MathZoom.js', 'AssistiveMML.js', 'a11y/accessibility-menu.js',],
	jax: ['input/MathML', 'output/CommonHTML'],
	tex2jax: {
		inlineMath: [['$', '$'], ['\\(', '\\)']],
		displayMath: [['$$', '$$'], ['\\[', '\\]']],
		processEscapes: true,
	},
	TeX: { extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js'], },
}
const dnd = {
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
			width: width,
			height,
		});
		setTimeout(() => {
			this.setState({
				width: Math.max(width, screen.width),
				height,
				show: true,
			});
			// setTimeout(() => {
			// 	this.setState({
			// 		width: Math.max(width, screen.width),
			// 		height,
			// 		realWidth: screen.width
			// 	});

			// }, 1000)

		}, 1000)
	}

	wrapMathjax(content) {
		const options = JSON.stringify(
			Object.assign({}, content.includes('<math') ? defaultOptions: dnd, this.props.mathJaxOptions)
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
			<div id="formula" style="font-size: 15px">
				${content}
			</div>
		`;
	}
	render() {
		const html = this.wrapMathjax(this.props.html);

		// Create new props without `props.html` field. Since it's deprecated.
		const props = Object.assign({}, this.props, { html: undefined });

		return (
			<View>
				<ScrollView horizontal={this.state.show}>
					<View style={{ width: this.state.width }}>
						<View style={{ height: this.state.height, ...props.style }}>
							<WebView
								scrollEnabled={false}
								onMessage={this.handleMessage.bind(this)}
								source={{ html }}
								{...props}
							/>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}

export default MathJax;

import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Dimensions, View, StyleSheet, Animated, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { Button, Icon } from 'native-base';

const { height, width } = Dimensions.get('window');

const userHook = props => {
	const [showRightBar] = useState(new Animated.Value(width));
	const [showBackDrop] = useState(new Animated.Value(0));
	const [showUpBtn] = useState(new Animated.Value(-200));

	const { handleOBar = () => { }, htmlView = useRef(null) } = props;

	useEffect(() => {
		if (props.closeBar) _handleClose();
	}, [props.closeBar])

	//
	const _handleOpen = () => {
		handleOBar();
		Animated.parallel([
			Animated.timing(showRightBar, {
				toValue: width * 0.3,
				duration: 300,
			}),
			Animated.timing(showBackDrop, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			})
		]).start()
	}

	const _handleClose = () => {
		Animated.parallel([
			Animated.timing(showRightBar, {
				toValue: width,
				duration: 300,
			}),
			Animated.timing(showBackDrop, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			})
		]).start();
	}

	const _handleShowBtn = () => {
		Animated.spring(showUpBtn, {
			toValue: 15,
			// speed: 1500,
			velocity: 1500,
		}).start()
	}

	const _handleHideBtn = () => {
		Animated.spring(showUpBtn, {
			toValue: -200,
			// speed: 1500,
			velocity: 1500,
		}).start()
	}

	const ButtonScroll = () => <Button onPress={_handleOpen} transparent >
		<Icon ios='ios-menu' android="md-menu" style={{ fontSize: 25, color: '#fff' }} />
	</Button>
	let preDic = '';
	let _listViewOffset = 0;
	const _onScroll = (event) => {
		const currentOffset = event.nativeEvent.contentOffset.y;
		const direction = (currentOffset > 0 && currentOffset >= _listViewOffset)
			? 'down'
			: 'up'
			;

		if (preDic != direction) {
			if (direction === 'up') {
				_handleShowBtn();
				// props.handleScroll('up')
			}
			else {
				_handleHideBtn()
				// props.handleScroll('down')
			}
			preDic = direction
		}
		// Update your scroll position
		_listViewOffset = currentOffset
	}
	const backdrop = {
		transform: [
			{
				translateY: showBackDrop.interpolate({
					inputRange: [0, 0.01],
					outputRange: [height, 0],
					extrapolate: "clamp",
				}),
			},
		],
		opacity: showBackDrop.interpolate({
			inputRange: [0.01, 0.5],
			outputRange: [0, 1],
			extrapolate: "clamp",
		}),
	};

	const view = (
		<SafeAreaView style={{ flex: 1, borderBottomColor: "#fff", borderBottomWidth: 10 }}>
			{/* btn show right bar */}
			<ScrollView ref={htmlView} contentContainerStyle={{ flexGrow: 1 }} style={styles.container} scrollEventThrottle={16}
				onScroll={_onScroll}
			>
				{props.children}
			</ScrollView>
			<View style={[styles.btnMenu, { bottom: 15 }]} transparent>
				<ButtonScroll />
			</View>
			{/* backdrop */}
			<Animated.View style={[StyleSheet.absoluteFill, styles.cover, backdrop]}>
				<TouchableWithoutFeedback onPress={_handleClose}>
					<View style={{ height: '100%', width: '100%' }}></View>
				</TouchableWithoutFeedback>
			</Animated.View>
			{/* View */}
			<Animated.View style={[styles.rightBar, { left: showRightBar }]}>
				<View style={{
					height: '100%',
					width: '70%',
					backgroundColor: 'white',
				}}>
					{props.barContent}
				</View>
			</Animated.View>
		</SafeAreaView>
	);
	return view;
}

const styles = StyleSheet.create({
	cover: {
		backgroundColor: "rgba(0,0,0,.5)",
	},
	container: {
		flex: 1,
	},
	rightBar: {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		height: '100%',
		width: '100%',
	},
	btnMenu: {
		position: 'absolute',
		right: 15,
		height: 60,
		width: 60,
		borderRadius: 100,
		backgroundColor: 'green',
		justifyContent: 'center',
		alignItems: 'center',
		opacity: 0.5
	},
	modal: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '70%',
		height: '100%'
	},

	text: {
		color: "black",
		fontSize: 22
	},

	btn: {
		margin: 10,
		backgroundColor: "#3B5998",
		color: "white",
		padding: 10
	},

	btnModal: {
		position: "absolute",
		top: 0,
		right: 0,
		width: 50,
		height: 50,
		backgroundColor: "transparent"
	},
})

export default React.memo(userHook);

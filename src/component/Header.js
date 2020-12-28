import React from 'react';
import { StatusBar, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Header, Icon } from 'native-base';

import { COLOR, whiteColor, fontSize } from '../handle/Constant';
import { images, mapImg } from '../utils/images';
import { fontMaker, fontStyles } from '../utils/fonts';

const handleSource = (icon) => {
	if (mapImg[icon]) {
		return images[mapImg[icon]]
	}
}

const Head = (props) => {
	const {
		headerStyle = styles.headerDefault,
		leftIcon = (<Icon ios='ios-menu' android="md-menu" style={styles.icon} />),
		leftAction = () => { },
		title = '',
		showRight = false,
		onPressSearch = () => { },
	} = props;
	// pros.navigation.openDrawer
	return (
		<Header style={headerStyle}>
			<StatusBar backgroundColor={"#fff"} barStyle='dark-content' />
			<View style={styles.container}>
				<TouchableOpacity onPress={leftAction} style={{ justifyContent: 'center', alignItems: 'center', width: 40 }} >
					{leftIcon}
				</TouchableOpacity>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text numberOfLines={1} style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: fontSize.h3 }}>{title}</Text>
				</View>
				{showRight ?
					<TouchableOpacity onPress={
						onPressSearch
					} style={{ alignItems: 'center', justifyContent: 'center', width: 40 }}>
						<Icon name='search' style={styles.icon} />
					</TouchableOpacity>
					:
					<View style={{ width: 40 }}></View>}
			</View>
		</Header >
	)
};


export const NewHead = (props) => {
	const {
		headerStyle = styles.headerDefault,
		leftIcon = (<Icon name='md-arrow-back' style={styles.icon} />),
		leftAction = () => { },
		title = null,
		onPressTitle = () => { },
		navigation = () => { },
		iconTitle = '1',
		showSearch = true,
		onPressSearch = () => { },
	} = props;
	// pros.navigation.openDrawer
	return (
		<Header style={[headerStyle, { height: 100 }]}>
			<StatusBar backgroundColor={'#fff'} barStyle='dark-content' />
			<View style={styles.container}>
				<TouchableOpacity onPress={leftAction} style={{ flex: 4, alignItems: 'center', justifyContent: 'center', marginLeft: 12, flexDirection: 'row' }} transparent>
					{leftIcon}
					<View style={{ marginLeft: 10, height: "100%", backgroundColor: COLOR.MAIN, justifyContent: 'center' }}>
						<Text style={{ color: '#fff', fontSize: 20 }}> Hoa hoc</Text>
						<Text style={{ color: '#fff' }}> Lop 12</Text>
					</View>
				</TouchableOpacity>
				<Text>asas</Text>
				{showSearch ?
					<TouchableOpacity onPress={
						onPressSearch
					} style={{ flex: 4, alignItems: 'center', justifyContent: 'center', marginRight: 4, flexDirection: 'row' }}>

						<Text style={{ fontSize: 13, color: "#fff", marginRight: 10 }}>Tìm kiếm</Text>
						<Icon name='search' style={styles.icon} />
					</TouchableOpacity>
					:
					<View style={{ flex: 2 }}></View>}
			</View>
		</Header >
	)
};

const styles = StyleSheet.create({
	imgWap: {
		height: '90%',
		aspectRatio: 1,
		// backgroundColor: '#fff'
	},

	img: {
		flex: 1,
		alignSelf: 'stretch',
		width: null,
		// borderRadius: 100,
		height: null
	},
	headerDefault: {
		backgroundColor: COLOR.white(1),
		paddingLeft: 0,
		paddingRight: 0,
		borderBottomWidth: 1,
		borderBottomColor: 'white',
		elevation: 0
		// height: 100
	},
	container: {
		flex: 1,
		flexDirection: 'row',
		paddingLeft: 0,
		// alignItems: 'flex-end'
	},
	title: {
		color: whiteColor(1),
		fontSize: 18,
		...fontMaker({ weight: 'Regular' })
	},
	icon: { fontSize: 25, color: '#836AEE' },
	layoutHead: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}
})

var Hexagon = () => {
	return (
		<View style={styleShapes.hexagon}>
			<View style={styleShapes.hexagonInner} />
			<View style={styleShapes.hexagonBefore}>
				<View style={styleShapes.hexagonBeforeInside} />
			</View>
			<View style={styleShapes.hexagonAfter} >
				<View style={styleShapes.hexagonAfterInside} />
			</View>
		</View>
	)
};
const styleShapes = StyleSheet.create({
	hexagon: {
		width: 100,
		height: 55,
		transform: [{ rotate: '28deg' }]
	},
	hexagonInner: {
		width: 99,
		height: 55,
		backgroundColor: 'transparent',
		// borderColor: 'transparent',
		borderLeftColor: '#fff',
		borderRightColor: '#fff',
		borderLeftWidth: 2.5,
		borderRightWidth: 2.5,


	},
	hexagonAfter: {
		position: 'absolute',
		bottom: -25,
		left: 0,
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderLeftWidth: 50,
		borderLeftColor: 'transparent',
		borderRightWidth: 50,
		borderRightColor: 'transparent',
		borderTopWidth: 25,
		borderTopColor: '#fff'
	},
	hexagonAfterInside: {
		position: 'absolute',
		// height: '100%',
		// width: '100%',
		bottom: 2,
		left: -45,
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderLeftWidth: 45,
		borderLeftColor: 'transparent',
		borderRightWidth: 45,
		borderRightColor: 'transparent',
		borderTopWidth: 23,
		borderTopColor: COLOR.MAIN,
	},
	hexagonBefore: {
		position: 'absolute',
		top: -24,
		left: 0,
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderLeftWidth: 50,
		borderLeftColor: 'transparent',
		borderRightWidth: 50,
		borderRightColor: 'transparent',
		// height: 25,
		// width: 100,
		// backgroundColor: 'blue',
		borderBottomWidth: 25,
		borderBottomColor: '#fff',
	},
	hexagonBeforeInside: {
		position: 'absolute',
		// height: '100%',
		// width: '100%',
		top: 2,
		left: -45,
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderLeftWidth: 45,
		borderLeftColor: 'transparent',
		borderRightWidth: 45,
		borderRightColor: 'transparent',
		borderBottomWidth: 23,
		borderBottomColor: COLOR.MAIN,
	},
});
export default Head;
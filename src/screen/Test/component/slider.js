import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, SafeAreaView, ScrollView, Text, StyleSheet, Platform, ImageBackground, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { fontMaker } from '../../../utils/fonts';
import { COLOR } from '../../../handle/Constant';
// import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';


const { width } = Dimensions.get('window');

export const UseAnimation = ({
	index,
	setIndex,
	max,
	openMod = () => { },
	handleShowConfirm = () => { },
	renderItem = () => null,
}) => {
	const [animation, setAnimation] = useState({
		l1: -width,
		l2: 0,
		l3: width,
	});

	const handleAnimation = useCallback((nextIndex) => {
		if (nextIndex % 3 == 1) { //0 => 1
			setAnimation({
				l1: -width,
				l2: 0, // show
				l3: width,
			});
		} else if (nextIndex % 3 == 2) { // 2
			setAnimation({
				l1: width,
				l2: -width,
				l3: 0,  // show
			})
		} else { // 3
			setAnimation({
				l1: 0,  // show
				l2: width,
				l3: -width,
			})
		}
	}, [])
	// index 0 1 2 3 4
	const [viewIndex, setView] = useState({
		l1: index - 1,
		l2: index, // show
		l3: +index + 1,
	});

	const refScreen1 = useRef();
	const refScreen2 = useRef();
	const refScreen3 = useRef();

	useEffect(() => {
		if (refScreen1.current && refScreen1.current.scrollTo) { refScreen1.current.scrollTo({ y: 0 }) }
		if (refScreen2.current && refScreen2.current.scrollTo) { refScreen2.current.scrollTo({ y: 0 }) }
		if (refScreen3.current && refScreen3.current.scrollTo) { refScreen3.current.scrollTo({ y: 0 }) }
		if (typeof index === 'string') {
			setView({
				l1: index - 1,
				l2: index, // show
				l3: +index + 1,
			});
			setAnimation({
				l1: -width,
				l2: 0,
				l3: width,
			})
		}
	}, [index])
	const handleChangeIndex = useCallback((nextIndex) => {
		if (nextIndex > max) {
			handleShowConfirm(true);
			return 1;
		} else if (nextIndex == 0) {
			return 1;
		} else {
			// if(nextIndex > index) { // right
			if (nextIndex % 3 == 1) { //0 => 1
				setView({
					l1: nextIndex - 1,
					l2: nextIndex, // show
					l3: nextIndex + 1,
				});
			} else if (nextIndex % 3 == 2) { // 2
				setView({
					l1: nextIndex + 1,
					l2: nextIndex - 1,
					l3: nextIndex,  // show
				})
			} else { // 3
				setView({
					l1: nextIndex,  // show
					l2: nextIndex + 1,
					l3: nextIndex - 1,
				})
			}

			handleAnimation(nextIndex)
			setIndex(nextIndex)
		}

	}, [index]);

	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<AnimatableView
					animation={animation}
					animationIndex={'l1'}
					content={renderItem(viewIndex['l1'], refScreen1)}
				/>
				<AnimatableView
					animation={animation}
					animationIndex={'l2'}
					content={renderItem(viewIndex['l2'], refScreen2)}
				/>
				<AnimatableView
					animation={animation}
					animationIndex={'l3'}
					content={renderItem(viewIndex['l3'], refScreen3)}
				/>
			</View>
			{/* </GestureRecognizer> */}
			<NavigateIndex
				openMod={openMod}
				index={index}
				max={max}
				handleChangeIndex={handleChangeIndex}
			/>
		</View>

	)
}

const AnimatableView = ({ content, animationIndex, animation }) => {
	return (
		<Animatable.View
			transition={["left", "opacity"]}
			duration={300}
			style={[stylesAni.ani, {
				left: animation[animationIndex],
				opacity: animation[animationIndex] == 0 ? 1 : 0,
			}]}
			easing="ease-out"
		>
			{
				// animation[animationIndex] == 0 &&
				content
			}
		</Animatable.View>
	)
}

const stylesAni = StyleSheet.create({
	ani: {
		position: 'absolute',
		height: '100%',
		width: '100%',
		justifyContent: "center",
		alignItems: 'center'
	}
})

export const NavigateIndex = ({ handleChangeIndex, index, max, openMod }) => {
	return (
		<View style={stNavigate.container}>
			{index != 1 ?
				<TouchableOpacity
					onPress={() => handleChangeIndex(index - 1)}
					style={{
						justifyContent: 'center',
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<Icon type='MaterialCommunityIcons' name="chevron-left" style={{ color: COLOR.MAIN }} />
					<Text style={[stNavigate.text, { color: COLOR.MAIN }]}> Trước </Text>
				</TouchableOpacity>
				: <View />}

			{index != max ?
				<TouchableOpacity
					onPress={() => handleChangeIndex(+index + 1)}
					style={{
						justifyContent: 'center',
						flexDirection: 'row',
						alignItems: 'center'
					}}
				// style={stNavigate.rightBtn}
				>
					{/* <LinearGradient
					style={stNavigate.next}
					colors={['#f48e37', '#f6a048', '#f7d87e']}
				> */}
					<Text style={[stNavigate.text, { color: COLOR.MAIN }]}>Tiếp theo </Text>
					<Icon type='MaterialCommunityIcons' name="chevron-right" style={{ color: COLOR.MAIN }} />
					{/* </LinearGradient> */}
				</TouchableOpacity> :
				<View />
			}

		</View>
	)
}

const stNavigate = StyleSheet.create({
	container: {
		width: '100%',
		// backgroundColor: '#dedede',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		// borderTopColor: '#dedede',
		// borderTopWidth: 1,
		paddingVertical: 10,
		paddingHorizontal: 20
	},
	text: {
		fontSize: 18,
		...fontMaker({ weight: 'Black' })
	},
	leftBtn: {
		// opacity: index == 1? 0.5: 1,
		// width: "40%",
		justifyContent: "center",
		alignItems: "center",

		// backgroundColor: 'red',
		// borderRadius: 25,
		// borderWidth: 4,
		paddingVertical: 10,
		// borderColor: '#e88812'
	},
	centerBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		width: "60%",
		height: '100%'
	},
	// rightBtn: {
	// 	width: "40%",
	// },
	next: {
		width: '100%',
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 25,
		paddingVertical: Platform.OS === 'ios' ? 12 : 9
	},
	iconCen: {
		fontSize: 14,
	}

})

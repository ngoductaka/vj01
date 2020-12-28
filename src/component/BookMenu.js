import React, { useState } from "react";
import { Icon, Accordion } from "native-base";
import { FlatList, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Animated, Dimensions } from 'react-native';

import MenuItem from '../component/menuItem';

const { height, width } = Dimensions.get('window');
const dnd = Math.round(height * 0.17)
const SubjectMenu = (props) => {
	const { bookName, navigation, isBar = false, closeBar = () => { } } = props;
	const bookData = listBook[bookName];

	const [animation] = useState(new Animated.Value(0));
	// const [animation1] = useState(new Animated.Value(177));
	const _handleHideTitle = () => {
		Animated.timing(animation, {
			toValue: 1,
			duration: 800,
		}).start();
	};

	const _handleShowTitle = () => {
		Animated.timing(animation, {
			toValue: 0,
			duration: 800,
		}).start();
	};

	// let close = false;
	const _handleScroll = (event) => {
		const currentOffset = event.nativeEvent.contentOffset.y;
		if (currentOffset > 100) _handleHideTitle();
		// if (currentOffset < 10 && currentOffset !== 0) _handleShowTitle();
	}
	// this.component._root.scrollToPosition(0, 0)
	const _renderHeader = (item, expanded) => {
		return (
			<View style={styles.headerList}>
				<View style={{ width: '93%' }}>
					<Text style={[styles.header, { fontSize: isBar ? 13 : 15 }]}>
						{item.title}
					</Text>
				</View>
				<View style={{ width: '7%' }}>
					{expanded
						? <Icon style={[styles.icon, { textAlign: 'right' }]} name="remove-circle" />
						: <Icon style={[styles.icon, { textAlign: 'right' }]} name="add-circle" />}
				</View>
			</View>
		);
	}
	const _handleSelect = (item) => {
		navigation.navigate("Demo", { key: item.key, bookName });
		if (isBar) closeBar()
	}
	const _renderItem = ({ item }) => {
		const convertString = item.key.replace(/-/g, ' ');
		return (
			<TouchableOpacity onPress={() => _handleSelect(item)}>
				<View style={{
					paddingLeft: isBar ? 10 : 15,
					height: 35,
					borderWidth: 1,
					borderTopWidth: 0,
					borderColor: '#ddd',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexDirection: 'row',
				}}>
					<Text style={{ fontSize: isBar ? 12 : 14, textTransform: 'capitalize' }}>{convertString}</Text>
					{!isBar && <Icon style={[styles.icon, { marginRight: 20 }]} name="md-arrow-dropright" />}
				</View>
			</TouchableOpacity>
		)
	}
	const _renderContent = ({ content = [] }) => {
		return (
			<View>
				<FlatList
					data={content}
					renderItem={_renderItem}
				/>
			</View>
		);
	}
	const headContainerStyle = {
		opacity: animation.interpolate({
			inputRange: [0, 0.5, 1],
			outputRange: [1, 0, 0],
		}),

		marginTop: animation.interpolate({
			inputRange: [0, 0.5, 1],
			outputRange: [0, -dnd, -dnd],
		}),

		marginLeft: animation.interpolate({
			inputRange: [0, 0.5, 1],
			outputRange: [0, 0, width],
		}),

		transform: [
			{
				scale: animation.interpolate({
					inputRange: [0, 0.2, 0.5, 1],
					outputRange: [1, 1.1, 0.5, 1],
				})
			}
		]
	};

	const _renderHeadTitle = () => {
		return (
			<Animated.View style={[{ flexDirection: 'row', height: dnd }]}>
				<View style={{ flex: 1 }}>
					<MenuItem
						icon={bookData.img}
						style={styles.imgTitle}
						imgStyle={{ height: "80%", width: '80%', }}
					/>
				</View>
				<View style={{ flex: 2, padding: 20 }}>
					<Text style={{ textAlign: 'left' }}>
						{bookData.description}
					</Text>
				</View>
			</Animated.View>
		)
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			{!isBar && _renderHeadTitle()}
			<View style={[{ flex: 1 }]}>
				<Accordion
					dataArray={bookData.dataArray}
					animation={true}
					expanded={true}
					renderHeader={_renderHeader}
					renderContent={_renderContent}
					// onScroll={_handleScroll}
				/>
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	header: { fontWeight: "600" },
	headerList: {
		flexDirection: "row",
		padding: 10,
		marginTop: 5,
		// marginBottom: 10,
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#A9DAD6"
	},
	icon: { fontSize: 18 },
	imgTitle: { height: "100%", width: '100%' },
});

export default SubjectMenu;
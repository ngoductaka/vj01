import React from "react";
import { Icon } from "native-base";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Platform } from 'react-native';
import { NewHead } from '../../component/Header';
import Header from '../../component/Header';
import SubjectContent from '../../component/ListLesson';

const TableContent = (props) => {
	const bookName = props.navigation.getParam('book', '');
	const bookTitle = props.navigation.getParam('title', '');
	const activeLevel = props.navigation.getParam('activeLevel', []);

	return (
		<View style={{
			flex: 1,
			// justifyContent: 'center',
			// alignItems: 'center',
			// marginTop: 40,
		}}>
			<NewHead />
			{/*  */}
			<View style={stylesMainItem.wrapper}>
				<View aspectRatio={1} style={stylesMainItem.numberContent}>
					<View style={stylesMainItem.textView}>
						<Text style={stylesMainItem.textContent}>1</Text>
					</View>
				</View>
				<View style={stylesMainItem.contentView}>
					<Text numberOfLines={2} style={stylesMainItem.content}>
						Chuong 1: este  sfsasaewergrtrtvdsqergwrewrt werfwerfrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
					</Text>
				</View>
				<Icon style={stylesMainItem.iconLeft} name="arrow-dropright" />
			</View>
			{/*  */}
			{/* <View > */}
			<FlatList
				style={stylesItem.wrapper}
				data={[1, 2, 3, 4, 5, 6, 6, 7, 8, 8, 8]}
				keyExtractor={({ item }) => `${item}_header`}
				// extraData={itemExpanded}
				renderItem={({ item }) => {
					return (
						<React.Fragment>
							{_renderTitleLesson(item)}
							{/* {indexLesson == itemExpanded && <RenderDetailLesson lessonItem={lessonItem} 0={0} _handleSelect={_handleSelect} activeDetail={activeDetail} />} */}
						</React.Fragment>
					)
				}}

			/>
			{/* </View> */}
		</View>
	);
}
const _renderTitleLesson = (lessonItem) => {
	return (
		<TouchableOpacity
			style={[titleLessonStyles.headerList]}
		// onPress={() => {
		// 	setItemExpanded(expanded ? null : indexLesson);
		// 	if (lessonItem.type == 1) {
		// 		_handleSelect(lessonItem);
		// 	}
		// }}
		>
			<View
				style={{ width: '93%', borderWidthLeft: 2 }}
			>
				<Text
					style={[titleLessonStyles.header, { fontSize: 0 ? 14 : 17, fontWeight: 'bold' }]}
				>
					{lessonItem}
				</Text>
			</View>
			<View style={{ width: '7%' }}>
				{0
					? <Icon style={[titleLessonStyles.icon, { textAlign: 'right' }]} name="remove-circle" />
					: <Icon style={[titleLessonStyles.icon, { textAlign: 'right' }]} name="add-circle" />}
			</View>
		</TouchableOpacity>

	)
};

const titleLessonStyles = StyleSheet.create({
	icon: { fontSize: 18 },
	header: { fontWeight: "600" },
	headerList: {
		flexDirection: "row",
		padding: 14,
		marginTop: 3,
		// marginBottom: 10,
		justifyContent: "space-between",
		alignItems: "center",
		borderLeftWidth: 2,
		borderBottomColor: '#ddd',
		borderBottomWidth: 2,
		backgroundColor: "#FFF"
	},
})

const stylesMainItem = StyleSheet.create({
	wrapper: {
		// flex: 1,
		height: 70,
		width: '90%',
		borderWidth: 10,
		borderColor: '#f69b49',
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		display: 'flex',
		justifyContent: 'flex-start',
		flexDirection: 'row',
		// overflow: 'hidden',

	},
	numberContent: {
		height: 80,
		borderBottomLeftRadius: 30,
		marginTop: -35,
		backgroundColor: '#fff',
		flex: 3,

	},
	textView: {
		margin: 5,
		marginLeft: 10,
		flex: 1,
		backgroundColor: '#f8ab47',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 6, height: 2 },
        shadowOpacity: Platform.OS === 'ios' ? 0.4 : 0.8,
		shadowRadius: 2,
		elevation: 1,
	},
	textContent: {
		fontSize: 30,
		color: '#fff'

	},
	contentView: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: "center",
		// width: '90%',
		overflow: 'hidden',
		// maxWidth: '80%'
		flex: 9,
	},
	content: {
		fontSize: 20,
		textTransform: 'uppercase',
		overflow: 'hidden',
		// wordWrap: 'break-word'
	},
	iconLeft: {
		marginRight: 5, marginTop: 5, textAlign: 'center',
		color: '#f8ab47',
	}
});
const stylesItem = StyleSheet.create({
	wrapper: {
		// backgroundColor: '#dedede',
		borderRadius: 10,
		width: '90%',
		borderWidth: 5,
		borderColor: '#fef070',
		marginTop: 10,

	}
})
export default TableContent;
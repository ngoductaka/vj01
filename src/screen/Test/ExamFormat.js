import React from 'react';
import { View, FlatList, SafeAreaView, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';

import { setUserInfo } from '../../redux/action/user_info';
import { Loading, useRequest } from '../../handle/api';
import Header from './component/normalHeader';

const token = {
	Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvdGVzdC52aWV0amFjay5jb206MTMxMFwvbW9iaWxlLWFwaVwvdjFcL2xvZ2luIiwiaWF0IjoxNTg0NzIzNzc1LCJuYmYiOjE1ODQ3MjM3NzUsImp0aSI6InhrWTRHNUtRWlhQQ293TnQiLCJzdWIiOjYzMDcwLCJwcnYiOiI3NWQxMWUzZTg2OTMwMzg1YWFjMGEwMTQ4OTcyODAxZjVlMTM2MTYwIiwiaW1laSI6bnVsbH0.iKiCYm5IHHgeMhI7mEoN46GX4iGtOZczuJ_ik08Mwm0'
}
import RenderLesson from './component/RenderLesson';
import BackHeader from '../Subject/component/BackHeader';

//  ========== show list subject class====================
const Test = (props) => {
	const idDetail = props.navigation.getParam('idDetail', '');
	const currSubjectName = props.navigation.getParam('currSubjectName', '');
	const sourceScreen = props.navigation.getParam('sourceScreen', '');
	const subjectTest = props.navigation.getParam('subjectTest', {});

	// /multiple-choice/classlevel/11/subject/1
	const subjectDetail = `/multiple-choice/season/${idDetail}?per_page=60&page=1`;
	const [formatExamData, isLoadingSubject, errLoadingSubject] = useRequest(subjectDetail, [idDetail], 'get', token);
	let dataCourseConvert = get(formatExamData, 'courses.data', []);
	let name = get(formatExamData, 'season.name', '');

	return (
		<View
			style={[styles.container, { backgroundColor: "#dedede" }]}
		>
			<BackHeader
				title={name}
				leftAction={() => {
					if (sourceScreen) {
						props.navigation.navigate(sourceScreen);
						props.navigation.setParams({ sourceScreen: '' });
					} else {
						props.navigation.goBack()
					}
				}}
			/>
			<SafeAreaView style={styles.container}>
				<Loading isLoading={isLoadingSubject} err={errLoadingSubject}>
					{!isEmpty(dataCourseConvert) ?
						<RenderTableContent name={name} data={dataCourseConvert} props={props} currSubjectName={currSubjectName || subjectTest.name} /> :
						(
							<View style={{ justifyContent: "center", alignItems: 'center' }}>
								<Text style={{ fontSize: 18, marginTop: 25 }}> Tài liệu đang được biên soạn ... </Text>
							</View>
						)}
				</Loading>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	selectForm: {
		width: '40%',
		borderRadius: 10,
		backgroundColor: 'white',
		paddingHorizontal: 15,
		paddingVertical: 5,
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#aedcfc'
	},
	chooseClass: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 20,
		marginBottom: 10,
	},
	listClass: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 20,
		padding: 10,

		borderRightWidth: 5,
		borderRightColor: '#dadede',

		borderBottomWidth: 5,
		borderBottomColor: '#dadada'
	},
	itemClass: {
		width: '45%',
		borderWidth: 2.5,
		borderColor: '#fdb55f',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: Platform.OS === 'ios' ? 6 : 4,
		borderRadius: 20
	}
})

const mapDispatchToProps = dispatch => {
	return {
		setUserInfo: (userInfo) => dispatch(setUserInfo(userInfo)),
	};
};

export default connect(
	(state) => ({
		userInfo: state.userInfo,
	}),
	mapDispatchToProps
)(Test);


const RenderTableContent = ({ name = '', data, props, currSubjectName }) => {
	const randColor = handleColor();
	return (
		<View style={tblContentStyle.container}>
			{(data) ?
				(<View style={{ marginTop: 10 }}>
					<FlatList
						contentContainerStyle={{ marginLeft: 10 }}
						numColumns={2}
						style={{ marginBottom: 20 }}
						data={data}
						renderItem={({ item, index }) => RenderLesson({ content: item, props, currSubjectName, randColor, style: { marginBottom: 8, marginRight: index % 2 ? 0 : 8, width: (Dimensions.get('window').width - 34) / 2 } })}
						keyExtractor={(item, index) => index + 'subitem'}
					/>
				</View>) : (
					<View>
						<Text style={{ fontSize: 18, marginTop: 25 }}> Tài liệu đang được biên soạn ... </Text>
					</View>
				)
			}
		</View>
	)
}

const tblContentStyle = StyleSheet.create({
	container: { flex: 1 },
	header: {
		paddingVertical: 10,
		paddingLeft: 10,
		backgroundColor: '#fff9e7',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		flexDirection: 'row',
		flex: 1,
		paddingRight: 10
	},
	iconLeft: { color: 'black', fontSize: 30 },
	textSwapper: {
		justifyContent: "center",
		paddingRight: 25,
	},
	textTitle: { textAlign: 'left', fontSize: 18 },
	rightIcon: { color: 'black', fontSize: 15, marginRight: 5 }

})
const fullColor = [
	['#ff7e5f', '#feb47b'],
	['#799f0c', '#acbb78'],
	['#ffe000', '#799f0c'],
	['#ffe259', '#ffa751'],
	['#5433ff', '#20bdff'],
	['#20bdff', '#a5fecb'],
	['#a5fecb', '#5433ff'],
	// ['#00416a', '#799f0c'],
	['#799f0c', '#ffe000'],
	// ['#ffe000', '#00416a'],
]
const handleColor = () => {
	const index = Math.floor(Math.random() * (fullColor.length - 1))
	return fullColor[index]
}
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Platform,
	ScrollView,
} from 'react-native';
import ModalBox from 'react-native-modalbox';
import { get } from 'lodash';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

import { COLOR } from '../../../handle/Constant';
import { fontMaker } from '../../../utils/fonts';

const { width, height } = Dimensions.get('window');

const ModalTestScore = (props) => {
	const {
		setShowScore = () => { },
		isShowScore = true,
		data = {},
		rightAction = () => { },
		leftAction = () => { }
	} = props;
	const {
		correctAns,
		max,
		wrongAns,
	} = data;
	const correct = data.percentCorr * 100;
	const wrong = data.percentWro * 100;
	const scoreConvert = Number(data.percentCorr * 10).toFixed(2)

	return (
		<ModalBox
			onClosed={() => setShowScore(false)}
			isOpen={isShowScore}
			backdropPressToClose={false}
			useNativeDriver={false}
			swipeToClose={false}
			backdropColor='rgba(0, 0, 0, .7)'
			style={scoreStyle.modal}
			position='center'
		>
			<View style={scoreStyle.container}>
				<View style={scoreStyle.scoreContainer}>
					<View style={scoreStyle.circleSc}>
						<Text>Điểm</Text>
						<Text style={{ fontSize: 50 }}>{scoreConvert}</Text>
						<Text>{data.score}</Text>
					</View>
				</View>
				<View style={{ flex: 1, padding: 20, justifyContent: 'space-around' }}>
					<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
						<Icon type='FontAwesome5' name="stopwatch" style={{
							fontSize: 20,
							// color: '#fff',
							marginRight: 15,
						}}></Icon>
						<Text style={{ fontSize: 18, marginBottom: 5 }}>{convertTime(isShowScore)}</Text>
					</View>
					{/* isShowScore */}
					<View style={{ paddingVertical: 10 }}>
						<Text style={{ fontSize: 18, marginBottom: 5 }}>Số câu đúng: {correctAns}/{max}</Text>
						<View style={{ height: 15, width: '100%', backgroundColor: '#dedede' }}>
							<View style={{ height: 15, width: `${correct}%`, backgroundColor: COLOR.CORRECT }}></View>
						</View>
					</View>
					<View style={{ paddingVertical: 10 }}>
						<Text style={{ fontSize: 18, marginBottom: 5 }}>Số câu sai: {wrongAns}/{max}</Text>
						<View style={{ height: 15, width: '100%', backgroundColor: '#dedede' }}>
							<View style={{ height: 15, width: `${wrong}%`, backgroundColor: COLOR.WRONG }}></View>
						</View>
					</View>
					<View style={{ paddingVertical: 10 }}>
						<Text style={{ fontSize: 18, marginBottom: 5 }}>Số câu chưa trả lời: {max - wrongAns - correctAns}/{max}</Text>
						<View style={{ height: 15, width: '100%', backgroundColor: '#dedede' }}>
							<View style={{ height: 15, width: `${100 - wrong - correct}%`, backgroundColor: '#aaa' }}></View>
						</View>
					</View>
					<View style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 10,
					}}>
						<TouchableOpacity
							onPress={leftAction}>
							<LinearGradient
								start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}
								colors={[COLOR.CORRECT, COLOR.WRONG]}
								style={{
									borderRadius: 30,
									paddingVertical: 10,
									paddingHorizontal: 12,
								}} >
								<Text style={{ fontSize: 19, color: '#fff' }}>Xem chi tiết</Text>
							</LinearGradient>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={rightAction}
						>
							<LinearGradient
								start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
								colors={['#a5fecb', '#5433ff']}
								style={{
									borderRadius: 30,
									paddingVertical: 10,
									paddingHorizontal: 12,
								}} >
								<Text style={{ fontSize: 19, color: '#fff', ...fontMaker({ weight: 'Regular' }) }}>Bài tiếp theo</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ModalBox>
	)
};

const scoreStyle = StyleSheet.create({
	modal: {
		width: width - 20,
		height: width,
		backgroundColor: '#fff',
		borderRadius: 20
	},
	container: { flex: 1 },
	scoreContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: '#dedede'
	},
	circleSc: {
		height: 150,
		width: 150,
		// backgroundColor: COLOR.WRONG,
		borderRadius: 150,
		borderColor: COLOR.CORRECT,
		borderWidth: 3,
		marginTop: -40,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

const ModalAllResult = (props) => {
	const {
		isOpenAllQes = false,
		setOpenAllQes = () => { },
		handleResult = {},
		resultEx = {},
		dataCourseConvert = [],
		setIndex
	} = props;

	return (
		<ModalBox
			onClosed={() => setOpenAllQes(false)}
			isOpen={isOpenAllQes}
			backdropPressToClose={true}
			swipeToClose={true}
			useNativeDriver={true}
			backdropColor='rgba(0, 0, 0, .7)'
			style={{
				width: width - 20,
				height: 590,
				maxHeight: height / 1.3,
				backgroundColor: '#fff',
				borderTopRightRadius: 0,
				borderRadius: 20
			}}
			position='bottom'
		>
			<View
				style={{ flex: 1, paddingRight: 20, paddingVertical: 20 }}
			>
				<View style={{
					justifyContent: 'center',
					alignContent: 'center',
					display: 'flex',
					flexDirection: 'row',
					marginLeft: 20
				}}>
					<View style={{
						justifyContent: 'center',
						alignItems: 'center',
						marginBottom: 10,
						borderBottomColor: '#dedede',
						borderBottomWidth: 2,
						paddingVertical: 15
					}}>
						<Text style={{ fontSize: 24, textAlign: "center", ...fontMaker({ weight: 'Regular' }) }}>
							{`${handleResult.text} ${get(props, 'userInfo.user.first_name', 'Bạn')} đã đạt được ${handleResult.score} `}
						</Text>
						<Text style={{ ...fontMaker({ weight: 'Regular' }) }}>Tiếp tục cố gắng cùng VietJack nhé</Text>
					</View>
				</View>
				<TouchableOpacity
					onPress={() => setOpenAllQes(false)}
					style={{
						position: 'absolute',
						borderRadius: 30,
						width: 45, height: 45,
						justifyContent: 'center',
						alignItems: 'center',
						alignSelf: 'flex-end',
						backgroundColor: '#dedede',
						top: -25,
						right: -10
					}}
				>
					<Icon name='close' style={{ fontSize: Platform.OS === 'ios' ? 30 : 22, color: '#000' }} />
				</TouchableOpacity>
				<RenderResult
					setIndex={setIndex}
					setOpenAllQes={setOpenAllQes}
					data={resultEx}
					max={dataCourseConvert.length}
				/>
			</View>
		</ModalBox>
	)
}


const RenderResult = ({ data, max, setIndex, setOpenAllQes }) => {
	const dataInit = new Array(max).fill('null').map((_, i) => i + 1);
	const [dataRender, setRenderData] = useState(dataInit);
	useEffect(() => {
		setRenderData(dataInit);
	}, [data])
	const setVal = (type) => {
		if (type === 'wrong') {
			const resultWrong = Object.keys(data).filter(itemResult => {
				return !get(data, `${itemResult}.isCorrect`, null)
			});
			setRenderData(resultWrong)

		} else if (type === 'correct') {
			const resultWrong = Object.keys(data).filter(itemResult => {
				return get(data, `${itemResult}.isCorrect`, null)
			});
			setRenderData(resultWrong)

		} else {
			setRenderData(dataInit)
		}
	}
	return (
		<View style={{ flex: 1 }}>
			<ScrollView style={{ flex: 1 }}>
				<View style={styleResult.container}>
					{dataRender
						.map((i, index) => {
							let bg = '#dedede';
							const reIndex = get(data, `${i}.isCorrect`, null);
							if (reIndex === true) {
								bg = '#32CD32'
							} else if (reIndex === false) {
								bg = '#DC143C'
							}
							return (
								<TouchableOpacity
									onPress={() => {
										setIndex(`${i}`);
										setOpenAllQes(false)
									}}
									key={String(i)}
									style={[styleResult.itemRe, {
										backgroundColor: bg,
										borderColor: bg,
									}]}>
									<Text style={{
										color: bg === '#dedede' ? '#000' : '#fff',
										...fontMaker({ weight: 'Regular' }),
										fontSize: 16,
									}}>{i}</Text>
								</TouchableOpacity>
							)
						})
					}
				</View>
			</ScrollView>

			<View
				style={{
					paddingVertical: 25,
					flexDirection: 'row',
					justifyContent: 'space-around'
				}}
			>
				<TouchableOpacity onPress={() => setVal('wrong')} style={[styleResult.btnFilter, { backgroundColor: '#DC143C' }]}>
					<Text style={styleResult.text}>Sai</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => setVal('')} style={[styleResult.btnFilter, { backgroundColor: '#dedede' }]}>

					<Text style={[styleResult.text, { color: '#000' }]}>Tất cả</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => setVal('correct')} style={[styleResult.btnFilter, { backgroundColor: '#32CD32' }]}>
					<Text style={styleResult.text}>Đúng</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
const styleResult = StyleSheet.create({
	btnFilter: {
		paddingVertical: 9, borderRadius: 20, width: 90, justifyContent: 'center', alignItems: 'center'
	},
	text: {
		fontSize: 16,
		fontWeight: '400',
		color: '#fff'
	},
	itemRe: {
		borderWidth: 2,
		width: 50,
		height: 50,
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,

	},
	container: {
		flex: 1,
		flexDirection: 'row',
		marginBottom: 20,
		// backgroundColor: 'blue',
		flexWrap: 'wrap',
		justifyContent: 'center',
	}
})


export {
	ModalTestScore,
	ModalAllResult
};
const convertTime = (seconds) => {
	// const m = parseInt(seconds / 60 / 60);
	const m = parseInt(seconds / 60);
	const s = parseInt(seconds % 60);
	return ((m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
};
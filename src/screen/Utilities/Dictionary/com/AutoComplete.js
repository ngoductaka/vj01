import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { View, FlatList, SafeAreaView, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform, Keyboard } from 'react-native';
import { isEmpty } from 'lodash';

import { useRequest, Loading } from '../../../../handle/api';
import { Card, Icon } from 'native-base';
import { fontMaker } from '../../../../utils/fonts';
import { COLOR } from '../../../../handle/Constant';
import { ActivityIndicator } from 'react-native-paper';


const AutoComplete = (props) => {
	const {
		setShowAutoText,
		searchText,
		gradeId = 13,
		setSearchText,
		handleSaveSearchingKey
	} = props;
	const endPoint = `http://171.244.27.129:8088/api/autocomplete?query=${searchText}`;
	// console.log('endpoint', endPoint);

	const [result, loading, err] = useRequest(endPoint, [searchText, gradeId]);
	console.log('result', !!result)
	const handlePress = useCallback((textSearch) => {
		setSearchText(textSearch);
		setShowAutoText(false);
		handleSaveSearchingKey(textSearch);
	}, [searchText])
	return (
		<View style={{ backgroundColor: 'white', borderBottomLeftRadius: 18, borderBottomRightRadius: 18, ...styles.shadow }}>
			{loading ? <ActivityIndicator /> : null}
			{!isEmpty(result) ?
				<FlatList
					keyboardShouldPersistTaps='handled'
					data={result.suggestions}
					extraData={result.suggestions}
					renderItem={({ item, index }) => RenderItemTextAuto(item, index, handlePress)}
					keyExtractor={(item, index) => index + item.keyword + 'subitem'}
				/>
				:
				null
			}
		</View>
	)
}

const RenderItemTextAuto = (item, index, handlePress) => {
	return (
		<View>
			<TouchableOpacity
				style={{
					paddingTop: 10,
					borderTopColor: "#D9D9D9",
					borderTopWidth: index == 0 ? 0 : 0.5,
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingLeft: 25,
					marginBottom: 10,
					// backgroundColor: '#ddd'
				}}
				onPressIn={() => {
					handlePress(item.word);
					Keyboard.dismiss();
				}}
			>
				<View style={{ flexDirection: 'row' }}>
					<Icon name="ios-search" style={{ fontSize: 20, color: COLOR.black(.3), marginRight: 5 }} />
					<Text style={{ color: '#292526', ...fontMaker({ weight: 'Regular' }), }}>{item.word}</Text>
				</View>
				<Icon type="AntDesign" name="right" style={{ fontSize: 20, color: COLOR.black(.3), marginRight: 5 }} />

			</TouchableOpacity>
		</View>
	)
}

const styles = {
	shadow: {
		shadowColor: "rgba(0,0,0,0.3)",
		shadowOffset: {
			width: 5,
			height: 5,
		},
		shadowOpacity: 0.3,
		shadowRadius: 5,

		elevation: 3,
	}
}

export default AutoComplete;
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { View, FlatList, SafeAreaView, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform, Keyboard } from 'react-native';
import { isEmpty } from 'lodash';

import { useRequest, Loading } from '../../handle/api';
import { Card, Icon } from 'native-base';
import { fontMaker } from '../../utils/fonts';
import { COLOR } from '../../handle/Constant';

const AutoComplete = (props) => {
	const {
		setShowAutoText,
		searchText,
		gradeId = 13,
		setSearchText,
		handleSaveSearchingKey
	} = props;
	const grade_params = (gradeId && gradeId != 13) ? `&grade_id=${gradeId}` : '';
	const endPoint = `/elastic/keyword?q=${searchText}${grade_params}&limit=6`;
	// console.log('endpoint', endPoint);

	const [result, loading, err] = useRequest(endPoint, [searchText, gradeId]);

	const handlePress = useCallback((textSearch) => {
		setSearchText(textSearch);
		setShowAutoText(false);
		handleSaveSearchingKey(textSearch);
	}, [searchText])
	return (
		<View style={{ backgroundColor: 'white', borderBottomLeftRadius: 18, borderBottomRightRadius: 18, ...styles.shadow }}>
			{!isEmpty(result) ?
				<FlatList
					keyboardShouldPersistTaps='handled'
					data={result.data}
					extraData={result.data}
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
		<TouchableOpacity
			style={{
				padding: 15,
				borderTopColor: "#D9D9D9",
				borderTopWidth: index == 0 ? 0 : 0.5,
				flexDirection: 'row',
			}}
			onPressIn={() => {
				handlePress(item.keyword);
				Keyboard.dismiss();
			}}
		>
			<Icon name="ios-search" style={{ fontSize: 20, color: COLOR.black(.3), marginRight: 5 }} />
			<Text style={{ color: '#292526', ...fontMaker({ weight: 'Regular' }), }}>{item.keyword}</Text>
		</TouchableOpacity>
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
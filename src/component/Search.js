import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Keyboard, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import { Icon } from 'native-base';

import useDebounce from '../utils/useDebounce';
import { fontMaker } from '../utils/fonts';
import { Colors } from '../utils/colors';
import { blackColor, COLOR } from '../handle/Constant';

const Search = ({ style = {}, handleTypeKeyword = () => { }, handleSaveSearchingKey = () => { }, setIsBlank = () => { }, setIsShowAuto = () => { }, showFilter = () => { }, placeholder = 'Nhập từ khóa tìm kiếm...', ...props }) => {
	const [value, setValue] = useState(props.initKey ? props.initKey : '');
	const valueDebounce = useDebounce(value, 500);

	useEffect(() => {
		if (props.initKey) setValue(props.initKey);
	}, [props.initKey]);

	useEffect(() => {
		if (valueDebounce && String(valueDebounce).trim() !== '') {
			handleTypeKeyword(valueDebounce);
		}
	}, [valueDebounce]);

	const handleOnFocus = useCallback(() => {
		if (value && String(value).trim() !== '') {
			setIsShowAuto(true);
		}
	});

	return (
		<View style={[stylesSearch.inputForm, style]} >
			<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
				<TextInput
					keyboardType={Platform.OS === 'ios' ? 'web-search' : 'default'}
					onFocus={handleOnFocus}
					value={value}
					placeholder={placeholder}
					autoCorrect={false}
					placeholderTextColor='rgba(0, 0, 0, 0.3)'
					onChangeText={(text) => {
						setValue(text);
						if (text.trim().length === 0) {
							setIsBlank(true);
							setIsShowAuto(false);
						} else {
							setIsBlank(false);
							setIsShowAuto(true);
						}
					}}
					returnKeyType='search'
					onSubmitEditing={() => {
						handleSaveSearchingKey();
						setIsShowAuto(false);
						Keyboard.dismiss();
					}}
					style={stylesSearch.inputTag}
				/>
				<Icon name='ios-search' style={{ position: 'absolute', left: 0, color: COLOR.black(.3), fontSize: 20, paddingLeft: 12, paddingTop: 3 }} />
				{value.trim().length > 0 &&
					<TouchableOpacity style={stylesSearch.icon} onPress={() => {
						setValue('');
						props.setSearchText('')
						setIsBlank(true);
					}}>
						<Icon type='MaterialCommunityIcons' name='close-circle' style={{ fontSize: 22, color: "#BFBFBF" }} />
					</TouchableOpacity>
				}
			</View>
			<TouchableOpacity onPress={showFilter} style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
				<Icon type='AntDesign' name='filter' style={{ fontSize: 26, color: blackColor(0.6) }} />
			</TouchableOpacity>
		</View>
	)
}

const stylesSearch = StyleSheet.create({
	inputForm: {
		flexDirection: 'row',
		marginHorizontal: 15,
	},
	inputTag: {
		flex: 1,
		backgroundColor: '#E6E6E6',
		color: Colors.black,
		borderRadius: 30,
		paddingLeft: 35,
		paddingRight: 42,
		paddingVertical: Platform.OS === 'ios' ? 12 : 8,
		...fontMaker({ weight: 'Light' })
	},
	icon: {
		position: 'absolute', right: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
})

export default Search;
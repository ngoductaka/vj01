import React, { memo, useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, TextInput, Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon, Textarea } from 'native-base';
import Communication from 'react-native-communications';
import Toast from 'react-native-simple-toast';

import Header from '../../component/Header';
import { helpers } from '../../utils/helpers';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { COLOR } from '../../handle/Constant';
import { user_services } from '../../redux/services';
import SimpleToast from 'react-native-simple-toast';

//  ========== show list subject class====================
const FeedBack = memo((props) => {

	const [focus, setFocus] = useState(-1);
	const [state, setState] = useState({ content: '', contact: null });

	const sendFeedback = async () => {
		try {
			// console.log('sendFeedback', state.content.trim());
			if (!(state.content.trim().length > 0)) {
				alert('Bạn cần nhập nội dung góp ý.');
				return;
			}
			const result = await user_services.sendFeedback({
				content: state.content, contact: state.contact
			});
			// console.log('-----handle send feedback----', result);
			if (result.status === 200) {
				setState({ content: '', contact: '' });
				Toast.show('Cảm ơn bạn đã đóng góp ý kiến. Chúc bạn có những thời gian trải nghiệm ứng dụng vui vẻ!');
			} else {
				SimpleToast.show('Đã có lỗi khi gửi ý kiến góp ý, mời bạn thử lại sau!');
			}

		} catch (err) {
			SimpleToast.show('Đã có lỗi khi gửi ý kiến góp ý, mời bạn thử lại sau!');
		}

	}

	return (
		<View style={{ flex: 1 }}>
			<Header
				leftIcon={<Icon name='ios-arrow-back' style={{ fontSize: 25, color: '#836AEE' }} />}
				title={`GÓP Ý`}
				navigation={props.navigation}
				leftAction={() => {
					props.navigation.goBack();
				}}
				showSearch={false}
			/>
			<SafeAreaView style={styles.container}>
				<KeyboardAwareScrollView>
					<View style={{ padding: 15 }}>
						<Text style={{ ...fontMaker({ weight: fontStyles.Regular }) }}> Mọi góp ý, yêu cầu hỗ trợ vui lòng liên hệ chúng tôi </Text>
						<Textarea
							placeholder="Nhập nội dung ý kiến"
							placeholderTextColor={COLOR.black(.3)}
							onFocus={() => setFocus(0)}
							onBlur={() => setFocus(-1)}
							rowSpan={5}
							style={[styles.input, focus == 0 && { backgroundColor: 'white', borderWidth: 1, borderColor: COLOR.MAIN }]}
							onChangeText={(text) => setState({ ...state, content: text })}
							value={state.content}
						/>
						<TextInput
							placeholder="Email hoặc số điện thoại"
							placeholderTextColor={COLOR.black(.3)}
							onFocus={() => setFocus(1)}
							onBlur={() => setFocus(-1)}
							style={[styles.input2, focus == 1 && { backgroundColor: 'white', borderWidth: 1, borderColor: COLOR.MAIN }]}
							onChangeText={(text) => setState({ ...state, contact: text })}
							value={state.contact}
						/>

						<TouchableOpacity
							style={styles.btn}
							onPress={sendFeedback}
						>
							<Text style={{ color: '#fff', ...fontMaker({ weight: 'Bold' }) }}>Gửi góp ý</Text>
						</TouchableOpacity>
					</View>

					<TouchableOpacity onPress={() => { helpers.openUrl('https://www.facebook.com/hoc.cung.vietjack') }} style={[{ height: 50, paddingLeft: 20, borderTopColor: '#ddd', borderTopWidth: 1, alignItems: 'center', }, styles.baseItem]}>
						<View style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'flex-start' }}>
							<Icon name={'logo-facebook'} />
						</View>
						<Text style={{ ...fontMaker({ weight: fontStyles.Regular }) }} numberOfLines={1}>{'https://www.facebook.com/hoc.cung.vietjack'}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => { Communication.email(['vietjack_admin@gmail.com'], null, null, null, 'Phản hồi đến VietJack') }} style={[{ height: 50, paddingLeft: 20, alignItems: 'center' }, styles.baseItem]}>
						<View style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'flex-start' }}>
							<Icon name={'md-mail'} />
						</View>
						<Text style={{ ...fontMaker({ weight: fontStyles.Regular }) }} numberOfLines={1}>{'vietjack_admin@gmail.com'}</Text>
					</TouchableOpacity>
				</KeyboardAwareScrollView>
			</SafeAreaView>
		</View>
	)
})


const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	baseItem: { width: '100%', display: 'flex', flexDirection: 'row', borderBottomColor: '#ddd', borderBottomWidth: 1 },
	input: {
		paddingLeft: 12,
		paddingTop: 12,
		paddingBottom: 12,
		paddingRight: 12,
		backgroundColor: COLOR.black(.03),
		marginTop: 20,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLOR.black(.03),
		...fontMaker({ weight: fontStyles.Regular })
	},
	input2: {
		padding: 12,
		backgroundColor: COLOR.black(.03),
		borderRadius: 8,
		marginTop: 20,
		borderWidth: 1,
		borderColor: COLOR.black(.03),
		...fontMaker({ weight: fontStyles.Regular })
	},
	btn: {
		backgroundColor: 'orange',
		marginTop: 25,
		marginBottom: 5,
		paddingVertical: 14,
		paddingHorizontal: 50,
		borderWidth: 1,
		alignSelf: 'center',
		borderRadius: 8,
		borderColor: '#ddc',
		justifyContent: 'center',
		alignItems: 'center',

		shadowColor: 'rgba(0, 0, 0, 0.15)',
		shadowOpacity: 0.8,
		elevation: 6,
		shadowRadius: 10,
		shadowOffset: { width: 3, height: 10 },
	},
})
export default FeedBack;

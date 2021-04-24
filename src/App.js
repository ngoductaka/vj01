import React, { useEffect } from "react";
import { Provider } from 'react-redux';
import firebase from 'react-native-firebase';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppEventsLogger } from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/MaterialIcons'
import 'react-native-gesture-handler';

import CreateRootNavigator from './Router';
import store from './redux/store';
import RNExitApp from 'react-native-exit-app';
import { Alert } from "react-native";
import {
	setJSExceptionHandler,
	getJSExceptionHandler,
	setNativeExceptionHandler,
} from 'react-native-exception-handler';
import { throttle } from 'lodash';

Icon.loadFont();

import NavigationService from './Router/NavigationService';
import { mapScreenName } from './handle/Constant';

const App = () => {
	return (
		<Provider store={store}>
			<PaperProvider>
				<CreateRootNavigator
					ref={navigatorRef => {
						NavigationService.setTopLevelNavigator(navigatorRef)
					}}
					uriPrefix={'vietjack://'}
					onNavigationStateChange={(prevState, currentState, action) => {
						const currentRouteName = getActiveRouteName(currentState);
						const previousRouteName = getActiveRouteName(prevState);
						if (previousRouteName !== currentRouteName) {
							// console.log('currentRouteName', currentRouteName)
							// the line below uses the @react-native-firebase/analytics tracker
							// change the tracker here to use other Mobile analytics SDK.
							const dataSend = mapScreenName[currentRouteName] ? mapScreenName[currentRouteName] : currentRouteName
							firebase.analytics().setCurrentScreen(dataSend, dataSend);
							console.log({dataSend})
							AppEventsLogger.logEvent('ViewContent', {
								page: dataSend
							});
						}
					}}
				/>
			</PaperProvider>
		</Provider>
	)
}
export default App;
// 
const handleError = throttle((error = null, isFatal) => {
	// fetch
	if (isFatal && error) {
		firebase.analytics().logEvent('js_error_event', { error });
		console.log('__js_error__:', error);
		Alert.alert(
			"Xin lỗi vì sự cố",
			`VietJack team sẽ khắc phục sự cố sớm nhất có thể`,
			[
				{
					text: "Thử lại sau", onPress: () => {
						RNExitApp.exitApp()
					}
				}
			],
			{ cancelable: false }
		);
	}
}, 5000);
const previousErrorHandler = getJSExceptionHandler();

setJSExceptionHandler((error, isFatal) => {
	// console.log('caught global error', error);
	handleError(error, isFatal);
	// previousErrorHandler(error, isFatal);
}, true);

setNativeExceptionHandler(errorString => {
	firebase.analytics().logEvent('native_error_event', { data: errorString });
	// console.log('__native_error__:', error);
	// do the things
});

// const AppContainer = createRootNavigator();

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
	if (!navigationState) {
		return null;
	}
	const route = navigationState.routes[navigationState.index];
	// dive into nested navigators
	if (route.routes) {
		return getActiveRouteName(route);
	}
	return route.routeName;
}


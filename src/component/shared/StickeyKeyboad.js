
import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  NativeModules
} from 'react-native';

const { StatusBarManager } = NativeModules;

let statusBarHeight = 0;
if (Platform.OS === 'ios') {
  StatusBarManager.getHeight((statusBarFrameData) => {
    statusBarHeight = statusBarFrameData.height;
  });
}

// Could be nav bar height?
// Magic number but is necessary to work properly
const IOS_OFFSET = 0 // 44;

const getVerticalOffset = () => Platform.select({
  ios: 10,//10, //statusBarHeight + IOS_OFFSET,
  android: 0
});

const KeyboardStickyView = ({offset, style, children, ...other }) => (
  <KeyboardAvoidingView
    style={[styles.container, style]}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={offset || getVerticalOffset()}
    {...other} // can receive other view props
  >
    {children}
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center'
  }
});

export default KeyboardStickyView;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, StatusBar,
  TouchableWithoutFeedback, Keyboard,
  SafeAreaView, TextInput, TouchableOpacity
} from "react-native";
import S2 from './componentS2/dashboard';
import S1 from './s1';

const App = (props) => {
  const [screen, setScreen] = useState(true)
  if (screen) return <S1 setScreen={setScreen} {...props} />
  else return <S2 setScreen={setScreen} {...props}/>
}

export default App;

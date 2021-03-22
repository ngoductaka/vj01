import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, StatusBar,
  TouchableWithoutFeedback, Keyboard,
  SafeAreaView, TextInput, TouchableOpacity
} from "react-native";
import { Icon } from 'native-base';
import {
  atan2, chain, derivative, e, evaluate, log, pi, pow, round, sqrt
} from 'mathjs'

import Row from "./components/Row";
import Button, { BtnOption, OPT } from "./components/Button";
import calculator, { initialState } from "./util/calculator";


const regexEnd = /\|/ig;

const App = (props) => {
  const [stringCal, setString] = useState('');
  const [result, setResult] = useState('');
  const [historyCal, setHistoryCal] = useState('');
  const [history, setHistory] = useState([]);

  const [pointIndex, setPointIndex] = useState(0);
  const [run, setRun] = useState(false);
  const [mold, setMold] = useState(true);// true is rad false is deg
  // 
  const [opt, setOpt] = useState(true);

  useEffect(() => {
    if (result) {
      const newHis = [result, history[0]];
      setHistory(newHis)
    }
  }, [result])

  // handle poiter
  useInterval(() => {
    if (stringCal.includes("|") || run) {
      let strConvert = stringCal.replace(regexEnd, '');
      setString(strConvert)
    } else {
      let strArr = stringCal.split('');
      strArr.splice(pointIndex, 0, "|");

      setString(strArr.join(''))
    }
  }, run ? 499 : 500);
  // input string
  const handleConcatStringCal = useCallback((value, n = 0) => {
    // console.log(pointIndex || 0, String(value).length, (pointIndex || 0) + String(value).length)
    setPointIndex((pointIndex || 0) + String(value).length + n);

    let strArr = stringCal.split('');
    strArr.splice(pointIndex, 0, value);

    setString(strArr.join(''))

    setRun(true);
    setTimeout(() => {
      setRun(false);
    }, 510);
  }, [pointIndex, stringCal]);

  const handleCalculate = async () => {
    try {
      // normal
      const res = _handleCalString(stringCal);
      if (res) {
        setResult(String(res));
        setHistoryCal(stringCal)
        handleClean(true, false);
      } else {
        setResult("Phép tính lỗi")
      }

    } catch (err) {
      try {
        // try add ')'
        const stringConvert = stringCal + ")";
        setString(stringConvert);
        setPointIndex(pointIndex + 1);

        console.log('=try1')
        const res = _handleCalString(stringConvert);
        // set result and history
        setResult(String(res));
        setHistoryCal(stringCal);
      } catch (errors) {
        console.log('=er1')
        // reset try add ')'
        setString(stringCal.slice(0, stringCal.length - 1));
        setPointIndex(pointIndex - 1);

        setResult("Phép tính lỗi")
        console.log('errors', errors)
      }
    }
  }
  const handleClean = useCallback((isAll, isResetResult = false) => {
    if (isAll) {
      setString('');
      if (isResetResult) {
        setResult('');
        setHistoryCal('')
      }
      setPointIndex(0);
    } else {
      const removeEnd = stringCal.replace(regexEnd, '');
      const newString = removeEnd.slice(0, pointIndex - 1) + removeEnd.slice(pointIndex);

      setString(newString);
      setPointIndex(pointIndex - 1);
    }
  }, [stringCal, pointIndex])

  const handleANS = useCallback(() => {
    handleConcatStringCal(history[0] || '')
  }, [history, pointIndex, stringCal]);

  const _hanldeChangeMold = useCallback(() => {
    setMold(!mold);
    handleClean(true, true)
  }, [mold])

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <Icon /> */}
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={{
          // position: 'absolute',
          // left: width / 2 - 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row'
        }}>
          <View style={{ width: 50 }}></View>
          <Icon type="AntDesign" name='down' style={{ fontSize: 25, color: 'white' }} />
          <View style={{ width: 50 }}>

            <Text style={{ color: '#fff' }}>[{mold ? 'rad' : 'deg'}]</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, backgroundColor: '#A6BCA1', paddingTop: 10, borderRadius: 10 }}>

          <TextInput
            // showSoftInputOnFocus={false}
            // autoFocus={true}
            // blurOnSubmit={false}
            style={{
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 20,
              backgroundColor: '#A6BCA1',
              fontSize: 30,
              color: "#000",
              textAlignVertical: 'top'
              // minHeight:200,
              // width: 300,
            }}
            multiline={true}
            numberOfLines={1}
            value={run ? stringCal.replace(regexEnd, '') : stringCal}
            // onChangeText={() => { }}
            // keyboardType={'numeric'}
            // onFocus={() => {
            //   Keyboard.dismiss();
            // }}
            editable={false}
            // focusable={false}
            selection={{ start: 0, end: 0 }}
          // onFocus={() => Keyboard.dismiss()}

          />
          <Text style={{ fontSize: 30, }}>{historyCal ? historyCal.replace(regexEnd, '') + '=' : ''}</Text>
        </View>
        <Text style={styles.value}> {isNaN(result) ? result : (+result).toFixed(3)} </Text>
        <Text style={[styles.value, { fontSize: 16 }]}> {result} </Text>
        <Row>
          <Button theme="secondary" size="mini" text="ln" onPress={() => handleConcatStringCal("ln(")} />
          <Button theme={!opt ? "accent" : "secondary"} size="mini" text="ALT" onPress={() => setOpt(!opt)} />
          <Button theme="secondary" size="mini" text="MOLD" onPress={_hanldeChangeMold} />
          <Button theme="secondary" size="mini" text="MENU" onPress={() => handleConcatStringCal("*")} />
        </Row>
        <Row>
          <Button theme="secondary" size="mini" text={<Icon style={{fontSize: 18}} type="AntDesign" name="caretleft" />}onPress={() => { setPointIndex(pointIndex > 0 ? pointIndex - 1 : 0) }} />
          <Button theme="secondary" size="mini" text={<Icon style={{fontSize: 18}} type="AntDesign" name="caretright" />} onPress={() => {
            console.log(stringCal.length, pointIndex)
            setPointIndex(pointIndex + 1 <= stringCal.length ? pointIndex + 1 : stringCal.length)
          }} />
          <Button theme="secondary" size="mini" text="(" onPress={() => handleConcatStringCal("(")} />
          <Button theme="secondary" size="mini" text=")" onPress={() => handleConcatStringCal(")")} />
        </Row>
        <Row>
          <BtnOption text={opt ? "sin" : "asin"} opt={opt ? "asin" : "sin"} theme="secondary" size="mini" onPress={() => handleConcatStringCal(!opt ? "asin(" : "sin(")} />
          <BtnOption text={opt ? "cos" : "acos"} opt={opt ? "acos" : "cos"} theme="secondary" size="mini" onPress={() => handleConcatStringCal(!opt ? "acos(" : "cos(")} />
          <BtnOption text={opt ? "tan" : "atan"} opt={opt ? "atan" : "tan"} theme="secondary" size="mini" onPress={() => handleConcatStringCal(!opt ? "atan(" : "tan(")} />
          <BtnOption text={opt ? "log" : "10^"} opt={opt ? "10^" : "log"} theme="secondary" size="mini" onPress={() => handleConcatStringCal(!opt ? "10^" : "log(,10)", !opt ? 0 : -4)} />
          {/* <Button theme="secondary" size="mini" text="ln"  onPress={() => handleConcatStringCal("operator", "*")} /> */}
        </Row>
        <Row>
          <BtnOption
            text={OPT.pow[opt ? 'opt1' : 'opt2'](opt)}
            opt={OPT.pow[opt ? 'opt2' : 'opt1'](opt)}
            theme="secondary"
            size="mini"
            onPress={() => handleConcatStringCal(opt ? "^2" : "^(-1)")}
          />

          <BtnOption
            text={OPT.powx[opt ? 'opt1' : 'opt2'](opt)}
            opt={OPT.powx[opt ? 'opt2' : 'opt1'](opt)}
            theme="secondary"
            size="mini"
            onPress={() => handleConcatStringCal(opt ? "^" : "nthRoot(,x)", opt ? 0 : -3)}
          />

          <BtnOption
            opt={OPT.can[opt ? 'opt1' : 'opt2'](!opt)}
            text={OPT.can[opt ? 'opt2' : 'opt1'](!opt)}
            theme="secondary"
            size="mini"
            onPress={() => handleConcatStringCal(opt ? "sqrt(" : "nthRoot(,3)", opt ? 0 : -3)}
          />
          <BtnOption
            opt={opt ? "n!" : <Text style={{ textAlign: 'center', fontWeight: 'bold', color: !opt ? "#E6B658" : "#000" }}>&#960;</Text>}
            text={!opt ? "n!" : <Text style={{ textAlign: 'center', fontWeight: 'bold', color: !opt ? "#E6B658" : "#000" }}>&#960;</Text>}
            theme="secondary"
            size="mini"
            onPress={() => handleConcatStringCal(opt ? "PI" : "factorial(")}
          />
        </Row>

        <Row>
          <Button text="7" onPress={() => handleConcatStringCal(7)} />
          <Button text="8" onPress={() => handleConcatStringCal(8)} />
          <Button text="9" onPress={() => handleConcatStringCal(9)} />
          <Button text="DEL" theme="accent" onPress={() => handleClean()} />
          <Button text="AC" theme="accent" onPress={() => handleClean('all', true)} />
        </Row>
        <Row>
          <Button text="4" onPress={() => handleConcatStringCal(4)} />
          <Button text="5" onPress={() => handleConcatStringCal(5)} />
          <Button text="6" onPress={() => handleConcatStringCal(6)} />
          <Button text="X" onPress={() => handleConcatStringCal("*")} />
          <Button text="/" onPress={() => handleConcatStringCal("/")} />
        </Row>

        <Row>
          <Button text="1" onPress={() => handleConcatStringCal(1)} />
          <Button text="2" onPress={() => handleConcatStringCal(2)} />
          <Button text="3" onPress={() => handleConcatStringCal(3)} />
          <Button text="+" onPress={() => handleConcatStringCal("+")} />
          <Button text="-" onPress={() => handleConcatStringCal("-")} />

        </Row>

        <Row>
          <Button
            text="0"
            onPress={() => handleConcatStringCal(0)}
          />
          <Button text="." onPress={() => handleConcatStringCal(".")} />
          {/* <Button text="EXP" onPress={() => handleConcatStringCal(".")} /> */}
          <Button text="ANS" onPress={() => handleANS()} />
          <Button
            text="="
            onPress={() => handleCalculate()}
          />
        </Row>
      </SafeAreaView>
    </View>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    justifyContent: "flex-end"
  },
  value: {
    color: "#fff",
    fontSize: 34,
    textAlign: "right",
    marginRight: 20,
    // marginBottom: 0
  }
});

export default App;


function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}


const _handleCalString = (str) => {
  try {
    const regexLn = /ln/ig;
    let strConvert = str.replace(regexLn, 'log').replace(regexEnd, '');
    return evaluate(strConvert);
  } catch (err) {
    console.log(err, '-----')
    throw err
  }
}

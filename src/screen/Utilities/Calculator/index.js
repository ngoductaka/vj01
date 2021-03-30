import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, StatusBar,
  TouchableWithoutFeedback, Keyboard,
  SafeAreaView, TextInput, TouchableOpacity
} from "react-native";
import { Icon } from 'native-base';
import { evaluate } from 'mathjs';
import Toast from 'react-native-simple-toast';

import Row from "./components/Row";
import Button, { BtnOption, OPT } from "./components/Button";

const regexEnd = /\|/ig;

const App = (props) => {
  const [stringCal, setString] = useState('');
  const [result, setResult] = useState('');
  const [historyCal, setHistoryCal] = useState('');
  const [history, setHistory] = useState([]);

  const [pointIndex, setPointIndex] = useState(0);
  const [run, setRun] = useState(false);
  const [mold, setMold] = useState(true);// true is rad false is deg

  const [opt, setOpt] = useState(true);

  useEffect(() => {
    if (result) {
      const newHis = [result, history[0]];
      setHistory(newHis)
    }
  }, [result]);

  useEffect(() => {
    Toast.showWithGravity("Máy tính mặc định ở chế độ radian. ấn R->D để chuyển đổi", 2, Toast.CENTER)
  }, [])

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
      // if (res) {
      setResult(String(res));
      setHistoryCal(stringCal)
      handleClean(true, false);
      // } else {
      //   setResult("Phép tính lỗi")
      // }

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
        // setPointIndex(pointIndex - 1);

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
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.headClose}>
          <View style={styles.sideHead}></View>
          <Icon type="AntDesign" name='down' style={styles.closeBtn} />
          <View style={styles.sideHead}>
            <Text style={styles.whileColor}>[{mold ? 'rad' : 'deg'}]</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.inputWap}>
          <TextInput
            style={styles.inputStyle}
            multiline={true}
            scrollEnabled
            // numberOfLines={1}
            value={run ? stringCal.replace(regexEnd, '') : stringCal}
            editable={false}
            selection={{ start: 0, end: 0 }}
          />
          <Text style={styles.historyString}>{historyCal ? historyCal.replace(regexEnd, '') + '=' : ''}</Text>
        </View>
        <Text style={styles.value}> {result} </Text>
        <Text style={[styles.value, styles.fontH2]}> {isNaN(result) ? result : (+result).toFixed(3)} </Text>
        <Row>
          <Button theme="secondary" size="mini" text="ln" onPress={useCallback(() => handleConcatStringCal("ln("), [pointIndex, stringCal])} />
          <Button theme={!opt ? "accent" : "secondary"} size="mini" text="SHIFT" onPress={() => setOpt(!opt)} />
          <Button theme="secondary" size="mini" text={mold ? "R->D" : "D->R"} onPress={_hanldeChangeMold} />
          <Button theme="secondary" size="mini" text="MENU" onPress={useCallback(() => {Toast.show("Tính năng mới sẽ được cập nhật sớm nhất", 1)}, [])} />
        </Row>
        <Row>
          <Button theme="secondary" size="mini" text={<Icon style={{ fontSize: 18 }} type="AntDesign" name="caretleft" />} onPress={() => { setPointIndex(pointIndex > 0 ? pointIndex - 1 : 0) }} />
          <Button theme="secondary" size="mini" text={<Icon style={{ fontSize: 18 }} type="AntDesign" name="caretright" />} onPress={() => {
            console.log(stringCal.length, pointIndex)
            setPointIndex(pointIndex + 1 <= stringCal.length ? pointIndex + 1 : stringCal.length)
          }} />
          <Button theme="secondary" size="mini" text="(" onPress={useCallback(() => handleConcatStringCal("("), [pointIndex, stringCal])} />
          <Button theme="secondary" size="mini" text=")" onPress={useCallback(() => handleConcatStringCal(")"), [pointIndex, stringCal])} />
        </Row>
        <Row>
          <BtnOption text={opt ? "sin" : "arcsin"} opt={opt ? "arcsin" : "sin"}
            theme="secondary" size="mini" onPress={() => handleConcatStringCal(
              !opt ? "asin(" : (mold ? "sin(" : "sin(deg)"),
              !opt ? 0 : (mold ? 0 : -4)
            )} />
          <BtnOption text={opt ? "cos" : "arccos"} opt={opt ? "arccos" : "cos"}
            theme="secondary" size="mini" onPress={() => handleConcatStringCal(
              !opt ? "acos(" : (mold ? "cos(" : "cos(deg)"),
              !opt ? 0 : (mold ? 0 : -4)
            )} />
          <BtnOption text={opt ? "tan" : "arctan"} opt={opt ? "arctan" : "tan"}
            theme="secondary" size="mini" onPress={() => handleConcatStringCal(
              !opt ? "atan(" : (mold ? "tan(" : "tan(deg)"),
              !opt ? 0 : (mold ? 0 : -4)
            )} />
          <BtnOption text={opt ? "log" : "10^"} opt={opt ? "10^" : "log"}
            theme="secondary" size="mini" onPress={() => handleConcatStringCal(!opt ? "10^" : "log(,10)", !opt ? 0 : -4)} />
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
          <Button text="7" onPress={useCallback(() => handleConcatStringCal(7), [pointIndex, stringCal])} />
          <Button text="8" onPress={useCallback(() => handleConcatStringCal(8), [pointIndex, stringCal])} />
          <Button text="9" onPress={useCallback(() => handleConcatStringCal(9), [pointIndex, stringCal])} />
          <Button text="DEL" theme="accent" onPress={() => handleClean()} />
          <Button text="AC" theme="accent" onPress={() => handleClean('all', true)} />
        </Row>
        <Row>
          <Button text="4" onPress={useCallback(() => handleConcatStringCal(4), [pointIndex, stringCal])} />
          <Button text="5" onPress={useCallback(() => handleConcatStringCal(5), [pointIndex, stringCal])} />
          <Button text="6" onPress={useCallback(() => handleConcatStringCal(6), [pointIndex, stringCal])} />
          <Button text="X" onPress={useCallback(() => handleConcatStringCal("*"), [pointIndex, stringCal])} />
          <Button text="/" onPress={useCallback(() => handleConcatStringCal("/"), [pointIndex, stringCal])} />
        </Row>

        <Row>
          <Button text="1" onPress={useCallback(() => handleConcatStringCal(1), [pointIndex, stringCal])} />
          <Button text="2" onPress={useCallback(() => handleConcatStringCal(2), [pointIndex, stringCal])} />
          <Button text="3" onPress={useCallback(() => handleConcatStringCal(3), [pointIndex, stringCal])} />
          <Button text="+" onPress={useCallback(() => handleConcatStringCal("+"), [pointIndex, stringCal])} />
          <Button text="-" onPress={useCallback(() => handleConcatStringCal("-"), [pointIndex, stringCal])} />

        </Row>

        <Row>
          <Button text="0" onPress={useCallback(() => handleConcatStringCal(0), [pointIndex, stringCal])} />
          <Button text="." onPress={useCallback(() => handleConcatStringCal("."), [pointIndex, stringCal])} />
          <Button text="e" onPress={useCallback(() => handleConcatStringCal("e"), [pointIndex, stringCal])} />
          <Button text="ANS" onPress={() => handleANS()} />
          <Button text="=" onPress={() => handleCalculate()} />
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
  },
  headClose: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  sideHead: { width: 50 },
  closeBtn: { fontSize: 25, color: 'white' },
  whileColor: { color: '#fff' },
  inputWap: { flex: 1, backgroundColor: '#A6BCA1', paddingTop: 10, borderRadius: 10 },
  inputStyle: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#A6BCA1',
    fontSize: 30,
    color: "#000",
    textAlignVertical: 'top'
  },
  historyString: { fontSize: 30 },
  fontH2: { fontSize: 16 }
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

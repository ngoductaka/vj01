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
  const [showConvertDeg, setShowConvertDeg] = useState(false);

  useEffect(() => {
    if (result) {
      const newHis = [result, history[0]];
      setHistory(newHis)
    }
  }, [result]);

  useEffect(() => {
    if (historyCal && (historyCal + '').includes('a')) {
      setShowConvertDeg(true)
    } else {
      setShowConvertDeg(false)
    }
  }, [historyCal])

  useEffect(() => {
    Toast.showWithGravity("Máy tính mặc định ở chế độ radian. ấn R->D để chuyển đổi", 3.4, Toast.TOP)
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

  const handleCalculate = () => {
    try {
      if (!stringCal.replace(regexEnd, '')) return 1;
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
  const handleClean = useCallback(async (isAll, isResetResult = false) => {
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

      await setString(newString);
      await setPointIndex(pointIndex - 1);
    }
  }, [stringCal, pointIndex])

  const handleANS = useCallback(() => {
    handleConcatStringCal(history[0] || '')
  }, [history, pointIndex, stringCal]);

  const _hanldeChangeMold = useCallback(() => {
    setMold(!mold);
    handleClean(true, true)
  }, [mold])

  const _handlePressConvertDeg = useCallback(() => {
    setShowConvertDeg(false);
    setResult(convertToDeg(result))
  }, [result]);

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
        <View style={styles.resultView}>
          {showConvertDeg ? <TouchableOpacity
            onPress={_handlePressConvertDeg}
            style={styles.btnConvert}>
            <Text>Rad=>Deg</Text>
          </TouchableOpacity> : <View />}
          <Text style={styles.value}> {isNaN(result) ? result : +(+result).toFixed(10)} </Text>
        </View>
        {/* <Text numberOfLines={1} style={[styles.value, styles.fontH2]}> {isNaN(result) ? result : +(+result).toFixed(3)} </Text> */}
        <Row>
          <Button theme="secondary" size="mini" text="ln" onPress={useCallback(() => handleConcatStringCal("ln("), [pointIndex, stringCal])} />
          <Button theme={!opt ? "accent" : "secondary2"} size="mini" text="SHIFT" onPress={() => setOpt(!opt)} />
          <Button theme="secondary" size="mini" text={mold ? "R->D" : "D->R"} onPress={_hanldeChangeMold} />
          <Button theme="secondary" size="mini" text="MENU" onPress={useCallback(() => { Toast.show("Tính năng mới sẽ được cập nhật sớm nhất", 1) }, [])} />
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
              !opt ? "asin(" : (mold ? "sin(" : "sin(°)"),
              !opt ? 0 : (mold ? 0 : -2)
            )} />
          <BtnOption text={opt ? "cos" : "arccos"} opt={opt ? "arccos" : "cos"}
            theme="secondary" size="mini" onPress={() => handleConcatStringCal(
              !opt ? "acos(" : (mold ? "cos(" : "cos(°)"),
              !opt ? 0 : (mold ? 0 : -2)
            )} />
          <BtnOption text={opt ? "tan" : "arctan"} opt={opt ? "arctan" : "tan"}
            theme="secondary" size="mini" onPress={() => handleConcatStringCal(
              !opt ? "atan(" : (mold ? "tan(" : "tan(°)"),
              !opt ? 0 : (mold ? 0 : -2)
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
            onPress={() => handleConcatStringCal(opt ? "^" : "ª√(,a)", opt ? 0 : -3)}
          />

          <BtnOption
            opt={OPT.can[opt ? 'opt1' : 'opt2'](!opt)}
            text={OPT.can[opt ? 'opt2' : 'opt1'](!opt)}
            theme="secondary"
            size="mini"
            onPress={() => handleConcatStringCal(opt ? "√(" : "ª√(,3)", opt ? 0 : -3)}
          />
          <BtnOption
            opt={opt ? "n!" : <Text style={{ textAlign: 'center', fontWeight: 'bold', color: !opt ? "#E6B658" : "#000" }}>π</Text>}
            text={!opt ? "n!" : <Text style={{ textAlign: 'center', fontWeight: 'bold', color: !opt ? "#E6B658" : "#000" }}>π</Text>}
            theme="secondary"
            size="mini"
            onPress={() => handleConcatStringCal(opt ? "π" : "factorial(")}
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
    fontSize: 30,
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
  fontH2: { fontSize: 16 },
  btnConvert: { paddingHorizontal: 6, paddingVertical: 3, backgroundColor: '#ddd', borderRadius: 6 },
  resultView: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 2 },
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
    const regexNthRoot = /ª√/ig;
    const regexSqrt = /√/ig;
    const regexC = /°/ig;
    const regexPI = /π/ig;

    let strConvert = str
      .replace(regexLn, 'log')
      .replace(regexPI, 'PI')
      .replace(regexEnd, '')
      .replace(regexNthRoot, 'nthRoot')
      .replace(regexSqrt, 'sqrt')
      .replace(regexC, 'deg');

    const result = evaluate(strConvert);
    if (('' + result).includes('i') || result == Math.tan(Math.PI / 2)) {
      return 'Phép tính lỗi'
    }
    return result;
  } catch (err) {
    console.log(err, '-----')
    throw err
  }
}


const convertToDeg = num => {
  try {
    return +num / 2 / Math.PI * 360
  } catch (err) {
    return num
  }
}
import React, { useState, useEffect, useRef } from 'react';
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
import Button from "./components/Button";
import calculator, { initialState } from "./util/calculator";


const regexEnd = /\|/ig;

const App = (props) => {
  const [stringCal, setString] = useState('');
  const [result, setResult] = useState('');
  const [pointIndex, setPointIndex] = useState(0);
  const [run, setRun] = useState(false);

  useInterval(() => {
    // ========
    // console.log(stringCal, 'strConvert', pointIndex)
 
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
  const handleTap = (value) => {
    console.log( pointIndex||0, String(value).length, (pointIndex||0) + String(value).length)
    setPointIndex((pointIndex||0) + String(value).length);

    let strArr = stringCal.split('');
    strArr.splice(pointIndex, 0, value);
    
    setString(strArr.join(''))
    // setString(stringCal + value);

    setRun(true);
    setTimeout(() => {
      setRun(false);
    }, 510);
  };



  const _hanldeCalString = (str) => {
    try {
      const regexLn = /ln/ig;
      let strConvert = str.replace(regexLn, 'log').replace(regexEnd, '');
      // console.log(str, 'strConvert', strConvert);

      return evaluate(strConvert);
    } catch (err) {

    }
  }
  const handleCalculate = async () => {
    try {
      // console.log('stringCal', stringCal.replace('ln', 'log'))
      const res = _hanldeCalString(stringCal);
      // console.log('resresresres', res)
      if (res) {
        setResult(res)
      } else {
        setResult("Phép tính lỗi")
      }

    } catch (err) {
      try {
        console.log('err', err)
        if (err.message.includes('Parenthesis ) expected')) {
          const stringConvert = stringCal + ")";
          setString(stringConvert);
          const res = _hanldeCalString(stringConvert);
          setResult(res)
        }
      } catch (errors) {
        console.log('errors', errors)
      }
    }
  }
  const handleClean = (isAll) => {
    if (isAll) {
      setString('');
      setResult('');
      setPointIndex(0);
    } else {
      setString(stringCal.substring(0, stringCal.length - 1));
      setPointIndex(pointIndex-1);
    }
  }


  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <Icon /> */}
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={{
          // position: 'absolute',
          // left: width / 2 - 10,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Icon type="AntDesign" name='down' style={{ fontSize: 25, color: 'white' }} />
        </TouchableOpacity>
        <View style={{ flex: 1, backgroundColor: '#A6BCA1', paddingVertical: 20, borderRadius: 10 }}>
          <TextInput
            // showSoftInputOnFocus={false}
            // autoFocus={true}
            // blurOnSubmit={false}
            style={{
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 40,
              backgroundColor: '#A6BCA1',
              fontSize: 30,
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
        </View>
        <Text style={styles.value}>
          {result}
        </Text>
        <Row>
          <Button theme="secondary" size="mini" text="<-" onPress={() => {setPointIndex(pointIndex-1)}} />
          <Button theme="secondary" size="mini" text="->" onPress={() => {setPointIndex(pointIndex+1)}} />
          <Button theme="secondary" size="mini" text="" onPress={() => handleTap(")")} />
          <Button theme="secondary" size="mini" text="" onPress={() => handleTap("operator", "*")} />
        </Row>
        <Row>
          <Button theme="secondary" size="mini" text="ln" onPress={() => handleTap("ln(3")} />
          <Button theme="secondary" size="mini" text="(" onPress={() => handleTap("(")} />
          <Button theme="secondary" size="mini" text=")" onPress={() => handleTap(")")} />
          <Button theme="secondary" size="mini" text="ln" onPress={() => handleTap("operator", "*")} />
        </Row>
        <Row>
          <Button theme="secondary" size="mini" text="sin" onPress={() => handleTap("sin(")} />
          <Button theme="secondary" size="mini" text="cos" onPress={() => handleTap("cos(")} />
          <Button theme="secondary" size="mini" text="tan" onPress={() => handleTap("tan(")} />
          <Button theme="secondary" size="mini" text="log" onPress={() => handleTap("log(, 10)")} />
          {/* <Button theme="secondary" size="mini" text="ln"  onPress={() => handleTap("operator", "*")} /> */}
        </Row>
        <Row>
          <Button
            text={
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text>X</Text>
                <Text style={{ fontSize: 12, alignSelf: 'flex-start', marginTop: -3 }}>2</Text>
              </View>
            }
            theme="secondary"
            size="mini"
            onPress={() => handleTap("clear")}
          />

          <Button
            text={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>X</Text>
                <Text style={{ fontSize: 12, alignSelf: 'flex-start', marginTop: -3 }}>y</Text>
              </View>
            }
            theme="secondary"
            size="mini"
            onPress={() => handleTap("clear")}
          />

          <Button
            text={
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text>2</Text>
                <Text>√</Text>
                <Text style={{ fontSize: 12, alignSelf: 'flex-start', marginTop: -6 }}>-</Text>
              </View>
            }
            theme="secondary"
            size="mini"
            onPress={() => handleTap("clear")}
          />
          <Button
            text={
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text>&#960;</Text>
              </View>
            }
            theme="secondary"
            size="mini"
            onPress={() => handleTap("clear")}
          />
        </Row>

        <Row>
          <Button text="7" onPress={() => handleTap(7)} />
          <Button text="8" onPress={() => handleTap(8)} />
          <Button text="9" onPress={() => handleTap(9)} />
          <Button text="DEL" theme="accent" onPress={() => handleClean()} />
          <Button text="AC" theme="accent" onPress={() => handleClean('all')} />
        </Row>
        <Row>
          <Button text="4" onPress={() => handleTap(4)} />
          <Button text="5" onPress={() => handleTap(5)} />
          <Button text="6" onPress={() => handleTap(6)} />
          <Button text="X" onPress={() => handleTap("*")} />
          <Button text="/" onPress={() => handleTap("/")} />
        </Row>

        <Row>
          <Button text="1" onPress={() => handleTap(1)} />
          <Button text="2" onPress={() => handleTap(2)} />
          <Button text="3" onPress={() => handleTap(3)} />
          <Button text="+" onPress={() => handleTap("+")} />
          <Button text="-" onPress={() => handleTap("-")} />

        </Row>

        <Row>
          <Button
            text="0"
            onPress={() => handleTap(0)}
          />
          <Button text="." onPress={() => handleTap(".")} />
          <Button text="EXP" onPress={() => handleTap(".")} />
          <Button text="ANS" onPress={() => handleTap(".")} />
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
    fontSize: 40,
    textAlign: "right",
    marginRight: 20,
    marginBottom: 10
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
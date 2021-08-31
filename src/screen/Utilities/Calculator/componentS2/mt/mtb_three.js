import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import {MathText} from 'react-native-math-view';
const asciimath2latex = require('asciimath-to-latex');
const MtbThree = props => {
  const [param_mt3_a_1, psetParamMt3_a_1] = useState({a: '', b: '',c:""});
  const [param_mt3_a_2, psetParamMt3_a_2] = useState({a: '', b: '',c:""});
  const [param_mt3_a_3, psetParamMt3_a_3] = useState({a: '', b: '',c:""});
  const [param_mt3_b_1, psetParamMt3_b_1] = useState({a: '', b: '',c:""});
  const [param_mt3_b_2, psetParamMt3_b_2] = useState({a: '', b: '',c:""});
  const [param_mt3_b_3, psetParamMt3_b_3] = useState({a: '', b: '',c:""});
  const [param_cal_vt,setParamCalVT] =useState("")

  const [showText, setShowText] = useState(true);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState('');

  useEffect(() => {
    psetParamMt3_a_1(props.param_mt3_a_1);
    psetParamMt3_a_2(props.param_mt3_a_2);
    psetParamMt3_a_3(props.param_mt3_a_3);
    psetParamMt3_b_1(props.param_mt3_b_1);
    psetParamMt3_b_2(props.param_mt3_b_2);
    psetParamMt3_b_3(props.param_mt3_b_3);
    setParamCalVT(props.param_cal_vt)

    setIndex(props.index_cursor);
    if (props.props_cursor) {
      setShowText(true);
    } else {
      const interval = setInterval(() => {
        setShowText(showText => !showText);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [props]);

  const callback = ({key, value}) => {
    setKey(key);
    setIndex(value.length);
    props.ParamCallback({key, value});
  };
  const addStr = (str, index, stringToAdd) => {
    
    
    value =
      str.substring(0, index) + stringToAdd + str.substring(index, str.length);
    
    return value;
  };
  return (
    <>
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      }}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 5}}>
        <View
          style={{
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
            }}>
            A=
          </Text>
        </View>

        <Image style={styles.stretch2} source={require('../image/right.png')} />
        <View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_A_1_1', value: param_mt3_a_1});
              }}>
              <View style={param_mt3_a_1.a == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_A_1_1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_a_1.a, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_a_1.a
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_A_1_2', value: param_mt3_a_1});
              }}>
              <View style={param_mt3_a_1.b == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_A_1_2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_a_1.b, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_a_1.b
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_A_1_3', value: param_mt3_a_1});
              }}>
              <View style={param_mt3_a_1.c == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_A_1_3'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_a_1.c, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_a_1.c
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_A_2_1', value: param_mt3_a_2});
              }}>
              <View style={param_mt3_a_2.a == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_A_2_1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_a_2.a, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_mt3_a_2.a
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_A_2_2', value: param_mt3_a_2});
              }}>
              <View style={param_mt3_a_2.b == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_A_2_2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_a_2.b, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_mt3_a_2.b
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_A_2_3', value: param_mt3_a_2});
              }}>
              <View style={param_mt3_a_2.c == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_A_2_3'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_a_2.c, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_a_2.c
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_A_3_1', value: param_mt3_a_3});
              }}>
              <View style={param_mt3_a_3.a == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_A_3_1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_a_3.a, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_a_3.a
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_A_3_2', value: param_mt3_a_3});
              }}>
              <View style={param_mt3_a_3.b == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_A_3_2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_a_3.b, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_a_3.b
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_A_3_3', value: param_mt3_a_3});
              }}>
              <View style={param_mt3_a_3.c == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_A_3_3'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_a_3.c, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_a_3.c
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Image style={styles.stretch2} source={require('../image/left.png')} />
      </View>

      <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 5}}>
        <View
          style={{
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
            }}>
            B=
          </Text>
        </View>
        <Image style={styles.stretch2} source={require('../image/right.png')} />
        <View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_B_1_1', value: param_mt3_b_1});
              }}>
              <View style={param_mt3_b_1.a == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_B_1_1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_b_1.a, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_mt3_b_1.a
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_B_1_2', value: param_mt3_b_1});
              }}>
              <View style={param_mt3_b_1.b == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_B_1_2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_b_1.b, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_b_1.b
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_B_1_3', value: param_mt3_b_1});
              }}>
              <View style={param_mt3_b_1.c == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_B_1_3'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_b_1.c, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_b_1.c
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_B_2_1', value: param_mt3_b_2});
              }}>
              <View style={param_mt3_b_2.a == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_B_2_1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_b_2.a, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_mt3_b_2.a
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_B_2_2', value: param_mt3_b_2});
              }}>
              <View style={param_mt3_b_2.b == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_B_2_2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_b_2.b, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_mt3_b_2.b
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_B_2_3', value: param_mt3_b_2});
              }}>
              <View style={param_mt3_b_2.c == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_B_2_3'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_b_2.c, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_mt3_b_2.c
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_B_3_1', value: param_mt3_b_3});
              }}>
              <View style={param_mt3_b_3.a == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_B_3_1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_b_3.a, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_b_3.a
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_B_3_2', value: param_mt3_b_3});
              }}>
              <View style={param_mt3_b_3.b == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_B_3_2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_b_3.b, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_mt3_b_3.b
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                callback({key: 'PARAM_MT3_B_3_3', value: param_mt3_b_3});
              }}>
              <View style={param_mt3_b_3.c == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'PARAM_MT3_B_3_3'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_mt3_b_3.c, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_mt3_b_3.c
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Image style={styles.stretch2} source={require('../image/left.png')} />
      </View>
    </View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
    <View style={{
      justifyContent: 'center'
    }}>
      <Text
        style={{
          fontSize: 20,
        }}>
        A
    </Text>
    </View>

    <TouchableOpacity   onPress={() => {
            callback({key: 'CAL_VT', value: param_cal_vt});
          }}>
      <View
        style={
            param_cal_vt == ''
            ? styles.in
            : styles.out_in
        }>
        <Text
          style={styles.text}>
          {(key === 'CAL_VT') ? addStr(param_cal_vt, index, showText ? '∣' : " ") : param_cal_vt}
        </Text>
      </View>
    </TouchableOpacity>

    <View style={{
      justifyContent: 'center'
    }}>
      <Text
        style={{
          fontSize: 20,
        }}>
        B
    </Text>
    </View>

  </View>
  </>
  );
};

export default MtbThree;
const styles = StyleSheet.create({
  stretch: {
    width: 10,
    height: 70,
    resizeMode: 'stretch',
  },
  stretch2: {
    width: 10,
    height: 100,
    resizeMode: 'stretch',
  },
  stretch3: {
    width: 10,
    height: 135,
    resizeMode: 'stretch',
  },
  text: {
    padding: 0,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  in: {
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'dashed',
    borderColor: 'black',
    minHeight: 30,
    minWidth: 30,
    maxHeight: 30,
    margin: 2,
  },
  out_in: {
    justifyContent: 'center',
    borderColor: '#b3ae7e',
    minHeight: 35,
    minWidth: 30,
    maxHeight: 35,
    margin: 2,
  },
});

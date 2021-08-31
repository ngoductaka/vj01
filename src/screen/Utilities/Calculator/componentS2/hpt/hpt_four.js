import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {MathText} from 'react-native-math-view';
const asciimath2latex = require('asciimath-to-latex');
const HptFour = props => {
  const [param_hpt4_1, setParamhpt4_1] = useState({x1: '', x2: '',x3: '',x4: '', end: ''});
  const [param_hpt4_2, setParamhpt4_2] = useState({x1: '', x2: '',x3: '',x4: '', end: ''});
  const [param_hpt4_3, setParamhpt4_3] = useState({x1: '', x2: '',x3: '',x4: '', end: ''});
  const [param_hpt4_4, setParamhpt4_4] = useState({x1: '', x2: '',x3: '',x4: '', end: ''});

  const [showText, setShowText] = useState(true);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState('');

  useEffect(() => {
    setParamhpt4_1(props.param_hpt4_1);
    setParamhpt4_2(props.param_hpt4_2);
    setParamhpt4_3(props.param_hpt4_3);
    setParamhpt4_4(props.param_hpt4_4);
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
    <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 5}}>
      <View style={{marginTop: 5}}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_1_X1', value: param_hpt4_1});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_1.x1 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_1_X1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_1.x1, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt4_1.x1
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{1}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_1_X2', value: param_hpt4_1});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_1.x2 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_1_X2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_1.x2, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt4_1.x2
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{2}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_1_X3', value: param_hpt4_1});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_1.x3 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_1_X3'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_1.x3, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt4_1.x3
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{3}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_1_X4', value: param_hpt4_1});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_1.x4 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_1_X4'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_1.x4, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt4_1.x4
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{4}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.out_add}>
            <MathText value="$$= $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_1_END', value: param_hpt4_1});
            }}>
            <View style={param_hpt4_1.end == '' ? styles.in : styles.out_in}>
              <MathText
                value={
                  key === 'HPT4_1_END'
                    ? '$$' +
                      asciimath2latex(
                        addStr(param_hpt4_1.end, index, showText ? '∣' : '')
                          .replace(/R/g, 'root')
                          .replace(/S/g, 'sqrt')
                          .replace(/π/g, 'pi'),
                      ) +
                      '$$'
                    : '$$' +
                      asciimath2latex(
                        param_hpt4_1.end
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

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_2_X1', value: param_hpt4_2});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_2.x1 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_2_X1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_2.x1, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt4_2.x1
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{1}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_2_X2', value: param_hpt4_2});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_2.x2 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_2_X2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_2.x2, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt4_2.x2
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{2}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_2_X3', value: param_hpt4_2});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_2.x3 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_2_X3'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_2.x3, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt4_2.x3
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{3}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_2_X4', value: param_hpt4_2});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_2.x4 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_2_X4'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_2.x4, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt4_2.x4
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{4}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.out_add}>
            <MathText value="$$= $$" direction="ltr" />
          </View>
          
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_2_END', value: param_hpt4_2});
            }}>
            <View style={param_hpt4_2.end == '' ? styles.in : styles.out_in}>
              <MathText
                value={
                  key === 'HPT4_2_END'
                    ? '$$' +
                      asciimath2latex(
                        addStr(param_hpt4_2.end, index, showText ? '∣' : '')
                          .replace(/R/g, 'root')
                          .replace(/S/g, 'sqrt')
                          .replace(/π/g, 'pi'),
                      ) +
                      '$$'
                    : '$$' +
                      asciimath2latex(
                        param_hpt4_2.end
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
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_3_X1', value: param_hpt4_3});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_3.x1 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_3_X1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_3.x1, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_hpt4_3.x1
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{1}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_3_X2', value: param_hpt4_3});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_3.x2 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_3_X2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_3.x2, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_hpt4_3.x2
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{2}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_3_X3', value: param_hpt4_3});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_3.x3 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_3_X3'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_3.x3, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_hpt4_3.x3
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{3}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_3_X4', value: param_hpt4_3});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_3.x4 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_3_X4'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_3.x4, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt4_3.x4
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{4}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.out_add}>
            <MathText value="$$= $$" direction="ltr" />
          </View>
          
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_3_END', value: param_hpt4_3});
            }}>
            <View style={param_hpt4_3.end == '' ? styles.in : styles.out_in}>
              <MathText
                value={
                  key === 'HPT4_3_END'
                    ? '$$' +
                      asciimath2latex(
                        addStr(param_hpt4_3.end, index, showText ? '∣' : '')
                          .replace(/R/g, 'root')
                          .replace(/S/g, 'sqrt')
                          .replace(/π/g, 'pi'),
                      ) +
                      '$$'
                    : '$$' +
                      asciimath2latex(
                        param_hpt4_3.end
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
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_4_X1', value: param_hpt4_4});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_4.x1 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_4_X1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_4.x1, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_hpt4_4.x1
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{1}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_4_X2', value: param_hpt4_4});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_4.x2 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_4_X2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_4.x2, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_hpt4_4.x2
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{2}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_4_X3', value: param_hpt4_4});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_4.x3 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_4_X3'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_4.x3, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_hpt4_4.x3
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{3}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.out_add}>
            <MathText value="$$ + $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_4_X4', value: param_hpt4_4});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt4_4.x4 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT4_4_X4'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt4_4.x4, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                            param_hpt4_4.x4
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <View style={styles.out_x}>
                <MathText value="$$X_{4}$$" direction="ltr" />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.out_add}>
            <MathText value="$$= $$" direction="ltr" />
          </View>
          
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT4_4_END', value: param_hpt4_4});
            }}>
            <View style={param_hpt4_4.end == '' ? styles.in : styles.out_in}>
              <MathText
                value={
                  key === 'HPT4_4_END'
                    ? '$$' +
                      asciimath2latex(
                        addStr(param_hpt4_4.end, index, showText ? '∣' : '')
                          .replace(/R/g, 'root')
                          .replace(/S/g, 'sqrt')
                          .replace(/π/g, 'pi'),
                      ) +
                      '$$'
                    : '$$' +
                      asciimath2latex(
                        param_hpt4_4.end
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
    </View>
  );
};

export default HptFour;
const styles = StyleSheet.create({
  text: {
    padding: 0,
    fontSize: 20,
    paddingTop: 4,
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
    marginTop: 5,
  },
  out_in: {
    marginTop: Platform.OS === 'ios' ? -1 : 8,
    justifyContent: 'center',
    borderColor: '#b3ae7e',
    minHeight: 35,
    maxHeight: 35
  }
});

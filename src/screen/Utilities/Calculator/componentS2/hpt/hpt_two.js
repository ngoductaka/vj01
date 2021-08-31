import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {MathText} from 'react-native-math-view';
const asciimath2latex = require('asciimath-to-latex');
const HptTwo = props => {
  const [param_hpt2_1, setParamhpt2_1] = useState({x1: '', x2: '', end: ''});
  const [param_hpt2_2, setParamhpt2_2] = useState({x1: '', x2: '', end: ''});

  const [showText, setShowText] = useState(true);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState('');

  useEffect(() => {
    setParamhpt2_1(props.param_hpt2_1);
    setParamhpt2_2(props.param_hpt2_2);
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
              callback({key: 'HPT2_1_X1', value: param_hpt2_1});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt2_1.x1 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT2_1_X1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt2_1.x1, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt2_1.x1
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
              callback({key: 'HPT2_1_X2', value: param_hpt2_1});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt2_1.x2 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT2_1_X2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt2_1.x2, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt2_1.x2
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
            <MathText value="$$= $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT2_1_END', value: param_hpt2_1});
            }}>
            <View style={param_hpt2_1.end == '' ? styles.in : styles.out_in}>
              <MathText
                value={
                  key === 'HPT2_1_END'
                    ? '$$' +
                      asciimath2latex(
                        addStr(param_hpt2_1.end, index, showText ? '∣' : '')
                          .replace(/R/g, 'root')
                          .replace(/S/g, 'sqrt')
                          .replace(/π/g, 'pi'),
                      ) +
                      '$$'
                    : '$$' +
                      asciimath2latex(
                        param_hpt2_1.end
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
              callback({key: 'HPT2_2_X1', value: param_hpt2_2});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt2_2.x1 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT2_2_X1'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt2_2.x1, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt2_2.x1
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
              callback({key: 'HPT2_2_X2', value: param_hpt2_2});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_hpt2_2.x2 == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'HPT2_2_X2'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_hpt2_2.x2, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_hpt2_2.x2
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
            <MathText value="$$= $$" direction="ltr" />
          </View>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'HPT2_2_END', value: param_hpt2_2});
            }}>
            <View style={param_hpt2_2.end == '' ? styles.in : styles.out_in}>
              <MathText
                value={
                  key === 'HPT2_2_END'
                    ? '$$' +
                      asciimath2latex(
                        addStr(param_hpt2_2.end, index, showText ? '∣' : '')
                          .replace(/R/g, 'root')
                          .replace(/S/g, 'sqrt')
                          .replace(/π/g, 'pi'),
                      ) +
                      '$$'
                    : '$$' +
                      asciimath2latex(
                        param_hpt2_2.end
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

export default HptTwo;
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
    marginTop: 1,
  },
  out_in: {
    marginTop: Platform.OS === 'ios' ? -1 : 8,
    justifyContent: 'center',
    borderColor: '#b3ae7e',
    minHeight: 35,
    maxHeight: 35
  }
});

import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet,Image} from 'react-native';
import {MathText} from 'react-native-math-view';
const asciimath2latex = require('asciimath-to-latex');
const Vector = props => {
  const [param_vector_1, setParamVector_1] = useState({a: '', b: '', c: ''});
  const [param_vector_2, setParamVector_2] = useState({a: '', b: '', c: ''});

  const [showText, setShowText] = useState(true);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState('');

  useEffect(() => {
    setParamVector_1(props.param_vector_1);
    setParamVector_2(props.param_vector_2);
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
              <View style={styles.button_a}>
          <Image style={styles.image_a} source={require('../image/a.png')} />
        </View>
        <Text style={styles.text}>{'( '}</Text>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'VECTOR_1_A', value: param_vector_1});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_vector_1.a == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'VECTOR_1_A'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_vector_1.a, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_vector_1.a
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <Text style={styles.text}>{' ; '}</Text>

            </View>
          </TouchableOpacity>

         
          <TouchableOpacity
            onPress={() => {
              callback({key: 'VECTOR_1_B', value: param_vector_1});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_vector_1.b == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'VECTOR_1_B'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_vector_1.b, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_vector_1.b
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <Text style={styles.text}>{' ; '}</Text>

            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              callback({key: 'VECTOR_1_C', value: param_vector_1});
            }}>
            <View style={param_vector_1.c == '' ? styles.in : styles.out_in}>
              <MathText
                value={
                  key === 'VECTOR_1_C'
                    ? '$$' +
                      asciimath2latex(
                        addStr(param_vector_1.c, index, showText ? '∣' : '')
                          .replace(/R/g, 'root')
                          .replace(/S/g, 'sqrt')
                          .replace(/π/g, 'pi'),
                      ) +
                      '$$'
                    : '$$' +
                      asciimath2latex(
                        param_vector_1.c
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
          <Text style={styles.text}>{')'}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 5,
          }}>
               <View style={styles.button_b}>
          <Image style={styles.image_b} source={require('../image/b.png')} />
        </View>
        <Text style={styles.text}>{'( '}</Text>
          <TouchableOpacity
            onPress={() => {
              callback({key: 'VECTOR_2_A', value: param_vector_2});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
              <View style={param_vector_2.a == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'VECTOR_2_A'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_vector_2.a, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_vector_2.a
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <Text style={styles.text}>{' ; '}</Text>

            </View>
          </TouchableOpacity>

          
          <TouchableOpacity
            onPress={() => {
              callback({key: 'VECTOR_2_B', value: param_vector_2});
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}>
                  
              <View style={param_vector_2.b == '' ? styles.in : styles.out_in}>
                <MathText
                  value={
                    key === 'VECTOR_2_B'
                      ? '$$' +
                        asciimath2latex(
                          addStr(param_vector_2.b, index, showText ? '∣' : '')
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                      : '$$' +
                        asciimath2latex(
                          param_vector_2.b
                            .replace(/R/g, 'root')
                            .replace(/S/g, 'sqrt')
                            .replace(/π/g, 'pi'),
                        ) +
                        '$$'
                  }
                  direction="ltr"
                />
              </View>

              <Text style={styles.text}>{' ; '}</Text>

            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              callback({key: 'VECTOR_2_C', value: param_vector_2});
            }}>
            <View style={param_vector_2.c == '' ? styles.in : styles.out_in}>
              <MathText
                value={
                  key === 'VECTOR_2_C'
                    ? '$$' +
                      asciimath2latex(
                        addStr(param_vector_2.c, index, showText ? '∣' : '')
                          .replace(/R/g, 'root')
                          .replace(/S/g, 'sqrt')
                          .replace(/π/g, 'pi'),
                      ) +
                      '$$'
                    : '$$' +
                      asciimath2latex(
                        param_vector_2.c
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
          <Text style={styles.text}>{')'}</Text>

        </View>
      </View>
    </View>
  );
};

export default Vector;
const styles = StyleSheet.create({
    text: {
      paddingTop: 5,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    image_b: {
      width: 30,
      height: 30,
      // flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    button_b: {
      marginTop:-5,
      height: 40,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image_a: {
      marginTop:-5,
      width: 25,
      height: 20,
      // flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    button_a: {
      marginTop:5,
      height: 30,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    in:{
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius : 5,
      borderStyle: 'dashed',
      borderColor: 'black',
      minHeight:30,minWidth: 30,maxHeight:30,
       marginTop: 1,
   },
   out_in:{
    marginTop: 2,
    justifyContent: 'center',
    alignItems:"center",
    borderColor: '#b3ae7e',
    minHeight: 35,
    minWidth: 30,
    maxHeight: 35,
    }
  });
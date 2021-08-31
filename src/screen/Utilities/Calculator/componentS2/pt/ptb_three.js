import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {MathText} from 'react-native-math-view';
const asciimath2latex = require('asciimath-to-latex');
const PtbThree = props => {
    const [param_ptb3, setParamPtb3] = useState({a: '', b: '', c: '', d: ''});
    const [showText, setShowText] = useState(true);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState('');

  useEffect(() => {
    setParamPtb3(props.param_ptb3);
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
    <View style={{marginTop: 5}}>
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
      }}>
      <TouchableOpacity
        onPress={() => {
          callback({key: 'PTB3_A', value: param_ptb3});
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <View style={param_ptb3.a == '' ? styles.in : styles.out_in}>
            <MathText
              value={
                key === 'PTB3_A'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_ptb3.a, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_ptb3.a
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
            <MathText value="$$X^{3}$$" direction="ltr" />
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.out_add}>
        <MathText value="$$ + $$" direction="ltr" />
      </View>
      <TouchableOpacity
        onPress={() => {
          callback({key: 'PTB3_B', value: param_ptb3});
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <View style={param_ptb3.b == '' ? styles.in : styles.out_in}>
            <MathText
              value={
                key === 'PTB3_B'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_ptb3.b, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_ptb3.b
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
            <MathText value="$$X^{2}$$" direction="ltr" />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.out_add}>
        <MathText value="$$ + $$" direction="ltr" />
      </View>
      <TouchableOpacity
        onPress={() => {
          callback({key: 'PTB3_C', value: param_ptb3});
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <View style={param_ptb3.c == '' ? styles.in : styles.out_in}>
            <MathText
              value={
                key === 'PTB3_C'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_ptb3.c, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_ptb3.c
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
              }
              direction="ltr"
            />

          </View>

          <View >
            <MathText value="$$X^{}$$" direction="ltr" />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.out_add}>
        <MathText value="$$ + $$" direction="ltr" />
      </View>
      <TouchableOpacity
        onPress={() => {
          callback({key: 'PTB3_D', value: param_ptb3});
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <View style={param_ptb3.d == '' ? styles.in : styles.out_in}>
            <MathText
              value={
                key === 'PTB3_D'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_ptb3.d, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_ptb3.d
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
              }
              direction="ltr"
            />
          </View>

          
        </View>
      </TouchableOpacity>
      <View >
            <MathText value="$$ = 0" direction="ltr" />
          </View>
    </View>
    </View>
  );
};

export default PtbThree;
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
    marginTop: Platform.OS === 'ios' ? -1 : 10,
    justifyContent: 'center',
    borderColor: '#b3ae7e',
    minHeight: 35,
    maxHeight: 35
  },
  out_x:{
    marginTop:-2
  }
});

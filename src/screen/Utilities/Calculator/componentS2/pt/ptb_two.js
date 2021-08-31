import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {MathText} from 'react-native-math-view';
const asciimath2latex = require('asciimath-to-latex');
const PtbTwo = props => {
    const [param_ptb2, setParamPtb2] = useState({a: '', b: '', c: ''});
    const [showText, setShowText] = useState(true);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState('');

  useEffect(() => {
    setParamPtb2(props.param_ptb2);
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
    <View style={{marginTop: 5,justifyContent: 'center',}}>
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
      }}>
      <TouchableOpacity
        onPress={() => {
          callback({key: 'PTB2_A', value: param_ptb2});
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <View style={param_ptb2.a == '' ? styles.in : styles.out_in}>
            <MathText
              value={
                key === 'PTB2_A'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_ptb2.a, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_ptb2.a
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
          callback({key: 'PTB2_B', value: param_ptb2});
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <View style={param_ptb2.b == '' ? styles.in : styles.out_in}>
            <MathText
              value={
                key === 'PTB2_B'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_ptb2.b, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_ptb2.b
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
          callback({key: 'PTB2_C', value: param_ptb2});
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <View style={param_ptb2.c == '' ? styles.in : styles.out_in}>
            <MathText
              value={
                key === 'PTB2_C'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_ptb2.c, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_ptb2.c
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
              }
              direction="ltr"
            />
          </View>

          <View style={styles.out_add}>
        <MathText value="$$ $$" direction="ltr" />
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

export default PtbTwo;
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
    marginTop: Platform.OS === 'ios' ? 0 : 10,
    justifyContent: 'center',
    borderColor: '#b3ae7e',
    minHeight: 35,
    maxHeight: 35
  },
  out_x:{
    marginTop:-2
  }
});

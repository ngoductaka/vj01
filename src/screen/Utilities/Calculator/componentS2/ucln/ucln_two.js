import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {MathText} from 'react-native-math-view';
const asciimath2latex = require('asciimath-to-latex');
const UclnTwo = props => {
  const [param_ucln_1, setParamUcln_1] = useState('');
  const [param_ucln_2, setParamUcln_2] = useState('');
  const [showText, setShowText] = useState(true);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState('');

  useEffect(() => {
    setParamUcln_1(props.param_ucln_1);
    setParamUcln_2(props.param_ucln_2);
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
    <View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 5}}>
        <Text style={styles.text}>{'UCLN ( '}</Text>
        <TouchableOpacity
          onPress={() => {
            callback({key: 'PARAM_UCLN_1', value: param_ucln_1});
          }}>
          <View style={param_ucln_1 == '' ? styles.in : styles.out}>
            <MathText
              value={
                key === 'PARAM_UCLN_1'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_ucln_1, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_ucln_1
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
        <Text style={styles.text}>{' , '}</Text>
        <TouchableOpacity
          onPress={() => {
            callback({key: 'PARAM_UCLN_2', value: param_ucln_2});
          }}>
          <View style={param_ucln_2 == '' ? styles.in : styles.out}>
            <MathText
              value={
                key === 'PARAM_UCLN_2'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_ucln_2, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_ucln_2
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
        <Text style={styles.text}>{' )'}</Text>
      </View>
    </View>
  );
};

export default UclnTwo;
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
  out: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 0 : -8,
    minHeight: 30,
    minWidth: 30,
  },
});

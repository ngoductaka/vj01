import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {MathText} from 'react-native-math-view';
const asciimath2latex = require('asciimath-to-latex');
const BcnnThree = props => {
  const [param_bcnn_1, setParamBcnn_1] = useState('');
  const [param_bcnn_2, setParamBcnn_2] = useState('');
  const [param_bcnn_3, setParamBcnn_3] = useState('');

  const [showText, setShowText] = useState(true);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState('');

  useEffect(() => {
    setParamBcnn_1(props.param_bcnn_1);
    setParamBcnn_2(props.param_bcnn_2);
    setParamBcnn_3(props.param_bcnn_3);
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
        <Text style={styles.text}>{'BCNN ( '}</Text>
        <TouchableOpacity
          onPress={() => {
            callback({key: 'PARAM_BCNN_1', value: param_bcnn_1});
          }}>
          <View style={param_bcnn_1 == '' ? styles.in : styles.out}>
            <MathText
              value={
                key === 'PARAM_BCNN_1'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_bcnn_1, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_bcnn_1
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
            callback({key: 'PARAM_BCNN_2', value: param_bcnn_2});
          }}>
          <View style={param_bcnn_2 == '' ? styles.in : styles.out}>
            <MathText
              value={
                key === 'PARAM_BCNN_2'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_bcnn_2, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                      param_bcnn_2
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
            callback({key: 'PARAM_BCNN_3', value: param_bcnn_3});
          }}>
          <View style={param_bcnn_3 == '' ? styles.in : styles.out}>
            <MathText
              value={
                key === 'PARAM_BCNN_3'
                  ? '$$' +
                    asciimath2latex(
                      addStr(param_bcnn_3, index, showText ? '∣' : '')
                        .replace(/R/g, 'root')
                        .replace(/S/g, 'sqrt')
                        .replace(/π/g, 'pi'),
                    ) +
                    '$$'
                  : '$$' +
                    asciimath2latex(
                        param_bcnn_3
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

export default BcnnThree;
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

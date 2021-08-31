import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {MathText} from 'react-native-math-view';
const asciimath2latex = require('asciimath-to-latex');
const Calculator = props => {
  const [param_calculator, setParamCalculator] = useState('');

  const [showText, setShowText] = useState(true);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState('');

  useEffect(() => {
    setParamCalculator(props.param_calculator);
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
      <TouchableOpacity
        onPress={() => {
          callback({key: 'CALCULATOR', value: param_calculator});
        }}>
        <View
          style={{
            minWidth: 30,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
          <MathText
            value={
              '$$' +
              asciimath2latex(
                addStr(param_calculator, index, showText ? '∣' : '')
                  .replace(/R/g, 'root')
                  .replace(/S/g, 'sqrt')
                  .replace(/π/g, 'pi'),
              ) +
              '$$'
            }
            direction="ltr"
            CellRendererComponent={<TouchableOpacity />}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Calculator;
const styles = StyleSheet.create({
  text: {
    padding: 0,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  text2: {
    padding: 0,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  text_ct: {
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

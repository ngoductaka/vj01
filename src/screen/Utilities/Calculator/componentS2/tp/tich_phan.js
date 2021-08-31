import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet,Image} from 'react-native';
import {MathText} from 'react-native-math-view';
const asciimath2latex = require('asciimath-to-latex');
const TichPhan = props => {
    const [param_tp, setParamTp] = useState({ct: '', cd: '', func: ''});
    const [showText, setShowText] = useState(true);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState('');

  useEffect(() => {
    setParamTp(props.param_tp);
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
    <View style={{flexDirection: 'row', flexWrap: 'wrap',margin:5}}>
        <Image style={styles.stretch} source={require('../image/tp.png')} />
        <View style={{justifyContent: 'space-between',minHeight:130}} >
          <TouchableOpacity  onPress={() => {
          callback({key: 'TP_CT', value: param_tp});
        }}>
          <View
             style={(param_tp.ct==="")?{
              borderWidth: 1,
              borderRadius : 5,
              borderStyle: 'dashed',
              borderColor: 'black',
              minWidth: 30,
              minHeight:30,
              maxHeight:30,
              width:30,
              justifyContent: 'center',

             }:{
              justifyContent: 'center',
              marginTop: Platform.OS === 'ios' ?0:-15,
              minWidth: 30,
              paddingLeft:3
             }}>
                 <MathText
          value={(key==='TP_CT')?"$$"+asciimath2latex(addStr(param_tp.ct,index,showText?'∣':"").replace(/R/g,"root").replace(/S/g,"sqrt").replace(/π/g,"pi"))+"$$":"$$"+asciimath2latex(param_tp.ct.replace(/R/g,"root").replace(/S/g,"sqrt").replace(/π/g,"pi"))+"$$"}
          direction="ltr"
	/> 
           
            </View>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => {
          callback({key: 'TP_FUNC', value: param_tp});
        }}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', height: 40}}>
          <View
             style={(param_tp.func==="")?{
               borderWidth: 1,
               borderRadius : 5,
               borderStyle: 'dashed',
               borderColor: 'black',
               minHeight:40,
               minWidth: 60,
               maxHeight:40,
               padding: 1,
               marginLeft:-5,
               justifyContent: 'center',

             }:{
              justifyContent: 'center',
              marginTop: Platform.OS === 'ios' ?-10:-15,
              minWidth: 30,
              marginLeft:-5,
              height:60
             }}>
               <MathText
          value={(key==='TP_FUNC')?"$$"+asciimath2latex(addStr(param_tp.func,index,showText?'∣':"").replace(/R/g,"root").replace(/S/g,"sqrt").replace(/π/g,"pi"))+"$$":"$$"+asciimath2latex(param_tp.func.replace(/R/g,"root").replace(/S/g,"sqrt").replace(/π/g,"pi"))+"$$"}
          direction="ltr"
	/> 
         
            </View>
            <View style={(param_tp.func==="")?{
               borderRadius : 5,
               borderStyle: 'dashed',
               borderColor: 'black',
               minHeight:40,
               maxHeight:40,
               padding: 1,
               justifyContent: 'center',

             }:{
              justifyContent: 'center',
              marginTop: Platform.OS === 'ios' ?-10:-15,
              minWidth: 30,
              height:60
             }}>
            <MathText
          value={"$$d(x)$$"}
          direction="ltr"
	/> 
            </View>
            </View>
           </TouchableOpacity>
          <TouchableOpacity  onPress={() => {
          callback({key: 'TP_CD', value: param_tp});
        }}>
          <View

             style={(param_tp.cd==="")?{
              borderWidth: 1,
              borderRadius : 5,
              borderStyle: 'dashed',
              borderColor: 'black',
               minWidth: 30,
               minHeight:30,
               maxHeight:30,
               marginLeft:-10,
               width:30,
               justifyContent: 'center',

             }:{
              justifyContent: 'center',
              marginTop: Platform.OS === 'ios' ?0:-15,
              marginLeft:-10,
              minWidth: 30,
            }}>
               <MathText
          value={(key==='TP_CD')?"$$"+asciimath2latex(addStr(param_tp.cd,index,showText?'∣':"").replace(/R/g,"root").replace(/S/g,"sqrt").replace(/π/g,"pi"))+"$$":"$$"+asciimath2latex(param_tp.cd.replace(/R/g,"root").replace(/S/g,"sqrt").replace(/π/g,"pi"))+"$$"}
          direction="ltr"
	/> 
            </View>
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default TichPhan;
const styles = StyleSheet.create({
    stretch: {
      marginTop:10,
      width: 20,
      height: 100,
      resizeMode: 'stretch',
    },
    in: {
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'dashed',
      borderColor: 'black',
      minHeight:40,minWidth: 30,maxHeight:40,
      marginTop: 1,
    },
    out_in: {
      padding: 2,
    },
  });
  
  
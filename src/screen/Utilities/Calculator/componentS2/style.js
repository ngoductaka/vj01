import {
    StyleSheet,
    Dimensions,
  } from 'react-native';
const styles = StyleSheet.create({
    container: {
      margin: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: '#424242',
      width: (Dimensions.get('window').width - 20) / 5,
      borderRadius: 10,
      justifyContent: 'center',
      minHeight:45,maxHeight:45
    },
    button_AC: {
      backgroundColor: 'orange',
      width: (Dimensions.get('window').width - 20) / 5,
      borderRadius: 10,
      borderTopColor: 'gray',
      justifyContent: 'center',
      minHeight:45,maxHeight:45
    },
    button_DEL: {
      backgroundColor: 'red',
      width: (Dimensions.get('window').width - 20) / 5,
      borderRadius: 10,
      borderTopColor: 'gray',
      justifyContent: 'center',
      minHeight:45,maxHeight:45
    },
    button_2: {
      backgroundColor: '#424242',
      width: (Dimensions.get('window').width - 20) / 4,
      borderRadius: 10,
      justifyContent: 'center',
      minHeight:45,maxHeight:45
    },
  
    text: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      color: '#FFFFFF',
    },
    button_cn: {
      backgroundColor: '#424242',
      width: (Dimensions.get('window').width - 10) / 4,
      borderRadius: 10,
      maxHeight:35,minHeight:35
    },
    text_show: {
      height: '100%',
      width: (Dimensions.get('window').width - 10) / 4,
      justifyContent: 'center',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      color: 'black',
    },
    button_cn_5: {
      backgroundColor: '#424242',
      width: (Dimensions.get('window').width - 20) / 5,
      height: '90%',
      borderRadius: 10,
      textAlign:'center',
      justifyContent: 'center',
    },
    text_cn: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      color: 'black',
    },
    text_hoa: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 16,
      color: 'black',
    },
  
    input: {
      flex:1,
      margin: 0,
      borderWidth: 1,
      borderRadius: 10,
      height: 320,
      maxHeight:320,
      maxHeight:320,
      textAlignVertical: 'top',
      backgroundColor: '#b3ae7e',
      fontSize: 20,
      marginTop: 2,
    },
    image: {
      height:'80%',
      resizeMode: 'contain',
      justifyContent: 'center',
    },
    stretch: {
      width: (Dimensions.get('window').width - 20) / 15,
      height: 25,
      resizeMode: 'stretch',
    },
    bottom: {
      paddingTop: 8,
      paddingBottom: 8,
      textAlignVertical: 'bottom',
      justifyContent: 'flex-end',
    },
    text_buton: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontSize: 16,
    },
    gradient: {
      
      flex: 1,
      height:'100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
    },
    imageCancel: {
      width:'100%',
      height: 'auto',
      justifyContent:'center',
      alignItems: 'flex-end',
 },
 text_shift: {
   textAlign: 'center',
   fontWeight: 'bold',
   fontStyle: 'normal',
   fontSize: 13,
   color:"orange"
 },
 shift:{
  textAlign: 'center',
  fontWeight: 'bold',
  fontStyle: 'normal',
  fontSize: 16,
  color:"orange"
 },
 text_shift_on: {
   textAlign: 'center',
   fontWeight: 'bold',
   fontStyle: 'normal',
   fontSize: 16,
  color: "black"
 },
 shift_rad: {
   height:15,
  textAlign: 'center',
  fontWeight: 'bold',
  fontStyle: 'normal',
  fontSize: 25,
  color:"orange"
 },
 text_mini: {
  textAlign: 'center',
  fontWeight: 'bold',
  fontStyle: 'normal',
  fontSize: 9,
  color:"orange"
},
containerStyle:{
  backgroundColor: '#FFFFFF',
  padding:10
},
button_cn_exit: {
  backgroundColor: '#FFFFFF',
  width: (Dimensions.get('window').width - 10) / 4,
  borderRadius: 10,
  maxHeight:35,minHeight:35
},
  });
  export default styles
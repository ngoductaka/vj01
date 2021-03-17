import React from "react";
import { TouchableOpacity, StyleSheet, Text, Dimensions, View } from "react-native";

const screen = Dimensions.get("window");
const buttonWidth = screen.width / 5;

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 25
  },
  textSecondary: {
    color: "#060606"
  },
  button: {
    backgroundColor: "#333333",
    flex: 1,
    // height: Math.floor(buttonWidth - 10),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 10,
    margin: 4,
  },
  buttonSecondary: {
    backgroundColor: "#a6a6a6"
  },
  buttonAccent: {
    backgroundColor: "#f09a36"
  },
  btnMini: {
    paddingVertical: 5,
  },
  textMini: {
    fontSize: 17,
  }
});

export default ({ onPress, text, size, theme }) => {
  const buttonStyles = [styles.button];
  const textStyles = [styles.text];

  if (theme === "secondary") {
    buttonStyles.push(styles.buttonSecondary);
    textStyles.push(styles.textSecondary);
  } else if (theme === "accent") {
    buttonStyles.push(styles.buttonAccent);
  }
  if (size === 'mini') {
    buttonStyles.push(styles.btnMini);
    textStyles.push(styles.textMini);
  }

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles}>
      {typeof text == 'string' ? <Text style={textStyles}>{text}</Text> : text}
    </TouchableOpacity>
  );
};


export const BtnOption = ({ onPress, text, size, theme, opt = "" }) => {
  const buttonStyles = [styles.button];
  const textStyles = [styles.text];

  if (theme === "secondary") {
    buttonStyles.push(styles.buttonSecondary);
    textStyles.push(styles.textSecondary);
  } else if (theme === "accent") {
    buttonStyles.push(styles.buttonAccent);
  }
  if (size === 'mini') {
    buttonStyles.push(styles.btnMini);
    textStyles.push(styles.textMini);
  }
// console.log({opt})
  return (
    <View style={{ flex: 1, minHeight: 53, marginTop: 1 }}>
      <View style={{transform: [{scale: 0.9}]}}>
        {typeof opt == 'string' ? <Text style={{color: '#E6B658', fontSize: 13, textAlign: 'center'}}>{opt}</Text> : opt}
      </View>
      <TouchableOpacity style={[buttonStyles, {marginTop: 1}]} onPress={onPress} >
        {typeof text == 'string' ? <Text style={textStyles}>{text}</Text> : text}
      </TouchableOpacity>
    </View>
  );
};


export const OPT = {
  pow: {
    opt1: () => (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ color: '#000', fontSize: 13}}>X</Text>
        <Text style={{ color: '#000', fontSize: 11, alignSelf: 'flex-start', marginTop: -3 }}>2</Text>
      </View>
    ),
    opt2: () => (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ color: '#E6B658', fontSize: 13 }}>X</Text>
        <Text style={{ fontSize: 11, alignSelf: 'flex-start', marginTop: -3, color: '#E6B658' }}>-1</Text>
      </View>
    )
  },
  powx: {
    opt1: () => (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text>X</Text>
        <Text style={{ fontSize: 11, alignSelf: 'flex-start', marginTop: -5, }}>y</Text>
      </View>
    ),
    opt2: () => (
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        <Text style={{color: '#E6B658'}}>x</Text>
        <Text style={{color: '#E6B658'}}>√</Text>
        <Text style={{ fontSize: 12, alignSelf: 'flex-start',color: '#E6B658', marginTop: -6 }}>-</Text>
      </View>
    )
  },
  can: {
    opt1: () => (
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        <Text style={{color: '#000'}}>3</Text>
        <Text style={{color: '#000'}}>√</Text>
        <Text style={{ fontSize: 12, alignSelf: 'flex-start',color: '#000', marginTop: -6 }}>-</Text>
      </View>
    ),
    opt2: () => (
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        <Text style={{color: '#E6B658'}}>2</Text>
        <Text style={{color: '#E6B658'}}>√</Text>
        <Text style={{ fontSize: 12, alignSelf: 'flex-start',color: '#E6B658', marginTop: -6 }}>-</Text>
      </View>
    )
  },
  sin: { 

  }
}
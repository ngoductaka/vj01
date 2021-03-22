import React from "react";
import { TouchableOpacity, StyleSheet, Text, Dimensions, View } from "react-native";

const screen = Dimensions.get("window");
const buttonWidth = screen.width / 5;

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 23,fontWeight: "bold",
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
    paddingVertical: 8,
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
    <View style={{ flex: 1, minHeight: 50 }}>
      <View style={{ transform: [{ scale: 0.9 }] }}>
        {typeof opt == 'string' ? <Text style={{ color: '#E6B658', fontSize: 13, textAlign: 'center', fontWeight: "bold", }}>{opt}</Text> : opt}
      </View>
      <TouchableOpacity style={[buttonStyles, { marginTop: 1 }]} onPress={onPress} >
        {typeof text == 'string' ? <Text style={textStyles}>{text}</Text> : text}
      </TouchableOpacity>
    </View>
  );
};


const COLOR = {

}


export const OPT = {
  pow: {
    opt1: (otp) => (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontWeight: "bold", color: otp? "#000": "#E6B658", fontSize: 13 }}>X</Text>
        <Text style={{ fontWeight: "bold", color: otp? "#000": "#E6B658", fontSize: 11, alignSelf: 'flex-start', marginTop: -3 }}>2</Text>
      </View>
    ),
    opt2: (otp) => (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{fontWeight: 'bold', color: otp? "#E6B658": "#000", fontSize: 13 }}>X</Text>
        <Text style={{ fontSize: 11, alignSelf: 'flex-start', marginTop: -3,fontWeight: 'bold', color: otp? "#E6B658": "#000" }}>-1</Text>
      </View>
    )
  },
  powx: {
    opt1: (otp) => (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontWeight: "bold", color: otp? "#000": "#E6B658" }}>X</Text>
        <Text style={{ fontWeight: "bold", color: otp? "#000": "#E6B658", fontSize: 11, alignSelf: 'flex-start', marginTop: -5, }}>y</Text>
      </View>
    ),
    opt2: (otp) => (
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        <Text style={{ fontWeight: 'bold', color: otp? "#E6B658": "#000", fontSize: 11 }}>x</Text>
        <Text style={{ fontWeight: 'bold', color: otp? "#E6B658": "#000" }}>√</Text>
        <Text style={{marginLeft: -1, fontSize: 12, alignSelf: 'flex-start', fontWeight: 'bold', color: otp? "#E6B658": "#000", marginTop: -5 }}>-</Text>
      </View>
    )
  },
  can: {
    opt1: (otp) => (
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        <Text style={{ fontWeight: "bold", color: otp? "#000": "#E6B658", fontSize: 11 }}>3</Text>
        <Text style={{ fontWeight: "bold", color: otp? "#000": "#E6B658" }}>√</Text>
        <Text style={{marginLeft: -1, fontSize: 12, alignSelf: 'flex-start', fontWeight: "bold", color: otp? "#000": "#E6B658", marginTop: -5 }}>-</Text>
      </View>
    ),
    opt2: (otp) => (
      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        <Text style={{ fontWeight: 'bold', color: otp? "#E6B658": "#000", fontSize: 11 }}>2</Text>
        <Text style={{ fontWeight: 'bold', color: otp? "#E6B658": "#000" }}>√</Text>
        <Text style={{marginLeft: -1, fontSize: 12, alignSelf: 'flex-start', fontWeight: 'bold', color: otp? "#E6B658": "#000", marginTop: -5 }}>-</Text>
      </View>
    )
  },
  sin: {

  }
}
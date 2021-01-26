import React, { useState } from "react";
import {
  StyleSheet, Text, View, StatusBar,
  TouchableWithoutFeedback, Keyboard,
  SafeAreaView, TextInput
} from "react-native";

import Row from "./components/Row";
import Button from "./components/Button";
import calculator, { initialState } from "./util/calculator";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    justifyContent: "flex-end"
  },
  value: {
    color: "#fff",
    fontSize: 40,
    textAlign: "right",
    marginRight: 20,
    marginBottom: 10
  }
});

const App = () => {
  const [stringCal, setString] = useState('');

  const handleTap = (type, value) => {

  };


  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#A6BCA1', paddingVertical: 20, borderRadius: 10 }}>
          <TouchableOpacity
            onPress={() => {
              console.log('-----')
              Keyboard.dismiss();
            }}
          >

            <TextInput
              showSoftInputOnFocus={false}
              blurOnSubmit={false}
              style={{
                flex: 1,
                paddingHorizontal: 10,
                paddingVertical: 40,
                backgroundColor: '#A6BCA1',
              }}
              multiline={true}
              onChangeText={() => { }}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.value}>
          {/* {parseFloat(state.currentValue).toLocaleString()} */}
        </Text>

        <Row>
          <Button theme="secondary" size="mini" text="ln" onPress={() => handleTap("number", 'cos')} />
          <Button theme="secondary" size="mini" text="(" onPress={() => handleTap("operator", "*")} />
          <Button theme="secondary" size="mini" text=")" onPress={() => handleTap("operator", "*")} />
          <Button theme="secondary" size="mini" text="ln" onPress={() => handleTap("operator", "*")} />
        </Row>
        <Row>
          <Button theme="secondary" size="mini" text="sin" onPress={() => handleTap("number", 'sin')} />
          <Button theme="secondary" size="mini" text="cos" onPress={() => handleTap("number", 'cos')} />
          <Button theme="secondary" size="mini" text="tan" onPress={() => handleTap("number", 'tan')} />
          <Button theme="secondary" size="mini" text="log" onPress={() => handleTap("operator", "*")} />
          {/* <Button theme="secondary" size="mini" text="ln"  onPress={() => handleTap("operator", "*")} /> */}
        </Row>
        <Row>
          <Button
            text={
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text>X</Text>
                <Text style={{ fontSize: 12, alignSelf: 'flex-start', marginTop: -3 }}>2</Text>
              </View>
            }
            theme="secondary"
            size="mini"
            onPress={() => handleTap("clear")}
          />

          <Button
            text={
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>X</Text>
                <Text style={{ fontSize: 12, alignSelf: 'flex-start', marginTop: -3 }}>y</Text>
              </View>
            }
            theme="secondary"
            size="mini"
            onPress={() => handleTap("clear")}
          />

          <Button
            text={
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text>2</Text>
                <Text>√</Text>
                <Text style={{ fontSize: 12, alignSelf: 'flex-start', marginTop: -6 }}>-</Text>
              </View>
            }
            theme="secondary"
            size="mini"
            onPress={() => handleTap("clear")}
          />
          <Button
            text={
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text>&#960;</Text>
              </View>
            }
            theme="secondary"
            size="mini"
            onPress={() => handleTap("clear")}
          />
        </Row>

        <Row>
          <Button text="7" onPress={() => handleTap("number", 7)} />
          <Button text="8" onPress={() => handleTap("number", 8)} />
          <Button text="9" onPress={() => handleTap("number", 9)} />
          <Button text="DEL" theme="accent" onPress={() => handleTap("operator", "*")} />
          <Button text="AC" theme="accent" onPress={() => handleTap("operator", "*")} />
        </Row>
        <Row>
          <Button text="4" onPress={() => handleTap("number", 4)} />
          <Button text="5" onPress={() => handleTap("number", 5)} />
          <Button text="6" onPress={() => handleTap("number", 6)} />
          <Button text="X" onPress={() => handleTap("operator", "*")} />
          <Button text="/" onPress={() => handleTap("operator", "*")} />
        </Row>

        <Row>
          <Button text="1" onPress={() => handleTap("number", 1)} />
          <Button text="2" onPress={() => handleTap("number", 2)} />
          <Button text="3" onPress={() => handleTap("number", 3)} />
          <Button text="+" onPress={() => handleTap("operator", "*")} />
          <Button text="-" onPress={() => handleTap("operator", "*")} />

        </Row>

        <Row>
          <Button
            text="0"
            onPress={() => handleTap("number", 0)}
          />
          <Button text="." onPress={() => handleTap("number", ".")} />
          <Button text="EXP" onPress={() => handleTap("number", ".")} />
          <Button text="ANS" onPress={() => handleTap("number", ".")} />
          <Button
            text="="
            onPress={() => handleTap("equal")}
          />
        </Row>
      </SafeAreaView>
    </View>
  );

}


export default App;
import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import styles from '../style';

const KeyBoard = (props) => {
  //ucln
  const [check_ucln_2, setCheckUcln2] = useState(false)
  const [check_ucln_3, setCheckUcln3] = useState(false)
  //bcnn
  const [check_bcnn_2, setCheckBcnn2] = useState(false)
  const [check_bcnn_3, setCheckBcnn3] = useState(false)
  //hpt
  const [check_hpt_2, setCheckHPT2] = useState(false)
  const [check_hpt_3, setCheckHPT3] = useState(false)
  const [check_hpt_4, setCheckHPT4] = useState(false)
  //bpt
  const [check_tp, setCheckTP] = useState(false)
  //ma trận
  const [check_mt_2, setCheckMT2] = useState(false)
  const [check_mt_3, setCheckMT3] = useState(false)
  const [check_mt_4, setCheckMT4] = useState(false)
  //phương trình
  const [check_ptb_2, setCheckPTB2] = useState(false)
  const [check_ptb_3, setCheckPTB3] = useState(false)
  //vector
  const [check_vt, setCheckVT] = useState(false)
  const [check_shift, setCheckShift] = useState(false)

  const callback = (value) => {
    props.keyboard(value);
  }
  const callback_delete = () => {
    props.CallbackRemove()
  }
  const callbacl_ac = () => {
    props.AcPress()
    setCheckUcln2(false)
    setCheckUcln3(false)
    setCheckBcnn2(false)
    setCheckBcnn3(false)
    setCheckHPT2(false)
    setCheckHPT3(false)
    setCheckHPT4(false)
    setCheckTP(false)
    setCheckMT2(false)
    setCheckMT3(false)
    setCheckMT4(false)
    setCheckPTB2(false)
    setCheckPTB3(false)
    setCheckVT(false)
    setCheckShift(false)
  }

  const callback_enter = () => {
    props.enter()
  }
  const callback_rad = () => {
    props.deg_rad()
  }
  const callbackfunc = (value) => {
    props.function(value);
  }
  const refRBSheet = useRef();

  const select = async (value) => {
    callbackfunc(value)
    await clean_check()
    switch (value) {
      case "OPEN_UCLN_2":
        setCheckUcln2(true)
        break;
      case "OPEN_UCLN_3":
        setCheckUcln3(true)
        break;
      case "OPEN_BCNN_2":
        setCheckBcnn2(true)
        break;
      case "OPEN_BCNN_3":
        setCheckBcnn3(true)
        break;
      case "OPEN_HPT_2":
        setCheckHPT2(true)
        break;
      case "OPEN_HPT_3":
        setCheckHPT3(true)
        break;
      case "OPEN_HPT_4":
        setCheckHPT4(true)
        break;
      case "OPEN_TP":
        setCheckTP(true)
        break;
      case "OPEN_MT_2":
        setCheckMT2(true)
        break;
      case "OPEN_MT_3":
        setCheckMT3(true)
        break;
      case "OPEN_MT_4":
        setCheckMT4(true)
        break;
      case "OPEN_PTB_2":
        setCheckPTB2(true)
        break;
      case "OPEN_PTB_3":
        setCheckPTB3(true)
        break;
      case "OPEN_VT":
        setCheckVT(true)
        break;
      default:
        break

    }
    refRBSheet.current.close()

  }
  const clean_check = async () => {
    await setCheckUcln2(false)
    await setCheckUcln3(false)
    await setCheckBcnn2(false)
    await setCheckBcnn3(false)
    await setCheckHPT2(false)
    await setCheckHPT3(false)
    await setCheckHPT4(false)
    await setCheckTP(false)
    await setCheckMT2(false)
    await setCheckMT3(false)
    await setCheckMT4(false)
    await setCheckPTB2(false)
    await setCheckPTB3(false)
    await setCheckVT(false)
  }

  return (
    <>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={180}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_UCLN_2");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_ucln_2
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 12
                  }}>
                  UCLN(a,b)
                    </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_UCLN_3");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_ucln_3
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 12
                  }}>
                  UCLN(a,b,c)
                    </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_BCNN_2");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_bcnn_2
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 12
                  }}>
                  BCNN(a,b)
                    </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_BCNN_3");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_bcnn_3
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 12
                  }}>
                  BCNN(a,b,c)
                    </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>


        </View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_HPT_2");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_hpt_2
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12
                    }}>
                    f(x
                    <Text
                      style={{
                        fontSize: 8,
                      }}>
                      {'1'}
                    </Text>,x
                    <Text
                      style={{
                        fontSize: 8,
                      }}>
                      {'2'}
                    </Text>)
                    </Text>

                </View>

              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_HPT_3");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_hpt_3
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12
                    }}>
                    f(x
                    <Text
                      style={{
                        fontSize: 8,
                      }}>
                      {'1'}
                    </Text>,x
                    <Text
                      style={{
                        fontSize: 8,
                      }}>
                      {'2'}
                    </Text>,x
                    <Text
                      style={{
                        fontSize: 8,
                      }}>
                      {'3'}
                    </Text>)
                    </Text>

                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_HPT_4");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_hpt_4
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12
                    }}>
                    f(x
                    <Text
                      style={{
                        fontSize: 8,
                      }}>
                      {'1'}
                    </Text>,x
                    <Text
                      style={{
                        fontSize: 8,
                      }}>
                      {'2'}
                    </Text>,x
                    <Text
                      style={{
                        fontSize: 8,
                      }}>
                      {'3'}
                    </Text>,x
                    <Text
                      style={{
                        fontSize: 8,
                      }}>
                      {'4'}
                    </Text>)
                    </Text>

                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_TP");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_tp
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <Text style={styles.text_buton}>
                  ∫<Text style={{ fontSize: 12 }}>{' dx'}</Text>
                </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>

        </View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_MT_2");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_mt_2
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 12
                  }}>
                  {"MT [2x2]"}
                </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_MT_3");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_mt_3
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 12
                  }}>
                  {"MT [3x3]"}
                </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_PTB_2");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_ptb_2
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12
                    }}>
                    f(x)=x
                    </Text>
                  <Text
                    style={{
                      fontSize: 8,
                    }}>
                    {'2'}
                  </Text>
                </View>

              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_PTB_3");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_ptb_3
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12
                    }}>
                    f(x)=x
                    </Text>
                  <Text
                    style={{
                      fontSize: 8,
                    }}>
                    {'3'}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>

        </View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_MT_4");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_mt_4
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 12
                  }}>
                  {"MT [4x4]"}
                </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              select("OPEN_VT");
            }}>
            <View style={styles.button_cn}>
              <LinearGradient
                colors={
                  check_vt
                    ? ['#FFDC00', '#FF8B00', '#FF6C00']
                    : ['#00FFC9', '#01BB93', '#005F4B']
                }
                style={styles.gradient}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: 18 }}>
                    {'[ '}
                  </Text>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: -7,
                      }}>
                      {'->'}
                    </Text>
                    <Text style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12
                    }}>{'a'}</Text>
                  </View>
                  <Text> </Text>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: -7,
                      }}>
                      {'->'}
                    </Text>
                    <Text style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 12
                    }}>{'b'}</Text>
                  </View>
                  <Text style={{ fontSize: 18 }}>
                    {' ]'}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <View style={styles.button_cn_exit}>
          </View>
          <View style={styles.button_cn_exit}>
          </View>
        </View>
      </RBSheet>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => { setCheckShift(!check_shift) }}>
          <View style={styles.button_cn}>
            <LinearGradient
              colors={check_shift ? ['#FFDC00', '#FF8B00', '#FF6C00'] : ['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={check_shift ? styles.text_shift_on : styles.shift}>{'Shift'}</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => refRBSheet.current.open()}>
          <View style={styles.button_cn}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'Advance'}</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => callback_rad()}>
          <View style={styles.button_cn}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'D <-> R'}</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          if (props.setScreen) props.setScreen(true)
        }}>
          <View style={styles.button_cn}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{"<=>"}</Text></LinearGradient>
          </View>
        </TouchableOpacity>

      </View>
      <View style={styles.container}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={styles.text_shift}>sin</Text>
            <Text style={styles.text_mini}>-1</Text>
          </View>
          <TouchableOpacity style={styles.button_cn} onPress={() => callback(check_shift ? 'asin(' : 'sin(')}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'sin'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={styles.text_shift}>cos</Text>
            <Text style={styles.text_mini}>-1</Text>
          </View>
          <TouchableOpacity style={styles.button_cn} onPress={() => callback(check_shift ? 'acos(' : 'cos(')}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'cos'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={styles.text_shift}>tan</Text>
            <Text style={styles.text_mini}>-1</Text>
          </View>
          <TouchableOpacity style={styles.button_cn} onPress={() => callback(check_shift ? 'atan(' : 'tan(')}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'tan'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.text_shift}>{" "}</Text>
          <TouchableOpacity style={styles.button_cn} onPress={() => callback('log(')} >
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'log'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={styles.text_shift}>x</Text>
            <Text style={styles.text_mini}>n</Text>
          </View>
          <TouchableOpacity style={styles.button_cn} onPress={() => callback(check_shift ? 'x^' : 'x')}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'x'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={styles.text_mini}>n</Text>
            <Text style={styles.text_shift}>√</Text>
          </View>
          <TouchableOpacity style={styles.button_cn} onPress={() => callback(check_shift ? 'R()' : 'S')}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'√'}</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>

        <View>
          <Text style={styles.text_shift}>e</Text>
          <TouchableOpacity style={styles.button_cn} onPress={() => callback(check_shift ? 'e' : 'π')}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'π'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.text_shift}>{" "}</Text>

          <TouchableOpacity style={styles.button_cn} onPress={() => callback('ln(')}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'ln'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <View>
          <Text style={styles.text_shift}>˚</Text>

          <TouchableOpacity style={styles.button_cn} onPress={() => callback(check_shift ? '˚' : '^')}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'^'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.text_shift}> </Text>

          <TouchableOpacity style={styles.button_cn} onPress={() => callback('(')}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'('}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={styles.text_shift}> </Text>
          </View>
          <TouchableOpacity style={styles.button_cn} onPress={() => callback(')')}>
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{')'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.text_shift}> </Text>

          <TouchableOpacity style={styles.button_cn} onPress={() => callback('!')} >
            <LinearGradient
              colors={['#BDBDBD', '#6E6E6E', '#424242']}
              style={styles.gradient}>
              <Text style={styles.text_buton}>{'!'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ margin: 4 }} />
      <View >
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              callback("7")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>7</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback("8")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>8</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback("9")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>9</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              callback_delete()
            }}>
            <View style={styles.button_DEL}>
              <LinearGradient
                colors={['#FF9494', '#FF3535', '#FE0000']}
                style={styles.gradient}>
                <Text style={styles.text}>DEL</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => callbacl_ac()}>
            <View style={styles.button_AC}>
              <LinearGradient
                colors={['#FFDC00', '#FF8B00', '#FF6C00']}
                style={styles.gradient}>
                <Text style={styles.text}>AC</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              callback("4")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>4</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback("5")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>5</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback("6")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>6</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback("×")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>x</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback("÷")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>÷</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              callback("1")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>1</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback("2")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>2</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback("3")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>3</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              callback("+")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>+</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              callback("-")
            }}>
            <View style={styles.button}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>-</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              callback("0")
            }}>
            <View style={styles.button_2}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>0</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback(".")
            }}>
            <View style={styles.button_2}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>.</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback("ANS")
            }}>
            <View style={styles.button_2}>
              <LinearGradient
                colors={['#00C1FF', '#008BFF', '#1B00FF']}
                style={styles.gradient}>
                <Text style={styles.text}>ANS</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              callback_enter()
            }}>
            <View style={styles.button_2}>
              <LinearGradient
                colors={['#ABABAB', '#545454', '#252525']}
                style={styles.gradient}>
                <Text style={styles.text}>=</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default KeyBoard
import React, { useState, useEffect, useRef, version } from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert
} from 'react-native';
import {
  MenuProvider,
} from 'react-native-popup-menu';
import { PanGestureHandler } from 'react-native-gesture-handler';
import integrate, {
  math_ucln_2,
  math_ucln_3,
  math_bcnn_2,
  math_bcnn_3,
  equations_2_hidden,
  solveCubic,
  math_cross,
} from './math_func';
import { create, all } from 'mathjs';
import Algebrite from 'algebrite';
import styles from './style';
import Convert from './convert_string';
import Traction from "./convert_traction"
//chia nho cac function
//keyboard 
import KeyBoard from "./keyboard/keyboard"
//ucln
import UclnTwo from "./ucln/ucln_two"
import UclnThree from "./ucln/ucln_three"
//bcnn
import BcnnTwo from "./bcnn/bcnn_two"
import BcnnThree from "./bcnn/bcnn_three"
//hpt
import HptTwo from "./hpt/hpt_two"
import HptThree from "./hpt/hpt_three"
import HptFour from "./hpt/hpt_four"
// phương trình
//ptb2
import PtbTwo from "./pt/ptb_two"
//ptb3
import PtbThree from "./pt/ptb_three"
//vector
import Vector from "./vector/vector"
//ma trận
import MtbTwo from "./mt/mtb_two"
import MtbThree from "./mt/mtb_three"
import MtbFour from "./mt/mtb_four"
//tích phân
import TichPhan from "./tp/tich_phan"
//
import Calculator from "./calculator/calculator"
const math = create(all);
math.import({
  integrate: integrate,
});

const Dashboard = (props) => {
  const _width = Dimensions.get('window').width;
  const [ret, setRet] = useState('0.000');
  const [ans, setANS] = useState('');
  const [x_old, setX] = useState(0);
  const [var_x, setVarX] = useState(0);
  const [cursor, setCursor] = useState(false);
  const [rad, setRad] = useState(true);
  const [ret_back, setRetBack] = useState("0.000");
  //setkey
  const [check_enter, setCheckEnter] = useState(false);
  const [key, setKey] = useState('')
  //cursor
  const [index_cursor, setIndexCursor] = useState(0)
  //param
  // value ucln
  const [param_ucln_1, setParamUcln_1] = useState("")
  const [param_ucln_2, setParamUcln_2] = useState("")
  const [param_ucln_3, setParamUcln_3] = useState("")
  // value bcnn
  const [param_bcnn_1, setParamBcnn_1] = useState("")
  const [param_bcnn_2, setParamBcnn_2] = useState("")
  const [param_bcnn_3, setParamBcnn_3] = useState("")
  //value hệ phương trình
  //2
  const [param_hpt2_1, setParamhpt2_1] = useState({ x1: "", x2: "", end: "" });
  const [param_hpt2_2, setParamhpt2_2] = useState({ x1: "", x2: "", end: "" });
  //3
  const [param_hpt3_1, setParamhpt3_1] = useState({ x1: '', x2: '', x3: '', end: '' });
  const [param_hpt3_2, setParamhpt3_2] = useState({ x1: '', x2: '', x3: '', end: '' });
  const [param_hpt3_3, setParamhpt3_3] = useState({ x1: '', x2: '', x3: '', end: '' });
  //4
  const [param_hpt4_1, setParamhpt4_1] = useState({ x1: '', x2: '', x3: '', x4: '', end: '' });
  const [param_hpt4_2, setParamhpt4_2] = useState({ x1: '', x2: '', x3: '', x4: '', end: '' });
  const [param_hpt4_3, setParamhpt4_3] = useState({ x1: '', x2: '', x3: '', x4: '', end: '' });
  const [param_hpt4_4, setParamhpt4_4] = useState({ x1: '', x2: '', x3: '', x4: '', end: '' });
  // value phương trình
  //2
  const [param_ptb2, setParamPtb2] = useState({ a: '', b: '', c: '' });
  //3
  const [param_ptb3, setParamPtb3] = useState({ a: '', b: '', c: '', d: '' });
  // tích của vector
  const [param_vector_1, setParamVector_1] = useState({ a: '', b: '', c: '' });
  const [param_vector_2, setParamVector_2] = useState({ a: '', b: '', c: '' });
  // ma trận 
  //2
  const [param_mt2_a_1, setParamMt2_a_1] = useState({ a: '', b: '' });
  const [param_mt2_a_2, setParamMt2_a_2] = useState({ a: '', b: '' });
  const [param_mt2_b_1, setParamMt2_b_1] = useState({ a: '', b: '' });
  const [param_mt2_b_2, setParamMt2_b_2] = useState({ a: '', b: '' });

  const [param_mt3_a_1, setParamMt3_a_1] = useState({ a: '', b: '', c: "" });
  const [param_mt3_a_2, setParamMt3_a_2] = useState({ a: '', b: '', c: "" });
  const [param_mt3_a_3, setParamMt3_a_3] = useState({ a: '', b: '', c: "" });
  const [param_mt3_b_1, setParamMt3_b_1] = useState({ a: '', b: '', c: "" });
  const [param_mt3_b_2, setParamMt3_b_2] = useState({ a: '', b: '', c: "" });
  const [param_mt3_b_3, setParamMt3_b_3] = useState({ a: '', b: '', c: "" });

  const [param_mt4_a_1, setParamMt4_a_1] = useState({ a: '', b: '', c: "", d: "" });
  const [param_mt4_a_2, setParamMt4_a_2] = useState({ a: '', b: '', c: "", d: "" });
  const [param_mt4_a_3, setParamMt4_a_3] = useState({ a: '', b: '', c: "", d: "" });
  const [param_mt4_a_4, setParamMt4_a_4] = useState({ a: '', b: '', c: "", d: "" });
  const [param_mt4_b_1, setParamMt4_b_1] = useState({ a: '', b: '', c: "", d: "" });
  const [param_mt4_b_2, setParamMt4_b_2] = useState({ a: '', b: '', c: "", d: "" });
  const [param_mt4_b_3, setParamMt4_b_3] = useState({ a: '', b: '', c: "", d: "" });
  const [param_mt4_b_4, setParamMt4_b_4] = useState({ a: '', b: '', c: "", d: "" });

  const [param_cal_vt, setParamCalVT] = useState("")
  // tính tích phân
  const [param_tp, setParamTp] = useState({ ct: '', cd: '', func: '' });
  // máy tính bình thường
  const [param_calculator, setParamCalculator] = useState("");
  //text_index
  const [text_index, setTextIndex] = useState("");
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

  useEffect(() => { }, [x_old]);

  const Callback = async (childData) => {
    await setKey(childData.key)
    if (typeof childData.value === "string") {
      await setIndexCursor(childData.value.length)
    }
    switch (childData.key) {
      case "PARAM_UCLN_1":
        setTextIndex(childData.value)
        setParamUcln_1(childData.value)
        break;
      case "PARAM_UCLN_2":
        setTextIndex(childData.value)
        setParamUcln_2(childData.value)
        break;
      case "PARAM_UCLN_3":
        setTextIndex(childData.value)
        setParamUcln_3(childData.value)
        break;
      case "PARAM_BCNN_1":
        setTextIndex(childData.value)
        setParamBcnn_1(childData.value)
        break;
      case "PARAM_BCNN_2":
        setTextIndex(childData.value)
        setParamBcnn_2(childData.value)
        break;
      case "PARAM_BCNN_3":
        setTextIndex(childData.value)
        setParamBcnn_3(childData.value)
        break;
      case "CALCULATOR":
        setTextIndex(childData.value)
        setParamCalculator(childData.value)
        break;
      case "CAL_VT":
        setTextIndex(childData.value)
        setParamCalVT(childData.value)
        break;
      case "HPT2_1_X1":
        setParamhpt2_1(childData.value)
        setIndexCursor(childData.value.x1.length)
        setTextIndex(childData.value.x1)
        break;
      case "HPT2_1_X2":
        setParamhpt2_1(childData.value)
        setIndexCursor(childData.value.x2.length)
        setTextIndex(childData.value.x2)

        break;
      case "HPT2_1_END":
        setParamhpt2_1(childData.value)
        setIndexCursor(childData.value.end.length)
        setTextIndex(childData.value.end)

        break;
      case "HPT2_2_X1":
        setParamhpt2_2(childData.value)
        setIndexCursor(childData.value.x1.length)
        setTextIndex(childData.value.x1)

        break;
      case "HPT2_2_X2":
        setParamhpt2_2(childData.value)
        setIndexCursor(childData.value.x2.length)
        setTextIndex(childData.value.x2)

        break;
      case "HPT2_2_END":
        setParamhpt2_2(childData.value)
        setIndexCursor(childData.value.end.length)
        setTextIndex(childData.value.end)
        break;
      case "HPT3_1_X1":
        setParamhpt3_1(childData.value)
        setIndexCursor(childData.value.x1.length)
        setTextIndex(childData.value.x1)
        break;
      case "HPT3_1_X2":
        setParamhpt3_1(childData.value)
        setIndexCursor(childData.value.x2.length)
        setTextIndex(childData.value.x2)
        break;
      case "HPT3_1_X3":
        setParamhpt3_1(childData.value)
        setIndexCursor(childData.value.x3.length)
        setTextIndex(childData.value.x3)
        break;
      case "HPT3_1_END":
        setParamhpt3_1(childData.value)
        setIndexCursor(childData.value.end.length)
        setTextIndex(childData.value.end)

        break;
      case "HPT3_2_X1":
        setParamhpt3_2(childData.value)
        setIndexCursor(childData.value.x1.length)
        setTextIndex(childData.value.x1)

        break;
      case "HPT3_2_X2":
        setParamhpt3_2(childData.value)
        setIndexCursor(childData.value.x2.length)
        setTextIndex(childData.value.x2)

        break;
      case "HPT3_2_X3":
        setParamhpt3_2(childData.value)
        setIndexCursor(childData.value.x3.length)
        setTextIndex(childData.value.x3)

        break;
      case "HPT3_2_END":
        setParamhpt3_2(childData.value)
        setIndexCursor(childData.value.end.length)
        setTextIndex(childData.value.end)

        break;
      case "HPT3_3_X1":
        setParamhpt3_3(childData.value)
        setIndexCursor(childData.value.x1.length)
        setTextIndex(childData.value.x1)

        break;
      case "HPT3_3_X2":
        setParamhpt3_3(childData.value)
        setIndexCursor(childData.value.x2.length)
        setTextIndex(childData.value.x2)

        break;
      case "HPT3_3_X3":
        setParamhpt3_3(childData.value)
        setIndexCursor(childData.value.x3.length)
        setTextIndex(childData.value.x3)

        break;
      case "HPT3_3_END":
        setParamhpt3_3(childData.value)
        setIndexCursor(childData.value.end.length)
        setTextIndex(childData.value.end)

        break;
      case "HPT4_1_X1":
        setParamhpt4_1(childData.value)
        setIndexCursor(childData.value.x1.length)
        setTextIndex(childData.value.x1)

        break;
      case "HPT4_1_X2":
        setParamhpt4_1(childData.value)
        setIndexCursor(childData.value.x2.length)
        setTextIndex(childData.value.x2)

        break;
      case "HPT4_1_X3":
        setParamhpt4_1(childData.value)
        setIndexCursor(childData.value.x3.length)
        setTextIndex(childData.value.x3)

        break;
      case "HPT4_1_X4":
        setParamhpt4_1(childData.value)
        setIndexCursor(childData.value.x4.length)
        setTextIndex(childData.value.x4)

        break;
      case "HPT4_1_END":
        setParamhpt4_1(childData.value)
        setIndexCursor(childData.value.end.length)
        setTextIndex(childData.value.end)

        break;
      case "HPT4_2_X1":
        setParamhpt4_2(childData.value)
        setIndexCursor(childData.value.x1.length)
        setTextIndex(childData.value.x1)

        break;
      case "HPT4_2_X2":
        setParamhpt4_2(childData.value)
        setIndexCursor(childData.value.x2.length)
        setTextIndex(childData.value.x2)

        break;
      case "HPT4_2_X3":
        setParamhpt4_2(childData.value)
        setIndexCursor(childData.value.x3.length)
        setTextIndex(childData.value.x3)

        break;
      case "HPT4_2_X4":
        setParamhpt4_2(childData.value)
        setIndexCursor(childData.value.x4.length)
        setTextIndex(childData.value.x4)

        break;
      case "HPT4_2_END":
        setParamhpt4_2(childData.value)
        setIndexCursor(childData.value.end.length)
        setTextIndex(childData.value.end)

        break;
      case "HPT4_3_X1":
        setParamhpt4_3(childData.value)
        setIndexCursor(childData.value.x1.length)
        setTextIndex(childData.value.x1)
        break;
      case "HPT4_3_X2":
        setParamhpt4_3(childData.value)
        setIndexCursor(childData.value.x2.length)
        setTextIndex(childData.value.x2)
        break;
      case "HPT4_3_X3":
        setParamhpt4_3(childData.value)
        setIndexCursor(childData.value.x3.length)
        setTextIndex(childData.value.x3)
        break;
      case "HPT4_3_X4":
        setParamhpt4_3(childData.value)
        setIndexCursor(childData.value.x4.length)
        setTextIndex(childData.value.x4)
        break;
      case "HPT4_3_END":
        setParamhpt4_3(childData.value)
        setIndexCursor(childData.value.end.length)
        setTextIndex(childData.value.end)
        break;
      case "HPT4_4_X1":
        setParamhpt4_4(childData.value)
        setIndexCursor(childData.value.x1.length)
        setTextIndex(childData.value.x1)
        break;
      case "HPT4_4_X2":
        setParamhpt4_4(childData.value)
        setIndexCursor(childData.value.x2.length)
        setTextIndex(childData.value.x2)
        break;
      case "HPT4_4_X3":
        setParamhpt4_4(childData.value)
        setIndexCursor(childData.value.x3.length)
        setTextIndex(childData.value.x3)
        break;
      case "HPT4_4_X4":
        setParamhpt4_4(childData.value)
        setIndexCursor(childData.value.x4.length)
        setTextIndex(childData.value.x4)
        break;
      case "HPT4_4_END":
        setParamhpt4_4(childData.value)
        setIndexCursor(childData.value.end.length)
        setTextIndex(childData.value.end)
        break;
      case "PTB2_A":
        setIndexCursor(childData.value.a.length)
        setParamPtb2(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PTB2_B":
        setIndexCursor(childData.value.b.length)
        setParamPtb2(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PTB2_C":
        setIndexCursor(childData.value.c.length)
        setParamPtb2(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PTB3_A":
        setIndexCursor(childData.value.a.length)
        setParamPtb3(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PTB3_B":
        setIndexCursor(childData.value.b.length)
        setParamPtb3(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PTB3_C":
        setIndexCursor(childData.value.c.length)
        setParamPtb3(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PTB3_D":
        setIndexCursor(childData.value.d.length)
        setParamPtb3(childData.value)
        setTextIndex(childData.value.d)
        break;
      case "VECTOR_1_A":
        setIndexCursor(childData.value.a.length)
        setParamVector_1(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "VECTOR_1_B":
        setIndexCursor(childData.value.b.length)
        setParamVector_1(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "VECTOR_1_C":
        setIndexCursor(childData.value.c.length)
        setParamVector_1(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "VECTOR_2_A":
        setIndexCursor(childData.value.a.length)
        setParamVector_2(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "VECTOR_2_B":
        setIndexCursor(childData.value.b.length)
        setParamVector_2(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "VECTOR_2_C":
        setIndexCursor(childData.value.c.length)
        setParamVector_2(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT2_A_1_1":
        setIndexCursor(childData.value.a.length)
        setParamMt2_a_1(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT2_A_1_2":
        setIndexCursor(childData.value.b.length)
        setParamMt2_a_1(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT2_A_2_1":
        setIndexCursor(childData.value.a.length)
        setParamMt2_a_2(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT2_A_2_2":
        setIndexCursor(childData.value.b.length)
        setParamMt2_a_2(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT2_B_1_1":
        setIndexCursor(childData.value.a.length)
        setParamMt2_b_1(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT2_B_1_2":
        setIndexCursor(childData.value.b.length)
        setParamMt2_b_1(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT2_B_2_1":
        setIndexCursor(childData.value.a.length)
        setParamMt2_b_2(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT2_B_2_2":
        setIndexCursor(childData.value.b.length)
        setParamMt2_b_2(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT3_A_1_1":
        setIndexCursor(childData.value.a.length)
        setParamMt3_a_1(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT3_A_1_2":
        setIndexCursor(childData.value.b.length)
        setParamMt3_a_1(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT3_A_1_3":
        setIndexCursor(childData.value.c.length)
        setParamMt3_a_1(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT3_A_2_1":
        setIndexCursor(childData.value.a.length)
        setParamMt3_a_2(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT3_A_2_2":
        setIndexCursor(childData.value.b.length)
        setParamMt3_a_2(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT3_A_2_3":
        setIndexCursor(childData.value.c.length)
        setParamMt3_a_2(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT3_A_3_1":
        setIndexCursor(childData.value.a.length)
        setParamMt3_a_3(childData.value)
        setTextIndex(childData.value.a)

        break;
      case "PARAM_MT3_A_3_2":
        setIndexCursor(childData.value.b.length)
        setParamMt3_a_3(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT3_A_3_3":
        setIndexCursor(childData.value.c.length)
        setParamMt3_a_3(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT3_B_1_1":
        setIndexCursor(childData.value.a.length)
        setParamMt3_b_1(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT3_B_1_2":
        setIndexCursor(childData.value.b.length)
        setParamMt3_b_1(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT3_B_1_3":
        setIndexCursor(childData.value.c.length)
        setParamMt3_b_1(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT3_B_2_1":
        setIndexCursor(childData.value.a.length)
        setParamMt3_b_2(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT3_B_2_2":
        setIndexCursor(childData.value.b.length)
        setParamMt3_b_2(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT3_B_2_3":
        setIndexCursor(childData.value.c.length)
        setParamMt3_b_2(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT3_B_3_1":
        setIndexCursor(childData.value.a.length)
        setParamMt3_b_3(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT3_B_3_2":
        setIndexCursor(childData.value.b.length)
        setParamMt3_b_3(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT3_B_3_3":
        setIndexCursor(childData.value.c.length)
        setParamMt3_b_3(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT4_A_1_1":
        setIndexCursor(childData.value.a.length)
        setParamMt4_a_1(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT4_A_1_2":
        setIndexCursor(childData.value.b.length)
        setParamMt4_a_1(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT4_A_1_3":
        setIndexCursor(childData.value.c.length)
        setParamMt4_a_1(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT4_A_1_4":
        setIndexCursor(childData.value.d.length)
        setParamMt4_a_1(childData.value)
        setTextIndex(childData.value.d)
        break;
      case "PARAM_MT4_A_2_1":
        setIndexCursor(childData.value.a.length)
        setParamMt4_a_2(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT4_A_2_2":
        setIndexCursor(childData.value.b.length)
        setParamMt4_a_2(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT4_A_2_3":
        setIndexCursor(childData.value.c.length)
        setParamMt4_a_2(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT4_A_2_4":
        setIndexCursor(childData.value.d.length)
        setParamMt4_a_2(childData.value)
        setTextIndex(childData.value.d)
        break;
      case "PARAM_MT4_A_3_1":
        setIndexCursor(childData.value.a.length)
        setParamMt4_a_3(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT4_A_3_2":
        setIndexCursor(childData.value.b.length)
        setParamMt4_a_3(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT4_A_3_3":
        setIndexCursor(childData.value.c.length)
        setParamMt4_a_3(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT4_A_3_4":
        setIndexCursor(childData.value.d.length)
        setParamMt4_a_3(childData.value)
        setTextIndex(childData.value.d)
        break;
      case "PARAM_MT4_A_4_1":
        setIndexCursor(childData.value.a.length)
        setParamMt4_a_4(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT4_A_4_2":
        setIndexCursor(childData.value.b.length)
        setParamMt4_a_4(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT4_A_4_3":
        setIndexCursor(childData.value.c.length)
        setParamMt4_a_4(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT4_A_4_4":
        setIndexCursor(childData.value.d.length)
        setParamMt4_a_4(childData.value)
        setTextIndex(childData.value.d)
        break;
      case "PARAM_MT4_B_1_1":
        setIndexCursor(childData.value.a.length)
        setParamMt4_b_1(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT4_B_1_2":
        setIndexCursor(childData.value.b.length)
        setParamMt4_b_1(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT4_B_1_3":
        setIndexCursor(childData.value.c.length)
        setParamMt4_b_1(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT4_B_1_4":
        setIndexCursor(childData.value.d.length)
        setParamMt4_b_1(childData.value)
        setTextIndex(childData.value.d)
        break;
      case "PARAM_MT4_B_2_1":
        setIndexCursor(childData.value.a.length)
        setParamMt4_b_2(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT4_B_2_2":
        setIndexCursor(childData.value.b.length)
        setParamMt4_b_2(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT4_B_2_3":
        setIndexCursor(childData.value.c.length)
        setParamMt4_b_2(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT4_B_2_4":
        setIndexCursor(childData.value.d.length)
        setParamMt4_b_2(childData.value)
        setTextIndex(childData.value.d)
        break;
      case "PARAM_MT4_B_3_1":
        setIndexCursor(childData.value.a.length)
        setParamMt4_b_3(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT4_B_3_2":
        setIndexCursor(childData.value.b.length)
        setParamMt4_b_3(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT4_B_3_3":
        setIndexCursor(childData.value.c.length)
        setParamMt4_b_3(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT4_B_3_4":
        setIndexCursor(childData.value.d.length)
        setParamMt4_b_3(childData.value)
        setTextIndex(childData.value.d)
        break;
      case "PARAM_MT4_B_4_1":
        setIndexCursor(childData.value.a.length)
        setParamMt4_b_4(childData.value)
        setTextIndex(childData.value.a)
        break;
      case "PARAM_MT4_B_4_2":
        setIndexCursor(childData.value.b.length)
        setParamMt4_b_4(childData.value)
        setTextIndex(childData.value.b)
        break;
      case "PARAM_MT4_B_4_3":
        setIndexCursor(childData.value.c.length)
        setParamMt4_b_4(childData.value)
        setTextIndex(childData.value.c)
        break;
      case "PARAM_MT4_B_4_4":
        setIndexCursor(childData.value.d.length)
        setParamMt4_b_4(childData.value)
        setTextIndex(childData.value.d)
        break;
      case "TP_CT":
        setIndexCursor(childData.value.ct.length)
        setParamTp(childData.value)
        setTextIndex(childData.value.ct)
        break;
      case "TP_CD":
        setIndexCursor(childData.value.cd.length)
        setParamTp(childData.value)
        setTextIndex(childData.value.cd)
        break;
      case "TP_FUNC":
        setIndexCursor(childData.value.func.length)
        setParamTp(childData.value)
        setTextIndex(childData.value.func)
        break;
      default:
        break
    }
  }


  const CallbackInput = (input) => {
    switch (key) {
      case "PARAM_UCLN_1":
        value = addStr(param_ucln_1, index_cursor, input)
        setParamUcln_1(value)
        break;
      case "PARAM_UCLN_2":
        value = addStr(param_ucln_2, index_cursor, input)
        setParamUcln_2(value)
        break;
      case "PARAM_UCLN_3":
        value = param_ucln_3 + input
        setParamUcln_3(value)
        break;
      case "PARAM_BCNN_1":
        value = addStr(param_bcnn_1, index_cursor, input)
        setParamBcnn_1(value)
        break;
      case "PARAM_BCNN_2":
        value = addStr(param_bcnn_2, index_cursor, input)
        setParamBcnn_2(value)
        break;
      case "PARAM_BCNN_3":
        value = addStr(param_bcnn_3, index_cursor, input)
        setParamBcnn_3(value)
        break;
      case "CALCULATOR":
        if (check_enter) {
          setCheckEnter(false)
          setParamCalculator("")
          setIndexCursor(0)
          setParamCalculator(addStr("", 0, input))
        }
        else {
          value = addStr(param_calculator, index_cursor, input)
          setParamCalculator(value)
        }
        break;
      case "CAL_VT":
        value = addStr(param_cal_vt, index_cursor, input)
        setParamCalVT(value)
        break;
      case "HPT2_1_X1":
        value = addStr(param_hpt2_1.x1, index_cursor, input)
        param_hpt2_1.x1 = value
        setParamhpt2_1(param_hpt2_1)
        break;
      case "HPT2_1_X2":
        value = addStr(param_hpt2_1.x2, index_cursor, input)
        param_hpt2_1.x2 = value
        setParamhpt2_1(param_hpt2_1)
        break;
      case "HPT2_1_END":
        value = addStr(param_hpt2_1.end, index_cursor, input)
        param_hpt2_1.end = value
        setParamhpt2_1(param_hpt2_1)
        break;
      case "HPT2_2_X1":
        value = addStr(param_hpt2_2.x1, index_cursor, input)
        param_hpt2_2.x1 = value
        setParamhpt2_2(param_hpt2_2)
        break;
      case "HPT2_2_X2":
        value = addStr(param_hpt2_2.x2, index_cursor, input)
        param_hpt2_2.x2 = value
        setParamhpt2_2(param_hpt2_2)
        break;
      case "HPT2_2_END":
        value = addStr(param_hpt2_2.end, index_cursor, input)
        param_hpt2_2.end = value
        setParamhpt2_2(param_hpt2_2)
        break;
      case "HPT3_1_X1":
        value = addStr(param_hpt3_1.x1, index_cursor, input)
        param_hpt3_1.x1 = value
        setParamhpt2_2(param_hpt3_1)
        break;
      case "HPT3_1_X2":
        value = addStr(param_hpt3_1.x2, index_cursor, input)
        param_hpt3_1.x2 = value
        setParamhpt2_2(param_hpt3_1)
        break;
      case "HPT3_1_X3":
        value = addStr(param_hpt3_1.x3, index_cursor, input)
        param_hpt3_1.x3 = value
        setParamhpt2_2(param_hpt3_1)
        break;
      case "HPT3_1_END":
        value = addStr(param_hpt3_1.end, index_cursor, input)
        param_hpt3_1.end = value
        setParamhpt2_2(param_hpt3_1)
        break;
      case "HPT3_2_X1":
        value = addStr(param_hpt3_2.x1, index_cursor, input)
        param_hpt3_2.x1 = value
        setParamhpt2_2(param_hpt3_2)
        break;
      case "HPT3_2_X2":
        value = addStr(param_hpt3_2.x2, index_cursor, input)
        param_hpt3_2.x2 = value
        setParamhpt2_2(param_hpt3_2)
        break;
      case "HPT3_2_X3":
        value = addStr(param_hpt3_2.x3, index_cursor, input)
        param_hpt3_2.x3 = value
        setParamhpt2_2(param_hpt3_2)
        break;
      case "HPT3_2_END":
        value = addStr(param_hpt3_2.end, index_cursor, input)
        param_hpt3_2.end = value
        setParamhpt2_2(param_hpt3_2)
        break;
      case "HPT3_3_X1":
        value = addStr(param_hpt3_3.x1, index_cursor, input)
        param_hpt3_3.x1 = value
        setParamhpt2_2(param_hpt3_3)
        break;
      case "HPT3_3_X2":
        value = addStr(param_hpt3_3.x2, index_cursor, input)
        param_hpt3_3.x2 = value
        setParamhpt2_2(param_hpt3_3)
        break;
      case "HPT3_3_X3":
        value = addStr(param_hpt3_3.x3, index_cursor, input)
        param_hpt3_3.x3 = value
        setParamhpt2_2(param_hpt3_3)
        break;
      case "HPT3_3_END":
        value = addStr(param_hpt3_3.end, index_cursor, input)
        param_hpt3_3.end = value
        setParamhpt2_2(param_hpt3_3)
        break;
      case "HPT4_1_X1":
        value = addStr(param_hpt4_1.x1, index_cursor, input)
        param_hpt4_1.x1 = value
        setParamhpt2_2(param_hpt4_1)
        break;
      case "HPT4_1_X2":
        value = addStr(param_hpt4_1.x2, index_cursor, input)
        param_hpt4_1.x2 = value
        setParamhpt2_2(param_hpt4_1)
        break;
      case "HPT4_1_X3":
        value = addStr(param_hpt4_1.x3, index_cursor, input)
        param_hpt4_1.x3 = value
        setParamhpt2_2(param_hpt4_1)
        break;
      case "HPT4_1_X4":
        value = addStr(param_hpt4_1.x4, index_cursor, input)
        param_hpt4_1.x4 = value
        setParamhpt2_2(param_hpt4_1)
        break;
      case "HPT4_1_END":
        value = addStr(param_hpt4_1.end, index_cursor, input)
        param_hpt4_1.end = value
        setParamhpt2_2(param_hpt4_1)
        break;
      case "HPT4_2_X1":
        value = addStr(param_hpt4_2.x1, index_cursor, input)
        param_hpt4_2.x1 = value
        setParamhpt2_2(param_hpt4_2)
        break;
      case "HPT4_2_X2":
        value = addStr(param_hpt4_2.x2, index_cursor, input)
        param_hpt4_2.x2 = value
        setParamhpt2_2(param_hpt4_2)
        break;
      case "HPT4_2_X3":
        value = addStr(param_hpt4_2.x3, index_cursor, input)
        param_hpt4_2.x3 = value
        setParamhpt2_2(param_hpt4_2)
        break;
      case "HPT4_2_X4":
        value = addStr(param_hpt4_2.x4, index_cursor, input)
        param_hpt4_2.x4 = value
        setParamhpt2_2(param_hpt4_2)
        break;
      case "HPT4_2_END":
        value = addStr(param_hpt4_2.end, index_cursor, input)
        param_hpt4_2.end = value
        setParamhpt2_2(param_hpt4_2)
        break;
      case "HPT4_3_X1":
        value = addStr(param_hpt4_3.x1, index_cursor, input)
        param_hpt4_3.x1 = value
        setParamhpt2_2(param_hpt4_3)
        break;
      case "HPT4_3_X2":
        value = addStr(param_hpt4_3.x2, index_cursor, input)
        param_hpt4_3.x2 = value
        setParamhpt2_2(param_hpt4_3)
        break;
      case "HPT4_3_X3":
        value = addStr(param_hpt4_3.x3, index_cursor, input)
        param_hpt4_3.x3 = value
        setParamhpt2_2(param_hpt4_3)
        break;
      case "HPT4_3_X4":
        value = addStr(param_hpt4_3.x4, index_cursor, input)
        param_hpt4_3.x4 = value
        setParamhpt2_2(param_hpt4_3)
        break;
      case "HPT4_3_END":
        value = addStr(param_hpt4_3.end, index_cursor, input)
        param_hpt4_3.end = value
        setParamhpt2_2(param_hpt4_3)
        break;
      case "HPT4_4_X1":
        value = addStr(param_hpt4_4.x1, index_cursor, input)
        param_hpt4_4.x1 = value
        setParamhpt2_2(param_hpt4_4)
        break;
      case "HPT4_4_X2":
        value = addStr(param_hpt4_4.x2, index_cursor, input)
        param_hpt4_4.x2 = value
        setParamhpt2_2(param_hpt4_4)
        break;
      case "HPT4_4_X3":
        value = addStr(param_hpt4_4.x3, index_cursor, input)
        param_hpt4_4.x3 = value
        setParamhpt2_2(param_hpt4_4)
        break;
      case "HPT4_4_X4":
        value = addStr(param_hpt4_4.x4, index_cursor, input)
        param_hpt4_4.x4 = value
        setParamhpt2_2(param_hpt4_4)
        break;
      case "HPT4_4_END":
        value = addStr(param_hpt4_4.end, index_cursor, input)
        param_hpt4_4.end = value
        setParamhpt2_2(param_hpt4_4)
        break;
      case "PTB2_A":
        value = addStr(param_ptb2.a, index_cursor, input)
        param_ptb2.a = value
        setParamPtb2(param_ptb2)
        break;
      case "PTB2_B":
        value = addStr(param_ptb2.b, index_cursor, input)
        param_ptb2.b = value
        setParamPtb2(param_ptb2)
        break;
      case "PTB2_C":
        value = addStr(param_ptb2.c, index_cursor, input)
        param_ptb2.c = value
        setParamPtb2(param_ptb2)
        break;
      case "PTB3_A":
        value = addStr(param_ptb3.a, index_cursor, input)
        param_ptb3.a = value
        setParamPtb3(param_ptb3)
        break;
      case "PTB3_B":
        value = addStr(param_ptb3.b, index_cursor, input)
        param_ptb3.b = value
        setParamPtb3(param_ptb3)
        break;
      case "PTB3_C":
        value = addStr(param_ptb3.c, index_cursor, input)
        param_ptb3.c = value
        setParamPtb3(param_ptb3)
        break;
      case "PTB3_D":
        value = addStr(param_ptb3.d, index_cursor, input)
        param_ptb3.d = value
        setParamPtb3(param_ptb3)
        break;
      case "VECTOR_1_A":
        value = addStr(param_vector_1.a, index_cursor, input)
        param_vector_1.a = value
        setParamVector_1(param_vector_1)
        break;
      case "VECTOR_1_B":
        value = addStr(param_vector_1.b, index_cursor, input)
        param_vector_1.b = value
        setParamVector_1(param_vector_1)
        break;
      case "VECTOR_1_C":
        value = addStr(param_vector_1.c, index_cursor, input)
        param_vector_1.c = value
        setParamVector_1(param_vector_1)
        break;
      case "VECTOR_2_A":
        value = addStr(param_vector_2.a, index_cursor, input)
        param_vector_2.a = value
        setParamVector_2(param_vector_2)
        break;
      case "VECTOR_2_B":
        value = addStr(param_vector_2.b, index_cursor, input)
        param_vector_2.b = value
        setParamVector_2(param_vector_2)
        break;
      case "VECTOR_2_C":
        value = addStr(param_vector_2.c, index_cursor, input)
        param_vector_2.c = value
        setParamVector_2(param_vector_2)
        break;
      case "PARAM_MT2_A_1_1":
        value = addStr(param_mt2_a_1.a, index_cursor, input)
        param_mt2_a_1.a = value
        setParamMt2_a_1(param_mt2_a_1)
        break;
      case "PARAM_MT2_A_1_2":
        value = addStr(param_mt2_a_1.b, index_cursor, input)
        param_mt2_a_1.b = value
        setParamMt2_a_1(param_mt2_a_1)
        break;
      case "PARAM_MT2_A_2_1":
        value = addStr(param_mt2_a_2.a, index_cursor, input)
        param_mt2_a_2.a = value
        setParamMt2_a_2(param_mt2_a_2)
        break;
      case "PARAM_MT2_A_2_2":
        value = addStr(param_mt2_a_2.b, index_cursor, input)
        param_mt2_a_2.b = value
        setParamMt2_a_2(param_mt2_a_2)
        break;
      case "PARAM_MT2_B_1_1":
        value = addStr(param_mt2_b_1.a, index_cursor, input)
        param_mt2_b_1.a = value
        setParamMt2_b_1(param_mt2_b_1)
        break;
      case "PARAM_MT2_B_1_2":
        value = addStr(param_mt2_b_1.b, index_cursor, input)
        param_mt2_b_1.b = value
        setParamMt2_b_1(param_mt2_b_1)
        break;
      case "PARAM_MT2_B_2_1":
        value = addStr(param_mt2_b_2.a, index_cursor, input)
        param_mt2_b_2.a = value
        setParamMt2_b_2(param_mt2_b_2)
        break;
      case "PARAM_MT2_B_2_2":
        value = addStr(param_mt2_b_2.b, index_cursor, input)
        param_mt2_b_2.b = value
        setParamMt2_b_2(param_mt2_b_2)
        break;
      case "PARAM_MT3_A_1_1":
        value = addStr(param_mt3_a_1.a, index_cursor, input)
        param_mt3_a_1.a = value
        setParamMt3_a_1(param_mt3_a_1)
        break;
      case "PARAM_MT3_A_1_2":
        value = addStr(param_mt3_a_1.b, index_cursor, input)
        param_mt3_a_1.b = value
        setParamMt3_a_1(param_mt3_a_1)
        break;
      case "PARAM_MT3_A_1_3":
        value = addStr(param_mt3_a_1.c, index_cursor, input)
        param_mt3_a_1.c = value
        setParamMt3_a_1(param_mt3_a_1)
        break;
      case "PARAM_MT3_A_2_1":
        value = addStr(param_mt3_a_2.a, index_cursor, input)
        param_mt3_a_2.a = value
        setParamMt3_a_2(param_mt3_a_2)
        break;
      case "PARAM_MT3_A_2_2":
        value = addStr(param_mt3_a_2.b, index_cursor, input)
        param_mt3_a_2.b = value
        setParamMt3_a_2(param_mt3_a_2)
        break;
      case "PARAM_MT3_A_2_3":
        value = addStr(param_mt3_a_2.c, index_cursor, input)
        param_mt3_a_2.c = value
        setParamMt3_a_2(param_mt3_a_2)
        break;
      case "PARAM_MT3_A_3_1":
        value = addStr(param_mt3_a_3.a, index_cursor, input)
        param_mt3_a_3.a = value
        setParamMt3_a_3(param_mt3_a_3)
        break;
      case "PARAM_MT3_A_3_2":
        value = addStr(param_mt3_a_3.b, index_cursor, input)
        param_mt3_a_3.b = value
        setParamMt3_a_3(param_mt3_a_3)
        break;
      case "PARAM_MT3_A_3_3":
        value = addStr(param_mt3_a_3.c, index_cursor, input)
        param_mt3_a_3.c = value
        setParamMt3_a_3(param_mt3_a_3)
        break;
      case "PARAM_MT3_B_1_1":
        value = addStr(param_mt3_b_1.a, index_cursor, input)
        param_mt3_b_1.a = value
        setParamMt3_b_1(param_mt3_b_1)
        break;
      case "PARAM_MT3_B_1_2":
        value = addStr(param_mt3_b_1.b, index_cursor, input)
        param_mt3_b_1.b = value
        setParamMt3_b_1(param_mt3_b_1)
        break;
      case "PARAM_MT3_B_1_3":
        value = addStr(param_mt3_b_1.c, index_cursor, input)
        param_mt3_b_1.c = value
        setParamMt3_b_1(param_mt3_b_1)
        break;
      case "PARAM_MT3_B_2_1":
        value = addStr(param_mt3_b_2.a, index_cursor, input)
        param_mt3_b_2.a = value
        setParamMt3_b_2(param_mt3_b_2)
        break;
      case "PARAM_MT3_B_2_2":
        value = addStr(param_mt3_b_2.b, index_cursor, input)
        param_mt3_b_2.b = value
        setParamMt3_b_2(param_mt3_b_2)
        break;
      case "PARAM_MT3_B_2_3":
        value = addStr(param_mt3_b_2.c, index_cursor, input)
        param_mt3_b_2.c = value
        setParamMt3_b_2(param_mt3_b_2)
        break;
      case "PARAM_MT3_B_3_1":
        value = addStr(param_mt3_b_3.a, index_cursor, input)
        param_mt3_b_3.a = value
        setParamMt3_b_3(param_mt3_b_3)
        break;
      case "PARAM_MT3_B_3_2":
        value = addStr(param_mt3_b_3.b, index_cursor, input)
        param_mt3_b_3.b = value
        setParamMt3_b_3(param_mt3_b_3)
        break;
      case "PARAM_MT3_B_3_3":
        value = addStr(param_mt3_b_3.c, index_cursor, input)
        param_mt3_b_3.c = value
        setParamMt3_b_3(param_mt3_b_3)
        break;
      case "PARAM_MT4_A_1_1":
        value = addStr(param_mt4_a_1.a, index_cursor, input)
        param_mt4_a_1.a = value
        setParamMt4_a_1(param_mt4_a_1)
        break;
      case "PARAM_MT4_A_1_2":
        value = addStr(param_mt4_a_1.b, index_cursor, input)
        param_mt4_a_1.b = value
        setParamMt4_a_1(param_mt4_a_1)
        break;
      case "PARAM_MT4_A_1_3":
        value = addStr(param_mt4_a_1.c, index_cursor, input)
        param_mt4_a_1.c = value
        setParamMt4_a_1(param_mt4_a_1)
        break;
      case "PARAM_MT4_A_1_4":
        value = addStr(param_mt4_a_1.d, index_cursor, input)
        param_mt4_a_1.d = value
        setParamMt4_a_1(param_mt4_a_1)
        break;
      case "PARAM_MT4_A_2_1":
        value = addStr(param_mt4_a_2.a, index_cursor, input)
        param_mt4_a_2.a = value
        setParamMt4_a_2(param_mt4_a_2)
        break;
      case "PARAM_MT4_A_2_2":
        value = addStr(param_mt4_a_2.b, index_cursor, input)
        param_mt4_a_2.b = value
        setParamMt4_a_2(param_mt4_a_2)
        break;
      case "PARAM_MT4_A_2_3":
        value = addStr(param_mt4_a_2.c, index_cursor, input)
        param_mt4_a_2.c = value
        setParamMt4_a_2(param_mt4_a_2)
        break;
      case "PARAM_MT4_A_2_4":
        value = addStr(param_mt4_a_2.d, index_cursor, input)
        param_mt4_a_2.d = value
        setParamMt4_a_2(param_mt4_a_2)
        break;
      case "PARAM_MT4_A_3_1":
        value = addStr(param_mt4_a_3.a, index_cursor, input)
        param_mt4_a_3.a = value
        setParamMt4_a_3(param_mt4_a_3)
        break;
      case "PARAM_MT4_A_3_2":
        value = addStr(param_mt4_a_3.b, index_cursor, input)
        param_mt4_a_3.b = value
        setParamMt4_a_3(param_mt4_a_3)
        break;
      case "PARAM_MT4_A_3_3":
        value = addStr(param_mt4_a_3.c, index_cursor, input)
        param_mt4_a_3.c = value
        setParamMt4_a_3(param_mt4_a_3)
        break;
      case "PARAM_MT4_A_3_4":
        value = addStr(param_mt4_a_3.d, index_cursor, input)
        param_mt4_a_3.d = value
        setParamMt4_a_3(param_mt4_a_3)
        break;
      case "PARAM_MT4_A_4_1":
        value = addStr(param_mt4_a_4.a, index_cursor, input)
        param_mt4_a_4.a = value
        setParamMt4_a_4(param_mt4_a_4)
        break;
      case "PARAM_MT4_A_4_2":
        value = addStr(param_mt4_a_4.b, index_cursor, input)
        param_mt4_a_4.b = value
        setParamMt4_a_4(param_mt4_a_4)
        break;
      case "PARAM_MT4_A_4_3":
        value = addStr(param_mt4_a_4.c, index_cursor, input)
        param_mt4_a_4.c = value
        setParamMt4_a_4(param_mt4_a_4)
        break;
      case "PARAM_MT4_A_4_4":
        value = addStr(param_mt4_a_4.d, index_cursor, input)
        param_mt4_a_4.d = value
        setParamMt4_a_4(param_mt4_a_4)
        break;
      case "PARAM_MT4_B_1_1":
        value = addStr(param_mt4_b_1.a, index_cursor, input)
        param_mt4_b_1.a = value
        setParamMt4_b_1(param_mt4_b_1)
        break;
      case "PARAM_MT4_B_1_2":
        value = addStr(param_mt4_b_1.b, index_cursor, input)
        param_mt4_b_1.b = value
        setParamMt4_b_1(param_mt4_b_1)
        break;
      case "PARAM_MT4_B_1_3":
        value = addStr(param_mt4_b_1.c, index_cursor, input)
        param_mt4_b_1.c = value
        setParamMt4_b_1(param_mt4_b_1)
        break;
      case "PARAM_MT4_B_1_4":
        value = addStr(param_mt4_b_1.d, index_cursor, input)
        param_mt4_b_1.d = value
        setParamMt4_b_1(param_mt4_b_1)
        break;
      case "PARAM_MT4_B_2_1":
        value = addStr(param_mt4_b_2.a, index_cursor, input)
        param_mt4_b_2.a = value
        setParamMt4_b_2(param_mt4_b_2)
        break;
      case "PARAM_MT4_B_2_2":
        value = addStr(param_mt4_b_2.b, index_cursor, input)
        param_mt4_b_2.b = value
        setParamMt4_b_2(param_mt4_b_2)
        break;
      case "PARAM_MT4_B_2_3":
        value = addStr(param_mt4_b_2.c, index_cursor, input)
        param_mt4_b_2.c = value
        setParamMt4_b_2(param_mt4_b_2)
        break;
      case "PARAM_MT4_B_2_4":
        value = addStr(param_mt4_b_2.d, index_cursor, input)
        param_mt4_b_2.d = value
        setParamMt4_b_2(param_mt4_b_2)
        break;
      case "PARAM_MT4_B_3_1":
        value = addStr(param_mt4_b_3.a, index_cursor, input)
        param_mt4_b_3.a = value
        setParamMt4_b_3(param_mt4_b_3)
        break;
      case "PARAM_MT4_B_3_2":
        value = addStr(param_mt4_b_3.b, index_cursor, input)
        param_mt4_b_3.b = value
        setParamMt4_b_3(param_mt4_b_3)
        break;
      case "PARAM_MT4_B_3_3":
        value = addStr(param_mt4_b_3.c, index_cursor, input)
        param_mt4_b_3.c = value
        setParamMt4_b_3(param_mt4_b_3)
        break;
      case "PARAM_MT4_B_3_4":
        value = addStr(param_mt4_b_3.d, index_cursor, input)
        param_mt4_b_3.d = value
        setParamMt4_b_3(param_mt4_b_3)
        break;
      case "PARAM_MT4_B_4_1":
        value = addStr(param_mt4_b_4.a, index_cursor, input)
        param_mt4_b_4.a = value
        setParamMt4_b_4(param_mt4_b_4)
        break;
      case "PARAM_MT4_B_4_2":
        value = addStr(param_mt4_b_4.b, index_cursor, input)
        param_mt4_b_4.b = value
        setParamMt4_b_4(param_mt4_b_4)
        break;
      case "PARAM_MT4_B_4_3":
        value = addStr(param_mt4_b_4.c, index_cursor, input)
        param_mt4_b_4.c = value
        setParamMt4_b_4(param_mt4_b_4)
        break;
      case "PARAM_MT4_B_4_4":
        value = addStr(param_mt4_b_4.d, index_cursor, input)
        param_mt4_b_4.d = value
        setParamMt4_b_4(param_mt4_b_4)
        break;
      case "TP_CT":
        value = addStr(param_tp.ct, index_cursor, input)
        param_tp.ct = value
        setParamTp(param_tp)
        break;
      case "TP_CD":
        value = addStr(param_tp.cd, index_cursor, input)
        param_tp.cd = value
        setParamTp(param_tp)
        break;
      case "TP_FUNC":
        value = addStr(param_tp.func, index_cursor, input)
        param_tp.func = value
        setParamTp(param_tp)
        break;
      default:
        if (check_enter) {
          setCheckEnter(false)
          setParamCalculator("")
          setIndexCursor(0)
          setParamCalculator(addStr("", 0, input))
        }
        else {
          setParamCalculator(addStr(param_calculator, index_cursor, input))

        }
        break
    }
  }

  const CallbackRemove = () => {
    switch (key) {
      case "PARAM_UCLN_1":
        value = remove_string(param_ucln_1, index_cursor)
        setParamUcln_1(value)
        break;
      case "PARAM_UCLN_2":
        value = remove_string(param_ucln_2, index_cursor)
        setParamUcln_2(value)
        break;
      case "PARAM_UCLN_3":
        value = param_ucln_3 + input
        setParamUcln_3(value)
        break;
      case "PARAM_BCNN_1":
        value = remove_string(param_bcnn_1, index_cursor)
        setParamBcnn_1(value)
        break;
      case "PARAM_BCNN_2":
        value = remove_string(param_bcnn_2, index_cursor)
        setParamBcnn_2(value)
        break;
      case "PARAM_BCNN_3":
        value = remove_string(param_bcnn_3, index_cursor)
        setParamBcnn_3(value)
        break;
      case "CALCULATOR":
        value = remove_string(param_calculator, index_cursor)
        setParamCalculator(value)
        break;
      case "CAL_VT":
        value = remove_string(param_cal_vt, index_cursor)
        setParamCalVT(value)
        break;
      case "HPT2_1_X1":
        value = remove_string(param_hpt2_1.x1, index_cursor)
        param_hpt2_1.x1 = value
        setParamhpt2_1(param_hpt2_1)
        break;
      case "HPT2_1_X2":
        value = remove_string(param_hpt2_1.x2, index_cursor)
        param_hpt2_1.x2 = value
        setParamhpt2_1(param_hpt2_1)
        break;
      case "HPT2_1_END":
        value = remove_string(param_hpt2_1.end, index_cursor)
        param_hpt2_1.end = value
        setParamhpt2_1(param_hpt2_1)
        break;
      case "HPT2_2_X1":
        value = remove_string(param_hpt2_2.x1, index_cursor)
        param_hpt2_2.x1 = value
        setParamhpt2_2(param_hpt2_2)
        break;
      case "HPT2_2_X2":
        value = remove_string(param_hpt2_2.x2, index_cursor)
        param_hpt2_2.x2 = value
        setParamhpt2_2(param_hpt2_2)
        break;
      case "HPT2_2_END":
        value = remove_string(param_hpt2_2.end, index_cursor)
        param_hpt2_2.end = value
        setParamhpt2_2(param_hpt2_2)
        break;
      case "HPT3_1_X1":
        value = remove_string(param_hpt3_1.x1, index_cursor)
        param_hpt3_1.x1 = value
        setParamhpt2_2(param_hpt3_1)
        break;
      case "HPT3_1_X2":
        value = remove_string(param_hpt3_1.x2, index_cursor)
        param_hpt3_1.x2 = value
        setParamhpt2_2(param_hpt3_1)
        break;
      case "HPT3_1_X3":
        value = remove_string(param_hpt3_1.x3, index_cursor)
        param_hpt3_1.x3 = value
        setParamhpt2_2(param_hpt3_1)
        break;
      case "HPT3_1_END":
        value = remove_string(param_hpt3_1.end, index_cursor)
        param_hpt3_1.end = value
        setParamhpt2_2(param_hpt3_1)
        break;
      case "HPT3_2_X1":
        value = remove_string(param_hpt3_2.x1, index_cursor)
        param_hpt3_2.x1 = value
        setParamhpt2_2(param_hpt3_2)
        break;
      case "HPT3_2_X2":
        value = remove_string(param_hpt3_2.x2, index_cursor)
        param_hpt3_2.x2 = value
        setParamhpt2_2(param_hpt3_2)
        break;
      case "HPT3_2_X3":
        value = remove_string(param_hpt3_2.x3, index_cursor)
        param_hpt3_2.x3 = value
        setParamhpt2_2(param_hpt3_2)
        break;
      case "HPT3_2_END":
        value = remove_string(param_hpt3_2.end, index_cursor)
        param_hpt3_2.end = value
        setParamhpt2_2(param_hpt3_2)
        break;
      case "HPT3_3_X1":
        value = remove_string(param_hpt3_3.x1, index_cursor)
        param_hpt3_3.x1 = value
        setParamhpt2_2(param_hpt3_3)
        break;
      case "HPT3_3_X2":
        value = remove_string(param_hpt3_3.x2, index_cursor)
        param_hpt3_3.x2 = value
        setParamhpt2_2(param_hpt3_3)
        break;
      case "HPT3_3_X3":
        value = remove_string(param_hpt3_3.x3, index_cursor)
        param_hpt3_3.x3 = value
        setParamhpt2_2(param_hpt3_3)
        break;
      case "HPT3_3_END":
        value = remove_string(param_hpt3_3.end, index_cursor)
        param_hpt3_3.end = value
        setParamhpt2_2(param_hpt3_3)
        break;
      case "HPT4_1_X1":
        value = remove_string(param_hpt4_1.x1, index_cursor)
        param_hpt4_1.x1 = value
        setParamhpt2_2(param_hpt4_1)
        break;
      case "HPT4_1_X2":
        value = remove_string(param_hpt4_1.x2, index_cursor)
        param_hpt4_1.x2 = value
        setParamhpt2_2(param_hpt4_1)
        break;
      case "HPT4_1_X3":
        value = remove_string(param_hpt4_1.x3, index_cursor)
        param_hpt4_1.x3 = value
        setParamhpt2_2(param_hpt4_1)
        break;
      case "HPT4_1_X4":
        value = remove_string(param_hpt4_1.x4, index_cursor)
        param_hpt4_1.x4 = value
        setParamhpt2_2(param_hpt4_1)
        break;
      case "HPT4_1_END":
        value = remove_string(param_hpt4_1.end, index_cursor)
        param_hpt4_1.end = value
        setParamhpt2_2(param_hpt4_1)
        break;
      case "HPT4_2_X1":
        value = remove_string(param_hpt4_2.x1, index_cursor)
        param_hpt4_2.x1 = value
        setParamhpt2_2(param_hpt4_2)
        break;
      case "HPT4_2_X2":
        value = remove_string(param_hpt4_2.x2, index_cursor)
        param_hpt4_2.x2 = value
        setParamhpt2_2(param_hpt4_2)
        break;
      case "HPT4_2_X3":
        value = remove_string(param_hpt4_2.x3, index_cursor)
        param_hpt4_2.x3 = value
        setParamhpt2_2(param_hpt4_2)
        break;
      case "HPT4_2_X4":
        value = remove_string(param_hpt4_2.x4, index_cursor)
        param_hpt4_2.x4 = value
        setParamhpt2_2(param_hpt4_2)
        break;
      case "HPT4_2_END":
        value = remove_string(param_hpt4_2.end, index_cursor)
        param_hpt4_2.end = value
        setParamhpt2_2(param_hpt4_2)
        break;
      case "HPT4_3_X1":
        value = remove_string(param_hpt4_3.x1, index_cursor)
        param_hpt4_3.x1 = value
        setParamhpt2_2(param_hpt4_3)
        break;
      case "HPT4_3_X2":
        value = remove_string(param_hpt4_3.x2, index_cursor)
        param_hpt4_3.x2 = value
        setParamhpt2_2(param_hpt4_3)
        break;
      case "HPT4_3_X3":
        value = remove_string(param_hpt4_3.x3, index_cursor)
        param_hpt4_3.x3 = value
        setParamhpt2_2(param_hpt4_3)
        break;
      case "HPT4_3_X4":
        value = remove_string(param_hpt4_3.x4, index_cursor)
        param_hpt4_3.x4 = value
        setParamhpt2_2(param_hpt4_3)
        break;
      case "HPT4_3_END":
        value = remove_string(param_hpt4_3.end, index_cursor)
        param_hpt4_3.end = value
        setParamhpt2_2(param_hpt4_3)
        break;
      case "HPT4_4_X1":
        value = remove_string(param_hpt4_4.x1, index_cursor)
        param_hpt4_4.x1 = value
        setParamhpt2_2(param_hpt4_4)
        break;
      case "HPT4_4_X2":
        value = remove_string(param_hpt4_4.x2, index_cursor)
        param_hpt4_4.x2 = value
        setParamhpt2_2(param_hpt4_4)
        break;
      case "HPT4_4_X3":
        value = remove_string(param_hpt4_4.x3, index_cursor)
        param_hpt4_4.x3 = value
        setParamhpt2_2(param_hpt4_4)
        break;
      case "HPT4_4_X4":
        value = remove_string(param_hpt4_4.x4, index_cursor)
        param_hpt4_4.x4 = value
        setParamhpt2_2(param_hpt4_4)
        break;
      case "HPT4_4_END":
        value = remove_string(param_hpt4_4.end, index_cursor)
        param_hpt4_4.end = value
        setParamhpt2_2(param_hpt4_4)
        break;
      case "PTB2_A":
        value = remove_string(param_ptb2.a, index_cursor)
        param_ptb2.a = value
        setParamPtb2(param_ptb2)
        break;
      case "PTB2_B":
        value = remove_string(param_ptb2.b, index_cursor)
        param_ptb2.b = value
        setParamPtb2(param_ptb2)
        break;
      case "PTB2_C":
        value = remove_string(param_ptb2.c, index_cursor)
        param_ptb2.c = value
        setParamPtb2(param_ptb2)
        break;
      case "PTB3_A":
        value = remove_string(param_ptb3.a, index_cursor)
        param_ptb3.a = value
        setParamPtb3(param_ptb3)
        break;
      case "PTB3_B":
        value = remove_string(param_ptb3.b, index_cursor)
        param_ptb3.b = value
        setParamPtb3(param_ptb3)
        break;
      case "PTB3_C":
        value = remove_string(param_ptb3.c, index_cursor)
        param_ptb3.c = value
        setParamPtb3(param_ptb3)
        break;
      case "PTB3_D":
        value = remove_string(param_ptb3.d, index_cursor)
        param_ptb3.d = value
        setParamPtb3(param_ptb3)
        break;
      case "VECTOR_1_A":
        value = remove_string(param_vector_1.a, index_cursor)
        param_vector_1.a = value
        setParamVector_1(param_vector_1)
        break;
      case "VECTOR_1_B":
        value = remove_string(param_vector_1.b, index_cursor)
        param_vector_1.b = value
        setParamVector_1(param_vector_1)
        break;
      case "VECTOR_1_C":
        value = remove_string(param_vector_1.c, index_cursor)
        param_vector_1.c = value
        setParamVector_1(param_vector_1)
        break;
      case "VECTOR_2_A":
        value = remove_string(param_vector_2.a, index_cursor)
        param_vector_2.a = value
        setParamVector_2(param_vector_2)
        break;
      case "VECTOR_2_B":
        value = remove_string(param_vector_2.b, index_cursor)
        param_vector_2.b = value
        setParamVector_2(param_vector_2)
        break;
      case "VECTOR_2_C":
        value = remove_string(param_vector_2.c, index_cursor)
        param_vector_2.c = value
        setParamVector_2(param_vector_2)
        break;
      case "PARAM_MT2_A_1_1":
        value = remove_string(param_mt2_a_1.a, index_cursor)
        param_mt2_a_1.a = value
        setParamMt2_a_1(param_mt2_a_1)
        break;
      case "PARAM_MT2_A_1_2":
        value = remove_string(param_mt2_a_1.b, index_cursor)
        param_mt2_a_1.b = value
        setParamMt2_a_1(param_mt2_a_1)
        break;
      case "PARAM_MT2_A_2_1":
        value = remove_string(param_mt2_a_2.a, index_cursor)
        param_mt2_a_2.a = value
        setParamMt2_a_2(param_mt2_a_2)
        break;
      case "PARAM_MT2_A_2_2":
        value = remove_string(param_mt2_a_2.b, index_cursor)
        param_mt2_a_2.b = value
        setParamMt2_a_2(param_mt2_a_2)
        break;
      case "PARAM_MT2_B_1_1":
        value = addStr(param_mt2_b_1.a, index_cursor)
        param_mt2_b_1.a = value
        setParamMt2_b_1(param_mt2_b_1)
        break;
      case "PARAM_MT2_B_1_2":
        value = addStr(param_mt2_b_1.b, index_cursor)
        param_mt2_b_1.b = value
        setParamMt2_b_1(param_mt2_b_1)
        break;
      case "PARAM_MT2_B_2_1":
        value = remove_string(param_mt2_b_2.a, index_cursor)
        param_mt2_b_2.a = value
        setParamMt2_b_2(param_mt2_b_2)
        break;
      case "PARAM_MT2_B_2_2":
        value = remove_string(param_mt2_b_2.b, index_cursor)
        param_mt2_b_2.b = value
        setParamMt2_b_2(param_mt2_b_2)
        break;
      case "PARAM_MT3_A_1_1":
        value = remove_string(param_mt3_a_1.a, index_cursor)
        param_mt3_a_1.a = value
        setParamMt3_a_1(param_mt3_a_1)
        break;
      case "PARAM_MT3_A_1_2":
        value = remove_string(param_mt3_a_1.b, index_cursor)
        param_mt3_a_1.b = value
        setParamMt3_a_1(param_mt3_a_1)
        break;
      case "PARAM_MT3_A_1_3":
        value = remove_string(param_mt3_a_1.c, index_cursor)
        param_mt3_a_1.c = value
        setParamMt3_a_1(param_mt3_a_1)
        break;
      case "PARAM_MT3_A_2_1":
        value = remove_string(param_mt3_a_2.a, index_cursor)
        param_mt3_a_2.a = value
        setParamMt3_a_2(param_mt3_a_2)
        break;
      case "PARAM_MT3_A_2_2":
        value = remove_string(param_mt3_a_2.b, index_cursor)
        param_mt3_a_2.b = value
        setParamMt3_a_2(param_mt3_a_2)
        break;
      case "PARAM_MT3_A_2_3":
        value = remove_string(param_mt3_a_2.c, index_cursor)
        param_mt3_a_2.c = value
        setParamMt3_a_2(param_mt3_a_2)
        break;
      case "PARAM_MT3_A_3_1":
        value = remove_string(param_mt3_a_3.a, index_cursor)
        param_mt3_a_3.a = value
        setParamMt3_a_3(param_mt3_a_3)
        break;
      case "PARAM_MT3_A_3_2":
        value = remove_string(param_mt3_a_3.b, index_cursor)
        param_mt3_a_3.b = value
        setParamMt3_a_3(param_mt3_a_3)
        break;
      case "PARAM_MT3_A_3_3":
        value = remove_string(param_mt3_a_3.c, index_cursor)
        param_mt3_a_3.c = value
        setParamMt3_a_3(param_mt3_a_3)
        break;
      case "PARAM_MT3_B_1_1":
        value = remove_string(param_mt3_b_1.a, index_cursor)
        param_mt3_b_1.a = value
        setParamMt3_b_1(param_mt3_b_1)
        break;
      case "PARAM_MT3_B_1_2":
        value = remove_string(param_mt3_b_1.b, index_cursor)
        param_mt3_b_1.b = value
        setParamMt3_b_1(param_mt3_b_1)
        break;
      case "PARAM_MT3_B_1_3":
        value = remove_string(param_mt3_b_1.c, index_cursor)
        param_mt3_b_1.c = value
        setParamMt3_b_1(param_mt3_b_1)
        break;
      case "PARAM_MT3_B_2_1":
        value = remove_string(param_mt3_b_2.a, index_cursor)
        param_mt3_b_2.a = value
        setParamMt3_b_2(param_mt3_b_2)
        break;
      case "PARAM_MT3_B_2_2":
        value = remove_string(param_mt3_b_2.b, index_cursor)
        param_mt3_b_2.b = value
        setParamMt3_b_2(param_mt3_b_2)
        break;
      case "PARAM_MT3_B_2_3":
        value = addStr(param_mt3_b_2.c, index_cursor)
        param_mt3_b_2.c = value
        setParamMt3_b_2(param_mt3_b_2)
        break;
      case "PARAM_MT3_B_3_1":
        value = remove_string(param_mt3_b_3.a, index_cursor)
        param_mt3_b_3.a = value
        setParamMt3_b_3(param_mt3_b_3)
        break;
      case "PARAM_MT3_B_3_2":
        value = remove_string(param_mt3_b_3.b, index_cursor)
        param_mt3_b_3.b = value
        setParamMt3_b_3(param_mt3_b_3)
        break;
      case "PARAM_MT3_B_3_3":
        value = remove_string(param_mt3_b_3.c, index_cursor)
        param_mt3_b_3.c = value
        setParamMt3_b_3(param_mt3_b_3)
        break;
      case "PARAM_MT4_A_1_1":
        value = remove_string(param_mt4_a_1.a, index_cursor)
        param_mt4_a_1.a = value
        setParamMt4_a_1(param_mt4_a_1)
        break;
      case "PARAM_MT4_A_1_2":
        value = remove_string(param_mt4_a_1.b, index_cursor)
        param_mt4_a_1.b = value
        setParamMt4_a_1(param_mt4_a_1)
        break;
      case "PARAM_MT4_A_1_3":
        value = remove_string(param_mt4_a_1.c, index_cursor)
        param_mt4_a_1.c = value
        setParamMt4_a_1(param_mt4_a_1)
        break;
      case "PARAM_MT4_A_1_4":
        value = remove_string(param_mt4_a_1.d, index_cursor)
        param_mt4_a_1.d = value
        setParamMt4_a_1(param_mt4_a_1)
        break;
      case "PARAM_MT4_A_2_1":
        value = remove_string(param_mt4_a_2.a, index_cursor)
        param_mt4_a_2.a = value
        setParamMt4_a_2(param_mt4_a_2)
        break;
      case "PARAM_MT4_A_2_2":
        value = remove_string(param_mt4_a_2.b, index_cursor)
        param_mt4_a_2.b = value
        setParamMt4_a_2(param_mt4_a_2)
        break;
      case "PARAM_MT4_A_2_3":
        value = remove_string(param_mt4_a_2.c, index_cursor)
        param_mt4_a_2.c = value
        setParamMt4_a_2(param_mt4_a_2)
        break;
      case "PARAM_MT4_A_2_4":
        value = remove_string(param_mt4_a_2.d, index_cursor)
        param_mt4_a_2.d = value
        setParamMt4_a_2(param_mt4_a_2)
        break;
      case "PARAM_MT4_A_3_1":
        value = remove_string(param_mt4_a_3.a, index_cursor)
        param_mt4_a_3.a = value
        setParamMt4_a_3(param_mt4_a_3)
        break;
      case "PARAM_MT4_A_3_2":
        value = remove_string(param_mt4_a_3.b, index_cursor)
        param_mt4_a_3.b = value
        setParamMt4_a_3(param_mt4_a_3)
        break;
      case "PARAM_MT4_A_3_3":
        value = remove_string(param_mt4_a_3.c, index_cursor)
        param_mt4_a_3.c = value
        setParamMt4_a_3(param_mt4_a_3)
        break;
      case "PARAM_MT4_A_3_4":
        value = remove_string(param_mt4_a_3.d, index_cursor)
        param_mt4_a_3.d = value
        setParamMt4_a_3(param_mt4_a_3)
        break;
      case "PARAM_MT4_A_4_1":
        value = remove_string(param_mt4_a_4.a, index_cursor)
        param_mt4_a_4.a = value
        setParamMt4_a_4(param_mt4_a_4)
        break;
      case "PARAM_MT4_A_4_2":
        value = remove_string(param_mt4_a_4.b, index_cursor)
        param_mt4_a_4.b = value
        setParamMt4_a_4(param_mt4_a_4)
        break;
      case "PARAM_MT4_A_4_3":
        value = remove_string(param_mt4_a_4.c, index_cursor)
        param_mt4_a_4.c = value
        setParamMt4_a_4(param_mt4_a_4)
        break;
      case "PARAM_MT4_A_4_4":
        value = remove_string(param_mt4_a_4.d, index_cursor)
        param_mt4_a_4.d = value
        setParamMt4_a_4(param_mt4_a_4)
        break;
      case "PARAM_MT4_B_1_1":
        value = remove_string(param_mt4_b_1.a, index_cursor)
        param_mt4_b_1.a = value
        setParamMt4_b_1(param_mt4_b_1)
        break;
      case "PARAM_MT4_B_1_2":
        value = remove_string(param_mt4_b_1.b, index_cursor)
        param_mt4_b_1.b = value
        setParamMt4_b_1(param_mt4_b_1)
        break;
      case "PARAM_MT4_B_1_3":
        value = remove_string(param_mt4_b_1.c, index_cursor)
        param_mt4_b_1.c = value
        setParamMt4_b_1(param_mt4_b_1)
        break;
      case "PARAM_MT4_B_1_4":
        value = remove_string(param_mt4_b_1.d, index_cursor)
        param_mt4_b_1.d = value
        setParamMt4_b_1(param_mt4_b_1)
        break;
      case "PARAM_MT4_B_2_1":
        value = remove_string(param_mt4_b_2.a, index_cursor)
        param_mt4_b_2.a = value
        setParamMt4_b_2(param_mt4_b_2)
        break;
      case "PARAM_MT4_B_2_2":
        value = remove_string(param_mt4_b_2.b, index_cursor)
        param_mt4_b_2.b = value
        setParamMt4_b_2(param_mt4_b_2)
        break;
      case "PARAM_MT4_B_2_3":
        value = remove_string(param_mt4_b_2.c, index_cursor)
        param_mt4_b_2.c = value
        setParamMt4_b_2(param_mt4_b_2)
        break;
      case "PARAM_MT4_B_2_4":
        value = remove_string(param_mt4_b_2.d, index_cursor)
        param_mt4_b_2.d = value
        setParamMt4_b_2(param_mt4_b_2)
        break;
      case "PARAM_MT4_B_3_1":
        value = remove_string(param_mt4_b_3.a, index_cursor)
        param_mt4_b_3.a = value
        setParamMt4_b_3(param_mt4_b_3)
        break;
      case "PARAM_MT4_B_3_2":
        value = remove_string(param_mt4_b_3.b, index_cursor)
        param_mt4_b_3.b = value
        setParamMt4_b_3(param_mt4_b_3)
        break;
      case "PARAM_MT4_B_3_3":
        value = remove_string(param_mt4_b_3.c, index_cursor)
        param_mt4_b_3.c = value
        setParamMt4_b_3(param_mt4_b_3)
        break;
      case "PARAM_MT4_B_3_4":
        value = remove_string(param_mt4_b_3.d, index_cursor)
        param_mt4_b_3.d = value
        setParamMt4_b_3(param_mt4_b_3)
        break;
      case "PARAM_MT4_B_4_1":
        value = remove_string(param_mt4_b_4.a, index_cursor)
        param_mt4_b_4.a = value
        setParamMt4_b_4(param_mt4_b_4)
        break;
      case "PARAM_MT4_B_4_2":
        value = remove_string(param_mt4_b_4.b, index_cursor)
        param_mt4_b_4.b = value
        setParamMt4_b_4(param_mt4_b_4)
        break;
      case "PARAM_MT4_B_4_3":
        value = remove_string(param_mt4_b_4.c, index_cursor)
        param_mt4_b_4.c = value
        setParamMt4_b_4(param_mt4_b_4)
        break;
      case "PARAM_MT4_B_4_4":
        value = remove_string(param_mt4_b_4.d, index_cursor)
        param_mt4_b_4.d = value
        setParamMt4_b_4(param_mt4_b_4)
        break;
      case "TP_CT":
        value = remove_string(param_tp.ct, index_cursor)
        param_tp.ct = value
        setParamTp(param_tp)
        break;
      case "TP_CD":
        value = remove_string(param_tp.cd, index_cursor)
        param_tp.cd = value
        setParamTp(param_tp)
        break;
      case "TP_FUNC":
        value = remove_string(param_tp.func, index_cursor)
        param_tp.func = value
        setParamTp(param_tp)
        break;
      default:
        setParamCalculator(remove_string(param_calculator, index_cursor))
        break
    }
  }

  const addStr = (str, index, stringToAdd) => {
    var new_index = 0;
    var check_string = "0123456789xe"
    if (stringToAdd === 'R()') {
      new_index = index + 2;
    }
    else if (stringToAdd === "^") {
      if (check_string.indexOf(str.charAt(index - 1)) < 1) {
        new_index = index
      }
      else {
        new_index = index + stringToAdd.length;
      }
    }
    else {
      new_index = index + stringToAdd.length;
    }

    if (new_index === index) {
      return str
    }
    str = str.substring(0, index) + stringToAdd + str.substring(index, str.length);
    setIndexCursor(new_index)
    setTextIndex(str)
    return str
  };

  const remove_string = (string, index) => {
    if (check_enter) {
      setCheckEnter(false)
    }
    var arr = string.split('')
    if (string.charAt(index - 1) === "(" && string.charAt(index - 2) === "R") {
      arr[index - 2] = '';
      setIndexCursor(index_cursor - 1);
    }
    //R()
    else if (string.charAt(index - 1) === ")" && string.charAt(index - 2) === "(" && string.charAt(index - 2) === "R") {
      arr[index - 3] = '';
      setIndexCursor(index_cursor - 3);
    }
    //()
    else if (string.charAt(index - 1) === ")" && string.charAt(index - 2) === "(") {
      arr[index - 1] = '';
      arr[index - 2] = '';
      setIndexCursor(index_cursor - 2);
    }
    else if (string.charAt(index - 1) === ")" && string.charAt(index - 2) === "") {
      arr[index - 1] = '';
      setIndexCursor(index_cursor - 1);
    }
    else if (index > 0) {
      arr[index - 1] = '';
      setIndexCursor(index_cursor - 1);
    }
    if (arr.join('') === "^") {
      setIndexCursor(0);
      return ""
    }
    else {

      return arr.join('');
    }
  };
  const AC = () => {
    clean_param()
    clean_check()
  }

  const CallbackFunction = async (value) => {
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
  }

  const clean_param = () => {
    setIndexCursor(0)
    setKey("")
    setParamUcln_1("")
    setParamUcln_2("")
    setParamUcln_3("")
    setParamBcnn_1("")
    setParamBcnn_2("")
    setParamBcnn_3("")
    setParamhpt2_1({ x1: "", x2: "", end: "" });
    setParamhpt2_2({ x1: "", x2: "", end: "" });
    setParamhpt3_1({ x1: '', x2: '', x3: '', end: '' });
    setParamhpt3_2({ x1: '', x2: '', x3: '', end: '' });
    setParamhpt3_3({ x1: '', x2: '', x3: '', end: '' });
    setParamhpt4_1({ x1: '', x2: '', x3: '', x4: '', end: '' });
    setParamhpt4_2({ x1: '', x2: '', x3: '', x4: '', end: '' });
    setParamhpt4_3({ x1: '', x2: '', x3: '', x4: '', end: '' });
    setParamhpt4_4({ x1: '', x2: '', x3: '', x4: '', end: '' });
    setParamPtb2({ a: '', b: '', c: '' });
    setParamPtb3({ a: '', b: '', c: '', d: '' });
    setParamVector_1({ a: '', b: '', c: '' });
    setParamVector_2({ a: '', b: '', c: '' });
    setParamMt2_a_1({ a: '', b: '' });
    setParamMt2_a_2({ a: '', b: '' });
    setParamMt2_b_1({ a: '', b: '' });
    setParamMt2_b_2({ a: '', b: '' });
    setParamMt3_a_1({ a: '', b: '', c: "" });
    setParamMt3_a_2({ a: '', b: '', c: "" });
    setParamMt3_a_3({ a: '', b: '', c: "" });
    setParamMt3_b_1({ a: '', b: '', c: "" });
    setParamMt3_b_2({ a: '', b: '', c: "" });
    setParamMt3_b_3({ a: '', b: '', c: "" });
    setParamMt4_a_1({ a: '', b: '', c: "", d: "" });
    setParamMt4_a_2({ a: '', b: '', c: "", d: "" });
    setParamMt4_a_3({ a: '', b: '', c: "", d: "" });
    setParamMt4_a_4({ a: '', b: '', c: "", d: "" });
    setParamMt4_b_1({ a: '', b: '', c: "", d: "" });
    setParamMt4_b_2({ a: '', b: '', c: "", d: "" });
    setParamMt4_b_3({ a: '', b: '', c: "", d: "" });
    setParamMt4_b_4({ a: '', b: '', c: "", d: "" });
    setParamTp({ ct: '', cd: '', func: '' });
    setParamCalculator("");
    setParamCalVT("")
    setRet('0.000');
  }

  const clean_check = async () => {
    clean_param()
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

  // next left
  const NextLeft = async () => {
    if (index_cursor > 0) {
      var text = text_index
      if (check_enter) {
        setCheckEnter(false)
      }
      if (text.charAt(index_cursor - 1) === "(" && text.charAt(index_cursor - 2) === "/") {
        await setIndexCursor(index_cursor - 3);
      }
      else if (text.charAt(index_cursor - 1) === "(" && text.charAt(index_cursor - 2) === ")") {
        await setIndexCursor(index_cursor - 2);
      }
      else if (text.charAt(index_cursor - 1) === "(" && text.charAt(index_cursor - 2) === "t") {
        await setIndexCursor(index_cursor - 5);
      }
      else if (text.charAt(index_cursor - 1) === "(" && text.charAt(index_cursor - 2) === "R") {
        await setIndexCursor(index_cursor - 2);
      }
      else {
        await setIndexCursor(index_cursor - 1);

      }
    }
  };


  const NextRight = async () => {
    // phải giới hạn lần next
    var max_next = text_index.length
    var text = text_index
    if (check_enter) {
      setCheckEnter(false)
    }
    if (index_cursor < max_next) {
      if (text.charAt(index_cursor) === ")" && text.charAt(index_cursor + 1) === "(") {
        await setIndexCursor(index_cursor + 2);
      }
      else if (text.charAt(index_cursor) === "R" && text.charAt(index_cursor + 1) === "(") {
        await setIndexCursor(index_cursor + 2);
      }
      else {
        await setIndexCursor(index_cursor + 1);
      }
    }
  };

  //return ket qua
  const Enter = async () => {
    await setRad(true)
    try {
      if (check_tp) {
        var func_cv = '';
        func_cv = math.simplify(Convert(param_tp.func)).toString();
        if (func_cv.search('x') < 0) {
          setRet('Null');
        } else {
          var func_integral = Algebrite.eval(
            'integral(' + func_cv + ')',
          ).toString();
          var value_ct = math.evaluate(func_integral, {
            x: math.evaluate(
              Convert(param_tp.ct),
            ),
          });
          var value_cd = math.evaluate(func_integral, {
            x: math.evaluate(
              Convert(param_tp.cd),
            ),
          });
          // var _value = math.evaluate(string_func.replace(/π/g, 'pi'));
          setRet(Traction(math.evaluate(value_ct - value_cd)));
        }
      }

      //Hệ phương trình
      else if (check_hpt_2) {
        const a = [
          [math.evaluate(Convert(param_hpt2_1.x1)), math.evaluate(Convert(param_hpt2_1.x2))],
          [math.evaluate(Convert(param_hpt2_2.x1)), math.evaluate(Convert(param_hpt2_2.x2))],
        ];
        const b = [math.evaluate(Convert(param_hpt2_1.end)), math.evaluate(Convert(param_hpt2_2.end))];
        var value = equations_2_hidden(a, b, math);
        setRet(
          'x1 = ' + value[0] + ' ; x2 = ' + value[1],
        );
      } else if (check_hpt_3) {
        const a = [
          [
            math.evaluate(Convert(param_hpt3_1.x1)),
            math.evaluate(Convert(param_hpt3_1.x2)),
            math.evaluate(Convert(param_hpt3_1.x3)),
          ],
          [
            math.evaluate(Convert(param_hpt3_2.x1)),
            math.evaluate(Convert(param_hpt3_2.x2)),
            math.evaluate(Convert(param_hpt3_2.x3)),
          ],
          [
            math.evaluate(Convert(param_hpt3_3.x1)),
            math.evaluate(Convert(param_hpt3_3.x2)),
            math.evaluate(Convert(param_hpt3_3.x3)),
          ],
        ];
        const b = [
          math.evaluate(Convert(param_hpt3_1.end)),
          math.evaluate(Convert(param_hpt3_2.end)),
          math.evaluate(Convert(param_hpt3_3.end)),
        ];
        var value = equations_2_hidden(a, b, math);
        setRet(
          'x1 = ' +
          value[0] +
          ' ; x2 = ' +
          value[1] +
          ' ; x3 = ' +
          value[2],
        );
      } else if (check_hpt_4) {
        const a = [
          [
            math.evaluate(Convert(param_hpt4_1.x1)),
            math.evaluate(Convert(param_hpt4_1.x2)),
            math.evaluate(Convert(param_hpt4_1.x3)),
            math.evaluate(Convert(param_hpt4_1.x4)),
          ],
          [
            math.evaluate(Convert(param_hpt4_2.x1)),
            math.evaluate(Convert(param_hpt4_2.x2)),
            math.evaluate(Convert(param_hpt4_2.x3)),
            math.evaluate(Convert(param_hpt4_2.x4)),
          ],
          [
            math.evaluate(Convert(param_hpt4_3.x1)),
            math.evaluate(Convert(param_hpt4_3.x2)),
            math.evaluate(Convert(param_hpt4_3.x3)),
            math.evaluate(Convert(param_hpt4_3.x4)),
          ],
          [
            math.evaluate(Convert(param_hpt4_4.x1)),
            math.evaluate(Convert(param_hpt4_4.x2)),
            math.evaluate(Convert(param_hpt4_4.x3)),
            math.evaluate(Convert(param_hpt4_4.x4)),
          ],
        ];
        const b = [
          math.evaluate(Convert(param_hpt4_1.end)),
          math.evaluate(Convert(param_hpt4_2.end)),
          math.evaluate(Convert(param_hpt4_3.end)),
          math.evaluate(Convert(param_hpt4_4.end)),
        ];
        var value = equations_2_hidden(a, b, math);
        setRet(
          'x1 = ' +
          value[0] +
          ' ; x2 = ' +
          value[1] +
          ' ; x3 = ' +
          value[2] +
          ' ; x4 = ' +
          value[3],
        );
      }
      // UCLN, BCNN
      else if (check_ucln_2) {
        var value = math_ucln_2(
          math.evaluate(Convert(param_ucln_1)),
          math.evaluate(Convert(param_ucln_2)),
          math,
        );

        setRet(value);
      } else if (check_ucln_3) {
        var value = math_ucln_3(
          math.evaluate(Convert(param_ucln_1)),
          math.evaluate(Convert(param_ucln_2)),
          math.evaluate(Convert(param_ucln_3)),
          math,
        );

        setRet(value);
      } else if (check_bcnn_2) {
        var value = math_bcnn_2(
          math.evaluate(Convert(param_bcnn_1)),
          math.evaluate(Convert(param_bcnn_2)),
          math,
        );

        setRet(value);
      } else if (check_bcnn_3) {
        var value = math_bcnn_3(
          math.evaluate(Convert(param_bcnn_1)),
          math.evaluate(Convert(param_bcnn_2)),
          math.evaluate(Convert(param_bcnn_3)),
          math,
        );

        setRet(value);
      }

      // Giải phương trình
      else if (check_ptb_2) {
        var value = solveCubic(
          0,
          math.evaluate(Convert(param_ptb2.a)),
          math.evaluate(Convert(param_ptb2.b)),
          math.evaluate(Convert(param_ptb2.c)),
        );
        if (value.length == 0) {
          setRet('Vô nghiệm');
        } else {
          let cv_value = []
          math.sort(value).map(val => {
            cv_value.push(Traction(val))
          })

          setRet('S = {' + cv_value.join(' ; ') + '}');
        }
      } else if (check_ptb_3) {
        var value = solveCubic(
          math.evaluate(Convert(param_ptb3.a)),
          math.evaluate(Convert(param_ptb3.b)),
          math.evaluate(Convert(param_ptb3.c)),
          math.evaluate(Convert(param_ptb3.d))
        );
        if (value.length == 0) {
          setRet('Vô nghiệm');
        } else {
          let cv_value = []
          math.sort(value).map(val => {
            cv_value.push(Traction(val))
          })

          setRet('S = {' + cv_value.join(' ; ') + '}');
        }
      } else if (check_vt) {
        const a = [
          math.evaluate(Convert(param_vector_1.a)),
          math.evaluate(Convert(param_vector_1.b)),
          math.evaluate(Convert(param_vector_1.c)),
        ];
        const b = [
          math.evaluate(Convert(param_vector_2.a)),
          math.evaluate(Convert(param_vector_2.b)),
          math.evaluate(Convert(param_vector_2.c)),
        ];

        var value = math_cross(a, b, math);

        setRet('(' + value.join(' ; ') + ')');
      }
      // ma trận
      else if (check_mt_2 || check_mt_3 || check_mt_4) {
        let A = [[]];
        let B = [[]];

        if (check_mt_2) {
          A = [
            [math.evaluate(Convert(param_mt2_a_1.a)), math.evaluate(Convert(param_mt2_a_1.b))],
            [math.evaluate(Convert(param_mt2_a_2.a)), math.evaluate(Convert(param_mt2_a_2.b))],
          ];
          B = [
            [math.evaluate(Convert(param_mt2_b_1.a)), math.evaluate(Convert(param_mt2_b_1.b))],
            [math.evaluate(Convert(param_mt2_b_2.a)), math.evaluate(Convert(param_mt2_b_2.b))],
          ];
        } else if (check_mt_3) {
          A = [
            [
              math.evaluate(Convert(param_mt3_a_1.a)),
              math.evaluate(Convert(param_mt3_a_1.b)),
              math.evaluate(Convert(param_mt3_a_1.c)),
            ],
            [
              math.evaluate(Convert(param_mt3_a_2.a)),
              math.evaluate(Convert(param_mt3_a_2.b)),
              math.evaluate(Convert(param_mt3_a_2.c)),
            ],
            [
              math.evaluate(Convert(param_mt3_a_3.a)),
              math.evaluate(Convert(param_mt3_a_3.b)),
              math.evaluate(Convert(param_mt3_a_3.c)),
            ],
          ];

          B = [
            [
              math.evaluate(Convert(param_mt3_b_1.a)),
              math.evaluate(Convert(param_mt3_b_1.b)),
              math.evaluate(Convert(param_mt3_b_1.c)),
            ],
            [
              math.evaluate(Convert(param_mt3_b_2.a)),
              math.evaluate(Convert(param_mt3_b_2.b)),
              math.evaluate(Convert(param_mt3_b_2.c)),
            ],
            [
              math.evaluate(Convert(param_mt3_b_3.a)),
              math.evaluate(Convert(param_mt3_b_3.b)),
              math.evaluate(Convert(param_mt3_b_3.c)),
            ],
          ];
        } else if (check_mt_4) {
          A = [
            [
              math.evaluate(Convert(param_mt4_a_1.a)),
              math.evaluate(Convert(param_mt4_a_1.b)),
              math.evaluate(Convert(param_mt4_a_1.c)),
              math.evaluate(Convert(param_mt4_a_1.d)),
            ],
            [
              math.evaluate(Convert(param_mt4_a_2.a)),
              math.evaluate(Convert(param_mt4_a_2.b)),
              math.evaluate(Convert(param_mt4_a_2.c)),
              math.evaluate(Convert(param_mt4_a_2.d)),
            ],
            [
              math.evaluate(Convert(param_mt4_a_3.a)),
              math.evaluate(Convert(param_mt4_a_3.b)),
              math.evaluate(Convert(param_mt4_a_3.c)),
              math.evaluate(Convert(param_mt4_a_3.d)),
            ],
            [
              math.evaluate(Convert(param_mt4_a_4.a)),
              math.evaluate(Convert(param_mt4_a_4.b)),
              math.evaluate(Convert(param_mt4_a_4.c)),
              math.evaluate(Convert(param_mt4_a_4.d)),
            ],
          ];

          B = [
            [
              math.evaluate(Convert(param_mt4_b_1.a)),
              math.evaluate(Convert(param_mt4_b_1.b)),
              math.evaluate(Convert(param_mt4_b_1.c)),
              math.evaluate(Convert(param_mt4_b_1.d)),
            ],
            [
              math.evaluate(Convert(param_mt4_b_2.a)),
              math.evaluate(Convert(param_mt4_b_2.b)),
              math.evaluate(Convert(param_mt4_b_2.c)),
              math.evaluate(Convert(param_mt4_b_2.d)),
            ],
            [
              math.evaluate(Convert(param_mt4_b_3.a)),
              math.evaluate(Convert(param_mt4_b_3.b)),
              math.evaluate(Convert(param_mt4_b_3.c)),
              math.evaluate(Convert(param_mt4_b_3.d)),
            ],
            [
              math.evaluate(Convert(param_mt4_b_4.a)),
              math.evaluate(Convert(param_mt4_b_4.b)),
              math.evaluate(Convert(param_mt4_b_4.c)),
              math.evaluate(Convert(param_mt4_b_4.d)),
            ],
          ];
        }
        if (param_cal_vt.indexOf('+') > -1) {
          var string_value = '';
          math.add(A, B).map(value => {
            string_value = string_value + '[ ' + value + ' ] ';
          });

          setRet('[ ' + string_value + ']');
        }
        else if (param_cal_vt.indexOf('-') > -1) {
          var string_value = '';
          math.subtract(A, B).map(value => {
            string_value = string_value + '[ ' + value + ' ] ';
          });

          setRet('[ ' + string_value + ']');
        }
        else if (param_cal_vt.indexOf('×') > -1) {
          var string_value = '';
          math.multiply(A, B).map(value => {
            string_value = string_value + '[ ' + value + ' ] ';
          });
          setRet('[ ' + string_value + ']');
        }
      } else if (_ret()) {
        var string_value = param_calculator;
        var count_right = (string_value.match(/\(/g) || []).length;
        var count_left = (string_value.match(/\)/g) || []).length;

        if (count_right > count_left) {
          string_value = string_value + ')';
        }
        // await addCalculator(string_value);
        // await addCountIndex(string_value.length);

        string_value = string_value
          .replace(/π/g, 'pi')
          .replace(/˚/g, '/180 *pi')

        var value = math.evaluate(Convert(string_value));
        if (typeof value == "object") {
          if (value["im"]) {
            var _varlue = value["re"] + " + " + value["im"] + " i"
            await setRet(_varlue);
          }
        }
        else {
          await setRet(Traction(value));
          await setANS(value);
        }
        await setCheckEnter(true);
      }
    } catch (e) {
      await setRet("Null");
      await setCheckEnter(true);
    }
  };


  const handleGesture = async evt => {
    const { absoluteX, absoluteY } = evt.nativeEvent;
    var var_X = math.round(absoluteX, 0);

    if (var_X % 2 == 0 && var_X / 2 != var_x) {
      setCursor(true);
      if (var_X > x_old) {
        await NextRight();
      } else {
        await NextLeft();
      }
      await setVarX(var_X / 2);
    }
    await setX(var_X);
  };

  const _onHandlerStateChange = async evt => {
    setCursor(false);
  };
  
  const deg_rad = async () => {

    if ((ret.toString().search("i") < 0) && (param_calculator.search("asin") > -1 || param_calculator.search("acos") > -1 || param_calculator.search("atan") > -1) || param_calculator.charAt(index_cursor - 1) === "˚") {
      var set_rad = !rad
      if (set_rad == false) {
        await setRet(math.round(math.evaluate(ret + "*180/pi"), 13))
        await setRetBack(ret)
      }
      else {
        await setRet(ret_back)
      }
      await setRad(!rad)
    }
    else {
      Alert.alert(
        "Chú ý",
        "Chỉ sử dụng khi tính arcsin, arccos, arctan và chuyển đổi độ (˚) sang rad",
        [
          { text: "OK" }
        ]
      )
    }
  }

  const _ret = () => {
    return (
      !check_ucln_2 &&
      !check_ucln_3 &&
      !check_bcnn_2 &&
      !check_bcnn_3 &&
      !check_hpt_2 &&
      !check_hpt_3 &&
      !check_hpt_4 &&
      !check_tp &&
      !check_mt_2 &&
      !check_mt_3 &&
      !check_mt_4 &&
      !check_ptb_2 &&
      !check_ptb_3 &&
      !check_vt
    );
  };

  return (
    <MenuProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: '#202020',
          justifyContent: 'flex-end',
        }}>
        <View style={{
          marginRight: 0,
          marginLeft: _width - 100,
        }}>
          <Text style={{ color: "#FFFFFF" }}>{rad ? "[RAD]" : "[DEG]"}</Text>
        </View>
        <PanGestureHandler
          onHandlerStateChange={_onHandlerStateChange}
          onGestureEvent={handleGesture}
          activeOffsetX={[0, 0]}>
          <ScrollView style={styles_show.input}>
            {check_ucln_2 && <UclnTwo param_ucln_1={param_ucln_1} param_ucln_2={param_ucln_2} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_ucln_3 && <UclnThree param_ucln_1={param_ucln_1} param_ucln_2={param_ucln_2} param_ucln_3={param_ucln_3} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_bcnn_2 && <BcnnTwo param_bcnn_1={param_bcnn_1} param_bcnn_2={param_bcnn_2} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_bcnn_3 && <BcnnThree param_bcnn_1={param_bcnn_1} param_bcnn_2={param_bcnn_2} param_bcnn_3={param_bcnn_3} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_hpt_2 && <HptTwo param_hpt2_1={param_hpt2_1} param_hpt2_2={param_hpt2_2} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_hpt_3 && <HptThree param_hpt3_1={param_hpt3_1} param_hpt3_2={param_hpt3_2} param_hpt3_3={param_hpt3_3} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_hpt_4 && <HptFour param_hpt4_1={param_hpt4_1} param_hpt4_2={param_hpt4_2} param_hpt4_3={param_hpt4_3} param_hpt4_4={param_hpt4_4} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_ptb_2 && <PtbTwo param_ptb2={param_ptb2} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_ptb_3 && <PtbThree param_ptb3={param_ptb3} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_vt && <Vector param_vector_1={param_vector_1} param_vector_2={param_vector_2} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_mt_2 && <MtbTwo param_cal_vt={param_cal_vt} param_mt2_a_1={param_mt2_a_1} param_mt2_a_2={param_mt2_a_2} param_mt2_b_1={param_mt2_b_1} param_mt2_b_2={param_mt2_b_2} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_mt_3 && <MtbThree param_cal_vt={param_cal_vt} param_mt3_a_1={param_mt3_a_1} param_mt3_a_2={param_mt3_a_2} param_mt3_a_3={param_mt3_a_3} param_mt3_b_1={param_mt3_b_1} param_mt3_b_2={param_mt3_b_2} param_mt3_b_3={param_mt3_b_3} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_mt_4 && <MtbFour param_cal_vt={param_cal_vt} param_mt4_a_1={param_mt4_a_1} param_mt4_a_2={param_mt4_a_2} param_mt4_a_3={param_mt4_a_3} param_mt4_a_4={param_mt4_a_4} param_mt4_b_1={param_mt4_b_1} param_mt4_b_2={param_mt4_b_2} param_mt4_b_3={param_mt4_b_3} param_mt4_b_4={param_mt4_b_4} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {check_tp && <TichPhan param_tp={param_tp} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            {_ret() && <Calculator param_calculator={param_calculator} index_cursor={index_cursor} ParamCallback={Callback} props_cursor={cursor} />}
            <View>
            </View>
          </ScrollView>
        </PanGestureHandler>
        <View style={{ marginBottom: 0, margin: "auto" }}>
          <View style={styles.bottom}>
            <Text
              style={{
                textAlign: 'right',
                fontSize: 20,
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}>
              {ret}
            </Text>
          </View>
          <View >
            <KeyBoard setScreen={props.setScreen} deg_rad={deg_rad} keyboard={CallbackInput} function={CallbackFunction} CallbackRemove={CallbackRemove} AcPress={AC} enter={Enter} />
          </View>
        </View>
      </View>
    </MenuProvider>
  );
};

export default Dashboard;


const styles_show = StyleSheet.create({

  input: {
    flex: 1,
    margin: 0,
    borderWidth: 1,
    borderRadius: 10,
    height: 400,
    maxHeight: 400,
    maxHeight: 400,
    textAlignVertical: 'top',
    backgroundColor: '#b3ae7e',
    fontSize: 20,
    marginTop: 2,
  }
});
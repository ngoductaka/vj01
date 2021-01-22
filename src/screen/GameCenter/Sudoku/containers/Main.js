'use strict';

import { Header, Icon } from 'native-base';
import React, { Component } from 'react';
import ModalBox from 'react-native-modalbox';

import {
  LayoutAnimation,
  StyleSheet,
  AppState,
  Platform,
  Alert,
  Modal,
  Image,
  View,
  Text,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { get } from 'lodash';
import { avatarIndex, COLOR } from '../../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../../utils/fonts';

import {
  Size,
  CellSize,
  BoardWidth,

  Board,
  Timer,
  Touchable,
} from '../components';
import {
  Store,
  sudoku,
} from '../utils';
import LinearGradient from 'react-native-linear-gradient';
import { connect, useSelector } from 'react-redux';

const formatTime = Timer.formatTime;

class Main extends Component {
  state = {
    puzzle: null,
    playing: false,
    initing: false,
    editing: false,
    fetching: false,
    showModal: false,
    showRecord: false,
    showOnline: false,
    showGuide: false
  }
  puzzle = null
  solve = null
  error = 0
  elapsed = null
  fromStore = false
  records = []
  granted = false
  nextPuzzle = null

  handeleAppStateChange = (currentAppState) => {
    if (currentAppState != 'active') this.onShowModal();
  }

  async componentDidMount() {
    AppState.addEventListener('change', this.handeleAppStateChange);
    this.records = await Store.get('records') || [];
    const puzzle = await Store.get('puzzle');
    if (puzzle) {
      this.puzzle = puzzle.slice();
      this.fromStore = true;
      this.solve = await Store.get('solve');
      this.error = await Store.get('error') || 0;
      this.elapsed = await Store.get('elapsed');
    }
    this.setState({
      showModal: true,
    }, () => {
      this.nextPuzzle = sudoku.makepuzzle();
    });
    this.granted = await Store.get('granted');
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handeleAppStateChange);
  }

  render() {
    const { puzzle, playing, initing, editing, showModal, showRecord, showOnline, fetching } = this.state;
    const disabled = !playing && !this.fromStore;
    if (puzzle && !this.solve) this.solve = puzzle.slice();
    let height = 0;
    if (showRecord) {
      height = CellSize / 3 + CellSize * (this.records.length + 1);
    }
    let onlineHeight = 0;
    if (showOnline) {
      onlineHeight = CellSize / 3 + CellSize * (this.scores.length + 1);
    }
    return (
      <View style={styles.container} >
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <View style={{ flex: 1, backgroundColor: '#6A4E6A' }} />
          <View style={{ flex: 1.8, backgroundColor: '#9D5E75' }} />
        </View>
        <SafeAreaView style={{ flex: 1 }}>
          <Header style={styles.header}>
            <View style={{ width: 56, height: 56, borderWidth: 6, borderColor: '#663059', borderRadius: 50, overflow: 'hidden', backgroundColor: COLOR.white(1) }}>
              <Image
                source={avatarIndex[this.props.avatar_id || 0].img}
                style={{ flex: 1, width: null, height: null, resizeMode: 'contain', padding: 3 }}
              />
            </View>
            <Pressable disabled={initing} style={{ backgroundColor: initing ? '#B8858C' : '#9D5E75', width: 44, height: 44, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }} onPress={this.onShowModal} >
              <Icon name='close' type='AntDesign' style={[styles.icon, initing && styles.disabled]} />
            </Pressable>
          </Header>
          <View style={{ flex: 1, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingVertical: 45 }}>
              <View style={{}}>
                <View style={{ paddingVertical: 8, backgroundColor: '#B593B7', borderRadius: 30, alignSelf: 'baseline', width: 100, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: COLOR.white(1), fontSize: 17, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Lỗi: {this.error}</Text>
                </View>
              </View>
              <Timer ref={ref => this.timer = ref} style={styles.timer} disabledStyle={styles.disabled} />
              <Pressable style={{ paddingVertical: 9, backgroundColor: '#B593B7', borderRadius: 30, alignSelf: 'baseline', width: 100, justifyContent: 'center', alignItems: 'center' }} disabled={!playing} onPress={this.onToggleEditing} >
                <Icon name='edit' type='Feather' style={[styles.icon, editing && { color: '#118ab2' }, !playing && styles.disabled]} />
              </Pressable>
            </View>
            <Board puzzle={puzzle} solve={this.solve} editing={editing}
              onInit={this.onInit} onErrorMove={this.onErrorMove} onFinish={this.onFinish} />
          </View>
          <Modal animationType='slide' visible={showModal} transparent={true} onRequestClose={this.onCloseModal} >
            <View style={styles.modal} >
              <LinearGradient style={{ flex: 1 }} colors={['#6C4F6A', '#9B5D74']} >
                <SafeAreaView style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 20 }}>
                    <View style={{ backgroundColor: '#663059', paddingTop: 4, paddingBottom: 6, marginLeft: 35, borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
                      <Text style={{ color: COLOR.white(1), paddingLeft: 28, paddingRight: 15, ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 16 }}>{this.props.name}</Text>
                    </View>
                    <View style={{ position: 'absolute', left: 0, alignSelf: 'center', width: 56, height: 56, borderWidth: 6, borderColor: '#663059', borderRadius: 50, overflow: 'hidden', backgroundColor: COLOR.white(1) }}>
                      <Image
                        source={avatarIndex[this.props.avatar_id || 0].img}
                        style={{ flex: 1, width: null, height: null, resizeMode: 'contain', padding: 3 }}
                      />
                    </View>
                  </View>
                  <View style={[styles.modalContainer, { marginTop: showOnline ? -onlineHeight : 0 }]} >
                    <Text style={{ textAlign: 'center', color: COLOR.white(1), fontSize: 40, marginBottom: 80, letterSpacing: 8, ...fontMaker({ weight: fontStyles.SemiBold }) }}>SUDOKU</Text>
                    <Pressable disabled={disabled} style={{ width: 320, alignSelf: 'center' }} onPress={this.onResume} >
                      <View style={{ height: 20, width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: '#A33C4E', position: 'absolute', bottom: -5 }} />
                      <View style={styles.button}>
                        <View style={{ backgroundColor: '#C7445A', justifyContent: 'center', alignItems: 'center', padding: 12, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                          <Icon name='play' type='Feather' style={[styles.buttonIcon, disabled && styles.disabled]} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.buttonText, disabled && styles.disabled]}>TIẾP TỤC</Text>
                        </View>
                      </View>
                    </Pressable>

                    {/* play again  */}
                    <Pressable onPress={this.onClear} disabled={disabled} style={{ width: 320, alignSelf: 'center', marginTop: 25 }}>
                      <View style={{ height: 20, width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: '#31799E', position: 'absolute', bottom: -5 }} />
                      <View style={[styles.button, { backgroundColor: '#469DC8' }]}>
                        <View style={{ backgroundColor: '#39AFE9', justifyContent: 'center', alignItems: 'center', padding: 12, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                          <Icon name='replay' type='MaterialIcons' style={[styles.buttonIcon, disabled && styles.disabled]} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.buttonText, disabled && styles.disabled]} >CHƠI LẠI</Text>
                        </View>
                      </View>
                    </Pressable>

                    {/* new game */}
                    <Pressable onPress={this.onCreate} disabled={disabled} style={{ width: 320, alignSelf: 'center', marginTop: 25 }}>
                      <View style={{ height: 20, width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: '#B5903C', position: 'absolute', bottom: -5 }} />
                      <View style={[styles.button, { backgroundColor: '#F2C960' }]}>
                        <View style={{ backgroundColor: '#CAAB56', justifyContent: 'center', alignItems: 'center', padding: 12, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                          <Icon name='shuffle' type='Ionicons' style={[styles.buttonIcon, disabled && styles.disabled]} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.buttonText, disabled && styles.disabled]} >TRÒ CHƠI MỚI</Text>
                        </View>
                      </View>
                    </Pressable>

                    {/* guide */}
                    <Pressable onPress={() => {
                      this.setState({ showModal: false });
                      this.props.navigation.navigate('SudokuInstruction', { callback: () => this.setState({ showModal: true }) });
                    }} style={{ width: 320, alignSelf: 'center', marginTop: 25 }} >
                      <View style={{ height: 20, width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: '#D58843', position: 'absolute', bottom: -5 }} />
                      <View style={[styles.button, { backgroundColor: '#F59331' }]}>
                        <View style={{ backgroundColor: '#D58843', justifyContent: 'center', alignItems: 'center', padding: 12, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                          <Icon name='information' type='Ionicons' style={[styles.buttonIcon, disabled && styles.disabled]} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.buttonText, disabled && styles.disabled]} >HƯỚNG DẪN</Text>
                        </View>
                      </View>
                    </Pressable>

                    {/* exit game */}
                    <Pressable onPress={() => this.props.navigation.goBack()} disabled={disabled} style={{ width: 320, alignSelf: 'center', marginTop: 25 }} >
                      <View style={{ height: 20, width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: '#6D5E61', position: 'absolute', bottom: -5 }} />
                      <View style={[styles.button, { backgroundColor: '#94918A' }]}>
                        <View style={{ backgroundColor: '#77746D', justifyContent: 'center', alignItems: 'center', padding: 12, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                          <Icon name='ios-exit-outline' type='Ionicons' style={[styles.buttonIcon, disabled && styles.disabled]} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.buttonText, disabled && styles.disabled]} >THOÁT TRÒ CHƠI</Text>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                </SafeAreaView>
              </LinearGradient>
            </View>
          </Modal>
        </SafeAreaView>
        {/* <ModalBox
          isOpen={this.state.showGuide}
          backdropPressToClose={true}
          swipeToClose={true}
          style={{ width: 320, height: null, borderRadius: 8, overflow: 'hidden', padding: 30 }}
          onClosed={() => this.setState({ showGuide: false })}
          position='center'
        >
          <Text style={{ textAlign: 'center', fontSize: 20, color: COLOR.MAIN, ...fontMaker({ weight: fontStyles.Bold }) }}>Hướng dẫn</Text>
          <Text style={{ fontSize: 16, textAlign: 'center', lineHeight: 24, marginTop: 10, ...fontMaker({ weight: fontStyles.Regular }) }}>Hãy cố gắng dùng những phím di chuyển để có thể điều hướng đoàn tàu của bạn có thể thu hoạch được nhiều chiến lợi phẩm tốt nhất nhé</Text>
          <Pressable onPress={() => this.setState({ showGuide: false })} style={{ alignSelf: 'center', marginTop: 20, paddingHorizontal: 40, paddingVertical: 12, backgroundColor: COLOR.MAIN_GREEN, borderRadius: 30 }}>
            <Text style={{ color: COLOR.white(1), fontSize: 17, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Đã hiểu</Text>
          </Pressable>
        </ModalBox> */}
      </View >
    );
  }

  onInit = () => {
    this.setState({
      initing: false,
      playing: true,
      showModal: false,
      showRecord: false,
      showOnline: false,
    }, () => {
      this.timer.start();
    });
  }

  onErrorMove = () => {
    this.error++;
    const message = this.error > 3 ? 'Bạn đã thua vì có 3 lần điền sai số' : ` Bạn đã sai ${this.error} lần, bạn sẽ thua cuộc nếu sai quá 3 lần`;
    Alert.alert('Đã hết nước đi', message, [
      { text: 'OK' },
      { text: 'Chơi lại', onPress: this.onCreate },
    ]);
  }

  onFinish = () => {
    this.setState({
      playing: false,
    });
    Store.multiRemove('puzzle', 'solve', 'error', 'elapsed');
    this.elapsed = null;
    this.solve = null;
    this.fromStore = false;
    const elapsed = this.timer.stop();
    if (this.error > 3) {
      setTimeout(() => {
        Alert.alert('Chúc mừng', 'Bạn đã chiến thắng trong' + formatTime(elapsed), [
          { text: 'Đồng ý' },
          { text: 'Chơi lại', onPress: this.onCreate },
        ]);
      }, 2000);
      return;
    }
    if (!this.records.includes(elapsed)) {
      this.records.push(elapsed);
      this.records.sort((a, b) => a - b);
      this.records = this.records.slice(0, 5);
      Store.set('records', this.records);
    }
    const length = this.records.length;
    const newRecord = elapsed == this.records[0] && this.records.length > 1;
    setTimeout(() => {
      Alert.alert('Chúc mừng', (newRecord ? 'Kỷ lục mới! Bạn đã giành chiến thắng trong' : 'Bạn đã giành chiến thắng trong') + formatTime(elapsed), [
        { text: 'Đồng ý' },
        { text: 'Chơi lại', onPress: this.onCreate },
      ]);
    }, 2000);
  }

  onToggleEditing = () => {
    this.setState({
      editing: !this.state.editing,
    });
  }

  onResume = () => {
    if (this.fromStore) {
      this.timer.setElapsed(this.elapsed);
      this.setState({
        puzzle: this.puzzle,
        initing: true,
        showModal: false,
        showRecord: false,
      });
      this.fromStore = false;
      return;
    }
    this.timer.resume();
    this.setState({
      showModal: false,
      showRecord: false,
    });
  }

  onClear = () => {
    this.elapsed = null;
    this.error = 0;
    this.solve = null;
    this.fromStore = false;
    this.timer.reset();
    Store.multiRemove('solve', 'error', 'elapsed');

    this.setState({
      puzzle: this.puzzle.slice(),
      initing: true,
      editing: false,
      playing: false,
      showModal: false,
      showRecord: false,
      showOnline: false,
    });
  }

  onCreate = () => {
    this.elapsed = null;
    this.error = 0;
    this.solve = null;
    this.fromStore = false;
    this.timer.reset();
    let puzzle;
    if (this.nextPuzzle) {
      puzzle = this.nextPuzzle.slice();
      this.nextPuzzle = null;
    } else {
      puzzle = sudoku.makepuzzle();
    }
    this.setState({
      puzzle,
      initing: true,
      editing: false,
      playing: false,
      showModal: false,
      showRecord: false,
      showOnline: false,
    }, async () => {
      await Store.multiRemove('puzzle', 'solve', 'error', 'elapsed');
      this.puzzle = puzzle.slice();
      Store.set('puzzle', this.puzzle);
    });
  }

  onToggleRecord = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      showOnline: this.state.showRecord ? false : this.state.showOnline,
      showRecord: !this.state.showRecord,
    });
  }

  onShowModal = () => {
    if (!this.state.initing) {
      if (this.solve) Store.set('solve', this.solve);
      if (this.error) Store.set('error', this.error);
      this.elapsed = this.timer.pause();
      if (this.elapsed) Store.set('elapsed', this.elapsed);
    }
    this.setState({
      showModal: true,
      showRecord: false,
    }, () => {
      if (!this.nextPuzzle) this.nextPuzzle = sudoku.makepuzzle();
    });
  }

  onCloseModal = () => {
    this.timer.resume();
    this.setState({
      showRecord: false,
      showOnline: false,
    }, () => {
      requestAnimationFrame(() => {
        this.setState({
          showModal: false,
        });
      });
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'cadetblue',
    paddingBottom: CellSize,
  },
  header: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    elevation: 0,
    borderBottomColor: 'transparent'
  },
  icon: {
    fontSize: 22,
    color: COLOR.white(1)
  },
  timer: {
    fontSize: 22,
    alignSelf: 'center',
    color: '#fff',
    opacity: 1,
  },
  modal: {
    flex: 1,
    // backgroundColor: 'teal',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  editing: {
    tintColor: 'khaki',
    opacity: 1,
  },
  title: {
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: CellSize,
    color: '#fff',
  },
  about: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: CellSize / 2,
    color: '#fff',
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    // padding: Size.height > 500 ? 20 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#EE4F68',
    width: 320,
    borderRadius: 8
  },
  buttonIcon: {
    fontSize: 26,
    color: '#fff',
    ...fontMaker({ weight: fontStyles.Regular })
  },
  buttonText: {
    marginLeft: 50,
    color: '#fff',
    fontSize: 18,
    ...fontMaker({ weight: fontStyles.SemiBold })
    // fontFamily: 'Menlo',
  },
  record: {
    backgroundColor: 'cadetblue',
    paddingVertical: CellSize / 6,
    borderColor: 'darkcyan',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  recordText: {
    height: CellSize * 4 / 6,
    marginVertical: CellSize / 6,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Menlo',
    fontSize: CellSize * 2 / 4,
    lineHeight: Platform.OS == 'android' ? Math.floor(CellSize * 4 / 6) : CellSize * 4 / 6,
  },
  highlightText: {
    color: 'khaki',
  },
  triangle: {
    position: 'absolute',
    left: Size.width / 2 - CellSize / 3 / 2,
    top: -CellSize / 3 / 2,
    width: CellSize / 3,
    height: CellSize / 3,
    backgroundColor: 'teal',
    borderColor: 'darkcyan',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    transform: [{
      rotate: '45deg',
    }],
  },
});

const mapStateToProps = (state) => {
  return {
    avatar_id: get(state, 'userInfo.user.avatar_id', 0),
    name: get(state, 'userInfo.user.name', '')
  };
}

export default connect(mapStateToProps, {})(Main);

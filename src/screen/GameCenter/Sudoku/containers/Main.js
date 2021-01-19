'use strict';

import { Icon } from 'native-base';
import React, { Component } from 'react';

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
} from 'react-native';
import { COLOR } from '../../../../handle/Constant';

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
        <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={styles.header} >
            <Touchable disabled={initing} onPress={this.onShowModal} >
              <Icon name='menu' type='Feather' style={[styles.icon, initing && styles.disabled]} />
            </Touchable>
            <Timer ref={ref => this.timer = ref} style={styles.timer} disabledStyle={styles.disabled} />
            <Touchable disabled={!playing} onPress={this.onToggleEditing} >
              <Icon name='edit' type='Feather' style={[styles.icon, editing && { tintColor: 'khaki' }, !playing && styles.disabled]} />
            </Touchable>
          </View>
          <Board puzzle={puzzle} solve={this.solve} editing={editing}
            onInit={this.onInit} onErrorMove={this.onErrorMove} onFinish={this.onFinish} />
          <View />
          <Modal animationType='slide' visible={showModal} transparent={true} onRequestClose={this.onCloseModal} >
            <View style={styles.modal} >
              <View style={[styles.modalContainer, { marginTop: showOnline ? -onlineHeight : 0 }]} >
                <Touchable disabled={disabled} style={styles.button} onPress={this.onResume} >
                  <Icon name='play' type='AntDesign' style={[styles.buttonIcon, disabled && styles.disabled]} />
                  <Text style={[styles.buttonText, disabled && styles.disabled]} >Continue</Text>
                </Touchable>
                <Touchable disabled={disabled} style={styles.button} onPress={this.onClear} >
                  <Icon name='replay' type='MaterialIcons' style={[styles.buttonIcon, disabled && styles.disabled]} />
                  <Text style={[styles.buttonText, disabled && styles.disabled]} >Chơi lại</Text>
                </Touchable>
                <Touchable style={styles.button} onPress={this.onCreate} >
                  <Icon name='shuffle' type='Ionicons' style={styles.buttonIcon} />
                  <Text style={styles.buttonText} >Trò chơi mới</Text>
                </Touchable>
                <Touchable style={styles.button} onPress={() => this.props.navigation.goBack()} >
                  <Icon name='exit-outline' type='Ionicons' style={styles.buttonIcon} />
                  <Text style={styles.buttonText} >Thoát trò chơi</Text>
                </Touchable>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
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
    backgroundColor: 'cadetblue',
    paddingBottom: CellSize,
  },
  header: {
    width: BoardWidth,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: CellSize,
    height: CellSize,
    color: COLOR.white(1)
  },
  timer: {
    fontSize: CellSize * 2.5 / 4,
    alignSelf: 'center',
    color: '#fff',
    opacity: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: 'teal',
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
    padding: Size.height > 500 ? 20 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: CellSize,
    height: CellSize,
    color: COLOR.white(1)
  },
  buttonText: {
    marginLeft: CellSize / 2,
    color: '#fff',
    fontSize: CellSize * 2 / 4,
    fontFamily: 'Menlo',
    marginBottom: 10
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


export default Main;

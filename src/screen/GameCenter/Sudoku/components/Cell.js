'use strict';

import React, { Component } from 'react';

import {
  LayoutAnimation,
  StyleSheet,
  Animated,
  Platform,
  View,
  Text,
} from 'react-native';

import {
  CellSize,
  BorderWidth,
} from './GlobalStyle';
import Touchable from './Touchable';

class Cell extends Component {
  state = {
    number: this.props.number,
    hints: [],
    editing: false,
    highlight: false,
    fixed: false,
    toggle: false,
    anim: new Animated.Value(0),
  }

  setHighlight(highlight) {
    this.setState({
      highlight: highlight,
    });
  }

  setNumber(number, fixed) {
    if (!fixed) LayoutAnimation.easeInEaseOut();
    this.setState({
      number,
      fixed,
      editing: false,
    });
  }

  setHintNumber(number) {
    let hints = this.state.hints;
    if (hints.length == 6) hints.shift();
    if (hints.includes(number)) hints = hints.filter(x => x != number);
    else hints.push(number);
    this.setState({
      hints,
      editing: true,
    });
  }

  reset() {
    this.setState({
      number: this.props.number,
      hints: [],
      editing: false,
      highlight: false,
      fixed: false,
      toggle: false,
      anim: new Animated.Value(0),
    });
  }

  animate() {
    if (this.state.toggle) return;
    this.setState({
      toggle: true,
    }, () => {
      this.state.anim.setValue(0);
      Animated.timing(this.state.anim, {
        toValue: 1,
        duration: 1000,
        //useNativeDriver: true,
      }).start(() => {
        this.setState({
          toggle: false,
        });
      });
    });
  }

  onPress = (e) => {
    this.props.onPress && this.props.onPress(this.props.index, this.state.number, this.state.fixed);
  }

  render() {
    const { number, fixed, highlight, editing, hints, toggle } = this.state;
    const rotate = this.state.anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const scale = this.state.anim.interpolate({
      inputRange: [0, 0.1, 0.9, 1],
      outputRange: [1, 1.1, 1.1, 1],
    });
    const transform = [{ rotate }, { scale }];
    const zIndex = toggle ? 100 : 0;
    const filled = typeof(number) == 'number';
    const text = filled ? (number + 1) : '';
    const hint = hints.map(x => x + 1).join('');
    return (
      <Animated.View style={[styles.cell, filled&&styles.filledCell, fixed&&styles.fixedCell, highlight&&styles.highlightCell, {transform, zIndex}]} >
        {editing?
          <Text style={[styles.text, styles.editingText]} >{hint}</Text>:
          <Text style={[styles.text, fixed&&styles.fixedText, highlight&&styles.highlightText]}>{text}</Text>
        }
        <Touchable activeOpacity={fixed?1:0.8} onPress={this.onPress} style={styles.handle} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  handle: {
    width: CellSize,
    height: CellSize,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cell: {
    width: CellSize,
    height: CellSize,
    backgroundColor: '#FDFDFD',
    borderColor: '#D8CED1',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: BorderWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    color: '#74696D',
    fontSize: CellSize * 2 / 3,
    // fontFamily: 'HelveticaNeue',
  },
  editingText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'green',
    fontSize: CellSize * 2 / 5,
    marginHorizontal: CellSize / 8,
    ...Platform.select({
      ios: {
        marginTop: CellSize / 12,
        lineHeight: CellSize * 2 / 5
      },
      android: {
        lineHeight: Math.floor(CellSize * 2 / 4),
      },
    })
  },
  filledCell: {
    backgroundColor: '#F0DCEE',
  },
  fixedCell: {
    backgroundColor: '#FAFDFD',
  },
  fixedText: {
    color: '#666',
  },
  highlightCell: {
    backgroundColor: '#EEDAEE',
  },
  highlightText: {
    color: '#fff',
  },
});


export default Cell;

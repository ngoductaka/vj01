import React from 'react';
import { wfNextStateAction, loadScoresAction, loadDeviceIdAction } from '../../../../redux/action/tetris';
import { connect } from 'react-redux';
import { View, Image, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';

import Header from '../components/Header';
import Game from './Game';

import scoreService from '../../../../redux/services/tetris/ScoreService';
import { STATE_INTRO } from '../../../../redux/reducers/tetris/workflow';

class NewTetris extends React.Component {

  state = {
    title: 'Yet Another Block Game',
    version: 'v1.11'
  };


  componentWillMount = () => {
    // Loading scoreList from disk
    scoreService.loadBestScoresFromDisk(this.props.loadScores);

    // Loading device id from disk
    scoreService.loadDeviceIdFromDisk(this.props.loadDeviceId);

    // Just for presentation
    let self = this;
    setTimeout(function () {
      self.setState({
        title: 'Start now'
      });
    }, 5000);
  };

  _introOrGame = () => {
    const game =
      <View style={styles.app} >
        <Header />
        <Game style={styles.game} />
      </View>;

    const intro =
      <View style={styles.container} >
        <View style={styles.version}>
          <Text style={styles.textVersion}>{this.state.version}</Text>
        </View>
        <TouchableHighlight >
          <Image style={styles.image} source={require('../images/yabloga-intro.png')} />
        </TouchableHighlight>
        <TouchableOpacity onPress={this.props.wfSetNextState} style={styles.title}>
          <Text style={styles.textTitle}>{this.state.title}</Text>
        </TouchableOpacity>
      </View>;

    if (this.props.wfState === STATE_INTRO) {
      return intro;
    }
    else {
      return game;
    }
  };

  render() {
    return this._introOrGame();
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1
  },
  version: {
    width: 300,
    height: 400,
    position: 'absolute',
  },
  textVersion: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: 'white',
    zIndex: 2,
  },
  game: {
    backgroundColor: '#fff',
    color: 'white',
    flex: 2,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'black',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: 300,
    height: 400,
  },
  textTitle: {
    bottom: 20,
    color: 'white',
    zIndex: 2,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 375,
  },
  title: {
    width: 300,
    height: 400,
    position: 'absolute',
  },
});

const mapStatesToProps = (state) => {
  return {
    wfState: state.wfState,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadScores: (scores) => {
      dispatch(loadScoresAction(scores));
    },
    loadDeviceId: (deviceId) => {
      dispatch(loadDeviceIdAction(deviceId));
    },
    wfSetNextState: () => {
      dispatch(wfNextStateAction());
    },
  }
};

export default connect(mapStatesToProps, mapDispatchToProps)(NewTetris);

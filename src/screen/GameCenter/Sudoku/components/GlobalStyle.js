'use strict';

import {
  StyleSheet,
  Dimensions,
} from 'react-native';

export const Size = Dimensions.get('window');

export const BoardWidth = Size.width;

export const CellSize = Math.floor(BoardWidth / 10);

export const BorderWidth = 0.75;

export const Color = {

};

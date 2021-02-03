import { combineReducers } from 'redux';
import userInfo from './user_info';
import bookInfo from './book_info';
import timeMachine from './time_machine';
import subjects from './class';

// tetris
// import coordinateReducer from './tetris/coordinate';
// import shapeCoordinateReducer from './tetris/shapeCoordinate'
// import areaReducer from './tetris/area'
// import shapeReducer from './tetris/shape'
// import nextShapeReducer from './tetris/nextShape'
// import bestScoresReducer from './tetris/bestScores'
// import deviceIdReducer from './tetris/deviceId'
// import { workflowReducer } from './tetris/workflow'

const reducers = combineReducers({
  userInfo,
  bookInfo,
  timeMachine,
  subjects,

  // tetris
  // coordinate: coordinateReducer,
  // shapeCoordinate: shapeCoordinateReducer,
  // area: areaReducer,
  // shape: shapeReducer,
  // nextShape: nextShapeReducer,
  // bestScores: bestScoresReducer,
  // deviceId: deviceIdReducer,
  // wfState: workflowReducer,
});
export default reducers;

import { combineReducers } from 'redux';
import userInfo from './user_info';
import bookInfo from './book_info';
import timeMachine from './time_machine';
import subjects from './class';

const reducers = combineReducers({
  userInfo,
  bookInfo,
  timeMachine,
  subjects
});
export default reducers;

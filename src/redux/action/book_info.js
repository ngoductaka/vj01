import { SET_BOOK_INFO } from '../constants';

/**
 * Changes the input field of the form
 *
 * @param  {object} bookInfo The new text of the input field
 *
 * @return {object} An action object with a type of SET_BOOK_INFO
 */
export function setBookInfo(bookInfo) {
  return {
    type: SET_BOOK_INFO,
    bookInfo,
  };
}

export default { setBookInfo };

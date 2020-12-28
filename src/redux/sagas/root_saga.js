import { fork, all } from 'redux-saga/effects';
import { watchLoginWithGoogle, watchLoginWithFacebook, watchLoginWithApple, watchLogout } from './user_saga';

export default function* rootSaga() {
    yield all ([
        fork(watchLoginWithGoogle),
        fork(watchLoginWithFacebook),
        fork(watchLoginWithApple),
        fork(watchLogout),
    ]);
}

import { combineReducers } from 'redux';

import userReducer from './user';
import postReducer from './post';

const allReducers = combineReducers({
    userReducer: userReducer,
    postReducer: postReducer,
});

export default allReducers;

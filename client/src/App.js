import React from 'react';
import {
    BrowserRouter as Router
} from 'react-router-dom';
import axios from 'axios';
import {
    applyMiddleware,
    createStore,
    compose
} from 'redux';
import {
    Provider
} from 'react-redux';
import thunk from 'redux-thunk';

import AuthRouter from './router';
import allReducers from './redux/reducers';

import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

axios.defaults.baseURL = 'https://localhost:4000';
axios.defaults.headers.common['Authorization'] =
    'Bearer ' + localStorage.getItem('token');

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancer = compose;

export const store = createStore(
    allReducers,
    composeEnhancer(applyMiddleware(thunk))
);

const App = () => {
    return ( <
        Provider store = {
            store
        } >
        <
        Router >
        <
        AuthRouter / >
        <
        /Router> < /
        Provider >
    );
};

export default App;
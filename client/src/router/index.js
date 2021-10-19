import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { userLogin } from '../redux/user/actions';

import Loading from '../pages/Loading';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Comments from '../pages/Comments';
import About from '../pages/About';
import Terms from '../pages/Terms';
import PostRegister from '../pages/PostRegister';

const LoggedIn = () => {
    return (
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/about-us' component={About} />
            <Route path='/profile' component={About} />
            <Route path='/posts/:postId' component={Comments} />
        </Switch>
    );
};

const LoggedOut = ({ authUser }) => {
    return (
        <Switch>
            <Route
                exact
                path='/'
                component={() => <Login authUser={authUser} />}
            />
            <Route path='/register' component={Register} />
            <Route path='/post-register' component={PostRegister} />
            <Route path='/terms' component={Terms} />
        </Switch>
    );
};

const AuthRouter = () => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        axios
            .get('/auth/authorize')
            .then((res) => {
                authUser(true, localStorage.getItem('username'));
            })
            .catch((err) => {
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const authUser = (res, username) => {
        setAuth(res);

        axios
            .get(`/users/${username}`)
            .then((res) => {
                dispatch(userLogin(res.data));
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    };

    // prettier-ignore
    return loading ? (
        <Loading />
    ) : auth ? (
        <LoggedIn />
    ) : (
        <LoggedOut authUser={authUser} />
    );
};

export default AuthRouter;

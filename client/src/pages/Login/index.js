import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { useHistory } from 'react-router';

import './index.css';

const Login = ({ authUser }) => {
    const [creds, setCreds] = useState({
        username: '',
        password: '',
    });
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState('Wrong / empty information!');

    const history = useHistory();

    useEffect(() => {
        if (creds.password.length > 0 && creds.username.length > 0) {
            setDisabled(false);
        }
    }, [creds.password, creds.username]);

    const handleCreds = (event) => {
        const target = event.target;
        setCreds((cred) => ({ ...cred, [target.name]: target.value }));
    };

    const handleSubmit = (action) => {
        if (action === 'register') {
            history.push('/register');
        } else if (action === 'login') {
            if (Object.values(creds).every((cred) => cred !== '')) {
                setLoading(true);
                axios
                    .post('/auth/login', {
                        username: creds.username,
                        password: creds.password,
                    })
                    .then((response) => {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('username', creds.username);
                        setLoading(false);
                        authUser(true, creds.username);
                        window.location.reload();
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 403) {
                            setAlertText(
                                'You need to confirm your account by clicking on the link we sent to your email.'
                            );
                            setAlert(true);
                            setLoading(false);
                        } else if (
                            error.response &&
                            error.response.status === 401
                        ) {
                            setAlertText('Wrong / empty information!');
                            setAlert(true);
                            setLoading(false);
                        }
                    });
            } else {
                setAlertText('Wrong / empty information!');
                setAlert(true);
            }
        }
    };

    return (
        <div className='login'>
            <div className='form-container'>
                <p className='title'>Social Media App</p>
                <div className='alert-container'>
                    <Alert
                        hidden={!alert}
                        variant='danger'
                        onClose={() => setAlert(false)}
                        dismissible
                    >
                        {alertText}
                    </Alert>
                </div>

                <form className='input-container'>
                    <label>Username</label>

                    <div>
                        <input
                            name='username'
                            type='text'
                            value={creds.username}
                            onChange={handleCreds}
                            autoComplete='off'
                        />
                    </div>
                    <label>Password</label>
                    <div>
                        <input
                            name='password'
                            type='password'
                            value={creds.password}
                            onChange={handleCreds}
                        />
                    </div>
                </form>

                <div className='button-container'>
                    <Button
                        disabled={disabled}
                        size='lg'
                        variant='primary'
                        onClick={() => handleSubmit('login')}
                    >
                        {loading ? (
                            <Spinner animation='border' size='sm' />
                        ) : (
                            'Login'
                        )}
                    </Button>
                    <Button
                        size='lg'
                        variant='success'
                        onClick={() => handleSubmit('register')}
                    >
                        Register
                    </Button>
                </div>

                <p className='footer'>
                    Lorem ipsum dolor sit amet.
                </p>
            </div>
        </div>
    );
};

export default Login;

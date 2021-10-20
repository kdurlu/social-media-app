import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

import './index.css';

const Register = () => {
    const [creds, setCreds] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState('Wrong / empty information!');

    const history = useHistory();

    useEffect(() => {
        if (
            creds.email.length > 0 &&
            checked &&
            creds.password.length > 0 &&
            creds.username.length > 0
        ) {
            setDisabled(false);
        }
    }, [checked, creds.password, creds.username, creds.email]);

    const handleCreds = (event) => {
        const target = event.target;
        setCreds((cred) => ({ ...cred, [target.name]: target.value }));
    };

    const handleCheckbox = () => {
        setChecked(!checked);
    };

    const handleSubmit = (action) => {
        if (action === 'go-back') {
            history.push('/');
        } else if (action === 'register') {
            if (
                creds.email === '' ||
                creds.username === '' ||
                creds.password === ''
            ) {
                // check if all areas are filled
                setAlertText('Fill all fields!');
                setAlert(true);
                return;
            }
            // You can add regex checking for specifying email domain to register.
            if (
                true
            ) {
                // check if mail is not valid
                setAlertText(
                    'You can only register with a valid email address.'
                );
                setAlert(true);
                return;
            }

            if (!checked) {
                setAlertText('You need the accept terms.');
                setAlert(true);
                return;
            }
            if (
                creds.email !== '' &&
                creds.username !== '' &&
                creds.password !== ''
            ) {
                // check if everything is okay

                setLoading(true);
                axios
                    .post('/auth/register', {
                        username: creds.username,
                        email: creds.email,
                        password: creds.password,
                    })
                    .then((response) => {
                        axios
                            .post('/auth/send-confirmation', {
                                email: creds.email,
                            })
                            .then((response) => {
                                setLoading(false);
                                history.push('/post-register');
                            })
                            .catch((error) => {
                                if (
                                    error.response &&
                                    error.response.status === 404
                                ) {
                                    setAlertText('Username not found.');
                                    setAlert(true);
                                    setLoading(false);
                                } else if (
                                    error.response &&
                                    error.response.status === 400
                                ) {
                                    setAlertText('Account is already confirmed.');
                                    setAlert(true);
                                    setLoading(false);
                                } else {
                                    setAlertText('An error occured.');
                                    setAlert(true);
                                    setLoading(false);
                                }
                            });
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 403) {
                            setAlertText(
                                'You can only register with a valid email address.'
                            );
                            setAlert(true);
                            setLoading(false);
                        } else if (
                            error.response &&
                            error.response.status === 400
                        ) {
                            setAlertText(
                                'Username or email is already in use.'
                            );
                            setAlert(true);
                            setLoading(false);
                        } else {
                            setAlertText('An error occured.');
                            setAlert(true);
                            setLoading(false);
                        }
                    });

                return;
            } else {
                // an error occured
                setAlertText('An error occured. Try again later.');
                setAlert(true);
                return;
            }
        }
    };

    return (
        <div className='register'>
            <div className='form-container'>
                <p className='title'>Register</p>
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
                            maxLength='30'
                        />
                    </div>
                    <label>Email</label>
                    <div>
                        <input
                            name='email'
                            type='text'
                            value={creds.email}
                            onChange={handleCreds}
                            autoComplete='off'
                            maxLength='320'
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

                <Form.Check
                    className='checkbox'
                    type='checkbox'
                    checked={checked}
                    onChange={() => handleCheckbox()}
                    label={
                        <Link className='anchor' to='/terms'>
                            I agree with the terms.
                        </Link>
                    }
                />

                <div className='button-container'>
                    <Button
                        size='lg'
                        variant='primary'
                        onClick={() => handleSubmit('go-back')}
                    >
                        Go back
                    </Button>
                    <Button
                        disabled={disabled}
                        size='lg'
                        variant='success'
                        onClick={() => handleSubmit('register')}
                    >
                        {loading ? (
                            <Spinner animation='border' size='sm' />
                        ) : (
                            'Register'
                        )}
                    </Button>
                </div>

                <p className='footer'>
                    Lorem ipsum dolor sit amet.
                </p>
            </div>
        </div>
    );
};

export default Register;

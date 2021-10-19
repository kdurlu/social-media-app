import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { useSelector } from 'react-redux';

import Header from '../../components/Header';
import Post from '../../components/Post';

import './index.css';

const Home = () => {
    const [content, setContent] = useState('');
    const [contentLength, setContentLength] = useState(0);
    const [contentLoading, setContentLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [alert, setAlert] = useState(false);
    const [contentAlert, setContentAlert] = useState(false);
    const [contentAlertText, setContentAlertText] = useState(
        'An error occured. Try again later.'
    );

    const user = useSelector((state) => state.userReducer);

    useEffect(() => {
        axios
            .get('/posts/feed')
            .then((response) => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 500) {
                    setAlert(true);
                    setLoading(false);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnChange = (event) => {
        const target = event.target;
        setContent(target.value);
        setContentLength(target.value.length);
    };

    const handleOnSubmit = () => {
        if (contentLength === 0 || content === '') {
            setContentAlertText('This field cannot be empty');
            setContentAlert(true);
        } else {
            setContentLoading(true);

            axios
                .post('/posts/new', {
                    content: content,
                    username: user.username,
                })
                .then((response) => {
                    setContentLoading(false);
                    window.location.reload();
                })
                .catch((error) => {
                    if (error.response && error.response.status === 500) {
                        setContentAlertText(
                            'An error occured. Try again later.'
                        );
                        setContentAlert(true);
                        setContentLoading(false);
                    } else if (error) {
                        setContentAlertText(
                            'An error occured. Try again later.'
                        );
                        setContentAlert(true);
                        setContentLoading(false);
                    }
                });
        }
    };

    return (
        <div className='home'>
            <Header />

            <div className='home-container'>
                <div
                    className='home-left'
                    style={
                        alert || loading
                            ? { borderRight: '0px transparent' }
                            : {}
                    }
                ></div>

                <div
                    className='home-center'
                    style={
                        alert || loading
                            ? {
                                  alignItems: 'center',
                                  paddingTop: '48px',
                                  borderRight: '0px transparent',
                              }
                            : {}
                    }
                >
                    <div className='input-area'>
                        {contentAlert ? (
                            <Alert
                                style={{
                                    textAlign: 'center',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    fontSize: '22px',
                                }}
                                hidden={!contentAlert}
                                variant='danger'
                                dismissible
                                onClose={() => setContentAlert(false)}
                            >
                                {contentAlertText}
                            </Alert>
                        ) : null}

                        <div className='text-area'>
                            <textarea
                                name='content'
                                type='text'
                                value={content}
                                onChange={handleOnChange}
                                placeholder='Write something...'
                                maxLength='300'
                                autoComplete='off'
                            />
                            <div className='footer-area'>
                                {contentLength + ' / 300'}
                                <button onClick={() => handleOnSubmit()}>
                                    {contentLoading ? (
                                        <Spinner animation='border' size='sm' />
                                    ) : (
                                        'Share'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {alert ? (
                        <Alert
                            style={{
                                textAlign: 'center',
                                paddingTop: '80px',
                                paddingBottom: '80px',
                                fontSize: '22px',
                            }}
                            hidden={!alert}
                            variant='danger'
                        >
                            An error occured. Try again later.
                        </Alert>
                    ) : loading ? (
                        <Spinner
                            animation='border'
                            style={{ width: '3rem', height: '3rem' }}
                        />
                    ) : (
                        posts.map((post) => {
                            return (
                                <Post
                                    key={post.post_id}
                                    owner={post.post_username === user.username}
                                    post_id={post.post_id}
                                    username={post.post_username}
                                    date={post.post_date}
                                    content={post.post_content}
                                    like_count={post.post_likes}
                                    comment_count={post.comment_count}
                                    is_liked={user.liked_post_ids.includes(
                                        post.post_id
                                    )}
                                />
                            );
                        })
                    )}
                </div>

                <div className='home-right'></div>
            </div>
        </div>
    );
};

export default Home;

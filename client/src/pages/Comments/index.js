import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Header from '../../components/Header';
import Post from '../../components/Post';
import Comment from '../../components/Comment';

import './index.css';

const Comments = () => {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [alert, setAlert] = useState(false);
    const [content, setContent] = useState('');
    const [contentLength, setContentLength] = useState(content.length);
    const [contentLoading, setContentLoading] = useState(false);
    const [contentAlertText, setContentAlertText] = useState(
        'An error occured. Try again later.'
    );
    const [contentAlert, setContentAlert] = useState(false);

    const { postId } = useParams();
    const user = useSelector((state) => state.userReducer);

    useEffect(() => {
        setLoading(true);

        axios
            .get('/posts/' + postId)
            .then((response) => {
                setPost(response.data);
            })
            .catch((error) => {
                if (error.response && error.response.status === 500) {
                    setAlert(true);
                    setLoading(false);
                    return;
                }
            });

        axios
            .get(`/comments/feed?postId=${postId}`)
            .then((response) => {
                setComments(response.data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 500) {
                    setAlert(true);
                    setLoading(false);
                    return;
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
            setContentAlertText('This field cannot be empty.');
            setContentAlert(true);
        } else {
            setContentLoading(true);

            axios
                .post(`/comments/new?postId=${postId}`, {
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
        <div className='comments'>
            <Header />

            <div className='comments-container'>
                <div
                    className='comments-left'
                    style={
                        alert || loading
                            ? { borderRight: '0px transparent' }
                            : {}
                    }
                ></div>

                <div
                    className='comments-center'
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
                            An error occured while loading comments. Try again later.
                        </Alert>
                    ) : loading ? (
                        <Spinner
                            animation='border'
                            style={{ width: '3rem', height: '3rem' }}
                        />
                    ) : (
                        <Post
                            owner={post[0].post_username === user.username}
                            post_id={post[0].post_id}
                            username={post[0].post_username}
                            date={post[0].post_date}
                            content={post[0].post_content}
                            like_count={post[0].post_likes}
                            comment_count={post[0].comment_count}
                            is_liked={user.liked_post_ids.includes(postId)}
                        />
                    )}

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
                                placeholder='Write a comment...'
                                maxLength='300'
                                autoComplete='off'
                            />
                            <div className='footer-area'>
                                {contentLength + ' / 300'}
                                <button onClick={() => handleOnSubmit()}>
                                    {contentLoading ? (
                                        <Spinner animation='border' size='sm' />
                                    ) : (
                                        'Comment'
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
                            An error occured while loading comments. Try again later.
                        </Alert>
                    ) : loading ? (
                        <Spinner
                            animation='border'
                            style={{ width: '3rem', height: '3rem' }}
                        />
                    ) : (
                        comments.map((post) => {
                            return (
                                <Comment
                                    key={post.comment_id}
                                    owner={
                                        post.comment_username === user.username
                                    }
                                    comment_id={post.comment_id}
                                    username={post.comment_username}
                                    date={post.comment_date}
                                    content={post.comment_content}
                                    like_count={post.comment_likes}
                                    is_liked={user.liked_comment_ids.includes(
                                        post.comment_id
                                    )}
                                />
                            );
                        })
                    )}
                </div>

                <div className='comments-right'></div>
            </div>
        </div>
    );
};

export default Comments;

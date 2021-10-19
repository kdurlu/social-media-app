import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';

import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BiComment } from 'react-icons/bi';
import { IoMdSettings } from 'react-icons/io';

import { userUpdate } from '../../redux/user/actions';

import './index.css';

const Post = (props) => {
    const post_id = props.post_id;
    const username = props.username;
    const date = props.date;
    const content = props.content;
    const owner = props.owner;

    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userReducer);

    const [likeCount, setLikeCount] = useState(props.like_count);
    // eslint-disable-next-line
    const [commentCount, setCommentCount] = useState(props.comment_count);
    const [liked, setLike] = useState(props.is_liked);
    const [admin, setAdmin] = useState(props.admin);
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        axios
            .get(`/users/isAdmin/${username}`)
            .then((response) => {
                if (response.data.role === 0) {
                    setAdmin(true);
                }
            })
            .catch((error) => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLike = () => {
        let liked_post_ids_temp = user.liked_post_ids;

        if (!liked) {
            liked_post_ids_temp.push(post_id);
            setLikeCount(likeCount + 1);
        } else {
            liked_post_ids_temp = liked_post_ids_temp.filter(
                (id) => id !== post_id
            );
            if (likeCount !== 0) setLikeCount(likeCount - 1);
        }

        axios
            .post('/posts/like', {
                action: liked ? 'dislike' : 'like',
                post_id: post_id,
                liked_post_ids: { array: liked_post_ids_temp },
                username: username,
            })
            .then((response) => {
                setLike(!liked);
                dispatch(userUpdate(liked_post_ids_temp));
            })
            .catch((error) => {});
    };
    const handleComment = () => {
        history.push('/posts/' + post_id);
    };
    const handleOnDelete = () => {
        axios
            .post(`/posts/delete?postId=${post_id}`, {
                username: username,
            })
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {});
    };
    const handleOnShare = () => {
        navigator.clipboard.writeText(`http://localhost:3000/posts/${post_id}`);
        setAlert(true);
    };

    return (
        <div className='post-container'>
            {alert ? (
                <Alert
                    style={{
                        position: 'absolute',
                        textAlign: 'center',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        fontSize: '22px',
                    }}
                    hidden={!alert}
                    variant='danger'
                    dismissible
                    onClose={() => setAlert(false)}
                >
                    Link copied.
                </Alert>
            ) : null}

            <div className='header'>
                <div
                    style={admin ? { color: 'red' } : null}
                    className='username'
                >
                    {admin ? username + ' (Admin)' : username}
                </div>
                <div className='date'>{date}</div>
                <div className='settings'>
                    <Dropdown className='d-inline mx-2'>
                        <Dropdown.Toggle
                            style={{
                                border: 'transparent solid',
                                outline: 'none',
                                color: 'black',
                                backgroundColor: 'transparent',
                            }}
                            id='dropdown-autoclose-true'
                        >
                            <IoMdSettings size='1.5em' />
                        </Dropdown.Toggle>

                        {owner ? (
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleOnDelete()}>
                                    Delete
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleOnShare()}>
                                    Share
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        ) : (
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleOnShare()}>
                                    Share
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        )}
                    </Dropdown>
                </div>
            </div>

            <div className='content'>{content}</div>

            <div className='footer'>
                <div className='button-container'>
                    <div
                        onClick={() => handleComment()}
                        className='comment-icon'
                    >
                        <div className='icon'>
                            <BiComment size='1.6em' />
                        </div>
                        <div className='comment-count'>{commentCount}</div>
                    </div>
                    <div onClick={() => handleLike()} className='like-icon'>
                        <div className='icon'>
                            {liked ? (
                                <AiFillLike size='1.6em' />
                            ) : (
                                <AiOutlineLike size='1.6em' />
                            )}
                        </div>
                        <div className='like-count'>{likeCount}</div>
                    </div>
                </div>
                <div className='misc-container'></div>
            </div>
        </div>
    );
};

export default Post;

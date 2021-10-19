const router = require('express').Router();
const verify = require('../utils/verify');

const db = require('../utils/database');

db.connect(function (err) {
    if (err) throw err;
});

// POST NEW POST
router.post('/new', verify, (req, res) => {
    let date = new Date();
    let dateFormatted = date.toLocaleString('tr-TR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Europe/Istanbul',
    });

    const content = req.body.content;
    const username = req.user.username;
    const usernameRedux = req.body.username;
    const usernameJWT = req.user.username;

    if (usernameJWT === usernameRedux) {
        db.query(
            'INSERT INTO POSTS (post_username, post_content, post_date) VALUES (?,?,?)',
            [username, content, dateFormatted],
            (err, result) => {
                if (err) {
                    res.status(500).json('Internal server error.');
                    return;
                }

                res.status(200).json('Post successfully posted.');
                return;
            }
        );
    } else {
        res.status(401).json('Unauthorized user.');
        return;
    }
});

// DELETE POST
router.post('/delete', verify, (req, res) => {
    const post_id = req.query.postId;
    const usernameJWT = req.user.username;
    const usernameRedux = req.body.username;

    if (usernameJWT === usernameRedux) {
        db.query(
            'DELETE FROM POSTS WHERE post_id = ?',
            [post_id],
            (err, result) => {
                if (err) {
                    res.status(500).json('Internal server error.');
                    return;
                }

                res.status(200).json(`Post deleted.`);
                return;
            }
        );
    } else {
        res.status(401).json('Unauthorized user.');
        return;
    }
});

// GET ALL POSTS
router.get('/feed', verify, (req, res) => {
    db.query(
        'SELECT * FROM POSTS ORDER BY post_datetime DESC;',
        (err, result) => {
            if (err) {
                res.status(500).json('Internal server error.');
                return;
            }

            res.status(200).json(result);
            return;
        }
    );
});

// GET POST INFO
router.get('/:postId', verify, (req, res) => {
    const post_id = req.params.postId;

    db.query(
        'SELECT * FROM POSTS WHERE post_id = ?',
        [post_id],
        (err, result) => {
            if (err) {
                res.status(500).json('Internal server error.');
                return;
            }

            res.status(200).json(result);
            return;
        }
    );
});

// LIKE - DISLIKE POST
router.post('/like', verify, (req, res) => {
    const post_id = req.body.post_id;
    const liked_posts = JSON.stringify(req.body.liked_post_ids);
    const username = req.user.username;

    let counter = -1;

    if (req.body.action === 'like') counter = 1;

    db.query(
        'SELECT * FROM POSTS WHERE post_id = ?',
        [post_id],
        (err, result) => {
            if (err || !result[0]) {
                res.status(400).json('Post not found.');
                return;
            }

            const like_count = result[0].post_likes;

            db.query(
                'UPDATE POSTS SET post_likes = ? WHERE post_id = ?',
                [like_count + counter, post_id],
                (err, result) => {
                    if (err) {
                        res.status(500).json('Internal server error.');
                        return;
                    }
                }
            );

            db.query(
                'UPDATE USERS SET liked_post_ids = ? WHERE username = ?',
                [liked_posts, username],
                (err, result) => {
                    if (err) {
                        res.status(500).json('Internal server error.');
                        return;
                    }

                    res.status(200).json('Post liked.');
                    return;
                }
            );
        }
    );
});

module.exports = router;

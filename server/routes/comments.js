const router = require('express').Router();
const verify = require('../utils/verify');

const db = require('../utils/database');

db.connect(function (err) {
    if (err) throw err;
});

// POST NEW COMMENT
router.post('/new', verify, (req, res) => {
    let date = new Date();
    let dateFormatted = date.toLocaleString('tr-TR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Europe/Istanbul',
    });

    const content = req.body.content;
    const usernameRedux = req.body.username;
    const usernameJWT = req.user.username;
    const username = req.user.username;
    const post_id = req.query.postId;

    if (usernameJWT === usernameRedux) {
        db.query(
            'INSERT INTO COMMENTS (comment_post_id, comment_username, comment_content, comment_date) VALUES (?, ?, ?, ?)',
            [post_id, username, content, dateFormatted],
            (err, result) => {
                if (err) {
                    res.status(500).json('Internal server error.');
                    return;
                }

                db.query(
                    'UPDATE POSTS SET comment_count = comment_count + 1 WHERE post_id = ?',
                    [post_id],
                    (err, result) => {
                        if (err) {
                            res.status(500).json('Internal server error.');
                            return;
                        }
                        res.status(200).json('Comment posted.');
                        return;
                    }
                );
            }
        );
    } else {
        res.status(401).json('Unauthorized user.');
        return;
    }
});

// DELETE COMMENT
router.post('/delete', verify, (req, res) => {
    const comment_id = req.query.commentId;

    const usernameRedux = req.body.username;
    const usernameJWT = req.user.username;

    if (usernameJWT === usernameRedux) {
        db.query(
            'UPDATE POSTS SET comment_count = comment_count - 1 WHERE post_id = (SELECT comment_post_id FROM COMMENTS WHERE comment_id = ?)',
            [comment_id],
            (err, result) => {
                if (err) {
                    res.status(500).json('Internal server error.');
                    return;
                }
            }
        );

        db.query(
            'DELETE FROM COMMENTS WHERE comment_id = ?',
            [comment_id],
            (err, result) => {
                if (err) {
                    res.status(500).json('Internal server error.');
                    return;
                }

                res.status(200).json('Comment deleted.');
                return;
            }
        );
    } else {
        res.status(401).json('Unauthorized user.');
        return;
    }
});

// GET ALL COMMENTS OF A POST
router.get('/feed', verify, (req, res) => {
    const post_id = req.query.postId;

    db.query(
        'SELECT * FROM COMMENTS WHERE comment_post_id = ? ORDER BY comment_datetime DESC;',
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

// LIKE - DISLIKE A COMMENT
router.post('/like', verify, (req, res) => {
    const comment_id = req.query.commentId;
    const liked_comments = JSON.stringify(req.body.liked_comment_ids);
    const username = req.user.username;

    let counter = -1;

    if (req.body.action === 'like') counter = 1;

    db.query(
        'SELECT * FROM COMMENTS WHERE comment_id = ?',
        [comment_id],
        (err, result) => {
            if (err || !result[0]) {
                res.status(400).json('Comment not found.');
                return;
            }

            const like_count = result[0].comment_likes;

            db.query(
                'UPDATE COMMENTS SET comment_likes = ? WHERE comment_id = ?',
                [like_count + counter, comment_id],
                (err, result) => {
                    if (err) {
                        res.status(500).json('Internal server error.');
                        return;
                    }
                }
            );

            db.query(
                'UPDATE USERS SET liked_comment_ids = ? WHERE username = ?',
                [liked_comments, username],
                (err, result) => {
                    if (err) {
                        res.status(500).json('Internal server error.');
                        return;
                    }

                    res.status(200).json('Comment liked.');
                    return;
                }
            );
        }
    );
});

module.exports = router;

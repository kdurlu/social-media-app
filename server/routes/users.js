const router = require('express').Router();
const verify = require('../utils/verify');

const db = require('../utils/database');

db.connect(function (err) {
    if (err) throw err;
});

router.get('/:username', verify, (req, res) => {
    const username = req.params.username;

    db.query(
        'SELECT username, email, liked_post_ids, liked_comment_ids FROM USERS WHERE username = ?',
        [username],
        (err, result) => {
            if (req.user.username !== username) {
                res.status(403).json('Unauthorized user.');
                return;
            } else if (err) {
                res.status(500).json('Internal server error.');
                return;
            } else if (result[0]) {
                res.status(200).json({
                    username: username,
                    email: result[0].email,
                    liked_post_ids: result[0].liked_post_ids.array,
                    liked_comment_ids: result[0].liked_comment_ids.array,
                });
                return;
            } else {
                res.status(403).json('Unauthorized user.');
                return;
            }
        }
    );
});

router.get('/isAdmin/:username', verify, (req, res) => {
    const username = req.params.username;

    db.query(
        'SELECT role FROM USERS WHERE username = ?',
        [username],
        (err, result) => {
            if (err) {
                res.status(500).json('Internal server error.');
                return;
            } else {
                res.status(200).json({ role: result[0].role });
            }
            return;
        }
    );
});

module.exports = router;

const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const mailer = require('../utils/mail');
const db = require('../utils/database');
const verify = require('../utils/verify');

db.connect((err) => {
    if (err) throw err;
});

// AUTHORIZE
router.get('/authorize', verify, (req, res) => {
    res.status(200).json('Authorized user.');
    return;
});

// LOGIN
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        'SELECT email, password, role, liked_post_ids, liked_comment_ids, confirmed FROM USERS WHERE username = ?',
        [username],
        (err, result) => {
            if (err) {
                res.status(500).json('Internal server error.');
                return;
            }

            if (result && result[0]) {
                if (result[0].confirmed === 0) {
                    res.status(403).json('Account is not confirmed.');
                    return;
                }

                const passCheck = bcrypt.compareSync(
                    password,
                    result[0].password
                );

                if (passCheck) {
                    const token = jwt.sign({
                            username: username,
                            role: result[0].role,
                            confirmed: result[0].confirmed,
                        },
                        process.env.ACCESS_TOKEN_SECRET, {
                            expiresIn: '120h'
                        }
                    );

                    res.status(200).json({
                        message: 'Login successful.',
                        token: token,
                    });
                    return;
                } else {
                    res.status(401).json('Wrong username or password.');
                    return;
                }
            } else {
                res.status(401).json('Wrong username or password.');
                return;
            }
        }
    );
});

// REGISTER
router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const hash = bcrypt.hashSync(password, 10);

    // You can add your regex checking here for specifying email domains that can register.
    if (true) {
        db.query(
            'INSERT INTO USERS (username, password, email, first_email, liked_post_ids, liked_comment_ids, role, confirmed) VALUES (?,?,?,?,?,?,?,?)',
            [
                username,
                hash,
                email,
                email,
                '{ "array": [] }',
                '{ "array": [] }',
                1,
                0,
            ],
            (err, result) => {
                if (err) {
                    res.status(409).json({
                        message: 'Username or email already in use.'
                    });
                    return;
                } else {
                    res.status(200).json({
                        message: 'Registration successful.'
                    });
                    return;
                }
            }
        );
    } else {
        res.status(403).json({
            message: 'You can only register with a valid email.'
        });
    }
});

// SEND CONFIRMATION MAIL

router.post('/send-confirmation', (req, res) => {
    const email = req.body.email;
    const token = jwt.sign({
        email: email
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    });
    const url = `http://localhost:4000/auth/confirmation?token=${token}`;

    let mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: 'Confirm Your Account!',
        html: `You can confirm your account by clicking the link that follows. <a href=${url}>${url}</a>`,
    };

    db.query(
        'SELECT confirmed FROM USERS WHERE email = ?',
        [email],
        (err, result) => {
            if (err) {
                res.status(500).json('Internal server error.');
                return;
            }
            if (result[0] && result[0].confirmed === 0) {
                mailer.sendMail(mailOptions, (err, data) => {
                    if (err) {
                        res.status(500).json('Internal server error.');
                        return;
                    } else {
                        res.status(200).json('Confirmation mail is sent.');
                        return;
                    }
                });
            } else if (result[0] && result[0].confirmed === 1) {
                res.status(400).json('Account is already confirmed.');
                return;
            } else {
                res.status(404).json('User not found.');
            }
        }
    );
});

// CONFIRMATION

router.get('/confirmation', (req, res) => {
    const token = req.query.token;

    try {
        let auth = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            function(err, decoded) {
                const email = decoded.email;

                db.query(
                    'SELECT confirmed FROM USERS WHERE email = ?',
                    [email],
                    (err, result) => {
                        if (err) {
                            res.status(500).json('Internal server error.');
                            return;
                        }
                        if (result[0] && result[0].confirmed === 0) {
                            db.query(
                                'UPDATE USERS SET confirmed = ? WHERE email = ?',
                                [1, email],
                                (err, result) => {
                                    if (err) {
                                        res.status(500).json(
                                            'Internal server error.'
                                        );

                                        return;
                                    }
                                    res.status(200).json(
                                        'Confirmation successful.'
                                    );
                                    return;
                                }
                            );
                        } else if (result[0] && result[0].confirmed === 1) {
                            res.status(400).json(
                                'Account is already confirmed.'
                            );
                            return;
                        } else {
                            res.status(404).json('User not found.');
                        }
                    }
                );
            }
        );
    } catch (err) {
        res.status(401).json('Unauthorized user.');
        return;
    }
});

module.exports = router;
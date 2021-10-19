require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const commentsRoute = require('./routes/comments');

app.use(express.json());
app.use(cors());

app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/posts', postsRoute);
app.use('/comments', commentsRoute);

app.listen(process.env.PORT);

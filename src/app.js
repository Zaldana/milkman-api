require('dotenv').config()
const express = require('express');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');
var cors = require('cors');
const productRouter = require('./routes/productRouter');
const UserModel = require('./models/UserModel');

mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log('connected to database'))
    .catch(() => console.log('did NOT connect to database'));

const app = express();

app.use(cors({
    origin: 'https://milkman.zaldana.studio',
    credentials: true,
}));
app.use(cookieParser())
app.use(bodyParser.json());

// Authorization middleware
app.use(async (req, res, next) => {
    // See who is the user making the request
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
        next();
        return;
    }

    // Asigning a user to the req object
    const { userId } = jwt.verify(sessionToken, process.env.AUTH_SECRET_KEY);
    const user = await UserModel.findOne({ id: userId });
    req.user = user;
    next();
});

// Attach routers to app
app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);

app.listen(process.env.PORT || 4001)

// ERROR HANDLER MIDDLEWARE
app.use((error, req, res, next) => {
    console.error(error);

    if (error.message === "User is not logged in") {
        res.status(401).send({ error: "User is not logged in" });
        return;
    }

    if (error.message === "User is not an admin") {
        res.status(401).send({ error: "User is not authorized" });
        return;
    }

    res.status(500).send({
        error: "An error happened",
    })
});
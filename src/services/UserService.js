const jwt = require('jsonwebtoken');
const UserModel = require("../models/UserModel");


const createUser = (req, res, next) => {

    try {
        const user = req.body.user;

        const newUser = new UserModel({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
        });

        newUser.save().then((savedUser) => {

            const cleanSavedUser = {
                id: savedUser.id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                isAdmin: savedUser.isAdmin,
            }

            res.send(cleanSavedUser);
        });
    } catch (error) {

        next(error);

    }

};

const signIn = async (req, res, next) => {

    try {

        const userCredentials = req.body.userCredentials;
        const foundUser = await UserModel.findOne({ email: userCredentials.email, password: userCredentials.password })

        if (!foundUser) {
            throw new Error("User not found")
        }

        const token = jwt.sign({
            userId: foundUser.id,
            iat: Date.now(),
        }, process.env.AUTH_SECRET_KEY);

        const cleanFoundUser = {
            id: foundUser.id,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email,
            isAdmin: foundUser.isAdmin,
        }

        res.cookie('session_token', token, { secure: false, httpOnly: true });

        res.send({ user: cleanFoundUser });

    } catch (error) {

        next(error)

    }
};

const signOut = (req, res) => {

    res.clearCookie('session_token').send('Sign out successfully');

};

const UserService = {
    createUser,
    signIn,
    signOut,
}

module.exports = UserService;
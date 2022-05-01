const jwt = require('jsonwebtoken');
const PermissionService = require("./PermissionService");
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

const updateUser = async (req, res, next) => {

    try {
        PermissionService.verifyUserIsLoggedIn(req)
        let updatedUser = await UserModel.findOneAndUpdate(
            { id: req.user.id },
            req.body.userUpdateForm,
            { new: true }
        );

        res.send(updatedUser)

    } catch (e) {
        next(error);
    }
}

const updateShoppingHistory = async (req, res, next) => {

    try {

        PermissionService.verifyUserIsLoggedIn(req)
        let update = await UserModel.updateOne(
            { id: req.user.id },
            { $addToSet: { shoppingHistory: { $each: req.body.id } } }
        )

        const foundUser = await UserModel.findOne({
            id: req.user.id
        })

        const cleanFoundUser = {
            id: foundUser.id,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email,
            isAdmin: foundUser.isAdmin,
            address: foundUser.address,
            shoppingHistory: foundUser.shoppingHistory
        }

        res.send({ user: cleanFoundUser })

    } catch (e) {
        next(error);
    }
}

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
            address: foundUser.address,
            shoppingHistory: foundUser.shoppingHistory
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
    updateUser,
    updateShoppingHistory
}

module.exports = UserService;
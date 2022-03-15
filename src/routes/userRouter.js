const express = require('express');
const UserService = require('../services/UserService');
const userRouter = express.Router();

userRouter.post(
    '/create-user',
    UserService.createUser
);

userRouter.post(
    '/sign-in',
    UserService.signIn
);

userRouter.get(
    '/sign-out',
    UserService.signOut
)

userRouter.put(
    "/edit-user",
    UserService.updateUser
);

userRouter.put(
    "/checkout",
    UserService.updateShoppingHistory
);
module.exports = userRouter;
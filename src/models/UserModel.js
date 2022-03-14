const mongoose = require('mongoose');
const uuid = require('uuid');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        default: () => uuid.v4()
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },

    shoppingHistory: [
        {
            type: Array,
        }
    ]
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
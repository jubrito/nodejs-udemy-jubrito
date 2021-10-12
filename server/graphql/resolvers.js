const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');

module.exports = {
    createUser: async function ({ userInput }, req) {
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({message: 'E-mail is invalid'});
        }
        if (validator.isEmpty(userInput.password) || validator.isLength(userInput.password, { min: 5 })) {
            errors.push({ message: 'Password is too short'});
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input');
            throw error;
        }
        if (userAlreadyExists(userInput.email)) {
            const error = new Error('User exists already!');
            throw error;
        }
        const saltRoundsToHashPassword = 12;
        const hashedPassword = await bcrypt.hash(userInput.password, saltRoundsToHashPassword);
        const newUser = new User ({
            email: userInput.email,
            name: userInput.name,
            password: hashedPassword
        });
        const createdUser = await newUser.save();
        const idConvertedFromObjectId = createdUser._id.toString();
        return {
            ...createdUser._doc, // user data without mongoose metadata
            _id: idConvertedFromObjectId
        };
    }
}

async function userAlreadyExists(email) {
    return await User.findOne({ email: email });
}
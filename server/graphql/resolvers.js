const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jsonwebtoken = require('jsonwebtoken');

module.exports = {
    createUser: async function ({ userInput }, req) {
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({message: 'E-mail is invalid'});
        }
        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
            errors.push({ message: 'Password is too short'});
        }
        ;
        if (await userAlreadyExists(userInput.email)) {
            const error = new Error('User exists already!');
            throw error;
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.statusCode = 422;
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
    },
    login: async function ({ email, password }) {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) {
            const error = new Error('Password is incorrect');
            error.statusCode = 401;
            throw error;
        }
        const privateKeyForAuthentication = 'privateKeyICreatedWhichIsUsedForSigningUpAndIsOnlyKnownToTheServerSoItCantBeFakeOnTheClient';
        const userId = user._id.toString();
        const jsonToken = jsonwebtoken.sign(
            {
                userId: userId,
                email: user.email
            }, 
            privateKeyForAuthentication,
            { expiresIn: '1h' }
        );
        return { token: jsonToken, userId: userId }
    }
}

async function userAlreadyExists(email) {
    const user = await User.findOne({ email: email });
    return user;
}
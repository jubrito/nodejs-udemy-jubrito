const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
    createUser: async function ({ userInput }, req) {
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
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
    createUser: async function ({ userInput }, req) {
        // const email = userInput.email;
        // refactors here separating into findIfUserAlreadyExists function
        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
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
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    // Without users:
    // creator: {
    //     type: Object,
    //     reqiured: true
    // }
    // With users:
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {timestamps: true}) // created and updated at

module.exports = mongoose.model('Post', postSchema);
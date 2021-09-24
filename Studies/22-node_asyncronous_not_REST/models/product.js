const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true
    },
    userId: { // which other mongoose model is actually related to this field data
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

module.exports = mongoose.model('Product', productSchema);
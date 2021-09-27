const { validationResult } = require('express-validator');
const Post = require('../models/post')
const STATUS_SUCCESS = 200;
const STATUS_SUCCESS_RESOURCE_WAS_CREATED = 201;
const STATUS_VALIDATION_FAILED_ERROR = 422;
const STATUS_SERVER_SIDE_ERROR = 500;

exports.getPosts = (req, res, next) => {
    res
        .status(STATUS_SUCCESS)
        .json({
            posts: [{
                _id: 1,
                title: 'First Post',
                content: 'Yay',
                imageUrl: 'images/tiamat.jpg',
                creator: {
                    name: 'Juliana'
                },
                createdAt: new Date()
            }]
        })
}

exports.postPosts = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is not valid')
        error.statusCode = STATUS_VALIDATION_FAILED_ERROR;
        throw error; //  THROWING ERROR because it is inside synchronous code
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title, 
        content: content,
        imageUrl: 'images/tiamat.jpg',
        creator: { name: 'Ju' },
    })
    post
        .save()
        .then(result => {
            console.log(result);
            res
                .status(STATUS_SUCCESS_RESOURCE_WAS_CREATED)
                .json({
                    message: 'Post created successfully',
                    post: result
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = STATUS_SERVER_SIDE_ERROR;
            }
            next(err); // NOT THROWING ERROR because the promise chain is async 
        }); 
    
}


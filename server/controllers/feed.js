const { validationResult } = require('express-validator');
const Post = require('../models/post')
const STATUS_SUCCESS = 200;
const STATUS_SUCCESS_RESOURCE_WAS_CREATED = 201;
const STATUS_VALIDATION_FAILED_ERROR = 422;
const STATUS_SERVER_SIDE_ERROR = 500;

function handleErrorsOnAsyncCodeUsingNext(error, next, errorStatusCode) {
    if (!error.statusCode) {
        error.statusCode = errorStatusCode;
    }
    next(error);
}

function throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock(errorMessage, errorStatusCode) {
    const error = new Error(errorMessage);
    error.statusCode = errorStatusCode;
    throw error; 
}


exports.getPosts = (req, res, next) => {
    Post
        .find()
        .then(posts => {
            res.status(STATUS_SUCCESS).json({ message: 'Fetched posts successfully', posts: posts })
        })
        .catch(err => {
            handleErrorsOnAsyncCodeUsingNext(err, next);
        })
}

exports.postPosts = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('Validation failed, entered data is not valid', STATUS_VALIDATION_FAILED_ERROR);
    }
    // if (!req.file) {
    //     throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('No image provided', STATUS_VALIDATION_FAILED_ERROR);
    // }
    // const imageUrl = req.file.path;
    // console.log('imageUrl')
    // console.log(imageUrl)
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title, 
        content: content,
        imageUrl: '/images/tiamat.jpg',
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
            handleErrorsOnAsyncCodeUsingNext(err, next, STATUS_SERVER_SIDE_ERROR);
        }); 
    
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post
        .findById(postId)
        .then(post => {
            if (!post) {
                throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock(next, STATUS_SERVER_SIDE_ERROR);
            }
            res.status(STATUS_SUCCESS).json({ message: 'Post fetched', post: post})
        })
        .catch(err => {
            handleErrorsOnAsyncCodeUsingNext(err, next);
        })
}
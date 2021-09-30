const fs = require('fs');
const path = require('path');
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
    if (!req.file) {
        throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('No image provided', STATUS_VALIDATION_FAILED_ERROR);
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title, 
        content: content,
        imageUrl: imageUrl,
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

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('Validation failed, entered data is not valid', STATUS_VALIDATION_FAILED_ERROR);
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image; // no new file was picked
    if (req.file) {
        imageUrl = req.file.path; // user updated a new file
    }
    if (!imageUrl) {
        throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('No file uploaded', STATUS_VALIDATION_FAILED_ERROR);
    }
    Post
        .findById(postId)
        .then(post => {
            if (!post) {
                throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('Could not find post', STATUS_VALIDATION_FAILED_ERROR);
                if (imageUrl !== post.imageUrl) {
                    clearImage(post.imageUrl);
                }
            }
            post.title = title;
            post.content - content;
            post.imageUrl = imageUrl;
            return post.save();
        })
        .then(result => {
            console.log('result')
            console.log(result)
            return res.status(STATUS_SUCCESS).json({ message: 'Post updated', post: result })
        })
        .catch(err => {
            handleErrorsOnAsyncCodeUsingNext(err, next);
        })
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(file, err => console.log(err));
}
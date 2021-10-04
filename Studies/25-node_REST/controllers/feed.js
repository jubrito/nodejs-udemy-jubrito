const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const Post = require('../models/post')
const User = require('../models/user');
const STATUS_SUCCESS = 200;
const STATUS_SUCCESS_RESOURCE_WAS_CREATED = 201;
const STATUS_VALIDATION_FAILED_ERROR = 422;
const STATUS_SERVER_SIDE_ERROR = 500;
const STATUS_FORBIDDEN = 403;

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
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post
        .find()
        .countDocuments()
        .then(numberOfItens => {
            totalItems = numberOfItens;
            return Post
                .find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res.status(STATUS_SUCCESS).json({ 
                message: 'Fetched posts successfully', 
                posts: posts, 
                totalItems: totalItems
            })
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
    let creator;
    const post = new Post({
        title: title, 
        content: content,
        imageUrl: imageUrl,
        creator: req.userId,
    })
    post
        .save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(userUpdated => {
            res
                .status(STATUS_SUCCESS_RESOURCE_WAS_CREATED)
                .json({
                    message: 'Post created successfully',
                    post: post,
                    creator: { _id: creator._id, name: creator.name }
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
            const userIsTryingToUpdateAPostCreatedBySomeoneElse = post.creator.toString() !== req.userId;
            if (!post) {
                throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('Could not find post', STATUS_VALIDATION_FAILED_ERROR);
            }
            if (userIsTryingToUpdateAPostCreatedBySomeoneElse) {
                throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('Not authorized', STATUS_FORBIDDEN);
            }
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
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

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post
        .findById(postId)
        .then(post => {
            if (!post) {
                throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('Could not find post', STATUS_VALIDATION_FAILED_ERROR);
            }
            const userIsTryingToUpdateAPostCreatedBySomeoneElse = post.creator.toString() !== req.userId;
            if (userIsTryingToUpdateAPostCreatedBySomeoneElse) {
                throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('Not authorized', STATUS_FORBIDDEN);
            }
            clearImage(post.imageUrl);
            return Post.findByIdAndDelete(postId);
        })
        .then(postWasRemoved => {
            return User.findById(req.userId);
        })
        .then(userMongooseModelFetchedFromDatabase => {
            // clear the relation between user and posts removing the post from the user model once it is deleted
            userMongooseModelFetchedFromDatabase.posts.pull(postId);
            return userMongooseModelFetchedFromDatabase.save();
        })
        .then(result => {
            res.status(STATUS_SUCCESS).json({ message: 'Post was deleted' })
        })
        .catch(err => {
            handleErrorsOnAsyncCodeUsingNext(err, next);
        });
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}
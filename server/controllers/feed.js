const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const socketIoConnection = require('../socket');
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
exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    const descendingWay = -1;
    try {
        const numberOfItens = await Post.find().countDocuments();
        const posts = await Post.find().populate('creator')
        .skip((currentPage - 1) * perPage)
        .sort({ createdAt: descendingWay })
        .limit(perPage);
        res.status(STATUS_SUCCESS).json({ 
            message: 'Fetched posts successfully', 
            posts: posts, 
            totalItems: numberOfItens
        })
    } catch (err) {
        handleErrorsOnAsyncCodeUsingNext(err, next);
    }
}


exports.postPosts = async (req, res, next) => {
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
        creator: req.userId,
    })
    try {
        const postCreated = await post.save();
        const user = await User.findById(req.userId);
        user.posts.push(post);
        const userUpdated = await user.save();
        const eventName = 'posts';
        const dataIWantToSentToAllConnectedUsers = {
            action: 'create',
            post: postCreated
        };
        socketIoConnection.getSocketIoConnection().emit(eventName, dataIWantToSentToAllConnectedUsers);
        res
            .status(STATUS_SUCCESS_RESOURCE_WAS_CREATED)
            .json({
                message: 'Post created successfully',
                post: post,
                creator: { _id: user._id, name: user.name }
            });
    } catch(err) {
        handleErrorsOnAsyncCodeUsingNext(err, next, STATUS_SERVER_SIDE_ERROR);
    }
}

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock(next, STATUS_SERVER_SIDE_ERROR);
        }
        res.status(STATUS_SUCCESS).json({ message: 'Post fetched', post: post})
    } catch(err) {
        handleErrorsOnAsyncCodeUsingNext(err, next);
    }
}

exports.updatePost = async (req, res, next) => {
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
    try {
        const post = await Post.findById(postId).populate('creator');
        const userIsTryingToUpdateAPostCreatedBySomeoneElse = post.creator._id.toString() !== req.userId;
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
        const newPost = await post.save();
        const eventName = 'posts';
        const dataIWantToSentToAllConnectedUsers = {
            action: 'update',
            post: post
        };
        socketIoConnection.getSocketIoConnection().emit(eventName, dataIWantToSentToAllConnectedUsers);
        return res.status(STATUS_SUCCESS).json({ message: 'Post updated', post: newPost })
    } catch(err) {
        handleErrorsOnAsyncCodeUsingNext(err, next);
    }
}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('Could not find post', STATUS_VALIDATION_FAILED_ERROR);
        }
        const userIsTryingToUpdateAPostCreatedBySomeoneElse = post.creator.toString() !== req.userId;
        if (userIsTryingToUpdateAPostCreatedBySomeoneElse) {
            throwErrorsOnSyncOrAsyncPassingToTheClosestCatchBlock('Not authorized', STATUS_FORBIDDEN);
        }
        clearImage(post.imageUrl);
        await Post.findByIdAndDelete(postId);
        const userMongooseModelFetchedFromDatabase = await User.findById(req.userId);
        // clear the relation between user and posts removing the post from the user model once it is deleted
        // userMongooseModelFetchedFromDatabase.posts.pull(postId);
        // await userMongooseModelFetchedFromDatabase.save();
        clearRelationBetween(userMongooseModelFetchedFromDatabase, userMongooseModelFetchedFromDatabase.posts, postId )

        const channelName = 'posts';
        const whatHappensToMyChannelInsideOfTheDataPackageBeingEmitted = {
            action: 'delete',
            post: postId
        }
        socketIoConnection.getSocketIoConnection().emit(channelName, whatHappensToMyChannelInsideOfTheDataPackageBeingEmitted);
        res.status(STATUS_SUCCESS).json({ message: 'Post was deleted' });
    } catch(err) {
        handleErrorsOnAsyncCodeUsingNext(err, next);
    };
}

const clearRelationBetween =  async (modelWhereTheRelationIsStored, modelWithFieldDataWhereIsStored, referenceToBeRemoved) => {
    modelWithFieldDataWhereIsStored.pull(referenceToBeRemoved);
    await modelWhereTheRelationIsStored.save();
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}
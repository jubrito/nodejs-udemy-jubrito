const { validationResult } = require('express-validator');
const STATUS_SUCCESS = 200;
const STATUS_SUCCESS_RESOURCE_WAS_CREATED = 201;
const STATUS_VALIDATION_FAILED_ERROR = 422;

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
        return res
            .status(STATUS_VALIDATION_FAILED_ERROR)
            .json({ 
                message: 'Validation failed, entered data is not valid',
                errors: errors.array()
            })
    }
    const title = req.body.title;
    const content = req.body.content;
    res
        .status(STATUS_SUCCESS_RESOURCE_WAS_CREATED)
        .json({
            message: 'Post created successfully',
            post: { 
                _id: new Date().toISOString(), 
                title: title, 
                content: content,
                creator: { name: 'Ju' },
                createdAt: new Date() 
            }
        });
}


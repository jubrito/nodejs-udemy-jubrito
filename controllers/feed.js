const STATUS_SUCCESS = 200;
const STATUS_SUCCESS_RESOURCE_WAS_CREATED = 201;

exports.getPosts = (req, res, next) => {
    res
        .status(STATUS_SUCCESS)
        .json({
            posts: [{
                title: 'First Post',
                content: 'Yay'
            }]
        })
}

exports.postPosts = (req, res, next) => {
    console.log('postou mana')
    const title = req.body.title;
    const content = req.body.content;
    res
        .status(STATUS_SUCCESS_RESOURCE_WAS_CREATED)
        .json({
            message: 'Post created successfully',
            post: { id: new Date().toISOString(), title: title, content: content }
        });
}
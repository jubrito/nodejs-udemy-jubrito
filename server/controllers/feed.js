const STATUS_SUCCESS = 200;
const STATUS_SUCCESS_RESOURCE_WAS_CREATED = 201;

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
    const title = req.body.title;
    const content = req.body.content;
    console.log(title, content);
    res
        .status(STATUS_SUCCESS_RESOURCE_WAS_CREATED)
        .json({
            message: 'Post created successfully',
            post: { id: new Date().toISOString(), title: title, content: content }
        });
}


exports.get404 = (req, res, next) => {
    res
        .status(404)
        .render(
            '404_not-found', { 
                pageTitle: 'Page not found', 
                path: '/404'
            });
};
exports.get500 = (req, res, next) => {
    res
        .status(500)
        .render('500_internal-error', {
            pageTitle: 'Error!',
            path: '/500',
            isAuthenticated: req.session.isAuthenticated
        });
};
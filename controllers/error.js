exports.get404 = (req, res, next) => {
    res
        .status(404)
        .render('errors/404_not-found', { pageTitle: 'Page not found', path: '/404'});
};
exports.get500 = (req, res, next) => {
    res
        .status(404)
        .render('errors/500_internal-error', { pageTitle: 'Page not found', path: '/500'});
};
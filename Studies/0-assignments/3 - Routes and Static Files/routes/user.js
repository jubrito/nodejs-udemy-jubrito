const express = require('express');
const path = require('path');
const rootDir = require('../util/path');
const router = express.Router();

router.get('/users', (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'view', 'user.html'));
    res.sendFile(path.join(__dirname, '..', 'view', 'user.html'));
});

router.get('/', (req, res, next) => {
    res.send('<a href="/users">users</a>');
});

module.exports = router;
const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();

router.get('/', (req, resp, next) => {
    // resp.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    resp.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
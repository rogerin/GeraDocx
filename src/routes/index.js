var express = require('express');
var router = express.Router();
let { testando, getFiles, download } = require('../controller/file')

// Home page route.
module.exports = router.get('/', testando)

module.exports = router.get('/getFiles', getFiles)

module.exports = router.post('/download', download)

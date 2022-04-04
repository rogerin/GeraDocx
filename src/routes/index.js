var express = require('express');
var router = express.Router();
let { testando, getFiles, download, upload, getIdentificadores, getDataSet } = require('../controller/file')
const path = require("path");

const multer = require('multer');

const dirPathInput = path.resolve(__dirname, '../../docx/input');
var storage = multer.diskStorage(
  {
      destination: dirPathInput,
      filename: function ( req, file, cb ) {
          cb( null, file.originalname );
      }
  }
);

const uploadFile = multer({ storage  });

module.exports = router.get('/getFiles', getFiles)

module.exports = router.get('/getDataSet', getDataSet)

module.exports = router.post('/getIdentificadores', getIdentificadores)

module.exports = router.post('/download', download)

module.exports = router.post('/upload', uploadFile.single('file'), async (req,res) => {
    res.send({
        upload: true,
        file: req.file        
    });
} )

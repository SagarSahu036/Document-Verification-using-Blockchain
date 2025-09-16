const express = require('express');
const router = express.Router();
const { uploadDocument, verifyDocument } = require('../controllers/documentController');
const multer = require('multer');


const storage = multer.memoryStorage(); // We store file in memory buffer
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadDocument);
router.post('/verify', upload.single('file'), verifyDocument);


module.exports = router;
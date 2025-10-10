const express = require('express');
const router = express.Router();
const { uploadDocument, verifyDocument, QRcodeVerification } = require('../controllers/documentController');
const multer = require('multer');


const storage = multer.memoryStorage(); // We store file in memory buffer
const upload = multer({ storage });

router.post('/upload', upload.single('document'), uploadDocument);
router.post('/verify', upload.single('document'), verifyDocument);
router.get('/verify/:hash', QRcodeVerification);



module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { saveCustomization, getCustomization } = require('../controllers/customizeController');

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/designs/');
    },
    filename: (req, file, cb) => {
        cb(null, `design-${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Configure upload for a single file named 'designImage'
// BUT also allow standard JSON requests for backward compatibility if needed, 
// though Multer middleware handles multipart/form-data.
// If we want to support both, we might need separate strategies, but let's stick to the user request of uploading.

router.post('/', upload.fields([
    { name: 'designImage', maxCount: 1 },
    { name: 'backDesignImage', maxCount: 1 }
]), (req, res, next) => {
    // Process uploaded files
    if (req.files) {
        if (req.files.designImage) {
            req.body.designImage = `/uploads/designs/${req.files.designImage[0].filename}`;
        }
        if (req.files.backDesignImage) {
            req.body.backDesignImage = `/uploads/designs/${req.files.backDesignImage[0].filename}`;
        }
    }
    next();
}, saveCustomization);

router.get('/:id', getCustomization);

module.exports = router;

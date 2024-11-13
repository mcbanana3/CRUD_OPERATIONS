const express = require('express');
const multer = require('multer');
const { createFaculty, getFaculties, updateFaculty, deleteFaculty, bulkUploadFaculties } = require('../controllers/facultyController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' }); 

router.post('/faculties', createFaculty);
router.get('/faculties', getFaculties);
router.put('/faculties/:id', updateFaculty);
router.delete('/faculties/:id', deleteFaculty);

router.post('/faculties/bulk-upload', upload.single('file'), bulkUploadFaculties);

module.exports = router;

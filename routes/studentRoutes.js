const express = require('express');
const multer = require('multer');
const { createStudent, getStudents, updateStudent, deleteStudent, bulkUploadStudents } = require('../controllers/studentController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/students', createStudent);
router.get('/students', getStudents);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.post('/students/bulk-upload', upload.single('file'), bulkUploadStudents);

module.exports = router;

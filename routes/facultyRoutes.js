const express = require('express');
const { createFaculty, getFaculties, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const router = express.Router();

router.post('/faculties', createFaculty);
router.get('/faculties', getFaculties);
router.put('/faculties/:id', updateFaculty);
router.delete('/faculties/:id', deleteFaculty);

module.exports = router;

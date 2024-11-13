const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Student = require('../models/Student');
const router = express.Router();

const upload = multer({ 
  dest: 'uploads/', 
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

router.post('/upload/student', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const students = results.map(student => ({
          name: student.name,
          email: student.email,
          age: student.age,
          course: student.course,
        }));
        
        await Student.insertMany(students);
        
        res.json({ message: 'Student data uploaded successfully' });
      } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ message: 'Error inserting student data' });
      } finally {
        fs.unlinkSync(req.file.path); 
      }
    })
    .on('error', (err) => {
      console.error('CSV parsing error:', err);
      res.status(500).json({ message: 'Error parsing CSV file' });
    });
});

module.exports = router;

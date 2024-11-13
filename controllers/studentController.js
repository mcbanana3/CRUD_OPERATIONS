const Student = require('../models/Student');
const fs = require('fs');
const csv = require('csv-parser');

exports.bulkUploadStudents = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const students = results.map((student) => ({
          name: student.name,
          email: student.email,
          age: student.age,
          course: student.course,
        }));

        await Student.insertMany(students);
        fs.unlinkSync(req.file.path); // Clean up the uploaded file
        res.json({ message: 'Student data uploaded successfully' });
      } catch (err) {
        console.error('Error inserting student data:', err);
        res.status(500).json({ message: 'Error inserting student data' });
      }
    })
    .on('error', (err) => {
      console.error('CSV parsing error:', err);
      res.status(500).json({ message: 'Error parsing CSV file' });
    });
};


exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

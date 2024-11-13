const fs = require('fs');
const csv = require('csv-parser');
const Faculty = require('../models/Faculty'); 

exports.bulkUploadFaculties = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const faculties = results.map((faculty) => ({
          name: faculty.name,
          email: faculty.email,
          department: faculty.department,
        }));

        await Faculty.insertMany(faculties);
        fs.unlinkSync(req.file.path); // Clean up the uploaded file
        res.json({ message: 'Faculty data uploaded successfully' });
      } catch (err) {
        console.error('Error inserting faculty data:', err);
        res.status(500).json({ message: 'Error inserting faculty data' });
      }
    })
    .on('error', (err) => {
      console.error('CSV parsing error:', err);
      res.status(500).json({ message: 'Error parsing CSV file' });
    });
};


exports.createFaculty = async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faculty deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

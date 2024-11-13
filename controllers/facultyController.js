const Faculty = require('../models/Faculty');
const Faculty = require('../models/Faculty');
const csvParser = require('csv-parser');
const fs = require('fs');

exports.bulkUploadFaculties = (req, res) => {
  const results = [];
  
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const faculties = await Faculty.insertMany(results);
        res.status(201).json({ message: 'Faculties uploaded successfully', faculties });
      } 
      catch (err) {
        res.status(500).json({ message: 'Error uploading faculties', error: err.message });
      } 
      finally {
        fs.unlinkSync(req.file.path);
      }
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

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Pending = require('../models/Pending'); 
router.get('/', async (req, res) => {
  try {
    const pendings = await Pending.find();
    res.json(pendings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', [
  body('name').notEmpty().trim().escape(),
  body('email').notEmpty().trim().escape(),
  body('date').notEmpty().trim().escape(),
  body('doctor').notEmpty().trim().escape(),
  body('medicine').notEmpty().trim().escape(),
  body('qty').notEmpty().trim().escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, date, doctor, medicine, qty } = req.body;

  const newMed = new Pending({
    name, 
    email, 
    date, 
    doctor, 
    medicine, 
    qty,
  });

  try {
    const savedMed = await newMed.save();
    res.status(201).json(savedMed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedMed = await Med.findByIdAndDelete(req.params.id);
    if (!deletedMed) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search', async (req, res) => {
  const { category, keyword } = req.query;

  // Ensure category is provided
  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  try {
    const pendings = await Pending.find(filter);
    res.json(pendings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', async (req, res) => {
  const medid = req.params.id;// Extract the medicine ID from the request parameters
  const updatedMed = req.body;// Get the updated medicine details from the request body

  try {
    const updated = await Pending.findByIdAndUpdate(medid, updatedMed, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json({ message: 'Medicine updated successfully', med: updated });
  } catch (err) {
     res.status(500).json({ message: err.message });
  }
});


module.exports = router;

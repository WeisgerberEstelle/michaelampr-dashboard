const express = require('express');
const router = express.Router();
const Deposit = require('../models/Deposit');
const auth = require('../middleware/auth');
const depositSchema = require('../validation/depositSchema');
const { processAllocations } = require('../services/fundService');

router.post('/', auth, async (req, res) => {
  try {
    const validatedData = depositSchema.parse(req.body);
    const { amount, rib, bic, date, allocations } = validatedData;

    const processedAllocations = await processAllocations(allocations, amount, date);

    const deposit = new Deposit({
      userId: req.user.id,
      amount,
      rib,
      bic,
      date: new Date(date),
      allocations: processedAllocations
    });

    await deposit.save();

    res.status(201).json(deposit);
  } catch (error) {
    console.error('Error creating deposit:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }

    res.status(500).json({
      message: error.message || 'Error creating deposit'
    });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user.id })
      .sort({ date: -1 })
      .lean();

    res.json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ message: 'Error fetching deposits' });
  }
});

module.exports = router;

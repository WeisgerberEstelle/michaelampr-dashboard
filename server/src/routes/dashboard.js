const express = require('express');
const router = express.Router();
const Deposit = require('../models/Deposit');
const auth = require('../middleware/auth');
const { getFundsById } = require('../services/fundService');
const { computeSummary, computeLineChartData, computePieChartData } = require('../services/dashboardService');

router.get('/summary', auth, async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user.id }).lean();
    const fundsById = await getFundsById();

    res.json(computeSummary(deposits, fundsById));
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Error fetching dashboard summary' });
  }
});

router.get('/linechart', auth, async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user.id }).lean();
    const fundsById = await getFundsById();

    res.json(computeLineChartData(deposits, fundsById));
  } catch (error) {
    console.error('Error fetching linechart data:', error);
    res.status(500).json({ message: 'Error fetching linechart data' });
  }
});

router.get('/piechart', auth, async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user.id }).lean();
    const fundsById = await getFundsById();

    res.json(computePieChartData(deposits, fundsById));
  } catch (error) {
    console.error('Error fetching piechart data:', error);
    res.status(500).json({ message: 'Error fetching piechart data' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Fund = require('../models/Fund');

router.get('/', async (req, res) => {
  try {
    const funds = await Fund.find({}, 'isin fundName');
    res.json(funds);
  } catch (error) {
    console.error('Error fetching funds:', error);
    res.status(500).json({ message: 'Error fetching funds' });
  }
});

router.get('/valorisations/latest', async (req, res) => {
  try {
    const funds = await Fund.find({});

    const latestValorisations = funds.map(fund => {
      const sortedValorisations = fund.valorisations.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );

      const latestValorisation = sortedValorisations[0];

      return {
        isin: fund.isin,
        fundName: fund.fundName,
        latestValorisation: latestValorisation ? {
          date: latestValorisation.date,
          value: latestValorisation.value
        } : null
      };
    });

    res.json(latestValorisations);
  } catch (error) {
    console.error('Error fetching latest valorisations:', error);
    res.status(500).json({ message: 'Error fetching latest valorisations' });
  }
});

module.exports = router;

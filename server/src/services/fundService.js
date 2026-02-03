const Fund = require('../models/Fund');

function getSharePrice(fund, date) {
  const targetDate = new Date(date);

  const valorisation = fund.valorisations
    .filter(v => new Date(v.date) <= targetDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  if (!valorisation) {
    throw new Error(`No valuation found for fund ${fund.fundName} on or before ${date}`);
  }

  return valorisation.value;
}

async function processAllocations(allocations, amount, date) {
  return Promise.all(
    allocations.map(async (allocation) => {
      const fund = await Fund.findOne({ isin: allocation.isin });
      if (!fund) {
        throw new Error(`Fund with ISIN ${allocation.isin} not found`);
      }

      const sharePrice = getSharePrice(fund, date);
      const amountInvested = amount * (allocation.percentage / 100);
      const sharesAcquired = amountInvested / sharePrice;

      return {
        fundId: fund._id,
        isin: fund.isin,
        fundName: fund.fundName,
        percentage: allocation.percentage,
        amountInvested,
        sharePrice,
        sharesAcquired
      };
    })
  );
}

module.exports = {
  getSharePrice,
  processAllocations
};

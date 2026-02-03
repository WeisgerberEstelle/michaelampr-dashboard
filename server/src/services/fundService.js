const Fund = require('../models/Fund');

function getSharePriceAtDate(fund, date) {
  const targetDate = new Date(date);

  const valorisation = fund.valorisations
    .filter(v => new Date(v.date) <= targetDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  return valorisation ? valorisation.value : null;
}

function getSharePrice(fund, date) {
  const price = getSharePriceAtDate(fund, date);

  if (price === null) {
    throw new Error(`No valuation found for fund ${fund.fundName} on or before ${date}`);
  }

  return price;
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

function getAllocationCurrentValue(allocation, fund) {
  const latestValo = fund.valorisations
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  if (!latestValo) return 0;

  return allocation.sharesAcquired * latestValo.value;
}

async function getFundsById() {
  const funds = await Fund.find({}).lean();

  const fundsById = {};
  funds.forEach(fund => {
    fundsById[fund._id.toString()] = fund;
  });

  return fundsById;
}

module.exports = {
  getSharePriceAtDate,
  getSharePrice,
  processAllocations,
  getAllocationCurrentValue,
  getFundsById
};

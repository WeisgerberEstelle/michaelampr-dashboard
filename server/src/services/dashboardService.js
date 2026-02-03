const { getSharePriceAtDate } = require('./fundService');

function getAllocationCurrentValue(allocation, fund) {
  const latestValo = fund.valorisations
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  if (!latestValo) return 0;

  return allocation.sharesAcquired * latestValo.value;
}

function computeSummary(deposits, fundsById) {
  let totalInvested = 0;
  let totalCurrentValue = 0;

  deposits.forEach(deposit => {
    deposit.allocations.forEach(allocation => {
      const fund = fundsById[allocation.fundId.toString()];
      if (!fund) return;

      totalInvested += allocation.amountInvested;
      totalCurrentValue += getAllocationCurrentValue(allocation, fund);
    });
  });

  return {
    totalCurrentValue,
    totalInvested,
    gain: totalCurrentValue - totalInvested
  };
}

function computeLineChartData(deposits, fundsById) {
  const allDatesSet = new Set();
  Object.values(fundsById).forEach(fund => {
    fund.valorisations.forEach(v => {
      allDatesSet.add(v.date.toISOString().split('T')[0]);
    });
  });

  const allDates = [...allDatesSet].sort();

  return allDates.map(dateStr => {
    const date = new Date(dateStr);
    let portfolioValue = 0;

    deposits.forEach(deposit => {
      if (new Date(deposit.date) > date) return;

      deposit.allocations.forEach(allocation => {
        const fund = fundsById[allocation.fundId.toString()];
        if (!fund) return;

        const price = getSharePriceAtDate(fund, dateStr);
        if (price) {
          portfolioValue += allocation.sharesAcquired * price;
        }
      });
    });

    return { date: dateStr, value: portfolioValue };
  });
}

function computePieChartData(deposits, fundsById) {
  const pieChartMap = {};

  deposits.forEach(deposit => {
    deposit.allocations.forEach(allocation => {
      const fund = fundsById[allocation.fundId.toString()];
      if (!fund) return;

      const currentValue = getAllocationCurrentValue(allocation, fund);
      const key = fund.isin;

      if (!pieChartMap[key]) {
        pieChartMap[key] = { name: fund.fundName, value: 0 };
      }
      pieChartMap[key].value += currentValue;
    });
  });

  return Object.values(pieChartMap).map(entry => ({
    name: entry.name,
    value: entry.value
  }));
}

module.exports = {
  getAllocationCurrentValue,
  computeSummary,
  computeLineChartData,
  computePieChartData
};

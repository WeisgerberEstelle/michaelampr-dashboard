const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  rib: { type: String, required: true },
  bic: { type: String, required: true },
  date: { type: Date, required: true },
  allocations: [{
    fundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fund', required: true },
    isin: { type: String, required: true },
    fundName: { type: String, required: true },
    percentage: { type: Number, required: true },
    amountInvested: { type: Number, required: true },
    sharePrice: { type: Number, required: true },
    sharesAcquired: { type: Number, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Deposit', depositSchema);

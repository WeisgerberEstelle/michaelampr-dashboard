const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  isin: { type: String, unique: true, index: true },
  fundName: String,
  valorisations: [{
    date: Date,
    value: Number
  }]
});

module.exports = mongoose.model('Fund', fundSchema);

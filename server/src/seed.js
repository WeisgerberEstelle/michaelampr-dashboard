require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Fund = require('./models/Fund');
const path = require('path');

const data = require(path.join(__dirname, '../../fake_isins_valorisations_with_fundname.json'));

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await Fund.deleteMany({});
    console.log('Funds collection cleared');

    const result = await Fund.insertMany(data);
    console.log(`${result.length} fonds inseres en base`);

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();

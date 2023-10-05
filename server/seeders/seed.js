const db = require('../config/connection');
const { User, Star } = require('../models');
const userSeeds = require('./userSeeds.json');
const starSeeds = require('./starSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    await cleanDB('Star', 'stars');

    await cleanDB('User', 'users');

    await User.create(userSeeds);

    await Star.create(starSeeds)
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});


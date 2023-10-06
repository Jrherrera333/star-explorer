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

    const totalUserSeeds = userSeeds.length;
    const totalStarSeeds = starSeeds.length;
    let starsAdded = 0;
    let starsRejected = 0;
    let starsAddedWithoutUserUpdate = 0;
    for (let i = 0; i < starSeeds.length; i++) {
      let adjustedStar = JSON.parse(JSON.stringify(starSeeds[i]));
      let finderString = adjustedStar.firstFinder;
      // Look up the corresponding user from finderString
      const user = await User.findOne({username:finderString});
      if (user) {
        // If a user is found for the original *String* version of firstFinder,
        // replace firstFinder in the cloned Star object (adjustedStar) with the
        // ID of the user.
        adjustedStar.firstFinder = user._id;
        // Now create a Star object/document, with a Star having 
        // firstFinder as a User ID rather than String (username) as
        // it had been in the seed.
        const { _id, firstFinder } = await Star.create(adjustedStar);
        if ( _id && firstFinder ) {
          // Update the associated user, adding the Star's ID to the stars[]
          // array of that user.
          const user2 = await User.findOneAndUpdate(
            { _id: firstFinder },
            {
              $addToSet: {
                stars: _id,  // Note: This SHOULD be a Star ID, not user ID (TODO - must verify)
              },
            }
          );
          starsAdded++;
        } else {
          starsRejected++;
          console.log('star not created = ', adjustedStar);
        }
      } else {
        starsRejected++;
        console.log('no user found in seed processing for username = "',finderString, '"');
      }
    }
    console.log('\n\nseed processing all done!:');
    console.log('  total star seeds  = ', totalStarSeeds);
    console.log('  stars added       = ', starsAdded);
    console.log('  stars rejected    = ', starsRejected);
    console.log('  users added       = ', totalUserSeeds, '\n\n\n');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

});


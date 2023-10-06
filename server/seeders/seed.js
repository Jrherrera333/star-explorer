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

    // await Star.create(starSeeds)
    for (let i = 0; i < starSeeds.length; i++) {
      // TODO - hokey, but this should work as a "deep" clone (i.e. including planets) - 
      // TODO - until we finesse this later (if we do).
      let adjustedStar = JSON.parse(JSON.stringify(starSeeds[i]));
      // TODO - now, we need to adjust adjustedStar.firstFinder so that
      // TODO - it is a User ID rather than the username specified in
      // TODO - in starSeeds[i].
      let finderString = adjustedStar.firstFinder;
      // Look up the corresponding user from finderString
      const user = await User.findOne({username:finderString});
      console.log('retrieved user = "', user, '"');
      if (user) {
        // TODO - get rid of this console log once done testing
        console.log('ID for username "', finderString, '" is "', user._id, '"');
        // If a user is found for the original *String* version of firstFinder,
        // replace firstFinder in the cloned Star object (adjustedStar) with the
        // ID of the user.
        adjustedStar.firstFinder = user._id;
        console.log('NEW adjusted Star = "', adjustedStar, '"');
        // Now create a Star object/document, with a Star having 
        // firstFinder as a User ID rather than String (username) as
        // it had been in the seed.
        const { _id, firstFinder } = await Star.create(adjustedStar);
        // Update the associated user, adding the Star's ID to the stars[]
        // array of that user.
        const user2 = await User.findOneAndUpdate(
          { _id: firstFinder },
          // { username: thoughtAuthor },  // TODO - delete once we know we don't need to refer to this
          {
            $addToSet: {
              stars: _id,  // Note: This SHOULD be a Star ID, not user ID (TODO - must verify)
            },
          }
        );
    } else {
        console.log('no user found in seed processing for username = "',finderString, '"');
      }
      // TODO - uncomment and fix once we are ready.
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});


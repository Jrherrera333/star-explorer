const { User, Star } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express')

const resolvers = {
  Query: {
    users: async () => {
      return User.find()
    },

    user: async (parent, { username }) => {
      return User.findOne({ username });
    },

    stars: async (parent) => {
      return await Star.find().populate('planets');
    },

    star: async (parent, { starId }) => {
      thisStar = await Star.findOne({ _id: starId })
      console.log(thisStar);
      return thisStar
    },

    planets: async (parent, { starId }) => {
      thisStar = await Star.findOne({ _id: starId }).populate("planets")
      return thisStar.planets;
    },

    planet: async (parent, { planetId }) => {
      thisStar = await Star.findOne({ "planets._id": planetId }, { "planets.$": 1 })
      const [planet] = thisStar.planets;
      return planet;
    },

    me: async (parent, args, context) => {
      console.log(context.user);
      if (context.user) {
        return User.findOne({ args }).populate("stars");
      }
      throw AuthenticationError
    }
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },

    addStar: async (parent, { starName, declination, rightAscension, distanceFromEarth }, context) => {
      console.log(context.user)
      if (context.user) {
        const newStar = await Star.create(
          {
            starName,
            firstFinder: context.user._id,
            declination,
            rightAscension,
            distanceFromEarth
          }
        );

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { stars: newStar._id } }
        )
        return newStar;
      }
      throw AuthenticationError
    },

    addPlanet: async (parent, { starId, ...planet }, context) => {
      if (context.user) {
        return Star.findOneAndUpdate(
          { _id: starId },
          {
            $addToSet: {
              planet: {
                planetName, distanceFromStar, circularOrbit, stableRotation, water, gravity
              }
            },
          },
          {
            new: true
          }

        )
      }
      throw AuthenticationError;
    },

    editStar: async (parent, { starId, starName, declination, rightAscension,
      distanceFromEarth }, context) => {
      if (context.user) {
        return Star.findOneAndUpdate(
          { _id: starId },
          {
            starName,
            declination,
            rightAscension,
            distanceFromEarth
          },
          {
            new: true,
            runValidators: true,
          }
        )
      }
      throw AuthenticationError
    },

    editPlanet: async (parent, { starId, planetId, planetName, circularOrbit, stableRotation, water, gravity }, context) => {
      if (context.user) {
        let thisStar = await Star.findById(starId);
        if (thisStar === null) {
          console.log('star for id ', starId, ' not found - no planet updated');
          return null;
        }
        let planetFound = false;
        console.log('planet count = ', thisStar.planets.length);
        for (let i = 0; !planetFound && i < thisStar.planets.length; i++) {
          console.log('planet id comparison ', thisStar.planets[i]._id, ' vs ', planetId);
          if (thisStar.planets[i]._id == planetId) {  //Note: ==, not ===
            console.log('planet found at ', i, ' for id ', thisStar.planets[i]._id);
            planetFound = true;
            if (planetName) {
              console.log('setting planet name to "' + planetName + '"');
              thisStar.planets[i].planetName = planetName;
            }
            if (circularOrbit !== undefined && circularOrbit !== null) {
              thisStar.planets[i].circularOrbit = circularOrbit;
            }
            if (stableRotation !== undefined && stableRotation !== null) {
              thisStar.planets[i].stableRotation = stableRotation;
            }
            if (water !== undefined && water !== null) {
              thisStar.planets[i].water = water;
            }
            if (gravity) {
              thisStar.planets[i].gravity = gravity;
            }
          }
        }
        if (!planetFound) {
          console.log('planet not found for id ', planetId, ' orbiting star ', starId, ' - no planet update');
          return null;
        }
        console.log('editStar return follows...');
        return Star.findOneAndUpdate(
          { _id: starId },
          thisStar,
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError("user not authenticated");
    },

    deleteStar: async (parent, { starId }, context) => {
      if (context.user) {

        const newStar = await Star.findOneAndDelete({
          _id: starId
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { starId } }
        )
        return newStar;
      }
      throw AuthenticationError("User not authenticated");
    },

    deletePlanet: async (parent, { starId, planetId }, context) => {

      if (context.user) {
        console.log(starId);
        console.log(planetId);
        return Star.findByIdAndUpdate(
          { _id: starId },
          { $pull: { planets: { _id: planetId } } },
          {
            new: true
          }
        );
      }
      throw new AuthenticationError("User not authenticated");
    }
  }
}

// removeThought: async (parent, { thoughtId }, context) => {
//   if (context.user) {
//     const thought = await Thought.findOneAndDelete({
//       _id: thoughtId,
//       thoughtAuthor: context.user.username,
//     });

//     await User.findOneAndUpdate(
//       { _id: context.user._id },
//       { $pull: { thoughts: thought._id } }
//     );

//     return thought;
//   }
//   throw AuthenticationError;
// },

// addThought: async (parent, { thoughtText }, context) => {
//   if (context.user) {
//     const thought = await Thought.create({
//       thoughtText,
//       thoughtAuthor: context.user.username,
//     });

//     await User.findOneAndUpdate(
//       { _id: context.user._id },
//       { $addToSet: { thoughts: thought._id } }
//     );

//     return thought;
//   }
//   throw AuthenticationError;
//   ('You need to be logged in!');
// },

//   throw AuthenticationError;
// },
// 
// removeComment: async (parent, { thoughtId, commentId }, context) => {
//   if (context.user) {
//     return Thought.findOneAndUpdate(
//       { _id: thoughtId },
//       {
//         $pull: {
//           comments: {
//             _id: commentId,
//             commentAuthor: context.user.username,
//           },
//         },
//       },
//       { new: true }
//     );
//   }
//   throw AuthenticationError;
// },


module.exports = resolvers;

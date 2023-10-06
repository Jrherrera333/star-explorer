const { User, Star } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

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

    planets: async (parent, {starId}) => {
      thisStar = await Star.findOne({_id: starId}).populate("planets")
      return thisStar.planets;
    },

    planet: async (parent, { planetId }) => {
      thisStar = await Star.findOne({"planets._id": planetId}, {"planets.$":1}  )
      const [planet] = thisStar.planets;
      return  planet;
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

    addStar: async (parent, {starName, declination, rightAscension, distanceFromEarth}, context) => {
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

    // addComment: async (parent, { thoughtId, commentText }, context) => {
//   if (context.user) {
//     return Thought.findOneAndUpdate(
//       { _id: thoughtId },
//       {
//         $addToSet: {
//           comments: { commentText, commentAuthor: context.user.username },
//         },
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//   }

    addPlanet: async (parent, { starId, ...planet }, context) => {
      if (context.user) {
        return Star.findOneAndUpdate(
          { _id: starId},
          {
            $addToSet: {
              planet: [{
                planetName, distanceFromStar, circularOrbit, stableRotation, water, gravity
              }]
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
          { starName,
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

    editPlanet: async (parent, { starId, ...planet }, context) => {
      if (context.user) {
        return Star.findOneAndUpdate(
          { _id: star.planet._id },
          {
            $addToSet: {
              planet: [{
                planetName, distanceFromStar, declination, rightAscension, circularOrbit, stableRotation, water, gravity
              }]
            },
          },
          {
            new: true
          }

        )
      }
      throw AuthenticationError;
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
      throw AuthenticationError;
    },

    deletePlanet: async (parent, { planetId }, context) => {
      if (context.user) {
        return Star.findOneAndDelete({
          planetId: planetId,
        });
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

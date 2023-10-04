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

    stars: async () => {
      return Star.find().populate('starName');
    },

    star: async (parent, { starName }) => {
      return Star.findOne({ starName })
    },

    planets: async () => {
      return Star.Planet.find().populate('planetName')
    },

    planet: async (parent, { planetName }) => {
      return Star.Planet.findOne({ planetName })
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("stars");
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

    addStar: async (parent, { starName }, context) => {
      if (context.user) {
        const newStar = await Star.create({
          starName
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { stars: newStar._id } }
        )
      }
      throw AuthenticationError
    },

    addPlanet: async (parent, { ...star }, context) => {
      if (context.user) {
        return Star.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              planet: {
                planetName, star, distanceFromStar, declination, rightAscention, circularOrbit, stableRotation, water, gravity
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

    editStar: async (parent, { starId, starName }, context) => {
      if (context.user) {
        return Star.findOneAndUpdate(
          { _id: starId },
          { $addToSet: { starName: starName } }
        )
      }
      throw AuthenticationError
    },

    editPlanet: async (parent, { ...star }, context) => {
      if (context.user) {
        return Star.findOneAndUpdate(
          { _id: star.planet._id },
          {
            $addToSet: {
              planet: {
                planetName, star, distanceFromStar, declination, rightAscention, circularOrbit, stableRotation, water, gravity
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

    deleteStar: async (parent, { starId }, context) => {
      if (context.user) {
        const newStar = Star.findOneAndDelete({
          _id: starId,
          starCreator: context.user.username
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { star: star.id } }
        )
        return newStar;
      }
      throw AuthenticationError;
    },

    deletePlanet: async (parent, { id }, context) => {
      if (context.user) {
        return Star.findOneAndUpdate({
          _id: starId,
        }),
        {
          $removeFromSet: {
            planet: {
              _id: id
            }
          }
        }
      }
      throw AuthenticationError
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

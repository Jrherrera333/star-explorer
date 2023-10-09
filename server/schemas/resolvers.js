const { User, Star } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express')
const { ApolloServer } = require('apollo-server-express');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find()
    },

    user: async (parent, { username }) => {
      return await User.findOne({ username });
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
        return await User.findOne({ args }).populate("stars");
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
      console.log('context.user: ', context.user)
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

    addPlanet: async (parent, args, context) => {
      const { starId, planetName, distanceFromStar, circularOrbit, stableRotation, water, gravity } = args;

      if (context.user) {
        try {
          const updatedStar = await Star.findOneAndUpdate(
            { _id: starId },
            {
              $addToSet: {
                planets: {
                  planetName,
                  distanceFromStar,
                  circularOrbit,
                  stableRotation,
                  water,
                  gravity,
                },
              },
            },
            { new: true }
          );

          if (!updatedStar) {
            throw new Error('Star not found');
          }

          return updatedStar.planets.find((planet) => planet.planetName === planetName);
        } catch (error) {
          throw new Error('Failed to add planet');
        }
      }

      throw new AuthenticationError('User is not authenticated');
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


    editPlanet: async (parent, args, context) => {
      const { starId, planetName, planetId, circularOrbit, stableRotation, water, gravity } = args;

      if (context.user) {
        try {
          const star = await Star.findById(starId);

          if (!star) {
            throw new Error(`Star with ID ${starId} not found.`);
          }

          const planet = star.planets.find((p) => p._id.toString() === planetId);

          if (!planet) {
            throw new Error(`Planet with ID ${planetId} not found.`);
          }

          if (planetName !== undefined) {
            planet.planetName = planetName;
          }
          if (circularOrbit !== undefined) {
            planet.circularOrbit = circularOrbit;
          }
          if (stableRotation !== undefined) {
            planet.stableRotation = stableRotation;
          }
          if (water !== undefined) {
            planet.water = water;
          }
          if (gravity !== undefined) {
            planet.gravity = gravity;
          }

          await star.save();

          return planet;
        } catch (err) {
          console.error(err);
          throw new Error('Failed to edit planet.');
        }
      } else {
        throw new Error('User not authenticated.');
      }
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


module.exports = resolvers;

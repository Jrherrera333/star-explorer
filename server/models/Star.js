const { Schema, model } = require('mongoose');
const User = require('./User');

const starSchema = new Schema({
    starName: {
      type: String,
      required: "you must enter a star name",
      minlength: 1
    },

    firstFinder: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    declination: {
      type: Number
    },

    rightAscension: {
      type: Number
    },

    distanceFromEarth: {
      type: Number
    },

    planets: [
      {
        planetName: {
        type: String,
        isUnique: true,
        required: "you must enter a planet name",
        minlength: 1
        },

        circularOrbit: {
          type: Boolean
        },

        stableRotation: {
          type: Boolean
        },

        water: {
          type: Boolean
        },

        gravity: {
          type: Number
        }

      }
    ]
})

const Star = model('Star', starSchema);

module.exports = Star;

const { Schema, model } = require('mongoose');
const User = require('./User');

const starSchema = new Schema({
    starName: {
      type: String,
      required: "you must enter a star name",
      minlength: 1
    },

    firstFinder: {
      type: String,
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

// const thoughtSchema = new Schema({
//   thoughtText: {
//     type: String,
//     required: 'You need to leave a thought!',
//     minlength: 1,
//     maxlength: 280,
//     trim: true,
//   },
//   thoughtAuthor: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     get: (timestamp) => dateFormat(timestamp),
//   },
//   comments: [
//     {
//       commentText: {
//         type: String,
//         required: true,
//         minlength: 1,
//         maxlength: 280,
//       },
//       commentAuthor: {
//         type: String,
//         required: true,
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now,
//         get: (timestamp) => dateFormat(timestamp),
//       },
//     },
//   ],
// });

const Star = model('Star', starSchema);

module.exports = Star;

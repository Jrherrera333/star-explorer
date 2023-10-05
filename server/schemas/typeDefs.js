const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    stars: [Star]
  }

   type Star {
    _id: ID
    starName: String!
    planets: [Planet]
    firstFinder: User!
  }

  type Planet {
    _id: ID
    planetName: String!
    star: Star!
    distanceFromStar: Number
    declination: Number
    rightAscension: Number
    circularOrbit: Boolean
    stableRotation: Boolean
    water: Boolean
    gravity: Number
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]

    user(username: String!): User

    stars: [Star]

    star(starId: ID!): Star

    planets(starId: ID!): [Planet]

    planet(planetId: ID!): Planet

    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth

    login(email: String!, password: String!): Auth

    addStar(starName: String!): Star

    addPlanet(star: Star!, distanceFromStar: Number, declination: Number, rightAscension: Number, circularOrbit: Boolean, stableRotation: Boolean, water: Boolean, gravity: Number, firstFinder: User!): Planet

    editStar(starId: ID, starName: String): Star

    editPlanet(star: Star, _id: ID, distanceFromStar: Number, declination: Number, rightAscension: Number, circularOrbit: Boolean, stableRotation: Boolean, water: Boolean, gravity: Number, firstFinder: User!, planetHabbitable: Boolean): Planet

    deleteStar(starId: ID): Star

    deletePlanet(_id: ID): Planet
  } 
`;

module.exports = typeDefs;

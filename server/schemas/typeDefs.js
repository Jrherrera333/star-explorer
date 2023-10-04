const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    thoughts: [Thought]!
  }

   type Star {
    _id: ID
    starName: String!
  }

  type Planet {
    _id: ID
    star: Star!
    distanceFromStar: Float
    declination: Float
    rightAscension: Float
    circularOrbit: Boolean
    stableRotation: Boolean
    water: Boolean
    gravity: Float
    firstFinder: User!
    planetHabitable: Boolean
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
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addStar(starName: String!): Star
    addPlanet(distanceFromStar: Float, declination: Float, rightAscension: Float, circularOrbit: Boolean, stableRotation: Boolean, water: Boolean, gravity: Float, firstFinder: User!, planetHabbitable: Boolean): Planet
    editStar(starId: ID, starName: String): Star
    editPlanet(_id: ID, distanceFromStar: Float, declination: Float, rightAscension: Float, circularOrbit: Boolean, stableRotation: Boolean, water: Boolean, gravity: Float, firstFinder: User!, planetHabbitable: Boolean): Planet
    deleteStar(starId: ID, starName: String): Star
    deletePlanet(_id: ID, distanceFromStar: Float, declination: Float, rightAscension: Float, circularOrbit: Boolean, stableRotation: Boolean, water: Boolean, gravity: Float, firstFinder: User!, planetHabbitable: Boolean): Planet
  } 
`;

module.exports = typeDefs;

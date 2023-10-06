const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    stars: [Star]
  }

  input UserInput {
    _id: ID
    username: String
    email: String
    password: String
    stars: [StarInput]
  }

   type Star {
    _id: ID
    starName: String
    planets: [Planet]
    firstFinder: ID!
    declination: Float
    rightAscension: Float
    distanceFromEarth: Float
  }

  input StarInput {
    _id: ID
    starName: String!
    planets: [PlanetInput]
    firstFinder: ID!
    declination: Float
    rightAscension: Float
    distanceFromEarth: Float
  }

  type Planet {
    _id: ID
    planetName: String!
    circularOrbit: Boolean
    stableRotation: Boolean
    water: Boolean
    gravity: Float
  }

  input PlanetInput{
      _id: ID
      planetName: String!
      circularOrbit: Boolean
      stableRotation: Boolean
      water: Boolean
      gravity: Float
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

    addStar(starName: String!, declination: Float, rightAscension: Float, distanceFromEarth: Float): Star

    addPlanet(starId: ID!, distanceFromStar: Float, circularOrbit: Boolean, stableRotation: Boolean, water: Boolean, gravity: Float): Planet

    editStar(starId: ID!, starName: String!, declination: Float!, rightAscension: Float!, distanceFromEarth: Float!): Star

    editPlanet(starId: ID!, planetId: ID!, circularOrbit: Boolean, stableRotation: Boolean, water: Boolean, gravity: Float): Planet

    deleteStar(starId: ID): Star

    deletePlanet(planetId: ID): Planet
  } 
`;

module.exports = typeDefs;

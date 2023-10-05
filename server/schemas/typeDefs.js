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
    starName: String!
    planets: [Planet]
    firstFinder: String!
  }

  input StarInput {
    _id: ID
    starName: String!
    planets: [PlanetInput]
    firstFinder: String!
  }

  type Planet {
    _id: ID
    planetName: String!
    distanceFromStar: Float
    declination: Float
    rightAscension: Float
    circularOrbit: Boolean
    stableRotation: Boolean
    water: Boolean
    gravity: Float
  }

  input PlanetInput{
      _id: ID
      planetName: String!
      star: StarInput!
      distanceFromStar: Float
      declination: Float
      rightAscension: Float
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

    addStar(starName: String!): Star

    addPlanet(star: StarInput!, distanceFromStar: Float, declination: Float, rightAscension: Float, circularOrbit: Boolean, stableRotation: Boolean, water: Boolean, gravity: Float, firstFinder: UserInput!): Planet

    editStar(starId: ID, starName: String): Star

    editPlanet(star: StarInput, _id: ID, distanceFromStar: Float, declination: Float, rightAscension: Float, circularOrbit: Boolean, stableRotation: Boolean, water: Boolean, gravity: Float, firstFinder: UserInput!, planetHabitable: Boolean): Planet

    deleteStar(starId: ID): Star

    deletePlanet(_id: ID): Planet
  } 
`;

module.exports = typeDefs;

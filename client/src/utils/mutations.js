import { gql } from '@apollo/client';

export const ADD_PLANET = gql`
mutation addPlanet($starId: ID!, $planetName: String!, $distanceFromStar: Float, $circularOrbit: Boolean, $stableRotation: Boolean, $water: Boolean, $gravity: Float) {
  addPlanet(starId: $starId, planetName: $planetName, distanceFromStar: $distanceFromStar, circularOrbit: $circularOrbit, stableRotation: $stableRotation, water: $water, gravity: $gravity) {
    _id
    planetName
    circularOrbit
    stableRotation
    water
    gravity
  }
}`

export const ADD_STAR = gql`
mutation Mutation($starName: String!, $declination: Float, $rightAscension: Float, $distanceFromEarth: Float) {
  addStar(starName: $starName, declination: $declination, rightAscension: $rightAscension, distanceFromEarth: $distanceFromEarth) {
    _id
    starName
    planets {
      _id
      planetName
      circularOrbit
      stableRotation
      water
      gravity
    }
    firstFinder
    declination
    rightAscension
    distanceFromEarth
  }
}`

export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username
      email
      password
      stars {
        _id
        starName
        planets {
          _id
          planetName
          circularOrbit
          stableRotation
          water
          gravity
        }
        firstFinder
        declination
        rightAscension
        distanceFromEarth
      }
    }
  }
}`

export const DELETE_PLANET = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username
      email
      password
      stars {
        _id
        starName
        planets {
          _id
          planetName
          circularOrbit
          stableRotation
          water
          gravity
        }
        firstFinder
        declination
        rightAscension
        distanceFromEarth
      }
    }
  }
}`

export const DELETE_STAR = gql`
mutation deleteStar($starId: ID) {
  deleteStar(starId: $starId) {
    _id
    starName
    planets {
      _id
      planetName
      circularOrbit
      stableRotation
      water
      gravity
    }
    firstFinder
    declination
    rightAscension
    distanceFromEarth
  }
}`

export const EDIT_PLANET = gql`
mutation editPlanet($starId: ID!, $planetId: ID!, $circularOrbit: Boolean, $stableRotation: Boolean, $water: Boolean, $gravity: Float) {
  editPlanet(starId: $starId, planetId: $planetId, circularOrbit: $circularOrbit, stableRotation: $stableRotation, water: $water, gravity: $gravity) {
    _id
    planetName
    circularOrbit
    stableRotation
    water
    gravity
  }
}`

export const EDIT_STAR = gql`
mutation editStar($starId: ID!, $starName: String!, $declination: Float!, $rightAscension: Float!, $distanceFromEarth: Float!) {
  editStar(starId: $starId, starName: $starName, declination: $declination, rightAscension: $rightAscension, distanceFromEarth: $distanceFromEarth) {
    _id
    starName
    planets {
      _id
      planetName
      circularOrbit
      stableRotation
      water
      gravity
    }
    firstFinder
    declination
    rightAscension
    distanceFromEarth
  }
}`

export const LOGIN = gql`
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
      email
      password
      stars {
        _id
        starName
        planets {
          _id
          planetName
          circularOrbit
          stableRotation
          water
          gravity
        }
        firstFinder
        declination
        rightAscension
        distanceFromEarth
      }
    }
  }
}`
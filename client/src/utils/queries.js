import { gql } from '@apollo/client';


export const QUERY_ME = gql`
query me {
  me {
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
}`

export const QUERY_PLANET = gql`
query planet($planetId: ID!) {
  planet(planetId: $planetId) {
    _id
    planetName
    circularOrbit
    stableRotation
    water
    gravity
  }
}`

export const QUERY_PLANETS = gql`
query planets($starId: ID!) {
  planets(starId: $starId) {
    _id
    planetName
    circularOrbit
    stableRotation
    water
    gravity
  }
}`

export const QUERY_STAR = gql`
query star($starId: ID!) {
  star(starId: $starId) {
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

export const QUERY_STARS = gql`
query stars {
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
}`

export const QUERY_USER = gql`
query user($username: String!) {
  user(username: $username) {
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
`
export const QUERY_USERS = gql`
query Users {
  users {
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
}`

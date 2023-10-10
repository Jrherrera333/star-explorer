import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@apollo/client'; 
import { useMutation } from '@apollo/client';

import { QUERY_STAR, QUERY_STARS, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';
import { EDIT_STAR } from '../utils/mutations';

const SingleStar = () => {
  // Use `useParams()` to retrieve value of the route parameter `:starId`
  const { starId } = useParams();
  console.log('SingleStar : starId at useParams ', starId);
  console.log('SingleStar : useParams ', useParams());

  const { loading, data } = useQuery(QUERY_STAR, {
    variables: { starId: starId },
  });

  console.log('SingleStar : data, loading : ', data, loading);

  const star = data?.star || {};

  console.log('SingleStar : star after DB : ', star);

  const [editStar, { error }] = useMutation
  (EDIT_STAR, {
      refetchQueries: [
          QUERY_STARS,
          'getStars',
          QUERY_ME,
          'me'
      ]
  });
  
  // let declination = star.declination;
  const [declination, setDeclination] = useState(star.declination);
  const [rightAscension, setRightAscension] = useState(star.rightAscension);
  const [distanceFromEarth, setDistanceFromEarth] = useState(star.setDistanceFromEarth);
  
  console.log(declination)
  console.log(rightAscension)
//   export const EDIT_STAR = gql`
// mutation editStar($starId: ID!, $starName: String!, $declination: Float!, $rightAscension: Float!, $distanceFromEarth: Float!) {
//   editStar(starId: $starId, starName: $starName, declination: $declination, rightAscension: $rightAscension, distanceFromEarth: $distanceFromEarth) {
//     _id
//     starName
//     planets {
//       _id
//       planetName
//       circularOrbit
//       stableRotation
//       water
//       gravity
//     }
//     firstFinder
//     declination
//     rightAscension
//     distanceFromEarth
//   }
// }`

  // editStar: async (parent, { starId, starName, declination, rightAscension,
  //   distanceFromEarth }, context) => {
  //   if (context.user) {
  //     return Star.findOneAndUpdate(
  //       { _id: starId },
  //       {
  //         starName,
  //         declination,
  //         rightAscension,
  //         distanceFromEarth
  //       },
  //       {
  //         new: true,
  //         runValidators: true,
  //       }
  //     )
  //   }
  //   throw AuthenticationError
  // },

  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await editStar({
        variables: {
          starId: star._id,
          starName: star.starName,
          firstFinder: star.firstFinder,
          declination: parseFloat(declination),
          rightAscension: parseFloat(rightAscension),
          distanceFromEarth: parseFloat(distanceFromEarth)
        }
      })
    } catch (err) {
      console.error(err);  // TODO
    }

    // try {
    //     const { data } = await addPlanet({
    //         variables: {
    //             starId: star._id,
    //             planetName: planetNameState,
    //             distanceFromStar: distanceFromStarState,
    //             circularOrbit: isOrbitChecked,
    //             stableRotation: isRotationChecked,
    //             water: isWaterChecked,
    //             gravity: gravityState
    //         },
    //     });

    //     setPlanet({});
    // } catch (err) {
    //     console.error(err);
    // }
  };

  const handleChange = (event) => {
    console.log("SingleStar : event : ", event);
    const { name, value } = event.target;
    console.log("SingleStar : event name & value", name, ' & ', value);
    if (name === 'declination') {
      setDeclination(value);
    } else if (name === 'rightAscension') {
      setRightAscension(value);
    } else if (name === 'distanceFromEarth') {
      setDistanceFromEarth(value);
    } else {
      console.log('SingleStar : unexpected event : ', name);
    }
    console.log('SingleStar : post-change state : ',
      '\ndec ', declination,
      '\nrightAsc ', rightAscension,
      '\ndist ', distanceFromEarth);
  };

  let starCanBeModified = (Auth.loggedIn() && Auth.getProfile().data._id === star.firstFinder);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-3">
      <h3 className="card-header bg-dark text-light p-2 m-0">
        {star.starName}
      </h3>
        {starCanBeModified ? (
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
          <div className="star-editable-outer">
            <div className="star-editable col-12 col-lg-9">
              <table>
                <tbody>
                  <tr><td className="star-stat-label">Declination (degrees north)</td><td className="star-stat-val"><input type="text" name="declination" value={declination ||star.declination} onChange={handleChange} /></td></tr>
                  <tr><td className="star-stat-label">Right Ascension</td><td className="star-stat-val"><input type="text" name="rightAscension" value={rightAscension || star.rightAscension} onChange={handleChange} /></td></tr>
                  <tr><td className="star-stat-label">Distance from Earth (light years)</td><td className="star-stat-val"><input type="text" name="distanceFromEarth" value={distanceFromEarth || star.distanceFromEarth} onChange={handleChange} /></td></tr>
                  <tr><td className="star-stat-label">Planet Count</td><td className="star-stat-val">{star.planets.length}</td></tr>
                </tbody>
              </table>
            </div>
            {star.planets.map((planet) => (
          <div key={planet._id} className="card mb-3 star-readonly-outer">
            <table>
            <tbody>
              <tr><td>Planet Name</td><td>{planet.planetName}</td></tr>
              <tr><td>has circular orbit</td><td>{planet.circularOrbit?"yes":"no"}</td></tr>
              <tr><td>has stable rotation</td><td>{planet.stableRotation?"yes":"no"}</td></tr>
              <tr><td>has adequate water</td><td>{planet.water?"yes":"no"}</td></tr>
              <tr><td>gravity (m/s<sup>2</sup>)</td><td>{planet.gravity}</td></tr>
            </tbody>
            </table>
          </div>
          
         ))}
        <Link className="star-editable-outer" to={`/planet/${starId}`}>
          Add a planet
        </Link> 


            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </div>
          </form>
        ) : (
          <>
          <div className="star-readonly-outer">
            <div className="star-readonly col-12 col-lg-9">
              <table>
                <tbody>
                  <tr><td className="star-stat-label">Declination (degrees north)</td><td className="star-stat-val">{declination || star.declination}</td></tr>
                  <tr><td className="star-stat-label">Right Ascension</td><td className="star-stat-val">{rightAscension || star.rightAscension}</td></tr>
                  <tr><td className="star-stat-label">Distance from Earth (light years)</td><td className="star-stat-val">{distanceFromEarth || star.distanceFromEarth}</td></tr>
                  <tr><td className="star-stat-label">Planet Count</td><td className="star-stat-val">{star.planets.length}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
            {star.planets.map((planet) => (
          <div key={planet._id} className="card mb-3 star-readonly-outer">
            <table>
            <tbody>
              <tr><td>Planet Name</td><td>{planet.planetName}</td></tr>
              <tr><td>has circular orbit</td><td>{planet.circularOrbit?"yes":"no"}</td></tr>
              <tr><td>has stable rotation</td><td>{planet.stableRotation?"yes":"no"}</td></tr>
              <tr><td>has adequate water</td><td>{planet.water?"yes":"no"}</td></tr>
              <tr><td>gravity (m/s<sup>2</sup>)</td><td>{planet.gravity}</td></tr>
            </tbody>
            </table>
          </div>
         ))}
        </>


      )
  }
  </div>);
};

export default SingleStar;

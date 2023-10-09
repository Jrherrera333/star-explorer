// import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_STAR } from '../../utils/mutations';
import { QUERY_STARS, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

import { parseRightAsc, numericRightAscToString } from '../../utils/starMath';

// TODO - this Star code is still very much a work-in-progress,
// and probably has a lot of "dead wood" code that ultimately will
// be either changed or removed.

function Star(props) {

  console.log('just prior to star clone');
  let localStar = JSON.parse(JSON.stringify(props.star));  // Clone props.star

  console.log('just after star clone');
  console.log('props.star', props.star);
  console.log('clone of star', localStar);
  const currentUserProfile = Auth.loggedIn() && Auth.getProfile();
  console.log('Star : user profile : ', currentUserProfile);
  console.log('Star : star : ', props.star);
  console.log('Star : current star : finder : ', props.star.firstFinder);
  let isEditable = false;
  if (currentUserProfile) {
    const currentUserId = currentUserProfile.data._id;
    const currentUserName = currentUserProfile.data.username;
    console.log('Star : user : ', currentUserProfile);
    console.log('Star : user : _id : ', currentUserId);
    isEditable = Auth.loggedIn() && currentUserId &&
      currentUserId === props.star.firstFinder;
  }
  console.log('Star is editable : ', isEditable);

  const [addStar, { error }] = useMutation
  (ADD_STAR, {
    refetchQueries: [
      QUERY_STARS,
      'getStars',
      QUERY_ME,
      'me'
    ]
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log('localStar before addStar call: ', localStar);
    //   setStar(localStar);
      console.log('localStar at try clause: ', localStar);
    //   console.log('star after call to setStar: ', star);  
      const { data } = await addStar({
        variables: {
          starName: localStar.starName,
          declination: localStar.declination,
          rightAscension: localStar.rightAscension,
          distanceFromEarth: localStar.distanceFromEarth,
        },
      });

    //   setStar({}); // TODO
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    console.log('on change triggered at ' + (new Date()));
    const { name, value } = event.target;
    if (name === 'rightAscension') {
        localStar.rightAscension = parseFloat(value);
        if (isNaN(localStar.rightAscension)) {
            localStar.rightAscension = parseRightAsc(value);
        }
    } else if (name === 'starName') {
        localStar.starName = value;
    } else {
        localStar[name] = parseFloat(value);
    }
    console.log('localStar after change = ', localStar);
  };

  return (
    <div>
      <h3>Some Star Information ... </h3>  {/*TODO*/}

      {isEditable ? (
        <>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
                <table>
                    <tbody>
                    <tr><td className="star-stat-label">Star Name</td><td><input name="starName" type="text" value={props.star.starName} onChange={handleChange} /></td></tr>
                    <tr><td className="star-stat-label">Declination (degrees north)</td><td><input name="declination"  value={props.star.declination} onChange={handleChange} /></td></tr>
                    <tr><td className="star-stat-label">Right Ascension</td><td><input name="rightAscension" value={props.star.rightAscension} onChange={handleChange} /></td></tr>
                    <tr><td className="star-stat-label">Distance from Earth (light years)</td><td><input name="distanceFromEarth" value={props.star.distanceFromEarth} onChange={handleChange} /></td></tr>
                    </tbody>
                </table>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Submit Star Data Changes
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
                <table>
                    <tbody>
                    <tr><td className="star-stat-label">Star Name</td><td>{props.star.starName}</td></tr>
                    <tr><td className="star-stat-label">Declination (degrees north)</td><td>{props.star.declination}</td></tr>
                    <tr><td className="star-stat-label">Right Ascension</td><td>{props.star.rightAscension}</td></tr>
                    <tr><td className="star-stat-label">Distance from Earth (light years)</td><td>{props.star.distanceFromEarth}</td></tr>
                    </tbody>
                </table>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default Star;

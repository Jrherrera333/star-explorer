import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_STAR } from '../../utils/mutations';
import { QUERY_STARS, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const StarForm = () => {

  const [star, setStar] = useState({});

  let localStar = {};

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
      setStar(localStar);
      console.log('localStar after setStar call using localStar: ', localStar);
      console.log('star after call to setStar: ', star);  
      const { data } = await addStar({
        variables: {
          starName: localStar.starName,
          declination: parseFloat(localStar.declination),
          rightAscension: parseFloat(localStar.rightAscension),
          distanceFromEarth: parseFloat(localStar.distanceFromEarth),
        },
      });

      setStar({}); // TODO
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    localStar[name] = value;
  };

  return (
    <div>
      <h3>What's Your New Discovery?</h3>

      {Auth.loggedIn() ? (
        <>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              <p>Star Name: <input name="starName" onChange={handleChange} /></p>
              <p>Declination: <input name="declination"  onChange={handleChange} /></p>
              <p>Right Ascension: <input name="rightAscension"  onChange={handleChange} /></p>
              <p>Distance from Earth (light years): <input name="distanceFromEarth"  onChange={handleChange} /></p>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Add Star Information
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
        <p>
          You need to be logged in to Update your Star System. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default StarForm;

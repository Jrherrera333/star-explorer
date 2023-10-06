import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_STAR } from '../../utils/mutations';
import { QUERY_STARS, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const StarForm = () => {
//   const [thoughtText, setThoughtText] = useState('');
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
      setStar(localStar);  
      const { data } = await addStar({
        variables: {
          starName: star.starName,
          declination: star.declination,
          rightAscension: star.rightAscension,
          distanceFromEarth: star.distanceFromEarth,
        //   thoughtText,
          firstFinder: Auth.getProfile().data._id  // TODO is _id right?
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
    // if (name === 'thoughtText' && value.length <= 280) {
    //   setThoughtText(value);
    // }
  };

  return (
    <div>
      <h3>What's on your techy mind?</h3>

      {Auth.loggedIn() ? (
        <>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              {/* <textarea
                name="thoughtText"
                placeholder="Here's a new thought..."
                value={thoughtText}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea> */}
              <p>Star Name: <input name="starName" onChange={handleChange} /></p>
              <p>Declination: <input name="declination"  onChange={handleChange} /></p>
              <p>Right Ascension: <input name="rightAscension"  onChange={handleChange} /></p>
              <p>Distance from Earth (km): <input name="distanceFromEarth"  onChange={handleChange} /></p>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Add Thought
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
          You need to be logged in to share your thoughts. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default StarForm;

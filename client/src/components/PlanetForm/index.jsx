import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_PLANET } from '../../utils/mutations';
import { QUERY_PLANETS, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const PlanetForm = ({star}) => {

  const [planet, setPlanet] = useState({});
  const [isOrbitChecked, setIsOrbitChecked] = useState(false)
  const [isRotationChecked, setIsRotationChecked] = useState(false)
  const [isWaterChecked, setIsWaterChecked] = useState(false);


  let localPlanet = {};

  const [addPlanet, { error }] = useMutation
  (ADD_PLANET, {
    refetchQueries: [
      QUERY_PLANETS,
      'getPlanets',
      QUERY_ME,
      'me'
    ]
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      setPlanet(localPlanet);
      const { data } = await addPlanet({
        variables: {
        planetName: localPlanet.planetName,
        distanceFromStar: localPlanet.distanceFromStar,
        circularOrbit: localPlanet.circularOrbit,
        stableRotation: localPlanet.stableRotation,
        water: localPlanet.water,
        gravity: localPlanet.gravity    
        },
      });

      setPlanet({}); // TODO
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if(name === "water"){
        setIsWaterChecked(!isWaterChecked);
    }

    else if(name === "circularOrbit"){
        setIsOrbitChecked(!isOrbitChecked);
    }

    else if(name === "stableRotation"){
        setIsRotationChecked(!isRotationChecked);
    }

    else{
    localPlanet[name] = value
    }

    console.log (localPlanet);
  };

  return (
    <div>
      <h3>Describe your planet</h3>

      {Auth.loggedIn() ? (
        <>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              <p>Planet Name: <input name="planetName" onChange={handleChange} /></p>
              <label>
              <input type = "checkbox" name = "circularOrbit" checked = {isOrbitChecked} onChange={handleChange}/>
              Is the orbit circular?
              </label>

              <label>
                <input type = "checkbox" name = "stableRotation" checked = {isRotationChecked} onChange = {handleChange} />
                Does the planet have a stable rotation?
              </label>

              <label>
                <input type = "checkbox" name = "water" checked = {isWaterChecked} onChange = {handleChange} />
                Does the planet have water?
              </label>

              <p>Gravity: <input name="gravity" onChange={handleChange} /></p>
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
          You need to be logged in to edit a planet. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default PlanetForm;

// const handleCheckboxChange = () => {
//     setIsChecked(!isChecked);
//   };

<<<<<<< HEAD
// const [isChecked, setIsChecked] = useState(false);
=======
// const [isChecked, setIsChecked] = useState(false);





>>>>>>> 94faa030cc7b3c9ec7e6ce107d7d0658bb61e178

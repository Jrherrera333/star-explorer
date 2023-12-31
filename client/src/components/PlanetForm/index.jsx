import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_PLANET } from '../../utils/mutations';
import { QUERY_PLANETS, QUERY_ME, QUERY_STAR } from '../../utils/queries';

import Auth from '../../utils/auth';

const PlanetForm = ({star}) => {
    const navigate = useNavigate();

    const [planet, setPlanet] = useState({});
    const [isOrbitChecked, setIsOrbitChecked] = useState(false)
    const [isRotationChecked, setIsRotationChecked] = useState(false)
    const [isWaterChecked, setIsWaterChecked] = useState(false)
    const [planetNameState, setPlanetNameState] = useState("");
    const [gravityState, setGravityState] = useState(0);
    const [distanceFromStarState, setDistanceFromStarState] = useState(0)
console.log(star)
    const [addPlanet, { error}] = useMutation
        (ADD_PLANET, {
            refetchQueries: [,
                QUERY_STAR,
                QUERY_PLANETS,
                QUERY_ME
          
            ]
        });

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const { data } = await addPlanet({
                variables: {
                    starId: star._id,
                    planetName: planetNameState,
                    distanceFromStar: distanceFromStarState,
                    circularOrbit: isOrbitChecked,
                    stableRotation: isRotationChecked,
                    water: isWaterChecked,
                    gravity: gravityState
                },
            });
            console.log(data)
            console.log(navigate)
            navigate(-1);
            // setPlanet({});
        } catch (err) {
            console.error(err);
        }
    };


    // const [planet, setPlanet] = useState({});
    // const [isOrbitChecked, setIsOrbitChecked] = useState(false)
    // const [isRotationChecked, setIsRotationChecked] = useState(false)
    // const [isWaterChecked, setIsWaterChecked] = useState(false)
    // const [planetNameState, setPlanetNameState] = useState("");
    // const [gravityState, setGravityState] = useState(0);
    // const [distanceFromStarState, setDistanceFromStarState] = useState(0)

    const handleChange = (event) => {
        console.log("WE ARE IN HANDLE CHANGE")
        console.log("EVENT: ", event);
        const { name, value } = event.target;

        if (name === "water") {
            setIsWaterChecked(!isWaterChecked);
        }

        else if (name === "circularOrbit") {
            setIsOrbitChecked(!isOrbitChecked);
        }

        else if (name === "stableRotation") {
            setIsRotationChecked(!isRotationChecked);
        }

        else if(name === "planetName"){
            setPlanetNameState(value);
        }

        else if(name === "gravity"){
            setGravityState(parseFloat(value))
        }

        else if(name === "distanceFromStar"){
            setDistanceFromStarState(parseFloat(value));
        }

        else {
            console.log("WE ARE IN THE ELSE: NAME: ", name, ", VALUE: ", value);
        }
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

                            
                            <p>DistanceFromStar: <input name="distanceFromStar" type="number" step="any" onChange={handleChange} /></p>

                            <label>
                                <input type="checkbox" name="circularOrbit" checked={isOrbitChecked} onChange={handleChange} />
                                Is the orbit circular?
                            </label>

                            <label>
                                <input type="checkbox" name="stableRotation" checked={isRotationChecked} onChange={handleChange} />
                                Does the planet have a stable rotation?
                            </label>

                            <label>
                                <input type="checkbox" name="water" checked={isWaterChecked} onChange={handleChange} />
                                Does the planet have water?
                            </label>

                            <p>Gravity: <input name="gravity" type="number" step="any" onChange={handleChange} /></p>
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






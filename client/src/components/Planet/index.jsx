import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { EDIT_PLANET } from '../../utils/mutations';
import { QUERY_ME, QUERY_STARS } from '../../utils/queries';

import Auth from '../../utils/auth'

const PlanetList = ({ star, planet }) => {

    const currentUser = Auth.currentUser;
    const isEditable = currentUser && currentUser.userName === star.firstFinder;

    const { loading, data } = useQuery(QUERY_STARS)

    const stars = data?.stars || {}
    console.log("loading:", loading)
    console.log("data:", data)
    console.log("stars:", stars)

    // const [addPlanet, { error }] = useMutation
    //     (EDIT_PLANET, {
    //         refetchQueries: [
    //             // QUERY_PLANETS,
    //             // 'getPlanet',
    //             // QUERY_ME,
    //             // "me"
    //         ]
    //     })

    const handleFieldChange = async (event) => {
        event.preventDefault();

        const { name, value } = event.target;

        try {
            const { data } = await addPlanet({
                variables: {
                    planetName: name === 'planetName' ? value : planetName,
                    circularOrbit: name === 'circularOrbit' ? value : circularOrbit,
                    stableRotation: name === 'stableRotation' ? value : stableRotation,
                    water: name === 'water' ? value : water,
                    gravity: name === 'gravity' ? value : gravity,
                },
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            {stars.planets?.map((list) => (
                <div>
                    <div> {list.id}</div>
                    <div> {list.planetName}</div>
                </div>
            ))}
            {/* {stars ?
                stars.planets?.map((list) => (
                    <div key={list._id} className="card mb-3">
                        <h4 className="card-header bg-primary text-light p-2 m-0">
                            <Link className="text-light" to={`/planets/${list.planetName}`}>
                                {list.planetName} <br />
                                <span style={{ fontSize: '1rem' }}>
                                    {isEditable ? (
                                        <div>
                                            <input type="text" value={list.planetName} onChange={handleFieldChange} />
                                            <label htmlFor="choices">Circular Orbit</label>
                                            <select id="circularorbit" value={list.circularOrbit} onChange={handleFieldChange}>
                                                <option value="true">true</option>
                                                <option value="false">false</option>
                                            </select>
                                            <select id="stableRotationChoices" value={list.stableRotation} onChange={handleFieldChange}>
                                                <option value="true">true</option>
                                                <option value="false">false</option>
                                            </select>
                                            <select id="waterChoices" value={list.water} onChange={handleFieldChange}>
                                                <option value="true">true</option>
                                                <option value="false">false</option>
                                            </select>
                                            <input type="text" value={list.gravity} onChange={handleFieldChange} />

                                        </div>
                                    ) : (
                                        <div>
                                            <p>{list.planetName}</p>
                                            <p>{list.circularOrbit}</p>
                                            <p>{list.stableRotation}</p>
                                            <p>{list.water}</p>
                                            <p>{list.gravity}</p>
                                        </div>
                                    )}
                                </span>
                            </Link>
                        </h4>
                    </div>
                )) :
                <div>
                    <p>No planet found</p>
                </div>} */}
        </div>
    );
}

export default PlanetList;
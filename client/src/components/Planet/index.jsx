import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { EDIT_PLANET } from '../../utils/mutations';
import { QUERY_ME, QUERY_PLANET } from '../../utils/queries';

import Auth from '../../utils/auth'

const PlanetList = ({ star, planet }) => {

    const currentUser = Auth.currentUser;
    const isEditable = currentUser && currentUser.userName === star.firstFinder;

    const [addPlanet, { error }] = useMutation
        (EDIT_PLANET, {
            refetchQueries: [
                QUERY_PLANET,
                'getPlanet',
                QUERY_ME,
                "me"
            ]
        })

    const handleFieldChange = async (event) => {
        event.preventDefault();

        try {
            const { data } = await addPlanet({
                variables: {
                    planetName,
                    circularOrbit,
                    stableRotation,
                    water,
                    gravity
                }
            })
        }
        catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            {planet &&
                planet.map((list) => (
                    <div key={list.planetName} className="card mb-3">
                        <h4 className="card-header bg-primary text-light p-2 m-0">
                            <Link className="text-light" to={`/planets/${list.planetName}`}>
                                {list.planetName} <br />
                                <span style={{ fontSize: '1rem' }}>
                                    {isEditable ? (
                                        <div>
                                            <input type="text" value={list.planetName} onChange={handleFieldChange} />
                                            <label htmlFor="choices">Circular Orbit</label>
                                            <select id="choices" value={list.circularOrbit} onChange={handleFieldChange}>
                                                <option value="true">true</option>
                                                <option value="false">false</option>
                                            </select>
                                            <select id="choices" value={list.stableRotation} onChange={handleFieldChange}>
                                                <option value="true">true</option>
                                                <option value="false">false</option>
                                            </select>
                                            <select id="choices" value={list.water} onChange={handleFieldChange}>
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
                ))}
        </div>
    );
}

export default PlanetList;
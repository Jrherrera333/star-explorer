import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import {QUERY_STAR} from "../utils/queries";

import EditPlanet from "../components/EditPlanet"

import Auth from "../utils/auth"

const AddPlanet = () => {
    const {StarId, PlanetId} = useParams();

    const {loading, data} = useQuery(QUERY_STAR, {
        variables: {starId: StarId,
                    planetId: PlanetId            
        }
    });

    const star = data.star;
    const planet = data.planet || {};

    let planetCanBeEdited = (Auth.loggedIn() && Auth.getProfile().data._id === star.firstFinder);

    if(loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="my-3">
          <h3 className="card-header bg-dark text-light p-2 m-0">
            {planet.planetName}
          </h3>
          <div>
            {planetCanBeEdited ? (
              <EditPlanet />
            ) : (
              <></>
            )}
          </div>
        </div>
      );
}

export default AddPlanet;
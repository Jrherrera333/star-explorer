import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import {QUERY_STAR} from "../utils/queries";

import PlanetForm from "../components/PlanetForm"

import Auth from "../utils/auth"

const AddPlanet = () => {
    const {starId} = useParams();

    const {loading, data} = useQuery(QUERY_STAR, {
        variables: {starId: starId}
    });

    const star = data.star || {};

    let planetCanBeCreated = (Auth.loggedIn() && Auth.getProfile().data._id === star.firstFinder);

    if(loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="my-3">
          <h3 className="card-header bg-dark text-light p-2 m-0">
            {star.starName}
          </h3>
          <div>
            {planetCanBeCreated ? (
              <PlanetForm />
            ) : (
              <></>
            )}
          </div>
        </div>
      );
}

export default AddPlanet;
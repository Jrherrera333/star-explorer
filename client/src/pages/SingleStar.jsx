// Import the `useParams()` hook
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

// import CommentList from '../components/CommentList';
// import CommentForm from '../components/CommentForm';

import { QUERY_STAR } from '../utils/queries';  // TODO ?

import Auth from '../utils/auth';  // TODO - can we do this here?

const SingleStar = () => {
  // Use `useParams()` to retrieve value of the route parameter `:starId`
  const { starId } = useParams();

  const { loading, data } = useQuery(QUERY_STAR, {
    // pass URL parameter
    variables: { starId: starId },
  });

  const star = data?.star || {};

  let starCanBeModified = (Auth.loggedIn() && Auth.getProfile().data._id === star.firstFinder);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-3">
      <h3 className="card-header bg-dark text-light p-2 m-0">
        {star.starName}  // TODO - should we ever allow the starName to be modified? Answer: NO!!!
      </h3>
      <Link to={`/planet/${starId}`}>
        Add a planet
      </Link>
      <div>
        {starCanBeModified ? (
          <span>Name: <input type='...'></input></span>
        ) : (
          <></>
        )}
      </div>

      {/* <div className="bg-light py-4">
        <blockquote
          className="p-4"
          style={{
            fontSize: '1.5rem',
            fontStyle: 'italic',
            border: '2px dotted #1a1a1a',
            lineHeight: '1.5',
          }}
        >
          {thought.thoughtText}
        </blockquote>
      </div>

      <div className="my-5">
        <CommentList comments={thought.comments} />
      </div>
      <div className="m-3 p-4" style={{ border: '1px dotted #1a1a1a' }}>
        <CommentForm thoughtId={thought._id} />
      </div> */}
    </div>
  );
};

export default SingleStar;

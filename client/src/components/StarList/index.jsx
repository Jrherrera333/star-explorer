import { Link } from 'react-router-dom';
import Star from '../Star';

const StarList = ({
  stars,
  title,
  showTitle = true,
  showUsername = true,
}) => {
  if (!stars.length) {
    return <h3>No Star Listed</h3>;
  }

  return (
    <div>
      {showTitle && <h3>{title}</h3>}
      {stars &&
        stars.map((star) => (
          <div key={star._id} className="card mb-3">
            <Star star={star} />
            {/* <h4 className="card-header bg-primary text-light p-2 m-0">
              {showUsername ? (
                <Link
                  className="text-light"
                  to={`/profiles/${star.firstFinder}`}
                >
                  {star.firstFinder} <br />
                  <span style={{ fontSize: '1rem' }}>
                    had this star on {star.createdAt}
                  </span>
                </Link>
              ) : (
                <>
                  <span style={{ fontSize: '1rem' }}>
                    You had this star on {star.createdAt}
                  </span>
                </>
              )}
            </h4>
            <div className="card-body bg-light p-2">
              <p>{star.thoughtText}</p>
            </div>
            <Link
              className="btn btn-primary btn-block btn-squared"
              to={`/stars/${star._id}`}
            >
              Join the discussion on this star.
            </Link> */}
          </div>
        ))}
    </div>
  );
};

export default StarList;

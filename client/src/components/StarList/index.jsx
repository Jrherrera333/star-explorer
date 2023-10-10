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
          </div>
        ))}
    </div>
  );
};

export default StarList;

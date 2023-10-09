import { useQuery } from '@apollo/client';

import StarList from '../components/StarList';
import StarForm from '../components/StarForm';

import { QUERY_STARS } from '../utils/queries';

const Home = () => {
  const { loading, data } = useQuery(QUERY_STARS);
  const stars = data?.stars || [];

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >
          <StarForm />
        </div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <StarList
              stars={stars}
              title="Star Catalog"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;

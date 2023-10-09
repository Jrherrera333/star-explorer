import { useQuery } from '@apollo/client';

import StarList from '../components/StarList';
import StarForm from '../components/StarForm';
import PlanetForm from '../components/PlanetForm';
import Star from '../components/Star';

import { QUERY_STARS } from '../utils/queries';

const HomeTest = () => {
  const { loading, data } = useQuery(QUERY_STARS);
  const stars = data?.stars || [];

//   const [star, setStar] = useState({});

//   setStar(stars[0]);

  console.log('first star on HomeTest = ', stars[0]);

//   console.log('star object on HomeTest after setStar = ', star);

  return (
    <main>
        {/* TODO - notice this special headline - to alert us that we are
        using test code rather than what we should be!!! */}
    <h1><font color="#FF0080" size="36">HomeTest</font></h1>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >
          {/* <StarForm /> */}
        </div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : ( <div>
            // TODO - couldn't get "tuple" to work with this
This is homeTest
            {/* <Star star={stars[0]} /> */}
            <Star star={stars[3]} />
            <Star star={stars[4]} />
            <Star star={stars[5]} />
            <Star star={stars[6]} />
            <PlanetForm star={stars[8]} />
            <Star star={stars[7]} />
            <Star star={stars[8]} />
            <Star star={stars[9]} />
            </div>
            // <StarList
            //   stars={stars}
            //   title="Some Star-related verbiage goes here (TODO)"
            // />
          )}
        </div>
      </div>
    </main>
  );
};

export default HomeTest;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { BasicDsl } from '../../shared/types';

function DslListItem({ dslData }: { dslData: BasicDsl }) {
  const history = useHistory();

  function handleClick() {
    history.push(`/dsl/${dslData.id}`);
  }

  return (
    <li onClick={handleClick} style={{ cursor: 'default' }}>
      Time Since Last {dslData.name}
    </li>
  );
}
function Home() {
  const [recentDsls, setRecentDsls] = useState<BasicDsl[]>([]);

  useEffect(() => {
    (async () => {
      setRecentDsls((await axios.get('/api/feed/recent')).data);
    })();
  }, []);

  return (
    <div>
      <p>Most Recent Counters</p>

      <ul>
        {recentDsls.length > 0
          ? recentDsls.map((recentDsl) => {
              return <DslListItem dslData={recentDsl} />;
            })
          : 'None.'}
      </ul>
    </div>
  );
}

export default Home;

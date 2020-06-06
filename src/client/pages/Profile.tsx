import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import { Profile as IProfile, BasicDsl } from '../../shared/types';

function DslListItem({ name, id }: { name: string; id: number }) {
  const history = useHistory();

  function handleClick() {
    history.push(`/dsl/${id}`);
  }

  return (
    <li onClick={handleClick} style={{ cursor: 'default' }}>
      Time Since Last {name}
    </li>
  );
}

function Profile() {
  const { userId } = useParams();

  const [profileData, setProfileData] = useState<IProfile | '404'>(null as any);
  const [profileDsls, setProfileDsls] = useState<BasicDsl[]>(null as any);

  useEffect(() => {
    (async () => {
      const profileResponse = (await axios.get(`/api/profile/${userId}`)).data;
      if (profileResponse !== 'FAILURE') {
        setProfileData(profileResponse);
      } else {
        setProfileData('404');
      }

      const dslsResponse = (await axios.get(`/api/profile/dsls/${userId}`)).data;
      if (dslsResponse !== 'FAILURE') {
        setProfileDsls(dslsResponse);
      }
    })();
  }, []);

  return (
    <div style={{ marginTop: '1em' }}>
      {profileData ? (
        profileData === '404' ? (
          'Not Found'
        ) : (
          <div>
            <div style={{ display: 'flex' }}>
              <img
                src={profileData.profilePicture}
                width={75}
                height={75}
                style={{ marginRight: '1em' }}
              />
              <h1>{profileData.name}</h1>
            </div>

            <div style={{ maxWidth: '900px', margin: 'auto' }}>
              <h2>Counters</h2>
              <ul>
                {profileDsls
                  ? profileDsls.map((dsl) => {
                      return <DslListItem key={dsl.id} name={dsl.name} id={dsl.id} />;
                    })
                  : 'Loading...'}
              </ul>
            </div>
          </div>
        )
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default Profile;

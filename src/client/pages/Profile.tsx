import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import { Profile as IProfile, BasicDsl, LoginInfo } from '../../shared/types';

function DslListItem({
  name,
  id,
  admin,
  token,
  refreshList
}: {
  name: string;
  id: number;
  admin: boolean;
  token: string;
  refreshList: () => void;
}) {
  const history = useHistory();

  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  function handleClick() {
    history.push(`/dsl/${id}`);
  }
  async function handleDeleteClick() {
    const response = (
      await axios.post('/api/dsl/delete', {
        id,
        token
      })
    ).data;

    if (response === 'SUCCESS') {
      refreshList();
    }
  }

  return (
    <div style={{ cursor: 'default', userSelect: 'none' }}>
      <li onClick={handleClick}>Time Since Last {name}</li>
      {admin && (
        <div>
          <ul>
            <li onClick={handleDeleteClick}>Delete</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function Profile({ userId: loginUserId, token }: { userId: string; token: string }) {
  const { userId } = useParams();

  const [profileData, setProfileData] = useState<IProfile | '404'>(null as any);
  const [profileDsls, setProfileDsls] = useState<BasicDsl[]>(null as any);

  async function refreshList() {
    const dslsResponse = (await axios.get(`/api/profile/dsls/${userId}`)).data;
    if (dslsResponse !== 'FAILURE') {
      setProfileDsls(dslsResponse);
    }
  }
  useEffect(() => {
    (async () => {
      const profileResponse = (await axios.get(`/api/profile/${userId}`)).data;
      if (profileResponse !== 'FAILURE') {
        setProfileData(profileResponse);
      } else {
        setProfileData('404');
      }

      refreshList();
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
                      return (
                        <DslListItem
                          key={dsl.id}
                          name={dsl.name}
                          id={dsl.id}
                          admin={loginUserId === userId}
                          refreshList={refreshList}
                          token={token}
                        />
                      );
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

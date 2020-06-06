import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { capitalize } from '@reverse/string';

import { Profile as IProfile, BasicDsl, Visibility } from '../../shared/types';

function DslListItem({
  name,
  id,
  visibility,
  admin,
  token,
  refreshList
}: {
  name: string;
  id: number;
  visibility: Visibility;
  admin: boolean;
  token: string;
  refreshList: () => void;
}) {
  const history = useHistory();

  const [deleteClicks, setDeleteClicks] = useState<number>(0);

  function handleClick() {
    history.push(`/dsl/${id}`);
  }
  async function handleDeleteClick() {
    const newClickCount = deleteClicks + 1;
    setDeleteClicks(newClickCount);

    if (newClickCount === 2) {
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
  }
  async function handleVisibilityClick() {
    const response = (
      await axios.post('/api/dsl/toggle-visibility', {
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
            <li onClick={handleVisibilityClick}>
              {capitalize(visibility.toLowerCase())} (Click to toggle.)
            </li>
            <li onClick={handleDeleteClick}>
              {deleteClicks > 0 ? 'Are you sure? (Click again to delete.)' : 'Delete'}
            </li>
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
                  ? profileDsls.length > 0
                    ? profileDsls.map((dsl) => {
                        return (
                          <DslListItem
                            key={dsl.id}
                            name={dsl.name}
                            id={dsl.id}
                            visibility={dsl.visibility}
                            admin={loginUserId === userId}
                            refreshList={refreshList}
                            token={token}
                          />
                        );
                      })
                    : 'None.'
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

import React from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';

import Button from './Button/Button';

import { LoginInfo } from '../../shared/types';

function AppBar({
  login,
  handleLogin
}: {
  login: LoginInfo;
  handleLogin: (googleUser: any) => void;
}) {
  const history = useHistory();

  function onLoginError(error: any) {
    console.log(error);
  }
  function handleHomeClick() {
    history.push('/');
  }
  function handleCreateClick() {
    history.push('/create');
  }
  function handleProfileClick() {
    history.push(`/profile/${login.userId}`);
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#dcdcdc', height: '75px' }}>
      <div style={{ flexGrow: 1, alignSelf: 'center', marginLeft: '0.5em' }}>
        <img src='/icon/favicon-57.png' onClick={handleHomeClick} />
      </div>

      {login ? (
        <div style={{ display: 'flex', alignItems: 'center', margin: '0.5em' }}>
          <Button onClick={handleCreateClick} style={{ marginRight: '1em' }}>
            + New
          </Button>

          <img
            src={login.profilePicture}
            style={{ width: '65px', height: '65px' }}
            onClick={handleProfileClick}
          />
        </div>
      ) : (
        <div
          style={{
            margin: '1em'
          }}
        >
          <GoogleLogin
            clientId='109219587503-s86rl00mo43u2tgu0fojrqtq4p6lh654.apps.googleusercontent.com'
            onSuccess={handleLogin}
            onFailure={onLoginError}
          />
        </div>
      )}
    </div>
  );
}

export default AppBar;

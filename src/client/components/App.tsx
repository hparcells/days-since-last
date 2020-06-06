import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

import AppBar from './AppBar';
import Home from '../pages/Home';
import Creation from '../pages/Creation';
import DaysSinceLast from '../pages/DaysSinceLast';
import Profile from '../pages/Profile';

import { LoginInfo } from '../../shared/types';

function App() {
  const [login, setLogin] = useState<LoginInfo>(null as any);

  async function handleLogin(googleUser: any) {
    const idToken = googleUser.getAuthResponse().id_token;
    const loginData = {
      name: googleUser.getBasicProfile().getName(),
      profilePicture: googleUser.getBasicProfile().getImageUrl(),
      token: idToken,
      userId: await (await axios.get('/api/userId', { headers: { token: idToken } })).data.userId
    };

    setLogin(loginData);
    await axios.post('/api/profile/create', loginData);
  }

  return (
    <Router>
      <AppBar login={login} handleLogin={handleLogin} />

      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        <Switch>
          <Route path='/dsl/:dslId'>
            <DaysSinceLast userId={login && login.userId} token={login && login.token} />
          </Route>
          <Route path='/profile/:userId'>
            <Profile />
          </Route>
          <Route path='/create'>
            <Creation token={login && login.token} />
          </Route>
          <Route exact path='/'>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

import { app, rootRouter } from 'fullstack-system';
import { config as setupDotEnv } from 'dotenv';
import bodyParser from 'body-parser';

import {
  setupDatabase,
  getDsl,
  addDsl,
  idExists,
  resetDsl,
  profileExists,
  createProfile,
  getProfile,
  getProfileDsls,
  deleteDsl
} from './database';
import { verifyGoogleToken } from './utils/verify-google-token';

setupDotEnv();

setupDatabase();

app.use(bodyParser());

app.get('/api/userId/', async (req, res) => {
  if (req.headers['token']) {
    res.send({
      userId: await verifyGoogleToken(req.headers['token'] as string)
    });
    return;
  }
  res.send('NO_TOKEN');
});
app.get('/api/dsl/:id', async (req, res) => {
  res.send((await getDsl(Number(req.params['id']))) || '404');
});
app.post('/api/dsl/create', async (req, res) => {
  const token = await verifyGoogleToken(req.body.token);
  if (token) {
    const newId = await addDsl(req.body.name, token);

    res.send({ status: 'SUCCESS', id: newId });
    return;
  }

  res.send('FAILURE');
});
app.post('/api/dsl/reset', async (req, res) => {
  const token = await verifyGoogleToken(req.body.token);
  if (token && idExists(req.body.id)) {
    resetDsl(req.body.id);

    res.send('SUCCESS');
    return;
  }

  res.send('FAILURE');
});
app.post('/api/dsl/delete', async (req, res) => {
  const token = await verifyGoogleToken(req.body.token);
  if (token && idExists(req.body.id)) {
    deleteDsl(req.body.id);

    res.send('SUCCESS');
    return;
  }

  res.send('FAILURE');
});
app.post('/api/profile/create', async (req, res) => {
  const token = await verifyGoogleToken(req.body.token);
  if (token && !profileExists(req.body.id)) {
    createProfile(req.body);

    res.send('SUCCESS');
    return;
  }

  res.send('FAILURE');
});
app.get('/api/profile/:userId', async (req, res) => {
  if (await profileExists(req.params.userId)) {
    res.send(await getProfile(req.params.userId));
    return;
  }
  res.send('FAILURE');
});
app.get('/api/profile/dsls/:userId', async (req, res) => {
  if (profileExists(req.params.userId)) {
    res.send(await getProfileDsls(req.params.userId));
    return;
  }

  res.send('FAILURE');
});

app.get('*', (req, res, next) => {
  req.url = '/';
  rootRouter(req, res, next);
});

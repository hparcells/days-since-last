import { app, rootRouter } from 'fullstack-system';
import { config as setupDotEnv } from 'dotenv';
import bodyParser from 'body-parser';

import { setupDatabase, getDsl, addDsl } from './database';
import { verifyGoogleToken } from './utils/verify-google-token';

setupDotEnv();

setupDatabase();

app.use(bodyParser());

app.get('/api/userId/', async (req, res) => {
  if (req.headers['token']) {
    res.send(await verifyGoogleToken(req.headers['token'] as string));
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

app.get('*', (req, res, next) => {
  req.url = '/';
  rootRouter(req, res, next);
});

import { io, app } from 'fullstack-system';
import { config as setupDotEnv } from 'dotenv';
import bodyParser from 'body-parser';

import { setupDatabase } from './database';

setupDotEnv();

setupDatabase();

app.use(bodyParser());

app.get('/api/test', (req, res) => {
  res.end('It Works!');
});

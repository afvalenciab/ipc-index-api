const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { config } = require('./config/index');
const authApi = require('./routes/auth');
const usersApi = require('./routes/usersApi');

const app = express();
app.use(cors('*'));
app.use(helmet);
app.use(express.json());
authApi(app);
usersApi(app);

app.listen(config.port, () => {
  const debug = require('debug')('app:server');
  debug(`Listening http://localhost:${config.port}`);
});

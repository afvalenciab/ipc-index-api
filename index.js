const express = require('express');
const cors = require('cors');
const { config } = require('./config/index');
const authApi = require('./routes/auth');

const app = express();
app.use(cors('*'));
app.use(express.json());
authApi(app);

app.listen(config.port, () => {
  console.log(`Listening http://localhost:${config.port}`);
});

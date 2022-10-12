const express = require('express');
const serveStatic = require('serve-static');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const authRouter = require('./routes/auth');

dotenv.config();

const app = express();

// parse application/json
app.use(bodyParser.json());

require('./strategies/googleStrategy');
require('./strategies/facebookStrategy');

const port = 3000;

app.use(serveStatic('public', { index: ['index.html'] }));

app.use('/auth', authRouter);

app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

// eslint-disable-next-line
app.use((err, req, res, next) => {
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Example app listening on port ${port}`);
});

const express = require('express');
const serveStatic = require('serve-static');
const dotenv = require('dotenv');

const authRouter = require('./routes/auth');

dotenv.config();

const app = express();

require('./strategies/googleStrategy');

const port = 3000;

app.use(serveStatic('public', { index: ['index.html'] }));

app.use('/auth', authRouter);

app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`);
});

const express = require('express');
const serveStatic = require('serve-static');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const engine = require('ejs-locals');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger-output.json');

const pageRouter = require('./routes/page');
const signInBeforePageRouter = require('./routes/signInBeforePage');
const signInAfterPageRouter = require('./routes/signInAfterPage');
const strategyRouter = require('./routes/strategy');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const siteRouter = require('./routes/site');

dotenv.config();

const app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('./strategies/googleStrategy');
require('./strategies/facebookStrategy');

app.use('/static', serveStatic('public'));

app.use('/', pageRouter);
app.use('/', signInBeforePageRouter);
app.use('/', signInAfterPageRouter);
app.use('/', strategyRouter);
app.use('/', authRouter);
app.use('/', usersRouter);
app.use('/', siteRouter);

app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

// eslint-disable-next-line
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || process.env.SERVER_ERROR_MSG,
  });
});

module.exports = app;

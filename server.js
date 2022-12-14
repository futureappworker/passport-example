const dotenv = require('dotenv');

dotenv.config();

const sequelize = require('./db/sequelize');
const app = require('./app');
const dbSetup = require('./db/setup');

const relationship = require('./db/relationship');

require('./db');

relationship.setup();

(async () => {
  await sequelize.sync();
  await dbSetup.run();
  const port = process.env.PORT || process.env.SERVER_PORT;
  app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Listening on ${port}`);
  });
})();

const dotenv = require('dotenv');

const sequelize = require('./db/sequelize');
const app = require('./app');
const dbSetup = require('./db/setup');

const relationship = require('./db/relationship');

require('./db');

relationship.setup();

dotenv.config();

(async () => {
  await sequelize.sync();
  await dbSetup.run();
  const port = process.env.SERVER_PORT;
  app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Example app listening on port ${port}`);
  });
})();

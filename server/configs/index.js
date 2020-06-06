const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  dbUser: process.env.DB_USER || 'test',
  dbPass: process.env.DB_PASS || 'test',
  dbHost: process.env.DB_HOST || 'localhost',
  dbName: process.env.DB_NAME || 'bhammyfarms'
};

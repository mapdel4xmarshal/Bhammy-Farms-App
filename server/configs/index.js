const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  dbUser: process.env.DB_USER || 'root',
  dbPass: process.env.DB_PASS || 'admin',
  dbHost: process.env.DB_HOST || 'localhost',
  dbName: process.env.DB_NAME || 'bhammyfarms',
  fileUploadPath: process.env.UPLOAD_PATH || path.resolve(__dirname, '../')
};

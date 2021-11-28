const mysql = require('mysql2/promise');

const dbName = process.env.DB_NAME || 'bhammyfarms';

mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || '3306',
  user: process.env.DB_USER || 'root',
  // password: process.env.DB_PASSWORD || 'Mapdel@01',
}).then(async (connection) => {
  await connection.query(`DROP DATABASE IF EXISTS ${dbName};`);
  connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`).then(() => {
    console.info('Database create or successfully checked');
    connection.close();
  });
});

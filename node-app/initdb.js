const { Client } = require('pg');
const bcrypt = require('bcrypt');

require('dotenv').config();

const client = new Client({
  // eslint-disable-next-line no-undef
  host: process.env.DB_HOST,
  // eslint-disable-next-line no-undef
  port: process.env.DB_PORT,
  // eslint-disable-next-line no-undef
  database: process.env.DB_NAME,
  // eslint-disable-next-line no-undef
  user: process.env.DB_USER,
  // eslint-disable-next-line no-undef
  password: process.env.DB_PASSWORD,
});

async function main() {
  try {
    await client.connect();

    await client.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
    );    
`);

    await client.query(
      ` INSERT INTO users (username, password, role) VALUES 
    ($1, $2, $3)
    ON CONFLICT (username) DO NOTHING`,
      ['admin', await bcrypt.hash('adminpass', 10), 'admin'],
    );

    await client.query(
      ` INSERT INTO users (username, password, role) VALUES
    ($1, $2, $3)
    ON CONFLICT (username) DO NOTHING`,
      ['user', await bcrypt.hash('userpass', 10), 'user'],
    );

    client.end();
  } catch (err) {
    console.error('Error initializing database', err);
  }
}

main();

const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL successfully via pg!');
    return client.end();
  })
  .catch(err => console.error('Connection error', err.stack));

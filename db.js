const { Client } = require("pg");
const { DB_URI } = require('./config');

const client = Client({
  connectionString : DB_URI
});

client.connect();
module.exports = client;
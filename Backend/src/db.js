const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "persona_db",
  password: "password",
  port: 5432, // Change if needed
});

module.exports = pool;

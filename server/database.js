import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'seanryan',
  host: 'localhost',
  database: 'cryptofolio',
  port: 5432,
});

export default pool;

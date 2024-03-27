import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'seanryan',
  host: 'localhost',
  database: 'cryptofolio',
  password: 'Basketball2',
  port: 5432,
});


export default pool;

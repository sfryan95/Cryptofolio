import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: 'postgres://xsforxqh:VVnwsm0M0qPGbjg_z-mIyOnnH1Smh-Cz@kala.db.elephantsql.com/xsforxqh',
});

export default pool;

import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
    "user": "postgres",
    "password" : "School123",
    "host" : "localhost",
    "port" : 5432,
    "database" : "pharmacy"
})

export default pool;

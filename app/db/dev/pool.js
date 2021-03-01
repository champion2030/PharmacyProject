import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    "user": "postgres",
    "password" : "School123",
    "host" : "localhost",
    "port" : 5432,
    "database" : "pharmacy"
})

export default pool

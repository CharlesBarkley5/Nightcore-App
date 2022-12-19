import { createConnection } from 'mysql';
const db = createConnection({
host: "localhost",
user: "root",
password: "",
database:"nightcore_db" 
})

export default db;
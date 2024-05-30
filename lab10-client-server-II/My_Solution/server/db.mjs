/** DB access module **/

import sqlite3 from "sqlite3";

// Opening the database
// NOTE: if you are running the solution from the root folder this path should be: `./lab03-express/solution/films.db`
const db = new sqlite3.Database('films.db', (err) => {
    if (err) throw err;
});

export default db;

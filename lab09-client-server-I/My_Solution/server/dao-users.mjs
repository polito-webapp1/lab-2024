/* Data Access Object (DAO) module for accessing users data */

import db from "./db.mjs";


// NOTE: all functions return error messages as json object { error: <string> }
export default function UserDao() {

    // This function retrieves one user by id
    this.getUser = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'User not found.'});
                } else {
                    resolve(row);
                }
            });
        });
    };


}

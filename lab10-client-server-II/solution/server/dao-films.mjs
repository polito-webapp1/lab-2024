/* Data Access Object (DAO) module for accessing films data */

import dayjs from "dayjs";
import db from "./db.mjs";
import Film from "./Film.mjs";


const filters = {
    'filter-favorite': {label: 'Favorites', filterFunction: film => film.favorite},
    'filter-best': {label: 'Best Rated', filterFunction: film => film.rating >= 5},
    'filter-lastmonth': {label: 'Seen Last Month', filterFunction: film => isSeenLastMonth(film)},
    'filter-unseen': {label: 'Unseen', filterFunction: film => !film.watchDate}
};

const isSeenLastMonth = (film) => {
    if ('watchDate' in film && film.watchDate) {  // Accessing watchDate only if defined
        const diff = film.watchDate.diff(dayjs(), 'month');
        const isLastMonth = diff <= 0 && diff > -1;      // last month
        return isLastMonth;
    }
};

function mapRowsToFilms(rows) {
    // Note: the parameters must follow the same order specified in the constructor.
    return rows.map(row => new Film(row.id, row.title, row.isFavorite === 1, row.watchDate, row.rating, row.userId));
}


// NOTE: all functions return error messages as json object { error: <string> } 
export default function FilmDao() {

    // This function retrieves the whole list of films from the database.
    this.getFilms = (filter) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films';
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const films = mapRowsToFilms(rows);

                    if (filters.hasOwnProperty(filter))
                        resolve(films.filter(filters[filter].filterFunction));
                    else  // if an invalid filter is specified, all the films are returned.
                        resolve(films);
                }
            });
        });
    };

    // This function retrieves a film given its id and the associated user id.
    this.getFilm = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE id=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'Film not found.'});
                } else {
                    resolve(mapRowsToFilms([row])[0]);
                }
            });
        });
    };


    /**
     * This function adds a new film in the database.
     * The film id is added automatically by the DB, and it is returned as this.lastID.
     */
    this.addFilm = (film) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO films (title, isFavorite, rating, watchDate, userId) VALUES(?, ?, ?, ?, ?)';
            const watchDate = film.watchDate ? film.watchDate.format("YYYY-MM-DD") : null;
            let rating;
            if (!film.rating || film.rating < 1 || film.rating > 5)
                rating = null;
            else
                rating = film.rating;

            db.run(query, [film.title, film.favorite, rating, watchDate, film.userId], function (err) {
                if (err) {
                    reject(err);
                }
                film.id = this.lastID;
                resolve(film);
            });
        });
    };

    // This function updates an existing film given its id and the new properties.
    this.updateFilm = (id, film) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE films SET title = ?, isFavorite = ?, rating = ?, watchDate = ? WHERE id = ?';
            const watchDate = film.watchDate ? film.watchDate.format("YYYY-MM-DD") : null;
            let rating;
            if (!film.rating || film.rating < 1 || film.rating > 5)
                rating = null;
            else
                rating = film.rating;

            db.run(query, [film.title, film.favorite, rating, watchDate, id], function (err) {
                if (err) {
                    reject(err);
                }
                if (this.changes !== 1) {
                    resolve({error: 'Film not found.'});
                } else {
                    resolve(film);
                }
            });
        });
    };

    // This function deletes an existing film given its id.
    this.deleteFilm = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM films WHERE id = ?';
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                } else
                    resolve(this.changes);
            });
        });
    };

}

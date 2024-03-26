/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 2 - 2024
 */

import sqlite3 from "sqlite3";
import Film from "./Film.mjs";
import dayjs from "dayjs";

function mapRowsToFilms(rows) {
    return rows.map(row => new Film(row.id, row.title, row.isFavorite === 1, row.watchDate, row.rating, row.userId));
}

export default function FilmLibrary() {
    // NOTE: if you are running the solution from the root folder this path should be: `./lab02-node-database/solution/films.db`
    const db = new sqlite3.Database('films.db', (err) => {
        if (err) throw err;
    });

    this.closeDB = () => {
        try {
            db.close();
        } catch (error) {
            console.error(`Impossible to close the database! ${error}`);
        }
    }

    this.getAll = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films';
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapRowsToFilms(rows));
                }
            });
        });
    };

    this.getFavorites = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE isFavorite = 1';
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapRowsToFilms(rows));
                }
            });
        });
    };

    this.getWatchedToday = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE watchdate = ?';
            const today = dayjs().format('YYYY-MM-DD');
            db.all(query, [today], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapRowsToFilms(rows));
                }
            });
        });
    }

    this.getWatchedBefore = (watchDate) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE watchDate < ?';
            db.all(query, [watchDate.format('YYYY-MM-DD')], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapRowsToFilms(rows));
                }
            });
        });
    };

    this.getRatedAbove = (rating) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE rating >= ?';
            db.all(query, [rating], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapRowsToFilms(rows));
                }
            });
        });
    };

    this.getContainingString = (string) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE title LIKE ?';
            db.all(query, [`%${string}%`], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(mapRowsToFilms(rows));
                }
            });
        });
    };

    /**
     * These methods are related to exercise 2
     */
    this.deleteFilm = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM films WHERE id = ?';
            db.run(query, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    };

    this.addFilm = (film) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO films (title, isFavorite, watchDate, rating, userId) VALUES (?, ?, ?, ?, ?)';
            const watchDate = film.watchDate ? film.watchDate.format("YYYY-MM-DD") : null;
            let rating = undefined;
            if (!film.rating || film.rating < 1 || film.rating > 5) 
                rating = null;
            else
                rating = film.rating;
            db.run(query, [film.title, film.favorite, watchDate, rating, film.userId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    film.id = this.lastID;
                    resolve(film);
                }
            });
        });
    };

    this.resetWatchDates = () => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE films SET watchDate = NULL';
            db.run(query, [], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

}

/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * 2024 - Lab 7
 */

import dayjs from "dayjs";

// This is the same model developed for lab 1.
function Film(id, title, isFavorite = false, watchDate = null, rating = null, userId = 1) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    // saved as dayjs object only if watchDate is truthy
    this.watchDate = watchDate && dayjs(watchDate);
    this.userId = userId

    this.toString = () => {
        const watchDate = this.watchDate ? this.watchDate.format('DD/MM/YYYY') : null

        return `Id: ${this.id}, ` +
            `Title: ${this.title}, Favorite: ${this.favorite}, ` +
            `Watch date: ${watchDate}, Score: ${this.rating}, ` +
            `User: ${this.userId}`;
    }

    this.formatWatchDate = (format = 'MMMM D, YYYY') => {
        return this.watchDate ? this.watchDate.format(format) : undefined;
    };
}

// This data structure emulates a database of movies. In the future these data will be retrieved from the server.
const INITIAL_FILMS = [
    new Film(1, "Pulp Fiction", true, "2024-03-10", 5),
    new Film(2, "21 Grams", true, "2024-03-17", 5),
    new Film(3, "Star Wars", false),
    new Film(4, "The Matrix", true),
    new Film(5, "Shrek", false, "2024-04-20", 3)
];

export {Film, INITIAL_FILMS};

/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Model from lab 1 - 2024
 */

import dayjs from "dayjs";

export default function Film(id, title, isFavorite = false, watchDate = null, rating = null, userId = 1) {
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
}

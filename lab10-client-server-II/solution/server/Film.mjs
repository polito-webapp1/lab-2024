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
    this.userId = userId;

    // customize toJSON method to return the object with date only, no time
    this.toJSON = () => {
        return {
            ...this,
            watchDate: this.watchDate ? this.watchDate.format("YYYY-MM-DD") : null,
        };
    };
}
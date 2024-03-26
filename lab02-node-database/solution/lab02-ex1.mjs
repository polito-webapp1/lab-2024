/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 2 - Exercise 1 - 2024
 */

import dayjs from "dayjs";
import FilmLibrary from "./FilmLibrary.mjs";

function printAll(films) {
    films.forEach((film) => console.log(`${film}`));
}

/**
 * Testing functionality for requirements of exercise 1
 */
async function main() {
    const filmLibrary = new FilmLibrary();

    try {
        // 1a. get all the films
        console.log('****** All the films: ******');
        const films = await filmLibrary.getAll();
        if (films.length === 0)
            console.log('No films yet, try later.');
        else
            printAll(films);

        // 1b. get all favorite films
        console.log('\n****** All favorite films: ******');
        const favoriteFilms = await filmLibrary.getFavorites();
        if (favoriteFilms.length === 0)
            console.log('No favorite films yet, try later.');
        else
            printAll(favoriteFilms);

        // 1c. get films watched today
        console.log('\n****** Films watched today ******');
        const watchedToday = await filmLibrary.getWatchedToday();
        if (watchedToday.length === 0)
            console.log('No films watched today, time to watch one?');
        else
            printAll(watchedToday);

        // 1d. get films before a certain date
        const watchDateStr = '2024-03-25';
        const watchDate = dayjs(watchDateStr);
        console.log(`\n****** Films watched before ${watchDateStr}: ******`);
        const watchedBeforeDate = await filmLibrary.getWatchedBefore(watchDate);
        if (watchedBeforeDate.length === 0)
            console.log(`No films watched before ${watchDateStr}, sorry.`);
        else
            printAll(watchedBeforeDate);

        // 1e. get films with a rating greater than or equal to given rating
        const rating = 4
        console.log(`\n****** Films with a minimum rating of ${rating}: ******`);
        const ratedAbove = await filmLibrary.getRatedAbove(rating);
        if (ratedAbove.length === 0)
            console.log('No films with this rating, yet.');
        else
            printAll(ratedAbove);

        // 1f. get films containing string
        const searchString = 'war';
        console.log(`\n****** Films containing '${searchString}' in the title: ******`);
        const containingString = await filmLibrary.getContainingString(searchString);
        if (containingString.length === 0)
            console.log(`No films with the word ${searchString} in the title...`);
        else
            printAll(containingString);
    } catch (error) {
        console.error(`Impossible to retrieve films! ${error}`);
        filmLibrary.closeDB();
        return;
    }

    filmLibrary.closeDB();
}

main();

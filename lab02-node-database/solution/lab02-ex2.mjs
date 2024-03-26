/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 2 - Exercise 2 - 2024
 */

import dayjs from "dayjs";
import Film from "./Film.mjs";
import FilmLibrary from "./FilmLibrary.mjs";

/**
 * Testing functionality for requirements of exercise 2
 */
async function main() {

    const filmLibrary = new FilmLibrary();

    // 2a. insert a film
    console.log(`\n****** Adding a new movie: ******`);
    let newFilm = new Film(undefined, "Fast & Furious", false, dayjs().toISOString(), 2, 2);
    try {
        newFilm = await filmLibrary.addFilm(newFilm);
        console.log(`New film inserted!`);
        console.log(newFilm.toString());
    } catch (error) {
        console.error(`Impossible to insert a new movie! ${error}`);
    }

    // Inserting another film with only the title
    console.log(`\n****** Adding a movie using default parameters: ******`);
    newFilm = new Film(undefined, "2 Fast 2 Furious");
    try {
        newFilm = await filmLibrary.addFilm(newFilm);
        console.log(`New film inserted!`);
        console.log(newFilm.toString());
    } catch (error) {
        console.error(`Impossible to insert a new movie! ${error}`);
    }

    // printing all movies
    console.log('\n****** Printing the list of movies: ******');
    const films = await filmLibrary.getAll();
    if (films.length === 0)
        console.log('No movies yet...');
    else
        films.forEach((film) => console.log(`${film}`));

    // 2b. delete a film (if correctly inserted)
    if (newFilm.id) {
        const filmID = newFilm.id;
        console.log(`\n****** Deleting the movie with ID '${filmID}': ******`);
        try {
            const deleted = await filmLibrary.deleteFilm(filmID);
            if (deleted)
                console.log('Movie successfully deleted!');
            else
                console.error(`There is no movie to delete with id: ${filmID}`);
        } catch (error) {
            console.error(`Impossible to delete the movie with id: ${filmID}! ${error}`);
        }
    }

    // 2c. reset all the watch dates
    console.log(`\n****** Resetting all the watch dates: ******`);
    try {
        await filmLibrary.resetWatchDates();
        console.log('Watch dates reset!');
    } catch (error) {
        console.error(`Impossible to reset watch dates! ${error}`);
    }

    // printing updated movies
    console.log('\n****** All the movies after the updates: ******');
    const updatedFilms = await filmLibrary.getAll();
    if (updatedFilms.length === 0)
        console.log('No movies yet, try later.');
    else
        updatedFilms.forEach((film) => console.log(`${film}`));

    filmLibrary.closeDB();
}

main();

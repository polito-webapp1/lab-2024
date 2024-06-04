import Film from "./models/Film.js";

const SERVER_URL = 'http://localhost:3001/api';

async function getFilms(filter) {
   const films = await fetch(SERVER_URL + '/films' + (filter ? `?filter=${filter}` : ''))
    .then(handleInvalidResponse)
    .then(response => response.json())
    .then(mapApiFilmsToFilms);

return films;
}

async function addFilm(film) {
    return await fetch(SERVER_URL + '/films', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(film)
    }).then(handleInvalidResponse)
}

async function updateFilm(film) {
    return await fetch(SERVER_URL + '/films/' + film.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(film)
    }).then(handleInvalidResponse)
}

async function updateFilmRating(filmId, nextRating) {
    return await fetch(SERVER_URL + '/films/' + filmId + '/rating', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body:  JSON.stringify({rating: nextRating})
    }).then(handleInvalidResponse)
}

async function updateFilmFavorite(filmId, nextFavorite) {
    return await fetch(SERVER_URL + '/films/' + filmId + '/favorite', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body:  JSON.stringify({favorite: nextFavorite})
    }).then(handleInvalidResponse)
}

async function deleteFilm(filmId) {
    return await fetch(SERVER_URL + '/films/' + filmId, {
        method: 'DELETE',
    }).then(handleInvalidResponse)
}

function handleInvalidResponse(response) {
    if (!response.ok) { throw Error(response.statusText) }
    let type = response.headers.get('Content-Type');
    if (type !== null && type.indexOf('application/json') === -1){
        throw new TypeError(`Expected JSON, got ${type}`)
    }
    return response;
}

function mapApiFilmsToFilms(apiFilms) {
    return apiFilms.map(film => new Film(film.id, film.title, film.favorite, film.watchDate, film.rating, film.userId));
}

const API = {getFilms, addFilm, updateFilm, updateFilmRating, updateFilmFavorite, deleteFilm};
export default API;

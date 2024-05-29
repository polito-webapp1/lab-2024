import Film from "./models/Film.js";

const SERVER_URL = 'http://localhost:3001/api';

async function getFilms(filter) {
   const films = await fetch(SERVER_URL + '/films' + (filter ? `?filter=${filter}` : ''))
    .then(handleInvalidResponse)
    .then(response => response.json())
    .then(mapApiFilmsToFilms);

return films;
}

function handleInvalidResponse(response) {
    if (!response.ok) { throw Error(response.statusText) }
    let type = response.headers.get('Content-Type');
    if (type.indexOf('application/json') === -1){
        throw new TypeError(`Expected JSON, got ${type}`)
    }
    return response;
}

function mapApiFilmsToFilms(apiFilms) {
    return apiFilms.map(film => new Film(film.id, film.title, film.favorite, film.watchDate, film.rating, film.userId));
}

const API = {getFilms};
export default API;
import Film from "./models/Film.js";

const SERVER_URL = 'http://localhost:3001/api';

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
    return await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',  // this parameter specifies that authentication cookie must be forwared. It is included in all the authenticated APIs.
        body: JSON.stringify(credentials),
    }).then(handleInvalidResponse)
    .then(response => response.json());
};
  
/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
    return await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include'
    }).then(handleInvalidResponse)
    .then(response => response.json());
};
  
  /**
   * This function destroy the current user's session (executing the log-out).
   */
  const logOut = async() => {
    return await fetch(SERVER_URL + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    }).then(handleInvalidResponse);
  }


async function getFilms(filter) {
    const films = await fetch(SERVER_URL + '/films' + (filter ? `?filter=${filter}` : ''), { credentials: 'include' })
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
        credentials: 'include',
        body: JSON.stringify(film)
    }).then(handleInvalidResponse)
}

async function updateFilm(film) {
    return await fetch(SERVER_URL + '/films/' + film.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(film)
    }).then(handleInvalidResponse)
}

async function updateFilmRating(filmId, nextRating) {
    return await fetch(SERVER_URL + '/films/' + filmId + '/rating', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body:  JSON.stringify({rating: nextRating})
    }).then(handleInvalidResponse)
}

async function updateFilmFavorite(filmId, nextFavorite) {
    return await fetch(SERVER_URL + '/films/' + filmId + '/favorite', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body:  JSON.stringify({favorite: nextFavorite})
    }).then(handleInvalidResponse)
}

async function deleteFilm(filmId) {
    return await fetch(SERVER_URL + '/films/' + filmId, {
        method: 'DELETE',
        credentials: 'include',
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

const API = {logIn, getUserInfo, logOut, getFilms, addFilm, updateFilm, updateFilmRating, updateFilmFavorite, deleteFilm};
export default API;

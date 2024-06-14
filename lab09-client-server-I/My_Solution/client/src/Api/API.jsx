import Film from "../Models/films.mjs";

const url = "http://localhost:3001/api"

async function loadFilm(filter) {
    let url1;
    if (filter) {
        url1 = `${url}/films?filter=${filter}`;
    } else {
        url1 = `${url}/films`;
    }
    const response = await fetch(url1)
    .then(handleInvalidResponse)
    .then(response => response.json())
    .then(mapApiFilmsToFilms);

    return response;
}
async function newFilm(film) {
    const response = await fetch(`${url}/films`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(film)
    })
    .handleInvalidResponse()
    .then(response => response.json());
    return response;
}

async function editFilm(film) {
    const response = await fetch(`${url}/films/${film.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(film)
    })
    .handleInvalidResponse()
    .then(response => response.json());
    return response;
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

const API = {loadFilm, newFilm, editFilm};
export default API;
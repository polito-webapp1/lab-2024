const url = "http://localhost:3001/api"

async function loadFilm(filter) {
    let url1;
    if (filter) {
        url1 = `${url}/films?filter=${filter}`;
    } else {
        url1 = `${url}/films`;
    }
    const response = await fetch(url1);
    return await response.json();
}

export { loadFilm }

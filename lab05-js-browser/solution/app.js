/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 5 - 2024
 */
'use strict';

const INITIAL_FILMS = [
    // Data Structure: id, title, favorite, watchDate, rating
    [1, "Pulp Fiction", true, "2024-04-10", 5],
    [2, "21 Grams", true, "2024-04-17", 4],
    [3, "Star Wars", false],
    [4, "Matrix", true],
    [5, "Shrek", false, "2024-04-21", 3]
];

// --- Selectors --- //
const filmsList = document.getElementById('films-list');
const filterLinks = document.querySelectorAll('#films-filters li a');

// --- Functions Definitions --- /

/******************
 *   Exercise 1   *
 ******************/

/**
 * Create a single film enclosed in a <li> tag.
 * @param {Film} film The film object.
 */
function createFilmInList(film) {

    const filmNode = document.createElement('li');
    filmNode.id = "film-" + film.id;
    filmNode.className = 'list-group-item';


    const filmContent = `<div class="row gy-2">
                        <div class="col-6 col-xl-3 favorite-title d-flex gap-2 align-items-center">
                            ${film.title}
                            <div class="d-xl-none actions">
                                <i class="bi bi-pencil"></i>
                                <i class="bi bi-trash"></i>
                            </div>
                        </div>
                        <div class="col-6 col-xl-3 text-end text-xl-center">
                        <span class="custom-control custom-checkbox">
                          <input type="checkbox" class="custom-control-input" id="films[${film.id}][favorite]" ${film.favorite && 'checked'}>
                          <label class="custom-control-label" for="films[${film.id}][favorite]">Favorite</label>
                        </span>
                        </div>
                        <div class="col-4 col-xl-3 text-xl-center">
                            ${film.watchDate ? film.formatWatchDate() : ''}
                        </div>
                        <div class="actions-container col-8 col-xl-3 text-end">
                            <div class="rating">
                                ${film.rating ? '<i class="bi bi-star-fill"></i> '.repeat(film.rating) : ''}
                                ${'<i class="bi bi-star"></i> '.repeat(5 - (film.rating ?? 0))}
                            </div>
                            <div class="d-none d-xl-flex actions">
                                <i class="bi bi-pencil"></i>
                                <i class="bi bi-trash"></i>
                            </div>
                        </div>
                    </div>`;

    filmNode.innerHTML = filmContent;
    return filmNode;
}

/**
 * Fill the list of films with the given array of films
 * @param {Array<Film>} films The array of films to display.
 */
function createFilmsList(films) {
    for (const film of films) {
        const filmNode = createFilmInList(film);
        filmsList.appendChild(filmNode);
    }

    addEventListenersToFilms();
}

/**
 * Function to destroy the <ul></ul> list of films.
 */
function clearFilmsList() {
    filmsList.innerHTML = '';
}

/******************
 *   Exercise 2   *
 ******************/

/**
 * Function to manage film filtering in the web page.
 * @param {string}   filterId  The filter node id.
 * @param {string}   titleText The text to put in the film list content h1 header.
 * @param {function} filterFn  The function that does the filtering and returns an array of gilms.
 */
function filterFilms(filterId, titleText, filterFn) {
    // if called without parameters, repeat last used filter
    if (!filterId) ({filterId, titleText, filterFn} = filterFilms.currentFilter);

    // Reset the appearance of all filters
    filterLinks.forEach(node => {
        node.classList.remove('active');
        node.classList.add('link-dark');
    });

    // Give the active appearance to the newly selected filter
    const activeFilter = document.getElementById(filterId);
    activeFilter.classList.add('active');
    activeFilter.classList.remove('link-dark');

    // Set the title of the film list
    document.getElementById("filter-title").innerText = titleText;

    clearFilmsList();
    createFilmsList(filterFn());

    // remember last used filter
    filterFilms.currentFilter = {filterId, titleText, filterFn};
}


const filmLibrary = new FilmLibrary();
INITIAL_FILMS.forEach(f => {
    filmLibrary.addNewFilm(new Film(...f));
});
createFilmsList(filmLibrary.filterAll());

// --- Creating Event Listeners for filters --- //
document.getElementById("filter-all").addEventListener('click', event =>
    filterFilms('filter-all', 'All', filmLibrary.filterAll)
);

document.getElementById("filter-favorites").addEventListener('click', event =>
    filterFilms('filter-favorites', 'Favorites', filmLibrary.filterByFavorite)
);

document.getElementById("filter-best").addEventListener('click', event =>
    filterFilms('filter-best', 'Best Rated', filmLibrary.filterByBestRated)
);

document.getElementById("filter-seen-last-month").addEventListener('click', event =>
    filterFilms('filter-seen-last-month', 'Seen Last Month', filmLibrary.filterBySeenLastMonth)
);

document.getElementById("filter-unseen").addEventListener('click', event =>
    filterFilms('filter-unseen', 'Unseen', filmLibrary.filterByUnseen)
);

/******************
 *   Exercise 3   *
 ******************/

/**
 * Add event listeners to the films in the list to manage the delete action.
 * Event listeners should be registered each time the list is re-rendered
 */
function addEventListenersToFilms() {
    Array.from(filmsList.children).forEach(filmNode => {
        const id = parseInt(filmNode.id.split('-')[1]);
        const deleteIcons = filmNode.querySelectorAll('.bi-trash');

        deleteIcons.forEach(icon => {
            icon.addEventListener('click', event => {
                filmLibrary.deleteFilm(id);
                filmNode.remove();
            });
        });
    });
}

// --- Model --- //
function Film(id, title, isFavorite = false, watchDate = null, rating = null, userId = 1) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    // saved as dayjs object only if watchDate is truthy
    this.watchDate = watchDate && dayjs(watchDate);
    this.userId = userId;

    // Filters
    this.isBestRated = () => this.rating === 5;

    this.isSeenLastMonth = () => {
        if (!this.watchDate) return false; // no watchDate
        const diff = (dayjs()).diff(this.watchDate, 'month', true);

        return diff >=0 && diff < 1;
    };

    this.isUnseen = () => !this.watchDate;

    this.formatWatchDate = (format = 'MMMM D,YYYY') => {
        return this.watchDate ? this.watchDate.format(format) : undefined;
    };
}


// --- Library --- //
function FilmLibrary(){
    this.list = [];

    this.addNewFilm = (film) => {
        if(!this.list.some(f => f.id === film.id))
            this.list.push(film);
        else
            throw new Error('Duplicate id');
    };

    this.deleteFilm = (id) => {
        const newList = this.list.filter(function(film, index, arr) {
            return film.id !== id;
        })
        this.list = newList;
    }

    // The filter methods create a new array with the elements that pass the test implemented by the provided function
    this.filterAll = () => {
        return this.list.filter( () => true);
    }

    this.filterByFavorite = () => {
        return this.list.filter( (film) => film.favorite === true);
    }

    this.filterByBestRated = () => {
        return this.list.filter( (film) => film.isBestRated() );
    }

    this.filterBySeenLastMonth = () => {
        return this.list.filter( (film) => film.isSeenLastMonth() );
    }

    this.filterByUnseen = () => {
        return this.list.filter( (film) => film.isUnseen() );
    }
}

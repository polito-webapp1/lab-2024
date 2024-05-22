/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 8 - 2024
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import {INITIAL_FILMS} from "./films.mjs";

import dayjs from 'dayjs';

import {useState} from 'react';
import {Container} from 'react-bootstrap/';
import {Routes, Route} from 'react-router-dom';

import Header from "./components/Header.jsx";
import FilmForm from './components/FilmForm.jsx';
import { FilmLibraryLayout, FilmListLayout, EditLayout, NotFoundLayout } from './components/PageLayout.jsx';

function App() {
    /**
     * Defining a structure for Filters
     * Each filter is identified by a unique name and is composed by the following fields:
     * - A label to be shown in the GUI
     * - An ID (equal to the unique name), used as key during the table generation
     * - A filter function applied before passing the films to the FilmTable component
     */
    const filters = {
        'filter-all': {label: 'All', url: '', filterFunction: () => true},
        'filter-favorite': {label: 'Favorites', url: '/filters/filter-favorite', filterFunction: film => film.favorite},
        'filter-best': {label: 'Best Rated', url: '/filters/filter-best', filterFunction: film => film.rating >= 5},
        'filter-lastmonth': {
            label: 'Seen Last Month',
            url: '/filters/filter-lastmonth',
            filterFunction: film => {
                if (!film?.watchDate) return false;
                const diff = film.watchDate.diff(dayjs(), 'month');
                return diff <= 0 && diff > -1;
            }
        },
        'filter-unseen': {label: 'Unseen', url: '/filters/filter-unseen', filterFunction: film => !film?.watchDate}
    };

    // This state contains the active filter
    const [activeFilter, setActiveFilter] = useState('filter-all');

    // This state controls the expansion of the sidebar (on small breakpoints only)
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    // This state contains the list of movie. It will be updated when a movie is modified or a new movie is added.
    const [films, setFilms] = useState(INITIAL_FILMS);

    // This function add the new film into the FilmLibrary array
    const saveNewFilm = (newFilm) => {
        const newFilmId = Math.max(...films.map(film => film.id)) + 1;
        newFilm.id = newFilmId;
        setFilms( (films) => [...films, newFilm] );
    }

    // This function updates a film already stored into the FilmLibrary array
    const updateFilm = (film) => {
        setFilms(oldFilms => {
            return oldFilms.map(f => {
                if(film.id === f.id)
                    return { "id": film.id, "title": film.title, "favorite": film.favorite, "watchDate": film.watchDate, "rating": film.rating };
                else
                    return f;
            });
        });
    }

    const deleteFilm = (filmId) => {
        setFilms((oldFilms) => oldFilms.filter((f) => f.id !== filmId));
      };

    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded}/>
        <Container fluid className="flex-grow-1 d-flex flex-column">
          <Routes>
            <Route path="/" element={<FilmLibraryLayout films={films} isSidebarExpanded={isSidebarExpanded}
                filters={filters} activeFilter={activeFilter} setActiveFilter={setActiveFilter}/>} >
                <Route path="*" element={<NotFoundLayout />} />
                <Route index element={<FilmListLayout films={films} filters={filters} updateFilm={updateFilm} deleteFilm={deleteFilm}/>} />
                <Route path="filters/:filterLabel" element={<FilmListLayout films={films} filters={filters} updateFilm={updateFilm} deleteFilm={deleteFilm}/>} />
            </Route>
            <Route path="add" element={ <FilmForm addFilm={saveNewFilm}/> } />
            <Route path="edit/:filmId" element={ <EditLayout films={films} editFilm={updateFilm}/> } />
          </Routes>
        </Container>
      </div>
    );
}

export default App;

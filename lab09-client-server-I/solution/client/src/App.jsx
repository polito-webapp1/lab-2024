/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 9 - 2024
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import {useEffect, useState} from 'react';
import {Container} from 'react-bootstrap/';
import {Route, Routes, useLocation} from 'react-router-dom';

import Header from "./components/Header.jsx";
import FilmForm from './components/FilmForm.jsx';
import {EditLayout, FilmLibraryLayout, FilmListLayout, NotFoundLayout} from './components/PageLayout.jsx';
import FeedbackContext from "./contexts/FeedbackContext.js";
import {Toast, ToastBody} from "react-bootstrap";
import API from "./API.js";

function App() {
    /**
     * Defining a structure for Filters
     * Each filter is identified by a unique name and is composed by the following fields:
     * - A label to be shown in the GUI
     * - An ID (equal to the unique name), used as key during the table generation
     */
    const filters = {
        'filter-all': {label: 'All', url: ''},
        'filter-favorite': {label: 'Favorites', url: '/filters/filter-favorite'},
        'filter-best': {label: 'Best Rated', url: '/filters/filter-best'},
        'filter-lastmonth': {label: 'Seen Last Month', url: '/filters/filter-lastmonth'},
        'filter-unseen': {label: 'Unseen', url: '/filters/filter-unseen'}
    };

    // This state controls the expansion of the sidebar (on small breakpoints only)
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    // This state is used to store the feedback message to be shown in the toast
    const [feedback, setFeedback] = useState('');

    const setFeedbackFromError = (err) => {
        let message = '';
        if (err.message) message = err.message;
        else message = "Unknown Error";
        setFeedback(message); // Assuming only one error message at a time
    };

    // This state contains the list of movie. It will be updated when a movie is modified or a new movie is added.
    const [films, setFilms] = useState([]);

    // Workaround to avoid refetching data when creating or updating a film
    const [lastFilter, setLastFilter] = useState(undefined);

    const {pathname} = useLocation();

    useEffect(() => {
        console.log('pathname:', pathname);
        console.log('lastFilter:', lastFilter)
        if (pathname.startsWith('/filters')) {
            setLastFilter(pathname.split('/').pop());
        } else if (pathname === '/') {
            setLastFilter('');
        }
        // else: lastFilter is kept when creating or updating a film
    }, [pathname]);


    useEffect(() => {
        if (lastFilter === undefined) return;
        API.getFilms(lastFilter)
            .then(films => {
                setFilms(films);
            })
            .catch(e => {
                setFeedbackFromError(e);
            });
    }, [lastFilter]);

    // This function add the new film into the FilmLibrary array
    const saveNewFilm = (newFilm) => {
        const newFilmId = Math.max(...films.map(film => film.id)) + 1;
        newFilm.id = newFilmId;
        setFilms((films) => [...films, newFilm]);
    };

    // This function updates a film already stored into the FilmLibrary array
    const updateFilm = (film) => {
        setFilms(oldFilms => {
            return oldFilms.map(f => {
                if (film.id === f.id)
                    return {
                        "id": film.id,
                        "title": film.title,
                        "favorite": film.favorite,
                        "watchDate": film.watchDate,
                        "rating": film.rating
                    };
                else
                    return f;
            });
        });
    };

    const deleteFilm = (filmId) => {
        setFilms((oldFilms) => oldFilms.filter((f) => f.id !== filmId));
    };

    return (
        /* We forward the setFeedback function via a context as it will be used in add/edit routes for next lab */
        <FeedbackContext.Provider value={{setFeedback, setFeedbackFromError}}>
            <div className="min-vh-100 d-flex flex-column">
                <Header isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded}/>
                <Container fluid className="flex-grow-1 d-flex flex-column">
                    <Routes>
                        <Route
                            path="/"
                            element={<FilmLibraryLayout
                                films={films}
                                isSidebarExpanded={isSidebarExpanded}
                                filters={filters}/>
                            }>
                            <Route path="*" element={<NotFoundLayout/>}/>
                            <Route index
                                   element={<FilmListLayout
                                       films={films}
                                       filters={filters}
                                       updateFilm={updateFilm}
                                       deleteFilm={deleteFilm}/>
                                   }/>
                            <Route path="filters/:filterLabel"
                                   element={<FilmListLayout
                                       films={films}
                                       filters={filters}
                                       updateFilm={updateFilm}
                                       deleteFilm={deleteFilm}/>
                                   }/>
                        </Route>
                        <Route path="add" element={<FilmForm addFilm={saveNewFilm}/>}/>
                        <Route path="edit/:filmId" element={<EditLayout films={films} editFilm={updateFilm}/>}/>
                    </Routes>
                    <Toast
                        show={feedback !== ''}
                        autohide
                        onClose={() => setFeedback('')}
                        delay={4000}
                        position="top-end"
                        className="position-fixed end-0 m-3"
                    >
                        <ToastBody>
                            {feedback}
                        </ToastBody>
                    </Toast>
                </Container>
            </div>
        </FeedbackContext.Provider>
    );
}

export default App;

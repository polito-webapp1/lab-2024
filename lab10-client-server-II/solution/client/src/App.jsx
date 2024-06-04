/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 10 - 2024
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import {useEffect, useState} from 'react';
import {Container, Toast, ToastBody} from 'react-bootstrap/';
import {Route, Routes, useLocation} from 'react-router-dom';

import Header from "./components/Header.jsx";
import {CreateLayout, EditLayout, FilmLibraryLayout, FilmListLayout, NotFoundLayout} from './components/PageLayout.jsx';
import FeedbackContext from "./contexts/FeedbackContext.js";
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

    // This state is used to force a refresh of the film list
    // Using null as initial state as we need to fetch even when the 1st load happens on create/edit pages
    const [shouldRefresh, setShouldRefresh] = useState(true);

    const {pathname} = useLocation();
    // A null filter means we have no information about the filter to be applied
    let filterLabel = null;
    if(pathname.startsWith('/filters')) {
        filterLabel = pathname.split('/').pop();
    } else if (pathname === '/') {
        filterLabel = false; // false means no filter (all films)
    }

    useEffect(() => {
        if(filterLabel === null) return;

        API.getFilms(filterLabel)
            .then(films => {
                setFilms(films);
            })
            .then(() => setShouldRefresh(false))
            .catch(e => { setFeedbackFromError(e); } );
    }, [shouldRefresh, filterLabel]);

    return (
        <FeedbackContext.Provider value={{setFeedback, setFeedbackFromError, setShouldRefresh}}>
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
                                       filters={filters}/>
                                   }/>
                            <Route path="filters/:filterLabel"
                                   element={<FilmListLayout
                                       films={films}
                                       filters={filters}/>
                                   }/>
                        </Route>
                        <Route path="add" element={<CreateLayout />}/>
                        <Route path="edit/:filmId" element={<EditLayout films={films}/>}/>
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

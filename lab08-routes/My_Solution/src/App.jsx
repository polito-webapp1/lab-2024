import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import {Film, INITIAL_FILMS} from "./films.mjs";
import dayjs from 'dayjs';
import {useState} from 'react';
import {Container} from 'react-bootstrap/';
import Header from "./components/Header.jsx";
import FilmForm from "./components/FilmForm.jsx";
import {Route, Routes} from "react-router-dom";
import NotFoundPage from './components/NotFoundPage.jsx';
import {FilmLibraryLayout, FilmListLayout} from "./components/PageLayout.jsx";

function App() {
    const filters = {
        'filter-all': { label: 'All', id: 'filter-all', filterFunction: () => true },
        'filter-favorite': { label: 'Favorites', id: 'filter-favorite', filterFunction: film => film.favorite },
        'filter-best': { label: 'Best Rated', id: 'filter-best', filterFunction: film => film.rating >= 5 },
        'filter-lastmonth': {
            label: 'Seen Last Month',
            id: 'filter-lastmonth',
            filterFunction: film => {
                if (!film?.watchDate) return false;
                const diff = film.watchDate.diff(dayjs(), 'month');
                return diff <= 0 && diff > -1;
            }
        },
        'filter-unseen': { label: 'Unseen', id: 'filter-unseen', filterFunction: film => !film?.watchDate }
    };

    const [activeFilter, setActiveFilter] = useState('filter-all');
    const [filmList, setFilmList] = useState(INITIAL_FILMS);
    const [visibleFilms, setVisibleFilms] = useState(filmList.filter(filters[activeFilter].filterFunction));
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    const addFilm = (film) => {
        film.id = Math.max(...visibleFilms.map(film => film.id)) + 1;
        const newFilm = new Film(film.id, film.title, film.favorite, film.date, film.rating, 1);
        setVisibleFilms([...visibleFilms, newFilm]);
        setFilmList([...filmList, newFilm]);
    }

    const editFilm = (film, id) => {
        const index = visibleFilms.findIndex(f => f.id === id);
        const newFilms = [...visibleFilms];
        newFilms[index] = new Film(film.id, film.title, film.favorite, film.date, film.rating, 1);
        setVisibleFilms(newFilms);
        setFilmList(newFilms);
    }

    const deleteFilm = (id) => {
        const newFilms = visibleFilms.filter(film => film.id !== id);
        setFilmList(newFilms);
        setVisibleFilms(newFilms);
    }

    const setFavorite = (id, favorite) => {
        const index = visibleFilms.findIndex(f => f.id === id);
        const newFilms = [...visibleFilms];
        newFilms[index].favorite = favorite;
        setVisibleFilms(newFilms);
    }

    const updateRating = (id, rating) => {
        const index = visibleFilms.findIndex(f => f.id === id);
        const newFilms = [...visibleFilms];
        newFilms[index].rating = rating;
        setVisibleFilms(newFilms);
    }

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Header isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />
            <Container fluid className="flex-grow-1 d-flex flex-column">
                <Routes>
                    <Route path="/" element={<FilmLibraryLayout films={filmList} isSidebarExpanded={isSidebarExpanded} filters={filters} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}>
                        <Route path="*" element={<NotFoundPage />} />
                        <Route index element={<FilmListLayout films={filmList} filters={filters} updateFilm={editFilm} deleteFilm={deleteFilm} setFavorite={setFavorite} updateRating={updateRating} />} />
                        <Route path="filters/:filterLabel" element={<FilmListLayout films={filmList} filters={filters} updateFilm={editFilm} deleteFilm={deleteFilm} setFavorite={setFavorite} updateRating={updateRating} />} />
                    </Route>
                    <Route path="add" element={<FilmForm mode="Add" addFilm={addFilm} />} />
                    <Route path="edit/:filmId" element={<FilmForm mode="Edit" editFilm={editFilm} films={filmList} />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;

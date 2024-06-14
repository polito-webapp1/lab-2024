import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Film from "./Models/films.mjs";
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap/';
import Header from "./components/Header.jsx";
import FilmForm from "./components/FilmForm.jsx";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from './components/NotFoundPage.jsx';
import { FilmLibraryLayout, FilmListLayout } from "./components/PageLayout.jsx";
import API from "./Api/API.jsx";

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
                const diff = dayjs().diff(film.watchDate, 'month');
                return diff <= 0 && diff > -1;
            }
        },
        'filter-unseen': { label: 'Unseen', id: 'filter-unseen', filterFunction: film => !film?.watchDate }
    };

    const [activeFilter, setActiveFilter] = useState('filter-all');
    const [filmList, setFilmList] = useState([]);
    const [visibleFilms, setVisibleFilms] = useState([]);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    }

    useEffect(() => {
        API.loadFilm().then(films => setFilmList(films));
    }, []);

    useEffect(() => {
        const filteredFilms = filmList.filter(filters[activeFilter].filterFunction);
        setVisibleFilms(filteredFilms);
    }, [activeFilter, filmList]);

    const addFilm = async (film) => {
        try {
            await API.newFilm(film).then(() => {
                film.id = Math.max(...filmList.map(f => f.id)) + 1;
                const newFilm = new Film(film.id, film.title, film.favorite, film.watchDate, film.rating, 1);
                setFilmList([...filmList, newFilm])
                console.log("New film added", newFilm);
        });      
        } catch (error) {
            console.error("Failed to add a new film", error);
        }
    };

    const editFilm = async (film) => {
        try {
            await API.editFilm(film).then(() => {
                const index = filmList.findIndex(f => f.id === film.id);
                const newFilms = [...filmList];
                newFilms[index] = new Film(film.id, film.title, film.favorite, film.watchDate, film.rating, 1);
                setFilmList(newFilms);
                console.log("Film edited", newFilms[index]);
            });
        } catch (error) {
            console.error("Failed to edit the film", error);
        }
    };

    const deleteFilm = async (id) => {
        try {
            await API.deleteFilm(id)
            .then(() => {
                setFilmList(filmList.filter(film => film.id !== id));
                console.log("Film deleted", id)
        });
        } catch (error) {
            console.error("Failed to delete the film", error);
        }
    };

    const setFavorite = async (id, favorite) => {
        try {
            await API.setFavorite(id, favorite).then(() => {
                const index = filmList.findIndex(f => f.id === id);
                const newFilms = [...filmList];
                newFilms[index].favorite = favorite;
                setFilmList(newFilms);
                console.log("Favorite status updated", newFilms[index]);
            });
        } catch (error) {
            console.error("Failed to update favorite status", error);
        }
    };

    const updateRating = async (id, rating) => {
        try {
            await API.setRating(id, rating).then(() => {
                const index = filmList.findIndex(f => f.id === id);
                const newFilms = [...filmList];
                newFilms[index].rating = rating;
                setFilmList(newFilms);
                console.log("Rating updated", newFilms[index]);
            });
        } catch (error) {
            console.error("Failed to update rating", error);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Header isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />
            <Container fluid className="flex-grow-1 d-flex flex-column">
                <Routes>
                    <Route path="/" element={<FilmLibraryLayout films={visibleFilms} isSidebarExpanded={isSidebarExpanded} filters={filters} activeFilter={activeFilter} setActiveFilter={handleFilterChange} />}>
                        <Route path="*" element={<NotFoundPage />} />
                        <Route index element={<FilmListLayout films={visibleFilms} filters={filters} updateFilm={editFilm} deleteFilm={deleteFilm} setFavorite={setFavorite} updateRating={updateRating} />} />
                        <Route path="filters/:filterLabel" element={<FilmListLayout films={visibleFilms} filters={filters} updateFilm={editFilm} deleteFilm={deleteFilm} setFavorite={setFavorite} updateRating={updateRating} />} />
                    </Route>
                    <Route path="add" element={<FilmForm mode="Add" addFilm={addFilm} />} />
                    <Route path="edit/:filmId" element={<FilmForm mode="Edit" editFilm={editFilm} films={filmList} />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;

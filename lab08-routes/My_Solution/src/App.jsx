import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { INITIAL_FILMS, Film } from "./films.mjs";
import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, Collapse, Col, Container, Row } from 'react-bootstrap/';
import Filters from './components/Filters.jsx';
import Header from "./components/Header.jsx";
import FilmList from "./components/FilmList.jsx";
import FilmForm from "./components/FilmForm.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import NotFoundPage from './components/NotFoundPage.jsx'; 


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
    const [editingFilm, setEditingFilm] = useState(null);
    const navigate = useNavigate();

    const handleSetFilter = (filter) => {
        setActiveFilter(filter);
        setVisibleFilms(filmList.filter(filters[filter].filterFunction));
    }

    const addFilm = (film) => {
        const newId = Math.max(...visibleFilms.map(film => film.id)) + 1;
        film.id = newId;
        const newFilm = new Film(film.id, film.title, film.favorite, film.date, film.rating, 1);
        setVisibleFilms([...visibleFilms, newFilm]);
    }

    const handleEdit = (film) => {
        setEditingFilm(film)
    }


    const editFilm = (film, id) => {
        const index = visibleFilms.findIndex(f => f.id === id);
        const newFilms = [...visibleFilms];
        newFilms[index] = new Film(film.id, film.title, film.favorite, film.date, film.rating, 1);
        setVisibleFilms(newFilms);
        setEditingFilm(null);
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
            <Header isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded}/>
            <Container fluid className="flex-grow-1 d-flex flex-column">
                <Routes>    
                    <Route path='/' element={
                        <>
                            <Row className="flex-grow-1">
                                <Collapse id="films-filters" in={isSidebarExpanded} className="col-md-3 bg-light d-md-block">
                                    <div className="py-4">
                                        <h5 className="mb-3">Filters</h5>
                                        <Filters items={filters} selected={activeFilter} onSelect={handleSetFilter}/>
                                    </div>
                                </Collapse>
                                <Col md={9} className="pt-3">
                                    <h1><span id="filter-title">{filters[activeFilter].label}</span> films</h1>
                                    <FilmList films={visibleFilms} handleEdit={handleEdit} deleteFilm={deleteFilm} setFavorite={setFavorite} updateRating={updateRating}/>        
                                </Col>
                            </Row>
                            <Button
                                variant="primary"
                                className="rounded-circle fixed-right-bottom"
                                onClick={() => navigate("/add")}
                            >
                                <i className="bi bi-plus"></i>
                            </Button>
                        </>
                    } />
                    <Route path='/add' element={
                        <FilmForm mode="Add" addFilm={addFilm}/>
                    } />
                    <Route path='/edit/:id' element={
                        <FilmForm mode="Edit" film={editingFilm} editFilm={editFilm} handleEdit={handleEdit}/>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;

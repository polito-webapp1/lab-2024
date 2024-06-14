import { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../Api/API';

const FilmForm = ({ mode, films, addFilm, editFilm }) => {
    const { filmId } = useParams();
    const navigate = useNavigate();

    const film = mode === 'Edit' ? films.find(film => film.id === parseInt(filmId)) : null;

    const [title, setTitle] = useState(film ? film.title : '');
    const [favorite, setFavorite] = useState(film ? film.favorite : false);
    const [date, setDate] = useState(film ? film.watchDate : '');
    const [rating, setRating] = useState(film ? film.rating : 1);


    const handleSubmit = (event) => {
        event.preventDefault();
        const watchDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
        const newFilm = { id: filmId ? parseInt(filmId) : null, title, favorite, watchDate, rating, userId: 1 };
        if (mode === 'Add') {
            addFilm(newFilm);
            console.log("Film added", newFilm);
        } else {
            editFilm(newFilm);
            console.log("Film edited", newFilm);
        }
        navigate('..');
    };

    return (
        <Card body>
            <Form onSubmit={handleSubmit}>
                <FormGroupControl label="Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <FormGroupCheck label="Favorite" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} />
                <FormGroupControl label="Date" type="date" value={date?dayjs(date).format('YYYY-MM-DD'):""} onChange={(e) => setDate(e.target.value)} />
                <FormGroupControl label="Rating" type="number" value={rating} onChange={(e) => setRating(parseInt(e.target.value))} min={0} max={5} />
                <Button variant="primary" type="submit">{mode === 'Add' ? 'Add' : 'Edit'}</Button>{' '}
                <Button variant="danger" onClick={() => navigate('..')}>Cancel</Button>
            </Form>
        </Card>
    );
};

const FormGroupControl = ({ label, ...props }) => (
    <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control {...props} />
    </Form.Group>
);

const FormGroupCheck = ({ label, ...props }) => (
    <Form.Group className="mb-3">
        <Form.Check type="switch" label={label} {...props} />
    </Form.Group>
);

export default FilmForm;

import { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const FilmForm = ({ mode, films, addFilm, editFilm }) => {
    const { filmId } = useParams();
    const navigate = useNavigate();

    // eslint-disable-next-line react/prop-types
    const film = mode === 'Edit' ? films.find(film => film.id === parseInt(filmId)) : null;

    const [id] = useState(film ? film.id : 0);
    const [title, setTitle] = useState(film ? film.title : '');
    const [favorite, setFavorite] = useState(film ? film.favorite : false);
    const [date, setDate] = useState(film ? film.watchDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    const [rating, setRating] = useState(film ? film.rating : 0);

    useEffect(() => {
        if (film) {
            setTitle(film.title);
            setFavorite(film.favorite);
            setDate(film.watchDate.format('YYYY-MM-DD'));
            setRating(film.rating);
        }
    }, [film]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const newFilm = { id, title, favorite, date: dayjs(date), rating };

        if (mode === 'Edit') {
            editFilm(newFilm, film.id);
        } else {
            addFilm(newFilm);
        }
        navigate('..');
    };

    return (
        <Card body>
            <Form onSubmit={handleSubmit}>
                <FormGroupControl
                    label="Title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <FormGroupCheck
                    label="Favorite"
                    checked={favorite}
                    onChange={(e) => setFavorite(e.target.checked)}
                />
                <FormGroupControl
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <FormGroupControl
                    label="Rating"
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    min={0}
                    max={5}
                />
                <Button variant="primary" type="submit">
                    {mode === 'Add' ? 'Add' : 'Edit'}
                </Button>{' '}
                <Button variant="danger" onClick={() => navigate('..')}>
                    Cancel
                </Button>
            </Form>
        </Card>
    );
};

// eslint-disable-next-line react/prop-types
const FormGroupControl = ({ label, ...props }) => (
    <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control {...props} />
    </Form.Group>
);

// eslint-disable-next-line react/prop-types
const FormGroupCheck = ({ label, ...props }) => (
    <Form.Group className="mb-3">
        <Form.Check type="switch" label={label} {...props} />
    </Form.Group>
);

export default FilmForm;

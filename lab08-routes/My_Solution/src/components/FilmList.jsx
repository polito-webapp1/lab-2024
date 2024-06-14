import 'dayjs';
import { Col, Row, ListGroup, ListGroupItem } from 'react-bootstrap/';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function FilmList({ films, deleteFilm, setFavorite, updateRating }) {
    const navigate = useNavigate();

    const handleEdit = (film) => {
        navigate(`/edit/${film.id}`);
    };

    return (
        <ListGroup id="films-list" variant="flush">
            {films.map(film => (
                <FilmInList
                    filmData={film}
                    handleEdit={handleEdit}
                    key={film.id}
                    deleteFilm={deleteFilm}
                    setFavorite={setFavorite}
                    updateRating={updateRating}
                />
            ))}
        </ListGroup>
    );
}

FilmList.propTypes = {
    films: PropTypes.array.isRequired,
    deleteFilm: PropTypes.func.isRequired,
    setFavorite: PropTypes.func.isRequired,
    updateRating: PropTypes.func.isRequired
};

function FilmInList({ filmData, handleEdit, deleteFilm, setFavorite, updateRating }) {
    return (
        <ListGroupItem>
            <Row className="gy-2">
                <Col xs={6} xl={3} className="favorite-title d-flex gap-2 align-items-center">
                    {filmData.title}
                    <div className="d-xl-none actions">
                        <i className="bi bi-pencil" onClick={() => handleEdit(filmData)}></i>
                        <i className="bi bi-trash" onClick={() => deleteFilm(filmData.id)}></i>
                    </div>
                </Col>
                <Col xs={6} xl={3} className="text-end text-xl-center">
                    <span className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" defaultChecked={filmData.favorite} onChange={(e) => setFavorite(filmData.id, e.target.checked)} />
                        <label className="custom-control-label">Favorite</label>
                    </span>
                </Col>
                <Col xs={4} xl={3} className="text-xl-center">
                    {filmData.formatWatchDate()}
                </Col>
                <Col xs={8} xl={3} className="actions-container text-end">
                    <div className="rating">
                        <Rating rating={filmData.rating} maxStars={5} updateRating={updateRating} filmId={filmData.id} />
                    </div>
                    <div className="d-none d-xl-flex actions">
                        <i className="bi bi-pencil" onClick={() => handleEdit(filmData)}></i>
                        <i className="bi bi-trash" onClick={() => deleteFilm(filmData.id)}></i>
                    </div>
                </Col>
            </Row>
        </ListGroupItem>
    );
}

FilmInList.propTypes = {
    filmData: PropTypes.object.isRequired,
    handleEdit: PropTypes.func.isRequired,
    deleteFilm: PropTypes.func.isRequired,
    setFavorite: PropTypes.func.isRequired,
    updateRating: PropTypes.func.isRequired
};

function Rating({ maxStars, rating, updateRating, filmId }) {
    return (
        [...Array(maxStars)].map((el, index) => (
            <i
                key={index}
                className={index < rating ? "bi bi-star-fill" : "bi bi-star"}
                onClick={() => updateRating(filmId, index + 1)}
                style={{ cursor: 'pointer' }}
            />
        ))
    );
}

Rating.propTypes = {
    maxStars: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    updateRating: PropTypes.func.isRequired,
    filmId: PropTypes.number.isRequired
};

export default FilmList;

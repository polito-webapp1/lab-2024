import 'dayjs';
import { Col, Row, ListGroup, ListGroupItem } from 'react-bootstrap/';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function FilmList(props) {
    //const params = useParams();
    //const filter = params.filter;

    const navigate = useNavigate(); // Ottieni la funzione navigate dall'hook useNavigate

    const handleEdit = (film) => {
        props.handleEdit(film);
        navigate(`/edit/${film.id}`);
    };

    return (
        <ListGroup id="films-list" variant="flush">
            {props.films.map((film) => (
                <FilmInList filmData={film} handleEdit={handleEdit} key={film.id} />
            ))}
        </ListGroup>
    );
}

FilmList.propTypes = {
    films: PropTypes.array.isRequired,
};

function FilmInList({ filmData, handleEdit }) {
    return (
        <ListGroupItem>
            <Row className="gy-2">
                <Col xs={6} xl={3} className="favorite-title d-flex gap-2 align-items-center">
                    {filmData.title}
                    <div className="d-xl-none actions">
                        <i className="bi bi-pencil" onClick={() => handleEdit(filmData)}></i>
                        <i className="bi bi-trash"></i>
                    </div>
                </Col>
                <Col xs={6} xl={3} className="text-end text-xl-center">
                    <span className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" defaultChecked={filmData.favorite} />
                        <label className="custom-control-label">Favorite</label>
                    </span>
                </Col>
                <Col xs={4} xl={3} className="text-xl-center">
                    {filmData.formatWatchDate()}
                </Col>
                <Col xs={8} xl={3} className="actions-container text-end">
                    <div className="rating">
                        <Rating rating={filmData.rating} maxStars={5} />
                    </div>
                    <div className="d-none d-xl-flex actions">
                        <i className="bi bi-pencil" onClick={() => handleEdit(filmData)}></i>
                        <i className="bi bi-trash"></i>
                    </div>
                </Col>
            </Row>
        </ListGroupItem>
    );
}

FilmInList.propTypes = {
    filmData: PropTypes.object.isRequired,
};

function Rating({ maxStars, rating }) {
    if (rating === null) rating = 0;
    return [...Array(maxStars)].map((el, index) => (
        <i key={index} className={index < rating ? "bi bi-star-fill" : "bi bi-star"} />
    ));
}

Rating.propTypes = {
    maxStars: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
};

export default FilmList;

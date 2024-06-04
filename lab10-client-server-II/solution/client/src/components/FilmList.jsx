import dayjs from 'dayjs';

import PropTypes from 'prop-types';
import {Col, Row, ListGroup, ListGroupItem} from 'react-bootstrap/';
import { Link, useLocation } from "react-router-dom";


export default function FilmList(props) {

    return (
        <ListGroup id="films-list" variant="flush">
            {props.films.map((film) => <FilmInList
                key={film.id}
                filmData={film}
                updateFilmRating={props.updateFilmRating}
                updateFilmFavorite={props.updateFilmFavorite}
                deleteFilm={props.deleteFilm}/>)}
        </ListGroup>
    );
}

FilmList.propTypes = {
    films: PropTypes.array.isRequired,
    updateFilmRating: PropTypes.func.isRequired,
    updateFilmFavorite: PropTypes.func.isRequired,
    deleteFilm: PropTypes.func.isRequired
};

export function FilmInList(props) {

    return (<ListGroupItem>
        <Row className="gy-2">
            <Col xs={6} xl={3} className="favorite-title d-flex gap-2 align-items-center">
                {props.filmData.title}
                <div className="d-xl-none actions">
                    <FilmIcons filmData={props.filmData} deleteFilm={props.deleteFilm}/>
                </div>
            </Col>
            <Col xs={6} xl={3} className="text-end text-xl-center">
                <span className="custom-control custom-checkbox">
                    <span className="custom-control custom-checkbox">
                        {/* Disabling the checkbox to suppress a warning. It is necessary to implement also the onChange function to properly manage the checkbox. */}
                        <input type="checkbox" className="custom-control-input" checked={props.filmData.favorite}
                            onChange={(event) => props.updateFilmFavorite(props.filmData.id, event.target.checked)} />
                        <label className="custom-control-label">Favorite</label>
                    </span>
                </span>
            </Col>

            <Col xs={4} xl={3} className="text-xl-center">
                {props.filmData.watchDate ? dayjs(props.filmData.watchDate).format('MMMM D, YYYY') : ''}
            </Col>
            <Col xs={8} xl={3} className="actions-container text-end">
                <div className="rating">
                    <Rating rating={props.filmData.rating} maxStars={5}
                        updateRating={(newRating) => props.updateFilmRating(props.filmData.id, newRating)}/>
                </div>
                <div className="d-none d-xl-flex actions">
                    <FilmIcons filmData={props.filmData} deleteFilm={props.deleteFilm}/>
                </div>
            </Col>
        </Row>
    </ListGroupItem>);
}

FilmInList.propTypes = {
    filmData: PropTypes.object.isRequired,
    updateFilmRating: PropTypes.func.isRequired,
    updateFilmFavorite: PropTypes.func.isRequired,
    deleteFilm: PropTypes.func.isRequired
};

function FilmIcons(props) {
    const location = useLocation();

    return(<>
        <Link className="bi bi-pencil" to={"/edit/" + props.filmData.id} state={{nextpage: location.pathname}}/>
        <i className="bi bi-trash"  onClick={() => props.deleteFilm(props.filmData.id)} />
    </>);
}

FilmIcons.propTypes = {
    filmData: PropTypes.object.isRequired,
    deleteFilm: PropTypes.func.isRequired
};

function Rating({maxStars, rating, updateRating}) {
    return [...Array(maxStars)].map(
        (el, index) =>
            <i key={index} className={(index < rating) ? "bi bi-star-fill" : "bi bi-star"} onClick={() => updateRating(index+1)} />);
}

Rating.propTypes = {
    maxStars: PropTypes.number.isRequired,
    updateRating: PropTypes.func.isRequired
};

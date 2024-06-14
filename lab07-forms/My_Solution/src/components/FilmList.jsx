import 'dayjs';
import {Col, Row} from 'react-bootstrap/';

import PropTypes from 'prop-types';
import {ListGroup, ListGroupItem} from "react-bootstrap";
import FilmForm from "./FilmForm";

function FilmList(props) {
    return (
    <>    
    <ListGroup id="films-list" variant="flush">
        {props.films.map((film) => <FilmInList filmData={film} handleEdit={props.handleEdit} key={film.id}/>)}
    </ListGroup>
    {(props.state=="Add" || props.state === "Edit") &&
                    <FilmForm
                       mode={props.state}
                       cancel={props.cancel}
                       film={props.film}
                       editFilm={props.editFilm}
                       addfilm={props.addfilm}
                    />
                }
    </>
    );
}

FilmList.propTypes = {
    films: PropTypes.array.isRequired,
};

function FilmInList({filmData, handleEdit}) {

    return (<ListGroupItem>
        <Row className="gy-2">

            <Col xs={6} xl={3} className="favorite-title d-flex gap-2 align-items-center">
                {filmData.title}
                <div className="d-xl-none actions">
                    <i className="bi bi-pencil" onClick={() => { handleEdit(filmData) }}></i>
                    <i className="bi bi-trash"></i>
                </div>
            </Col>
            <Col xs={6} xl={3} className="text-end text-xl-center">
            <span className="custom-control custom-checkbox">
              <span className="custom-control custom-checkbox">
                          <input type="checkbox" className="custom-control-input" defaultChecked={filmData.favorite}/>
                          <label className="custom-control-label">Favorite</label>
                        </span>
            </span>
            </Col>

            <Col xs={4} xl={3} className="text-xl-center">
                {filmData.formatWatchDate()}
            </Col>
            <Col xs={8} xl={3} className="actions-container text-end">
                <div className="rating">
                    <Rating rating={filmData.rating} maxStars={5}/>
                </div>
                <div className="d-none d-xl-flex actions">
                    <i className="bi bi-pencil" onClick={() => { handleEdit(filmData) }}></i>
                    <i className="bi bi-trash"></i>
                </div>
            </Col>
        </Row>
    </ListGroupItem>);
}

FilmInList.propTypes = {
    filmData: PropTypes.object.isRequired,
};

function Rating({maxStars, rating}) {
    return [...Array(maxStars)].map(
        (el, index) => <i key={index} className={(index < rating) ? "bi bi-star-fill" : "bi bi-star"}/>);
}

Rating.propTypes = {
    maxStars: PropTypes.number.isRequired,
};


export default FilmList;

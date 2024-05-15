import dayjs from 'dayjs';

import {useState} from 'react';
import PropTypes from 'prop-types';
import {Col, Row, Button, ListGroup, ListGroupItem} from 'react-bootstrap/';

import FilmForm from './FilmForm';

function FilmPage(props) {
    // This state is used for displaying the form
    const [showForm, setShowForm] = useState(false);

    // This state stores the current film when an *edit* button is pressed.
    const [editableFilm, setEditableFilm] = useState();

    return (<>
        <ListGroup id="films-list" variant="flush">
            {props.films.map((film) => <FilmInList key={film.id} filmData={film} setEditableFilm={setEditableFilm} setShowForm={setShowForm} />)}
        </ListGroup>
        { showForm ?
            <FilmForm key={editableFilm ? editableFilm.id : -1} 
                film={editableFilm}
                addFilm={(film) => {props.addFilm(film); setShowForm(false);}}
                editFilm={(film) => {props.editFilm(film); setShowForm(false);}}
                cancel={() => setShowForm(false)}
            />
            // setEditableFilm() avoids that the add form would show the data of a past edited film 
            : <Button variant="primary" className="rounded-circle fixed-right-bottom" onClick={() => { setShowForm(true); setEditableFilm(); } }>
                <i className="bi bi-plus"/>
            </Button>
        }
    </>);
}

FilmPage.propTypes = {
    films: PropTypes.array.isRequired,
    addFilm: PropTypes.func.isRequired,
    editFilm: PropTypes.func.isRequired,
};

function FilmInList(props) {

    return (<ListGroupItem>
        <Row className="gy-2">
            <Col xs={6} xl={3} className="favorite-title d-flex gap-2 align-items-center">
                {props.filmData.title}
                <div className="d-xl-none actions">
                    <FilmIcons filmData={props.filmData} setShowForm={props.setShowForm} setEditableFilm={props.setEditableFilm}/>
                </div>
            </Col>
            <Col xs={6} xl={3} className="text-end text-xl-center">
                <span className="custom-control custom-checkbox">
                    <span className="custom-control custom-checkbox">
                        {/* Disabling the checkbox to suppress a warning. It is necessary to implement also the onChange function to properly manage the checkbox. */}
                        <input type="checkbox" className="custom-control-input" checked={props.filmData.favorite} disabled={true}/>
                        <label className="custom-control-label">Favorite</label>
                    </span>
                </span>
            </Col>

            <Col xs={4} xl={3} className="text-xl-center">
                {props.filmData.watchDate ? dayjs(props.filmData.watchDate).format('MMMM D, YYYY') : ''}
            </Col>
            <Col xs={8} xl={3} className="actions-container text-end">
                <div className="rating">
                    <Rating rating={props.filmData.rating} maxStars={5}/>
                </div>
                <div className="d-none d-xl-flex actions">
                    <FilmIcons filmData={props.filmData} setShowForm={props.setShowForm} setEditableFilm={props.setEditableFilm}/>
                </div>
            </Col>
        </Row>
    </ListGroupItem>);
}

FilmInList.propTypes = {
    filmData: PropTypes.object.isRequired,
    setShowForm: PropTypes.func.isRequired,
    setEditableFilm: PropTypes.func.isRequired,
};

function FilmIcons(props) {

    return(<>
        <i className="bi bi-pencil" onClick={() => {
            props.setShowForm(true);
            props.setEditableFilm(props.filmData);
        }} />
        <i className="bi bi-trash" />
    </>);
}

FilmIcons.propTypes = {
    filmData: PropTypes.object.isRequired,
    setShowForm: PropTypes.func.isRequired,
    setEditableFilm: PropTypes.func.isRequired,
};

function Rating({maxStars, rating}) {
    return [...Array(maxStars)].map(
        (el, index) => <i key={index} className={(index < rating) ? "bi bi-star-fill" : "bi bi-star"}/>);
}

Rating.propTypes = {
    maxStars: PropTypes.number.isRequired,
};


export default FilmPage;

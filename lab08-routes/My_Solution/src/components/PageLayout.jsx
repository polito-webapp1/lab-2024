import {Row, Col, Collapse, Button} from "react-bootstrap";
import {Outlet, useParams, useNavigate} from "react-router-dom";

import Filters from "./Filters.jsx";
import FilmList from "./FilmList.jsx";

export function FilmLibraryLayout(props) {
    return (
        <Row className="flex-grow-1">
            {/* eslint-disable-next-line react/prop-types */}
            <Collapse id="films-filters" in={props.isSidebarExpanded} className="col-md-3 bg-light d-md-block">
                <div className="py-4">
                    <h5 className="mb-3">Filters</h5>
                    {/* eslint-disable-next-line react/prop-types */}
                    <Filters items={props.filters} />
                </div>
            </Collapse>
            <Col md={9} className="pt-3">
                <Outlet/>
            </Col>
        </Row>
    );
}

export function FilmListLayout(props) {
    const { filterLabel } = useParams();
    // eslint-disable-next-line react/prop-types
    const filterName = props.filters[filterLabel] ? props.filters[filterLabel].label : 'All';

    // When an unpredicted filter is written, all the films are displayed.
    // eslint-disable-next-line react/prop-types
    const filteredFilms = (filterLabel in props.filters) ? props.films.filter(props.filters[filterLabel].filterFunction) : props.films;

    const navigate = useNavigate();

    return (
        <>
            <Row><Col>  <h1><span id="filter-title">{filterName}</span> films</h1>  </Col></Row>
            {/* eslint-disable-next-line react/prop-types */}
            <FilmList films={filteredFilms} deleteFilm={props.deleteFilm} handleEdit={props.updateFilm} setFavorite={props.setFavorite} updateRating={props.updateRating}/>
                <Button
                    variant="primary"
                    className="rounded-circle fixed-right-bottom"
                    onClick={() => navigate("/add")}
                >
                    <i className="bi bi-plus"></i>
                </Button>
        </>
    );
}


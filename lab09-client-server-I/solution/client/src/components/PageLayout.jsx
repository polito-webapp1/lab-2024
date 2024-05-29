/* eslint-disable react/prop-types */
import { Row, Col, Collapse } from "react-bootstrap";
import { Outlet, Link, useParams, useLocation } from "react-router-dom";

import Filters from "./Filters.jsx";
import FilmForm from "./FilmForm.jsx";
import FilmList from "./FilmList.jsx";

export function FilmLibraryLayout(props) {
  return (
    <Row className="flex-grow-1">
      <Collapse id="films-filters" in={props.isSidebarExpanded} className="col-md-3 bg-light d-md-block">
        <div className="py-4">
          <h5 className="mb-3">Filters</h5>
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
  const filterName = props.filters[filterLabel] ? props.filters[filterLabel].label : 'All';

  const location = useLocation();

  return (
    <>
      <Row><Col>  <h1><span id="filter-title">{filterName}</span> films</h1>  </Col></Row>
      <FilmList films={props.films} updateFilm={props.updateFilm} deleteFilm={props.deleteFilm}/>
      <Row><Col>
        <Link className="btn btn-primary rounded-circle fixed-right-bottom" to="/add" state={{nextpage: location.pathname}}>
          <i className="bi bi-plus"/>
        </Link>
      </Col></Row>
    </>
  );
}

export function EditLayout(props) {
  const { filmId } = useParams();
  const editableFilm = props.films && props.films.find( f => f.id === Number(filmId) );
  
  return(!editableFilm ?
    <Row>
      <Col>
        <p className='lead mt-3'>Error: film not found!</p>
        <Link className='btn btn-primary mx-auto' to='../../' relative='path'>Go Home!</Link>
      </Col>
    </Row>
    : <Row><Col><FilmForm film={editableFilm} editFilm={props.editFilm}/></Col></Row>
  );
}

export function NotFoundLayout() {
  return(
      <>
        <Row><Col>  <h2>Error: page not found!</h2>  </Col></Row>
        <Row><Col>  <img src="/GitHub404.png" alt="page not found" className="my-3" style={{ display: 'block' }}/>  </Col></Row>
        <Row><Col>  <Link to="/" className="btn btn-primary mt-2 my-5" >Go Home!</Link>  </Col></Row>
      </>
  );
}

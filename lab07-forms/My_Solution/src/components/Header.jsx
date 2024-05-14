import {Button, Col, Container, Row} from "react-bootstrap/";
import PropTypes from "prop-types";

function Header({isSidebarExpanded, setIsSidebarExpanded}) {
    return <header className="py-1 py-md-3 border-bottom bg-primary">
        <Container fluid className="gap-3 align-items-center">
            <Row>
                <Col xs={3} className="d-md-none">
                    <Button
                        onClick={() => setIsSidebarExpanded(p => !p)}
                        aria-controls="films-filters"
                        aria-expanded={isSidebarExpanded}
                    >
                        <i className="bi bi-list"/>
                    </Button>
                </Col>
                <Col xs={6} md={4}>
                    <a href="/"
                       className="d-flex align-items-center justify-content-center justify-content-md-start h-100 link-light text-decoration-none">
                        <i className="bi bi-collection-play me-2 flex-shrink-0"></i>
                        <span className="h5 mb-0">Film Library</span>
                    </a>
                </Col>
                <Col xs={3} md={8} className="d-flex align-items-center justify-content-end">
                    <form className="d-none d-md-block w-100 me-3">
                        <input type="search" className="form-control" placeholder="Search..." aria-label="Search"/>
                    </form>
                    <a href="#" className="d-block link-light text-decoration-none">
                        <i className="bi bi-person-circle"></i>
                    </a>
                </Col>
            </Row>
        </Container>
    </header>;
}

Header.propTypes = {
    isSidebarExpanded: PropTypes.bool,
    setIsSidebarExpanded: PropTypes.func
}

export default Header;

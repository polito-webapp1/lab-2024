import PropTypes from 'prop-types';
import { ListGroup, NavItem } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Filters(props) {
    const { items } = props;

    // Converting the object into an array to use map method
    const filterArray = Object.entries(items);

    return (
        <ListGroup as="ul" variant="flush" className="nav nav-pills flex-column gap-2 mb-auto">
            {
                filterArray.map(([filterName, {label, url}]) => {
                    return (
                        <NavItem key={filterName}>
                            <NavLink
                                className={({isActive}) => `nav-link ${isActive ? 'active' : 'link-dark'}`}
                                to={url}
                            >
                                {label}
                            </NavLink>
                        </NavItem>);
                })
            }
        </ListGroup>
    );
}

Filters.propTypes = {
    items: PropTypes.object,  // This item object was modified containing URLs
};

export default Filters;

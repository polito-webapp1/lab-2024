import PropTypes from 'prop-types';
import {NavItem, NavLink} from "react-bootstrap";

/**
 * This components requires:
 * - the list of filters labels to show,
 * - the filter that is currently selected
 * - the handler to notify a new selection
 */
function Filters(props) {
    const {items, selected, onSelect} = props;

    // Converting the object into an array to use map method
    const filterArray = Object.entries(items);

    return (
        <ul className="nav nav-pills flex-column gap-2 mb-auto">
            {
                filterArray.map(([filterName, {label}]) => {
                    return (
                        <NavItem key={filterName}>
                            <NavLink
                                href={'#' + filterName}
                                onClick={() => onSelect(filterName)}
                                className={selected === filterName ? '': 'link-dark'}
                                active={selected === filterName}
                            >
                                {label}
                            </NavLink>
                        </NavItem>);
                })
            }
        </ul>
    );
}

Filters.propTypes = {
    items: PropTypes.object,
    selected: PropTypes.string,
    onSelect: PropTypes.func
};

export default Filters;

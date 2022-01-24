import Categories from "./Categories";
import PropTypes from "prop-types";

const CategoryDropdown = (props) => {

    return (
        <>
            {/* This shows the category at the top of the dropdown.*/}
            <li id="top-of-dropdown">
                <button type="button" id="category-in-focus">
                    {props.activeCategory === undefined ? <span>Home</span> : <span>{props.activeCategory}</span>}
                </button>
                {/* These are all other categories including home.*/}
                <ul id="category-dropdown-content">
                    <Categories />
                </ul>
            </li>
        </>
    )
}

CategoryDropdown.propTypes = {
    activeCategory: PropTypes.string
}

export default CategoryDropdown

import { useState, useEffect } from "react";
import Categories from "./Categories";
import PropTypes from "prop-types";

const CategoryDropdown = (props) => {
    
    const [wantDropdown, setWantDropdown] = useState(false);

    function handleCategoryClick() {
        setWantDropdown(wantDropdown => !wantDropdown);
    }

    return (
        <div id="category-dropdown">
            <button type="button" onClick={handleCategoryClick} id="category-in-focus">
                {props.activeCategory === undefined ? <span>Home</span> : <span>{props.activeCategory}</span>}
            </button>
            {wantDropdown ? <Categories /> : ""}
        </div>
    )
}

CategoryDropdown.propTypes = {
    activeCategory: PropTypes.string
}

export default CategoryDropdown

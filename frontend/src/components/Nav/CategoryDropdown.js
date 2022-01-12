import { useState } from "react";
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
                <span>{props.activeCategory}</span>
            </button>
            {wantDropdown ? <Categories /> : ""}
        </div>
    )
}

CategoryDropdown.propTypes = {
    activeCategory: PropTypes.string
}

export default CategoryDropdown

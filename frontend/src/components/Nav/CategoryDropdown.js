import Categories from "./Categories";
import PropTypes from "prop-types";
import { useState } from "react";

const CategoryDropdown = (props) => {

    const [wantDropdown, setWantDropdown] = useState(false);

    function determineDropdownDisplay() {
        if (wantDropdown) {
            return {display: "block"}
        }
        return {display: "none"}
    }

    return (
        <>
            {/* This shows the category at the top of the dropdown.*/}
            <li id="top-of-dropdown">
                <button type="button" id="category-in-focus" onClick={() => setWantDropdown(!wantDropdown)} >
                    {props.activeCategory === undefined ? <span>Home</span> : <span>{props.activeCategory}</span>}
                </button>
                {/* These are all other categories including home.*/}
                <ul id="category-dropdown-content" style={determineDropdownDisplay()}>
                    <Categories wantDropdown={wantDropdown} />
                </ul>
            </li>
        </>
    )
}

CategoryDropdown.propTypes = {
    activeCategory: PropTypes.string
}

export default CategoryDropdown

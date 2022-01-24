import Categories from "./Categories";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";

const CategoryDropdown = (props) => {

    const [wantDropdown, setWantDropdown] = useState(false);
    const categoryDropdown = useRef(null);

    function determineDropdownDisplay() {
        if (wantDropdown) {
            return {display: "block"}
        }
        return {display: "none"}
    }

    function handleClickOutsideDropdown(e) {
        if (categoryDropdown.current && !categoryDropdown.current.contains(e.target)) {
            if (wantDropdown) {
                setWantDropdown(false);
            }
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
    }, [wantDropdown]);


    return (
        <>
            {/* This shows the category at the top of the dropdown.*/}
            <li id="top-of-dropdown" ref={categoryDropdown}>
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

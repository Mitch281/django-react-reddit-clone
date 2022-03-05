import Categories from "../Categories/Categories";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import styles from "./category-dropdown.module.css";

const CategoryDropdown = (props) => {
    const [wantDropdown, setWantDropdown] = useState(false);
    const categoryDropdown = useRef(null);

    const [filterCategoriesText, setFilterCategoriesText] = useState("");

    const params = useParams();

    function determineDropdownDisplay() {
        if (wantDropdown) {
            return { display: "block" };
        }
        return { display: "none" };
    }

    function handleClickOutsideDropdown(e) {
        if (
            categoryDropdown.current &&
            !categoryDropdown.current.contains(e.target)
        ) {
            if (wantDropdown) {
                setWantDropdown(false);
            }
        }
    }

    // Whenever the user visits a new page, we do not want the dropdown to render.
    useEffect(() => {
        setWantDropdown(false);
    }, [params]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutsideDropdown
            );
        // eslint-disable-next-line
    }, [wantDropdown]);

    return (
        <>
            {/* This shows the category at the top of the dropdown.*/}
            <li id={styles["top-of-dropdown"]} ref={categoryDropdown}>
                <button
                    type="button"
                    id={styles["category-in-focus"]}
                    onClick={() => setWantDropdown(!wantDropdown)}
                >
                    {props.activeCategory === undefined ? (
                        <>
                            Home <IoIosArrowDown />
                        </>
                    ) : (
                        <>
                            {props.activeCategory}  <IoIosArrowDown />
                        </>
                    )}
                </button>
                {/* These are all other categories including home.*/}
                <ul
                    id={styles["category-dropdown-content"]}
                    style={determineDropdownDisplay()}
                >
                    <hr />
                    <li>
                        <input
                            type="text"
                            placeholder="Filter categories"
                            value={filterCategoriesText}
                            id={styles["filter-categories-input"]}
                            onChange={(e) =>
                                setFilterCategoriesText(e.target.value)
                            }
                        />
                    </li>
                    <hr />
                    <hr />
                    <li>
                        <Link to="/create-category/">
                            <BiPlus />
                            Create Category
                        </Link>
                    </li>
                    <hr />
                    <Categories
                        wantDropdown={wantDropdown}
                        categories={props.categories}
                        filterCategoriesText={filterCategoriesText}
                        categoriesLoading={props.categoriesLoading}
                        categoryLoadingError={props.categoryLoadingError}
                    />
                </ul>
            </li>
        </>
    );
};

CategoryDropdown.propTypes = {
    activeCategory: PropTypes.string,
    categories: PropTypes.array,
    categoryLoadingError: PropTypes.instanceOf(Error),
    categoriesLoading: PropTypes.bool
};

export default CategoryDropdown;

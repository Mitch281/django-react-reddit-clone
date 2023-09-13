import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ActiveCategory from "./ActiveCategory";
import Categories from "./Categories";
import { Link } from "react-router-dom";
import styles from "./styles/category-dropdown.module.css";
import { BiPlus } from "react-icons/bi";

const CategoryDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const categoryDropdown = useRef(null);
    const [filterCategoriesText, setFilterCategoriesText] = useState("");

    const params = useParams();

    let dropdownDisplay = isDropdownOpen
        ? { display: "block" }
        : { display: "none" };

    function handleClickOutsideDropdown(e) {
        const closeDropdown =
            categoryDropdown.current &&
            !categoryDropdown.current.contains(e.target) &&
            isDropdownOpen;
        if (closeDropdown) {
            setIsDropdownOpen(false);
        }
    }

    // Whenever the user visits a new page, we do not want the dropdown to render.
    useEffect(() => {
        setIsDropdownOpen(false);
    }, [params]);

    function toggleDropdown() {
        setIsDropdownOpen(!isDropdownOpen);
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutsideDropdown
            );
        // eslint-disable-next-line
    }, [isDropdownOpen]);

    return (
        <>
            <li id={styles["top-of-dropdown"]} ref={categoryDropdown}>
                <ActiveCategory toggleDropdown={toggleDropdown} />
                <ul
                    id={styles["category-dropdown-content"]}
                    style={dropdownDisplay}
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
                    <Categories filterCategoriesText={filterCategoriesText} />
                </ul>
            </li>
        </>
    );
};

export default CategoryDropdown;

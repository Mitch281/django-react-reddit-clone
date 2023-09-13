import { useParams } from "react-router-dom";
import styles from "./styles/category-dropdown.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";

const ActiveCategory = ({ toggleDropdown }) => {
    const params = useParams();
    const [activeCategory, setActiveCategory] = useState(() => {
        return params.categoryName || "Home";
    });

    useEffect(() => {
        setActiveCategory(() => {
            return params.categoryName || "Home";
        });
    }, [params]);

    return (
        <button
            type="button"
            id={styles["category-in-focus"]}
            onClick={toggleDropdown}
        >
            {activeCategory} <IoIosArrowDown />
        </button>
    );
};

export default ActiveCategory;

import { Link } from "react-router-dom";
import styles from "./styles/category.module.css";

const Category = ({ categoryId, categoryName }) => {
    // Note for future use: "/url/" is absolute path (replaces url) while "url/" is relative path (appends to current url).

    return (
        <Link
            to={`/posts/category=${categoryName}/`}
            state={{ categoryId: categoryId }}
            className={styles["post-category-name"]}
        >
            t/{categoryName} &nbsp;
        </Link>
    );
};

export default Category;

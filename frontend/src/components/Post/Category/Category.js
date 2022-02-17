import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Category = (props) => {

    // Note for future use: "/url/" is absolute path (replaces url) while "url/" is relative path (appends to current url).

    return (
        <Link 
        to={`/posts/category=${props.categoryName}/`}
        state={{categoryId: props.categoryId}}
        className="post-category-name">
            t/{props.categoryName} &nbsp;
        </Link>
    )
}

Category.propTypes = {
    categoryId: PropTypes.string,
    categoryName: PropTypes.string
}

export default Category

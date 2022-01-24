import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Category = (props) => {

    return (
        <li>
            {/* <button type="button" onClick={handleCategoryClick}>
                <span>{props.category.name}</span>
            </button> */}
            <Link to={`/posts/category=${props.category.name}/`} state={{categoryId: props.category.id}}>
                {props.category.name}
            </Link>
        </li>
    )
}

Category.propTypes = {
    category: PropTypes.object
}

export default Category

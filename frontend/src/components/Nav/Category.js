import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Category = (props) => {

    function filterCategories() {

        // Don't do any filtering if filter text is empty.
        if (props.filterCategoriesText === "") {
            return;
        }
        if (!props.category.name.includes(props.filterCategoriesText)) {
            return {display:"none"}
        }
        return;
    }

    return (
        <li>
            <Link to={`/posts/category=${props.category.name}/`} 
            state={{categoryId: props.category.id}} style={filterCategories()} >
                {props.category.name}
            </Link>
        </li>
    )
}

Category.propTypes = {
    category: PropTypes.object,
    filterCategoriesText: PropTypes.string
}

export default Category

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Category = (props) => {
    const navigate = useNavigate();

    function handleCategoryClick() {
        navigate(`/posts/category=${props.category.name}/`, {state: {categoryId: props.category.id}});
    }

    return (
        <button type="button" onClick={handleCategoryClick}>
            <span>{props.category.name}</span>
        </button>
    )
}

Category.propTypes = {
    category: PropTypes.object
}

export default Category

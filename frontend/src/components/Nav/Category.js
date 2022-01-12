import { useNavigate } from "react-router-dom";

const Category = (props) => {
    const navigate = useNavigate();

    function handleCategoryClick(e) {
        navigate(`/posts/category=${props.category.name}/`, {replace: true, state: {categoryId: props.category.id}});
    }

    return (
        <button type="button" onClick={(e) => handleCategoryClick(e)}>
            {props.category.name}
        </button>
    )
}

export default Category

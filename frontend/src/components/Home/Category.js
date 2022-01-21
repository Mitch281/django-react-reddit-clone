import PropTypes from "prop-types";

const Category = (props) => {
    return (
        <span className="post-category-name">
            t/{props.categoryName} &nbsp;
        </span>
    )
}

Category.propTypes = {
    categoryName: PropTypes.string
}

export default Category

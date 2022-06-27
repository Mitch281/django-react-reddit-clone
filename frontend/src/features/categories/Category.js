import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCategoryById } from "./categoriesSlice";

const Category = ({ categoryId, filterCategoriesText }) => {
    const category = useSelector((state) =>
        selectCategoryById(state, categoryId)
    );

    const content = (
        <li>
            <Link
                to={`/posts/category=${category.name}/`}
                state={{ categoryId: category.id }}
            >
                {category.name}
            </Link>
        </li>
    );
    if (!filterCategoriesText) {
        return content;
    } 

    const wantRenderCategoryName = category.name.includes(filterCategoriesText.toLowerCase());
    if (wantRenderCategoryName) {
        return content;
    } else {
        return null;
    }
};

export default Category;

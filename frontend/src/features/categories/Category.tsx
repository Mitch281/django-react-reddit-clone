import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { Category as CategoryType } from "../../../types.js";
import { selectCategoryById } from "./categoriesSlice.ts";

type Props = {
    categoryId: string;
    filterCategoriesText: string;
};

const Category = ({ categoryId, filterCategoriesText }: Props) => {
    const category: CategoryType = useSelector((state) =>
        selectCategoryById(state, categoryId)
    ) as CategoryType;

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

    const wantRenderCategoryName = category.name
        .toLowerCase()
        .includes(filterCategoriesText.toLowerCase());
    if (wantRenderCategoryName) {
        return content;
    } else {
        return null;
    }
};

export default Category;

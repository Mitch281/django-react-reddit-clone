import { useDispatch, useSelector } from "react-redux";
import { constants } from "../../utils/constants";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { useEffect } from "react";
import { fetchCategories, selectCategoryIds } from "./categoriesSlice";
import Category from "./Category";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

const Categories = ({ filterCategoriesText }) => {
    const dispatch = useDispatch();
    const categoriesStatus = useSelector((state) => state.categories.status);
    const categoryIds = useSelector(selectCategoryIds);

    const errorStyling = {
        display: "table",
        margin: "0px auto 5px auto",
    };

    const loadingStyling = {
        display: "table",
        margin: "0px auto 5px auto",
    };

    useEffect(() => {
        if (categoriesStatus === "idle") {
            dispatch(fetchCategories());
        }
    }, [dispatch, categoriesStatus]);

    const loader = (
        <ClipLoader
            color={constants.loaderColour}
            loading={true}
            size={20}
            css={loadingStyling}
        />
    );

    let content = null;
    if (categoriesStatus === "pending") {
        content = loader;
    } else if (categoriesStatus === "rejected") {
        content = (
            <li>
                <BsFillExclamationCircleFill
                    style={errorStyling}
                    color={constants.errorMessageColour}
                />
            </li>
        );
    } else if (categoriesStatus === "fulfilled") {
        content = (
            <>
                {/* This is the first category in the dropdown, which is always the home category.*/}
                <li>
                    <Link to="/">Home</Link>
                </li>
                <hr />

                {/* These are the rest of the categories.*/}
                {categoryIds.map((categoryId) => (
                    <Category
                        key={categoryId}
                        categoryId={categoryId}
                        filterCategoriesText={filterCategoriesText}
                    />
                ))}
                <hr />
            </>
        );
    }

    return content;
};

export default Categories;

import { Link } from "react-router-dom";
import Category from "../Category/Category";
import PropTypes from "prop-types";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";

const Categories = (props) => {

    const errorStyling = {
        display: "table",
        margin: "0px auto 5px auto"
    }

    const loadingStyling = `
        display: table;
        margin: 0px auto 5px auto;
    `;

    function getOutput() {
        if (props.categoryLoadingError) {
            return (
                <li>
                    <BsFillExclamationCircleFill style={errorStyling} color={constants.errorMessageColour} />
                </li>
            );
        }

        else if (props.categoriesLoading) {
            return (
                <li>
                    <ClipLoader
                        color={constants.loaderColour}
                        loading={true}
                        size={20}
                        css={loadingStyling}
                    />
                </li>
            );
        }

        return (
            <>
                {/* This is the first category in the dropdown, which is always the home category.*/}
                <li><Link to="/">Home</Link></li>
                <hr />

                {/* These are the rest of the categories.*/}
                {props.categories.map(category => <Category key={category.id} category={category} 
                filterCategoriesText={props.filterCategoriesText} />)}
                <hr />
            </>
        );
    }

    return (
        getOutput()
    );
}

Categories.propTypes = {
    categories: PropTypes.array,
    filterCategoriesText: PropTypes.string,
    categoryLoadingError: PropTypes.instanceOf(Error),
    categoriesLoading: PropTypes.bool
}

export default Categories

import { Link } from "react-router-dom";
import Category from "./Category";
import propTypes from "prop-types";

const Categories = (props) => {

    return (
        <>
            {/* This is the first category in the dropdown, which is always the home category.*/}
            <li><Link to="/">Home</Link></li>
            <hr />

            {/* These are the rest of the categories.*/}
            {props.categories.map(category => <Category key={category.id} category={category} />)}
        </>
    );
}

Categories.propTypes = {
    categories: propTypes.array
}

export default Categories

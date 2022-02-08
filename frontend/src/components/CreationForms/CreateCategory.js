import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import "../../style/create-category.css";
import { v4 as uuid_v4 } from "uuid";
import PropTypes from "prop-types";
import { getNewAccessTokenIfExpired } from "../../utils/auth";

const CreateCategory = (props) => {

    const [categoryName, setCategoryName] = useState("");

    const { loggedIn } = useContext(UserContext);

    let navigate = useNavigate();

    function determineOutput() {
        if (loggedIn) {
        return (
            <div id="create-category-flex-container">
                <form onSubmit={handleCategorySubmission}>
                    <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                    <input type="submit" value="Create Category" />
                </form>
            </div>
        );
        }
        return (
            <div className="not-logged-in-message-flex-container">
                <div className="not-logged-in-message">
                    <span>Log in or signup to create a category &nbsp;</span>
                    <Link to="/login/">Login</Link>
                    &nbsp;
                    <Link to="/signup/">Signup</Link>
                </div>
            </div>
        );
    }

    function handleCategorySubmission(e) {
        e.preventDefault();
        if ((categoryName.length) > 20) {
            alert ("Category name must be less than or equal to 20 characters!");
            return;
        }

        createCategory();
    }

    async function createCategory() {
        const categoryId = uuid_v4();
        const data = {
            id: categoryId,
            name: categoryName
        }

        const accessToken = localStorage.getItem("accessToken");
        const gotNewAccessToken = await getNewAccessTokenIfExpired(accessToken);
        if (gotNewAccessToken) {
            
            const response = await fetch("http://localhost:8000/api/categories/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                props.addCategory(data);
                navigate(`/posts/category=${categoryName}/`, {state: {categoryId: categoryId}});
            } else {
                throw new Error("couldn't create category:(");
            }
        }
        else {
            throw new Error("Couldn't get new access token");
        }
    }

    return (
        determineOutput()
    );
}

CreateCategory.propTypes = {
    addCategory: PropTypes.func
}

export default CreateCategory;

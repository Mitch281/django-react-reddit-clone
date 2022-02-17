import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../App";
import "../../../style/create-category.css";
import { v4 as uuid_v4 } from "uuid";
import PropTypes from "prop-types";
import { CantGetNewAccessTokenError, getNewAccessTokenIfExpired } from "../../../utils/auth";

const CreateCategory = (props) => {

    const [categoryName, setCategoryName] = useState("");

    const { loggedIn, logout } = useContext(UserContext);

    let navigate = useNavigate();

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login/");
        }
    }, []);

    async function createCategory() {
        const categoryId = uuid_v4();
        const data = {
            id: categoryId,
            name: categoryName
        }

        const accessToken = localStorage.getItem("accessToken");
        try {
            await getNewAccessTokenIfExpired(accessToken);
        } catch(error) {
            throw error;
        }
            
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
            throw new Error(response.status);
        }
    }

    function performCreateCategory(e) {
        e.preventDefault();
        if (categoryName.length > 20) {
            alert("Category name must be less than or equal to 20 characters!");
            return;
        }

        createCategory()
        .catch(error => {

            // Session expired.
            if (error instanceof CantGetNewAccessTokenError) {
                logout();
                navigate("/login/");
            }
        });
    }

    return (
        <div id="create-category-flex-container">
            <form onSubmit={performCreateCategory}>
                <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                <input type="submit" value="Create Category" />
            </form>
        </div>
    );
}

CreateCategory.propTypes = {
    addCategory: PropTypes.func
}

export default CreateCategory;

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../App";
import { v4 as uuid_v4 } from "uuid";
import PropTypes from "prop-types";
import {
    CantGetNewAccessTokenError,
    getNewAccessTokenIfExpired,
} from "../../../utils/auth";
import styles from "./create-category.module.css";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";

const CreateCategory = (props) => {
    const [categoryName, setCategoryName] = useState("");

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const { loggedIn, logout } = useContext(UserContext);

    let navigate = useNavigate();

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login/");
        }
    }, []);

    async function createCategory() {
        setLoading(true);
        const categoryId = uuid_v4();
        const data = {
            id: categoryId,
            name: categoryName,
        };

        const accessToken = localStorage.getItem("accessToken");
        try {
            await getNewAccessTokenIfExpired(accessToken);
        } catch (error) {
            throw error;
        }

        const response = await fetch("http://localhost:8000/api/categories/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            props.addCategory(data);
            navigate(`/posts/category=${categoryName}/`, {
                state: { categoryId: categoryId },
            });
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
            .catch((error) => setError(error));
    }

    useEffect(() => {
        setLoading(false);
    }, [error]);

    function getErrorMessage() {
        if (!error) {
            return;
        }

        // Session expired. This happens when the refresh token expires.
        if (error instanceof CantGetNewAccessTokenError) {
            logout();
            navigate("/login/");
        } else if (error.message === "400") {
            return (
                <ErrorMessage errorMessage="This category has already been created." />
            );
        }

        return (
            <ErrorMessage errorMessage="Could not create category. Please try again later." />
        );
    }

    return (
        <div id={styles["create-category-flex-container"]}>
            <form onSubmit={performCreateCategory}>
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                {loading ? (
                    <ClipLoader
                        color={constants.loaderColour}
                        loading={true}
                        size={20}
                        css={"margin-top: 10px"}
                    />
                ) : (
                    <input type="submit" value="Create Category" />
                )}
                {getErrorMessage()}
            </form>
        </div>
    );
};

CreateCategory.propTypes = {
    addCategory: PropTypes.func,
};

export default CreateCategory;

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../App";
import { v4 as uuid_v4 } from "uuid";
import PropTypes from "prop-types";
import { CantGetNewAccessTokenError } from "../../../utils/auth";
import styles from "./create-category.module.css";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import { postCategory } from "../../../utils/fetch-data";

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
        // eslint-disable-next-line
    }, []);

    async function createCategory() {
        setLoading(true);
        const categoryId = uuid_v4();
        const data = {
            id: categoryId,
            name: categoryName,
        };

        try {
            await postCategory(data);
            props.addCategory(data);
            navigate(`/posts/category=${categoryName}/`, {
                state: { categoryId: categoryId },
            });
        } catch (error) {
            throw error;
        }
    }

    async function performCreateCategory(e) {
        e.preventDefault();

        try {
            await createCategory();
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    function getErrorMessage() {
        if (!error) {
            return;
        }

        // Session expired. This happens when the refresh token expires.
        if (error instanceof CantGetNewAccessTokenError) {
            logout();
            navigate("/login/");
        } else if (categoryName.length > 20) {
            return (
                <ErrorMessage errorMessage="Category names must be less than 20 characters!" />
            );
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

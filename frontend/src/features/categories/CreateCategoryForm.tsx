import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import { UserContext } from "../../app/App";
import { AppDispatch } from "../../app/store";
import useHandleTextInput from "../../hooks/useHandleTextInput";
import { CreateCategoryPayload } from "../../types/shared";
import { renderErrorOnRequest } from "../../utils/auth";
import { constants } from "../../utils/constants";
import { createCategory } from "./categoriesSlice";
import styles from "./styles/create-category.module.css";

const CreateCategoryForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const handleTextInput = useHandleTextInput();

    const [categoryName, setCategoryName] = useState("");
    const [createCategoryStatus, setCreateCategoryStatus] = useState("idle");

    const { logout } = useContext(UserContext);

    let navigate = useNavigate();

    let numCategoryNameCharsLeft =
        constants.CATEGORY_NAME_CHAR_LIMIT - categoryName.length;

    async function handleCreateCategory(e: React.FormEvent) {
        e.preventDefault();
        setCreateCategoryStatus("pending");

        const categoryId = uuid_v4();

        const newCategory: CreateCategoryPayload = {
            id: categoryId,
            name: categoryName,
        };

        try {
            await dispatch(createCategory(newCategory)).unwrap();
            const successMessage = `Succesfully created the category ${categoryName}!`;
            navigate(`/posts/category=${categoryName}/`, {
                state: {
                    categoryId: categoryId,
                    successMessage: successMessage,
                },
            });
        } catch (error) {
            renderErrorOnRequest(error as Error, logout, navigate);
        } finally {
            setCreateCategoryStatus("idle");
        }
    }

    let submitButton;
    if (createCategoryStatus === "pending") {
        submitButton = (
            <ClipLoader
                color={constants.loaderColour}
                loading={true}
                size={20}
            />
        );
    } else {
        const disabled = numCategoryNameCharsLeft < 0;
        submitButton = (
            <input type="submit" value="Create Category" disabled={disabled} />
        );
    }

    const content = (
        <div id={styles["create-category-flex-container"]}>
            <form onSubmit={handleCreateCategory}>
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) =>
                        handleTextInput(
                            e,
                            setCategoryName,
                            numCategoryNameCharsLeft
                        )
                    }
                />
                <span className={styles["char-count"]}>
                    {numCategoryNameCharsLeft} characters left
                </span>
                {submitButton}
            </form>
        </div>
    );

    return <>{content}</>;
};

export default CreateCategoryForm;

import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import { UserContext } from "../../app/App";
import { constants } from "../../common/utils/constants";
import { createCategory } from "./categoriesSlice";
import styles from "./styles/create-category.module.css";

const CreateCategoryForm = () => {
    const dispatch = useDispatch();

    const [categoryName, setCategoryName] = useState("");
    const [createCategoryStatus, setCreateCategoryStatus] = useState("idle");

    const { loggedIn } = useContext(UserContext);

    let navigate = useNavigate();

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login/");
        }
    }, []);

    async function handleCreateCategory(e) {
        e.preventDefault();
        setCreateCategoryStatus("pending");

        const categoryId = uuid_v4();

        const newCategory = {
            id: categoryId,
            name: categoryName
        }

        try {
            await dispatch(createCategory(newCategory)).unwrap();
            // TODO: add state here to let user know category was succesfully created.
            navigate(`/posts/category=${categoryName}/`, {
                state: { categoryId: categoryId },
            });
        } catch (error) {
            toast.error("Could not create category!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
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
                css={"margin-top: 10px"}
            />
        );
    } else {
        submitButton = <input type="submit" value="Create Category" />;
    }

    const content = (
        <div id={styles["create-category-flex-container"]}>
            <form onSubmit={handleCreateCategory}>
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                {submitButton}
            </form>
        </div>
    );

    return (
        <>
            {content}
            <ToastContainer />
        </>
    );
};

export default CreateCategoryForm;

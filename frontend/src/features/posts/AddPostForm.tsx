import { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import { UserContext } from "../../app/App";
import useHandleTextInput from "../../hooks/useHandleTextInput";
import { AddPostBody, Category } from "../../types/shared";
import { renderErrorOnRequest } from "../../utils/auth";
import { constants } from "../../utils/constants";
import { selectAllCategories } from "../categories/categoriesSlice";
import { addNewPost } from "./postsSlice";
import styles from "./styles/add-post-form.module.css";

const AddPostForm = () => {
    let navigate = useNavigate();
    const handleTextInput = useHandleTextInput();
    const { usernameLoggedIn, userIdLoggedIn, logout } =
        useContext(UserContext);

    const dispatch = useDispatch();
    const categories: Category[] = useSelector(
        selectAllCategories
    ) as Category[];

    const [title, setTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const categoryDropdown = useRef<HTMLSelectElement>(null);
    const [addPostStatus, setAddPostStatus] = useState("idle");

    let numTitleCharsLeft = constants.POST_TITLE_CHAR_LIMIT - title.length;
    let numContentCharsLeft =
        constants.POST_CONTENT_CHAR_LIMIT - postContent.length;

    async function handleAddPost(e: React.FormEvent) {
        e.preventDefault();
        setAddPostStatus("pending");

        if (!categoryDropdown.current) {
            return;
        }

        const categoryName = categoryDropdown.current.value.split(",")[1];
        const categoryId = categoryDropdown.current.value.split(",")[0];

        const newPost: AddPostBody = {
            id: uuid_v4(),
            username: usernameLoggedIn,
            category_name: categoryName,
            title: title,
            content: postContent,
            date_created: new Date().toString(),
            user: parseInt(userIdLoggedIn),
            category: categoryId,
        };

        try {
            await dispatch(addNewPost(newPost)).unwrap();
            const successMessage = "Succesfully added post!";
            toast.success(successMessage, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate("/");
        } catch (error) {
            renderErrorOnRequest(error as Error, logout, navigate);
        } finally {
            setAddPostStatus("idle");
        }
    }

    const loader = (
        <ClipLoader
            id={styles["loader"]}
            color={constants.loaderColour}
            loading={true}
            size={20}
            css={"float: right;"}
        />
    );

    let submitButton;
    if (addPostStatus === "pending") {
        submitButton = loader;
    } else {
        const disabled = numTitleCharsLeft < 0 || numContentCharsLeft < 0;
        submitButton = (
            <input type="submit" value="Add Post" disabled={disabled} />
        );
    }

    const content = (
        <div id={styles["create-post-flex-container"]}>
            <form onSubmit={handleAddPost}>
                <input
                    type="text"
                    id={styles["post-title"]}
                    value={title}
                    onChange={(e) =>
                        handleTextInput(e, setTitle, numTitleCharsLeft)
                    }
                    placeholder="Title"
                />
                <span className={styles["char-count"]}>
                    {numTitleCharsLeft} characters left
                </span>
                <textarea
                    id={styles["post-content"]}
                    value={postContent}
                    onChange={(e) =>
                        handleTextInput(e, setPostContent, numContentCharsLeft)
                    }
                    placeholder="Content"
                />
                <span className={styles["char-count"]}>
                    {numContentCharsLeft} characters left
                </span>
                <select
                    id={styles["select-post-category"]}
                    ref={categoryDropdown}
                >
                    {categories.map((category) => (
                        <option
                            key={category.id}
                            value={`${category.id},${category.name}`}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
                {submitButton}
            </form>
        </div>
    );

    return <>{content}</>;
};

export default AddPostForm;

import { useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import { UserContext } from "../../app/App";
import { renderErrorOnRequest } from "../../utils/auth";
import { constants } from "../../utils/constants";
import { selectAllCategories } from "../categories/categoriesSlice";
import { addNewPost } from "./postsSlice";
import styles from "./styles/add-post-form.module.css";

const AddPostForm = () => {
    let navigate = useNavigate();
    const { usernameLoggedIn, userIdLoggedIn, logout } =
        useContext(UserContext);

    const dispatch = useDispatch();
    const categories = useSelector(selectAllCategories);

    const [title, setTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const category = useRef(null);
    const [addPostStatus, setAddPostStatus] = useState("idle");

    let numTitleCharsLeft = constants.POST_TITLE_CHAR_LIMIT - title.length;
    let numContentCharsLeft =
        constants.POST_CONTENT_CHAR_LIMIT - postContent.length;

    async function handleAddPost(e) {
        e.preventDefault();
        setAddPostStatus("pending");

        const categoryName = category.current.value.split(",")[1];
        const categoryId = category.current.value.split(",")[0];

        const newPost = {
            id: uuid_v4(),
            username: usernameLoggedIn,
            category_name: categoryName,
            title: title,
            content: postContent,
            date_created: new Date().toString(),
            user: userIdLoggedIn,
            category: categoryId,
        };

        try {
            await dispatch(addNewPost(newPost)).unwrap();
            const successMessage = "Succesfully added post!";
            navigate("/", { state: { successMessage: successMessage } });
        } catch (error) {
            renderErrorOnRequest(error, logout, navigate);
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
        submitButton = <input type="submit" value="Add Post" />;
    }

    const content = (
        <div id={styles["create-post-flex-container"]}>
            <form onSubmit={handleAddPost}>
                <input
                    type="text"
                    id={styles["post-title"]}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <span className={styles["char-count"]}>
                    {numTitleCharsLeft} characters left
                </span>
                <textarea
                    id={styles["post-content"]}
                    type="text"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Content"
                />
                <span className={styles["char-count"]}>
                    {numContentCharsLeft} characters left
                </span>
                <select id={styles["select-post-category"]} ref={category}>
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

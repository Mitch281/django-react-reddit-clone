import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { v4 as uuid_v4 } from "uuid";
import { CantGetNewAccessTokenError } from "../../../utils/auth";
import styles from "./create-post.module.css";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import { postPost } from "../../../utils/fetch-data";

const CreatePost = (props) => {
    let navigate = useNavigate();

    const { loggedIn, usernameLoggedIn, userIdLoggedIn, logout } =
        useContext(UserContext);

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login/");
        }
        // eslint-disable-next-line
    }, []);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const category = useRef(null);

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    async function handleAddPost() {
        setLoading(true);

        const postId = uuid_v4();
        const categoryId = category.current.value.split(",")[0];
        const categoryName = category.current.value.split(",")[1];
        const dateNow = new Date().toString();

        const data = {
            id: postId,
            username: usernameLoggedIn,
            category_name: categoryName,
            title: title,
            content: content,
            num_upvotes: 0,
            num_downvotes: 0,
            date_created: dateNow,
            user: userIdLoggedIn,
            category: categoryId,
        };

        try {
            await postPost(data);
            props.addPost(data);
            navigate("/");
        } catch (error) {
            throw error;
        }
    }

    async function performAddPost(e) {
        e.preventDefault();

        try {
            await handleAddPost();
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

        // Session expired (this happens when the refresh tokene expires).
        if (error instanceof CantGetNewAccessTokenError) {
            logout();
            navigate("/login/");
        } else if (title.length > 100) {
            return <ErrorMessage errorMessage="Title must be less than 100 characters." />
        } else if (content.length > 1000) {
            return <ErrorMessage errorMessage="Content length must be less than 1000 characters." />
        }

        return (
            <ErrorMessage errorMessage="Could not create post. Please try again later." />
        );
    }

    return (
        <div id={styles["create-post-flex-container"]}>
            <form onSubmit={performAddPost}>
                <input
                    type="text"
                    id={styles["post-title"]}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <textarea
                    id={styles["post-content"]}
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                />
                <select id={styles["select-post-category"]} ref={category}>
                    {props.categories.map((category) => (
                        <option
                            key={category.id}
                            value={`${category.id},${category.name}`}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>
                {loading ? (
                    <ClipLoader
                        color={constants.loaderColour}
                        loading={true}
                        size={20}
                        css={"margin-top: 10px"}
                    />
                ) : (
                    <input type="submit" value="Add Post" />
                )}
                {getErrorMessage()}
            </form>
        </div>
    );
};

CreatePost.propTypes = {
    categories: PropTypes.array,
    addPost: PropTypes.func,
};

export default CreatePost;

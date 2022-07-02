import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../app/App";
import { constants } from "../../common/utils/constants";
import { editPost, selectPostById } from "./postsSlice";
import styles from "./styles/post-content.module.css";

const PostContent = ({ postId, currentlyEditing, toggleCurrentlyEditing }) => {
    const dispatch = useDispatch();
    const post = useSelector((state) => selectPostById(state, postId));
    const [editPostStatus, setEditPostStatus] = useState("idle");
    const [postContent, setPostContent] = useState(post.content);

    const { userIdLoggedIn } = useContext(UserContext);

    async function handleEditPost(e) {
        e.preventDefault();
        setEditPostStatus("pending");

        const data = {
            postId: postId,
            userId: userIdLoggedIn,
            newPostContent: postContent,
        };
        try {
            await dispatch(editPost(data)).unwrap();
            toggleCurrentlyEditing();
        } catch (error) {
            toast.error(error.message, {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setEditPostStatus("idle");
        }
    }

    useEffect(() => {
        if (editPostStatus === "fulfilled") {
            toast.success("Succesfully edited post!", {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [editPostStatus]);

    let submitButton;
    if (editPostStatus === "pending") {
        submitButton = (
            <ClipLoader
                color={constants.loaderColour}
                loading={true}
                size={20}
                css={"margin-top: 10px"}
            />
        );
    } else {
        submitButton = <input type="submit" value="Edit" />;
    }

    let content;
    if (currentlyEditing) {
        content = (
            <form
                className={styles["edit-post-content-form"]}
                onSubmit={handleEditPost}
            >
                <div>
                    <span>Edit Post</span>
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                    {submitButton}
                </div>
            </form>
        );
    } else {
        content = <p className={styles["post-content"]}>{post.content}</p>;
    }

    return (
        <>
            {content}
        </>
    );
};

export default PostContent;

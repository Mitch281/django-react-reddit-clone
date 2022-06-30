import { editPost, selectPostById } from "./postsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import styles from "./styles/post-content.module.css";
import { UserContext } from "../../app/App";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../common/utils/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostContent = ({ postId, currentlyEditing }) => {
    const dispatch = useDispatch();
    const post = useSelector((state) => selectPostById(state, postId));
    const editPostStatus = useSelector((state) => state.posts.editPostStatus);
    const [postContent, setPostContent] = useState(post.content);

    const { userIdLoggedIn } = useContext(UserContext);

    function handleEditPost(e) {
        e.preventDefault();
        const data = {
            postId: postId,
            userId: userIdLoggedIn,
            newPostContent: postContent,
        };
        dispatch(editPost(data));
    }

    useEffect(() => {
        if (editPostStatus === "fulfilled") {
            toast.success("Succesfully edited post!", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [editPostStatus]);

    const loader = (
        <ClipLoader
            color={constants.loaderColour}
            loading={true}
            size={20}
            css={"margin-top: 10px"}
        />
    );

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
                    {editPostStatus === "pending" ? (
                        loader
                    ) : (
                        <input type="submit" value="Edit" />
                    )}
                </div>
            </form>
        );
    } else {
        content = <p className={styles["post-content"]}>{post.content}</p>;
    }

    if (editPostStatus === "rejected") {
        toast.error("Could not edit post!", {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    return (
        <>
            {content}
            <ToastContainer />
        </>
    );
};

export default PostContent;

import { useContext, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../App";
import { constants } from "../../constants";
import { deletePost } from "./postsSlice";
import styles from "./styles/delete-post.module.css";

const DeletePost = ({ postId }) => {
    const dispatch = useDispatch();
    const { userIdLoggedIn } = useContext(UserContext);
    const [deletePostStatus, setDeletePostStatus] = useState("idle");

    const loader = (
        <ClipLoader
            id={styles["loader"]}
            color={constants.loaderColour}
            loading={true}
            size={20}
            css={"float: right;"}
        />
    );

    async function handleDeletePost() {
        const wantDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );
        if (!wantDelete) {
            return;
        }

        try {
            setDeletePostStatus("pending");
            await dispatch(
                deletePost({ postId: postId, userId: userIdLoggedIn })
            ).unwrap();
            toast.success("Successfully deleted post!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } catch (error) {
            toast.error(error.message, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setDeletePostStatus("idle");
        }
    }

    let content;
    if (deletePostStatus === "pending") {
        content = loader;
    } else {
        content = (
            <>
                <BsFillTrashFill
                    className={styles["delete-post-button"]}
                    onClick={handleDeletePost}
                />
                <ToastContainer />
            </>
        );
    }

    return content;
};

export default DeletePost;

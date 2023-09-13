import { useContext, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeletePostPayload } from "../../../types";
import { UserContext } from "../../app/App";
import { renderErrorOnRequest } from "../../utils/auth";
import { constants } from "../../utils/constants";
import { deletePost } from "./postsSlice";
import styles from "./styles/delete-post.module.css";

type Props = {
    postId: string;
};

const DeletePost = ({ postId }: Props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userIdLoggedIn, logout } = useContext(UserContext);
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
            const deletePostPayload: DeletePostPayload = {
                postId: postId,
                userId: userIdLoggedIn,
            };
            dispatch(deletePost(deletePostPayload)).unwrap();
            toast.success("Successfully deleted post!", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            renderErrorOnRequest(error, logout, navigate);
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
            </>
        );
    }

    return content;
};

export default DeletePost;

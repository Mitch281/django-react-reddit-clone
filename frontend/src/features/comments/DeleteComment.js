import { useContext, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from "../../app/App";
import { constants } from "../../common/utils/constants";
import { deleteComment } from "./commentsSlice";
import styles from "./styles/delete-comment.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteComment = ({ commentId }) => {
    const dispatch = useDispatch();

    const [deleteCommentStatus, setDeleteCommentStatus] = useState("idle");

    const { userIdLoggedIn } = useContext(UserContext);

    async function handleDeleteComment() {
        const wantDelete = window.confirm("Are you sure you want to delete this comment?");

        if (!wantDelete) {
            return;
        }

        try {
            setDeleteCommentStatus("pending");
            await dispatch(deleteComment({
                commentId: commentId,
                userId: userIdLoggedIn
            }));
            toast.success("Succesfully deleted comment!", {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
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
            setDeleteCommentStatus("idle");
        }
    }

    let deleteButton;

    if (deleteCommentStatus === "pending") {
        deleteButton = (
            <ClipLoader
                id={styles["loader"]}
                color={constants.loaderColour}
                loading={true}
                size={20}
                css={"float: right;"}
            />
        );
    } else {
        deleteButton = (
            <BsFillTrashFill
                className={styles["delete-comment"]}
                onClick={handleDeleteComment}
            />
        );
    }

    return (
        <>
            {deleteButton}
            <ToastContainer />
        </>
    );
};

export default DeleteComment;

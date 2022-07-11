import { useContext, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../app/App";
import { handleErrorOnRequest } from "../../utils/auth";
import { constants } from "../../utils/constants";
import { deleteComment } from "./commentsSlice";
import styles from "./styles/delete-comment.module.css";

const DeleteComment = ({ commentId }) => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [deleteCommentStatus, setDeleteCommentStatus] = useState("idle");

    const { userIdLoggedIn, logout } = useContext(UserContext);

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
            handleErrorOnRequest(error, logout, navigate);
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
        </>
    );
};

export default DeleteComment;

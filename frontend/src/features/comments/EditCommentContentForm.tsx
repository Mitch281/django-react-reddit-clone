import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { EditCommentPayload } from "../../../types";
import { UserContext } from "../../app/App";
import { renderErrorOnRequest } from "../../utils/auth";
import { constants } from "../../utils/constants";
import { editComment, selectCommentById } from "./commentsSlice";
import styles from "./styles/comment-content.module.css";

const EditCommentContentForm = ({ commentId, toggleEditForm }) => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const comment = useSelector((state) => selectCommentById(state, commentId));

    const [commentContent, setCommentContent] = useState(comment.content);
    const [editCommentStatus, setEditCommentStatus] = useState("idle");

    const { userIdLoggedIn, logout } = useContext(UserContext);

    let numCommentContentCharsLeft =
        constants.COMMENT_CONTENT_CHAR_LIMIT - commentContent.length;

    async function handleEditCommentContent(e) {
        e.preventDefault();
        const editCommentInformation: EditCommentPayload = {
            userId: userIdLoggedIn,
            newCommentContent: commentContent,
            commentId: commentId,
        };

        setEditCommentStatus("pending");

        try {
            await dispatch(editComment(editCommentInformation)).unwrap();
            toggleEditForm();
            toast.success("Succesfully edited comment!", {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            renderErrorOnRequest(error, logout, navigate);
        } finally {
            setEditCommentStatus("idle");
        }
    }

    let submitButton;
    if (editCommentStatus === "idle") {
        const disabled = numCommentContentCharsLeft < 0;
        submitButton = <input type="submit" value="Edit" disabled={disabled} />;
    } else {
        submitButton = (
            <ClipLoader
                color={constants.loaderColour}
                loading={true}
                size={20}
                css={"margin-top: 10px"}
            />
        );
    }

    return (
        <form
            className={styles["edit-comment-content-form"]}
            onSubmit={handleEditCommentContent}
        >
            <div>
                <span>Edit Comment</span>
                <textarea
                    value={commentContent}
                    placeholder="Content"
                    onChange={(e) => setCommentContent(e.target.value)}
                />
                <span className={styles["char-count"]}>
                    {numCommentContentCharsLeft} characters left
                </span>
                {submitButton}
            </div>
        </form>
    );
};

export default EditCommentContentForm;

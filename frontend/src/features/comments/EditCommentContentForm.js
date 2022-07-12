import styles from "./styles/comment-content.module.css";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editComment, selectCommentById } from "./commentsSlice";
import { UserContext } from "../../app/App";
import { handleErrorOnRequest } from "../../utils/auth";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../utils/constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditCommentContentForm = ({ commentId, toggleEditForm }) => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const comment = useSelector((state) => selectCommentById(state, commentId));

    const [commentContent, setCommentContent] = useState(comment.content);
    const [editCommentStatus, setEditCommentStatus] = useState("idle");

    const { userIdLoggedIn, logout } = useContext(UserContext);

    async function handleEditCommentContent(e) {
        e.preventDefault();
        const editCommentInformation = {
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
            })
        } catch (error) {
            handleErrorOnRequest(error, logout, navigate);
        } finally {
            setEditCommentStatus("idle");
        }
    }

    let submitButton;
    if (editCommentStatus === "idle") {
        submitButton = <input type="submit" value="Edit" />;
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
                {submitButton}
            </div>
        </form>
    );
};

export default EditCommentContentForm;

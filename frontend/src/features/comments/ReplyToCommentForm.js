import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import { UserContext } from "../../app/App";
import { renderErrorOnRequest } from "../../utils/auth";
import { constants } from "../../utils/constants";
import {
    incrementNumReplies,
    makeCommentOnPost,
    selectCommentById,
} from "./commentsSlice";
import styles from "./styles/reply-to-comment-form.module.css";

const ReplyToCommentForm = ({ commentId, toggleReplyForm }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const commentToReplyTo = useSelector((state) =>
        selectCommentById(state, commentId)
    );
    const parentUsername = commentToReplyTo.username;

    const [replyContent, setReplyContent] = useState("");
    const [editCommentStatus, setEditCommentStatus] = useState("idle");

    const { usernameLoggedIn, userIdLoggedIn, logout } =
        useContext(UserContext);

    let numReplyContentCharsLeft = constants.COMMENT_CONTENT_CHAR_LIMIT - replyContent.length;

    async function handleReplyComment(e) {
        e.preventDefault();

        const reply = {
            id: uuid_v4(),
            username: usernameLoggedIn,
            user: userIdLoggedIn,
            parent_post: commentToReplyTo.parent_post,
            content: replyContent,
            date_created: new Date().toString(),
            parent_comment: commentId,
            hidden: false,
            num_replies: 0,
        };

        try {
            await dispatch(makeCommentOnPost(reply)).unwrap();
            dispatch(
                incrementNumReplies(commentId, commentToReplyTo.num_replies)
            );
            setReplyContent("");
            setEditCommentStatus("fulfilled");
            toggleReplyForm();
            toast.success("Comment successful!", {
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

    let content;

    let submitButton;
    if (editCommentStatus === "pending") {
        submitButton = (
            <ClipLoader
                color={constants.loaderColour}
                loading={true}
                size={20}
                css={"margin-top: 10px"}
            />
        );
    } else {
        submitButton = <input type="submit" value="Reply" />;
    }

    content = (
        <div>
            <form
                className={styles["reply-to-comment-form"]}
                onSubmit={handleReplyComment}
            >
                <div>
                    <span>
                        Reply to {parentUsername} as {usernameLoggedIn}
                    </span>
                    <textarea
                        type="text"
                        placeholder="Content"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <span className={styles["char-count"]}>{numReplyContentCharsLeft} characters left</span>
                    {submitButton}
                </div>
            </form>
        </div>
    );

    return content;
};

export default ReplyToCommentForm;

import { selectCommentById } from "./commentsSlice";
import styles from "./styles/comment.module.css";
import { useSelector, useDispatch } from "react-redux";
import CommentVotes from "./CommentVotes";
import CommentContent from "./CommentContent";
import DateOfComment from "../../common/comments/DateOfComment";
import Author from "../../common/comments/Author";
import ToggleHidden from "./ToggleHidden";
import { useContext, useState } from "react";
import ReplyToCommentForm from "./ReplyToCommentForm";
import { UserContext } from "../../app/App";
import DeleteComment from "./DeleteComment";

const Comment = ({ commentId, replies, isRootComment }) => {
    const comment = useSelector((state) => selectCommentById(state, commentId));
    const [isCurrentlyEditing, setIsCurrentlyEditing] = useState(false);

    const { loggedIn, userIdLoggedIn } = useContext(UserContext);

    function toggleReplyForm() {
        setIsCurrentlyEditing(!isCurrentlyEditing);
    }

    function renderReplies() {
        if (comment.num_replies > 0 && !comment.is_hidden) {
            return (
                <div className={styles["replies"]}>
                    {replies.map((comment) => (
                        <Comment
                            key={comment.id}
                            commentId={comment.id}
                            replies={comment.replies}
                            isRootComment={false}
                            isHidden={comment.is_hidden}
                        />
                    ))}
                </div>
            );
        }
    }

    let deleteCommentButton =
        userIdLoggedIn === comment.user ? (
            <DeleteComment commentId={commentId} />
        ) : null;

    let content;
    if (comment.deleted) {
        content = (
            <div
                className={
                    isRootComment
                        ? `${styles["comment-container"]} ${styles["root"]}`
                        : `${styles["comment-container"]}`
                }
            >
                <span>Deleted</span>
            </div>
        );
    } else {
        content = (
            <div className={styles["comment"]}>
                <CommentVotes commentId={commentId} />
                <Author username={comment.username} />
                <DateOfComment dateCreated={comment.date_created} />
                <CommentContent commentId={commentId} />
                {loggedIn ? (
                    <button
                        type="button"
                        className={styles["reply-to-comment-button"]}
                        onClick={toggleReplyForm}
                    >
                        Reply
                    </button>
                ) : null}
                {isCurrentlyEditing ? (
                    <ReplyToCommentForm
                        commentId={commentId}
                        toggleReplyForm={toggleReplyForm}
                    />
                ) : null}
                {deleteCommentButton}
            </div>
        );
    }

    return (
        <div
            className={
                isRootComment
                    ? `${styles["comment-container"]} ${styles["root"]}`
                    : `${styles["comment-container"]}`
            }
        >
            <div className={styles["comment"]}>{content}</div>
            <ToggleHidden commentId={commentId} />
            {renderReplies()}
        </div>
    );
};

export default Comment;

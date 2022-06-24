import { selectCommentById } from "./commentsSlice";
import styles from "./styles/comment.module.css";
import { useSelector } from "react-redux";
import CommentVotes from "./CommentVotes";
import CommentContent from "./CommentContent";
import DateOfComment from "../../components/Comments/DateOfComment/DateOfComment";
import Author from "../../components/Comments/User/Author";

const Comment = ({ commentId, replies, isRootComment }) => {
    const comment = useSelector((state) => selectCommentById(state, commentId));

    function renderReplies() {
        if (replies && !comment.hidden) {
            return (
                <div className={styles["replies"]}>
                    {replies.map((comment) => (
                        <Comment
                            key={comment.id}
                            commentId={comment.id}
                            replies={comment.replies}
                        />
                    ))}
                </div>
            );
        }
    }

    function toggleReplies() {
        if (comment.num_replies === 0) {
            return;
        }

        if (comment.hidden) {
            return (
                <button type="button" className={styles["hide-replies-button"]}>
                    Show {comment.num_replies} Replies
                </button>
            );
        }

        return (
            <button type="button" className={styles["hide-replies-button"]}>
                Hide {comment.num_replies} Replies
            </button>
        );
    }

    let content;
    if (comment.deleted) {
        content = (
            <>
                <div
                    className={
                        isRootComment
                            ? `${styles["comment-container"]} ${styles["root"]}`
                            : `${styles["comment-container"]}`
                    }
                >
                    <div className={styles["comment"]}>
                        <span>Deleted</span>
                    </div>
                    {toggleReplies()}
                    {renderReplies()}
                </div>
            </>
        );
    } else {
        content = (
            <div className={styles["comment"]}>
                <CommentVotes commentId={commentId} />
                <Author username={comment.username} />
                <DateOfComment dateCreated={comment.date_created} />
                <CommentContent commentId={commentId} />
                <button
                    type="button"
                    className={styles["reply-to-comment-button"]}
                >
                    Reply
                </button>
            </div>
        );

        return (
            <div
                className={
                    isRootComment
                        ? `${styles["comment-container"]} ${styles["root"]}`
                        : `${styles["comment-container"]}`
                }
            >
                <div className={styles["comment"]}>{content}</div>
                {toggleReplies()}
                {renderReplies()}
            </div>
        );
    }
};

export default Comment;

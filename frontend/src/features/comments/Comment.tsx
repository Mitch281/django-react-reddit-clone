import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { UserContext } from "../../app/App";
import type { FrontendModifiedComment } from "../../types/frontend";
import { Comment as CommentType } from "../../types/shared";
import Author from "./Author";
import CommentContent from "./CommentContent";
import CommentVotes from "./CommentVotes";
import DateOfComment from "./DateOfComment";
import DeleteComment from "./DeleteComment";
import ReplyToCommentForm from "./ReplyToCommentForm";
import ToggleHidden from "./ToggleHidden";
import { selectCommentById } from "./commentsSlice";
import styles from "./styles/comment.module.css";

type Props = {
    commentId: string;
    replies?: FrontendModifiedComment[];
    isRootComment: boolean;
};

const Comment = ({ commentId, replies, isRootComment }: Props) => {
    const comment = useSelector((state) =>
        selectCommentById(state, commentId)
    ) as CommentType;

    const [isCurrentlyReplying, setIsCurrentlyReplying] = useState(false);
    const [isCurrentlyEditing, setIsCurrentlyEditing] = useState(false);

    const { loggedIn, userIdLoggedIn } = useContext(UserContext);

    // TODO: When user loads comments of a certain post, then a different post an error will show saying "cannot read properties of undefined."
    // Not sure why this is happening since I only render comments once it succesfully is fetched from api?? This statement here prevents this,
    // but still want to gain understanding.
    if (!comment) {
        return null;
    }

    function toggleReplyForm() {
        setIsCurrentlyReplying(!isCurrentlyReplying);
    }

    function toggleEditForm() {
        setIsCurrentlyEditing(!isCurrentlyEditing);
    }

    // TODO: Maybe change name of is_hidden since we really want to see if replies are hidden. Maybe use is_replies_hidden instaed.
    function renderReplies() {
        if (comment.num_replies > 0 && !comment.is_hidden) {
            return (
                <div className={styles["replies"]}>
                    {replies?.map((comment) => (
                        <Comment
                            key={comment.id}
                            commentId={comment.id}
                            replies={comment.replies}
                            isRootComment={false}
                        />
                    ))}
                </div>
            );
        }
    }

    let deleteCommentButton =
        userIdLoggedIn === comment.user.toString() ? (
            <DeleteComment commentId={commentId} />
        ) : null;

    let replyButton = loggedIn ? (
        <button
            type="button"
            className={styles["reply-to-comment-button"]}
            onClick={toggleReplyForm}
        >
            Reply
        </button>
    ) : null;

    let editContentButton =
        userIdLoggedIn === comment.user.toString() ? (
            <button
                type="button"
                className={styles["toggle-edit-comment"]}
                onClick={toggleEditForm}
            >
                Edit
            </button>
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
                <CommentContent
                    commentId={commentId}
                    isCurrentlyEditing={isCurrentlyEditing}
                    toggleEditForm={toggleEditForm}
                />
                {replyButton}
                {isCurrentlyReplying ? (
                    <ReplyToCommentForm
                        commentId={commentId}
                        toggleReplyForm={toggleReplyForm}
                    />
                ) : null}
                {editContentButton}
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
            {/* <div className={styles["comment"]}>{content}</div> */}
            {content}
            <ToggleHidden commentId={commentId} />
            {renderReplies()}
        </div>
    );
};

export default Comment;

import { useState, useContext } from "react";
import { UserContext } from "../../../App";
import PropTypes from "prop-types";
import CommentContent from "../CommentContent/CommentContent";
import DateOfComment from "../DateOfComment/DateOfComment";
import User from "../User/User";
import ReplyToComment from "../ReplyToComment/ReplyToComment";
import CommentVotes from "../CommentVotes/CommentVotes";
import DeleteComment from "../DeleteComment/DeleteComment";
import styles from "./comment.module.css";

const Comment = (props) => {
    const { userIdLoggedIn } = useContext(UserContext);

    const votes = {
        numUpvotes: props.numUpvotes,
        numDownvotes: props.numDownvotes,
    };

    const [wantReplyForm, setWantReplyForm] = useState(false);
    const [currentlyEditing, setCurrentlyEditing] = useState(false);

    function renderReplies() {
        if (props.replies) {
            return props.replies.map((comment) => (
                <Comment
                    key={comment.id}
                    id={comment.id}
                    userId={comment.user}
                    username={comment.username}
                    content={comment.content}
                    numUpvotes={comment.num_upvotes}
                    numDownvotes={comment.num_downvotes}
                    dateCreated={comment.date_created}
                    replies={comment.replies}
                    nestingLevel={comment.nestingLevel}
                    deleted={comment.deleted}
                    updateComments={props.updateComments}
                    userCommentVotes={props.userCommentVotes}
                    upvote={props.upvote}
                    downvote={props.downvote}
                    trackUsersUpvotes={props.trackUsersUpvotes}
                    trackUsersDownvotes={props.trackUsersDownvotes}
                    editComment={props.editComment}
                    deleteComment={props.deleteComment}
                />
            ));
        }
    }

    function getMarginLeft() {
        const marginLeft = `${props.nestingLevel * 50}px`;
        return { marginLeft: marginLeft };
    }

    function toggleReplyForm() {
        setWantReplyForm((wantReplyForm) => !wantReplyForm);
    }

    function toggleEditForm() {
        setCurrentlyEditing(currentlyEditing => !currentlyEditing);
    }

    function getOutput() {
        if (props.deleted) {
            return (
            <>
                <div className={styles["comment"]} style={getMarginLeft()}>
                    <span>Deleted</span>
                </div>
                {renderReplies()}
            </>
            );
        }
        return (
            <>
                <div className={styles["comment"]} style={getMarginLeft()}>
                    <CommentVotes
                        votes={votes}
                        userCommentVotes={props.userCommentVotes}
                        commentId={props.id}
                        upvote={props.upvote}
                        downvote={props.downvote}
                        trackUsersUpvotes={props.trackUsersUpvotes}
                        trackUsersDownvotes={props.trackUsersDownvotes}
                    />
                    <User username={props.username} />
                    <DateOfComment dateCreated={props.dateCreated} />
                    <CommentContent
                        content={props.content}
                        currentlyEditing={currentlyEditing}
                        commentId={props.id}
                        userId={props.userId}
                        editComment={props.editComment}
                        toggleEditForm={toggleEditForm}
                    />
                    <button
                        type="button"
                        onClick={toggleReplyForm}
                        className={styles["reply-to-comment-button"]}
                    >
                        Reply
                    </button>
                    <ReplyToComment
                        wantReplyForm={wantReplyForm}
                        parentUsername={props.username}
                        postId={props.postId}
                        updateComments={props.updateComments}
                        parentCommentId={props.id}
                        toggleReplyForm={toggleReplyForm}
                    />
                    {userIdLoggedIn === props.userId ? (
                        <DeleteComment
                            deleteComment={props.deleteComment}
                            commentId={props.id}
                            userId={props.userId}
                        />
                    ) : (
                        ""
                    )}
                    {userIdLoggedIn === props.userId ? (
                        <button
                            type="button"
                            className={styles["toggle-edit-comment"]}
                            onClick={() =>
                                setCurrentlyEditing(!currentlyEditing)
                            }
                        >
                            Edit
                        </button>
                    ) : (
                        ""
                    )}
                </div>
                {renderReplies()}
            </>
        );
    }

    return getOutput();
};

Comment.propTypes = {
    id: PropTypes.string,
    content: PropTypes.string,
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    numUpvotes: PropTypes.number,
    numDownvotes: PropTypes.number,
    dateCreated: PropTypes.string,
    replies: PropTypes.array,
    nestingLevel: PropTypes.number,
    deleted: PropTypes.bool,
    updateComments: PropTypes.func,
    userCommentVotes: PropTypes.array,
    upvote: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersUpvotes: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
    editComment: PropTypes.func,
    deleteComment: PropTypes.func,
};

export default Comment;

import { useState } from "react";
import PropTypes from "prop-types";
import CommentContent from "./CommentContent";
import DateOfComment from "./DateOfComment";
import User from "./User";
import ReplyToComment from "./ReplyToComment";
import CommentVotes from "./CommentVotes";

const Comment = (props) => {

    const votes = {numUpvotes: props.numUpvotes, numDownvotes: props.numDownvotes};
    const [wantReplyForm, setWantReplyForm] = useState(false);

    function renderReplies() {
        if (props.replies) {
            return (
                    props.replies.map((comment) => 
                    <Comment
                        key={comment.id}
                        id={comment.id}
                        username={comment.username}
                        content={comment.content}
                        numUpvotes={comment.num_upvotes}
                        numDownvotes={comment.num_downvotes}
                        dateCreated={comment.date_created}
                        replies={comment.replies}
                        nestingLevel={comment.nestingLevel}
                        updateComments={props.updateComments}
                        userCommentVotes={props.userCommentVotes}
                        upvote={props.upvote}
                        downvote={props.downvote}
                        trackUsersUpvotes={props.trackUsersUpvotes}
                        trackUsersDownvotes={props.trackUsersDownvotes}
                    />
                )
            );
        }
    }

    function getMarginLeft() {
        const marginLeft = `${props.nestingLevel * 50}px`;
        return {marginLeft:marginLeft};
    }

    function toggleReplyForm() {
        setWantReplyForm(wantReplyForm => !wantReplyForm);
    }

    return (
        <>
            <div className="comment" style={getMarginLeft()}>
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
                <CommentContent content={props.content} />
                <button type="button" onClick={toggleReplyForm} className="reply-to-comment-button">Reply</button>
                <ReplyToComment 
                    wantReplyForm={wantReplyForm} 
                    parentUsername={props.username}
                    postId={props.postId}
                    updateComments={props.updateComments}
                    parentCommentId={props.id}
                />
            </div>
            {renderReplies()}
        </>
    )
}

Comment.propTypes = {
    id: PropTypes.string,
    content: PropTypes.string,
    userId: PropTypes.string,
    numUpvotes: PropTypes.number,
    numDownvotes: PropTypes.number,
    dateCreated: PropTypes.string,
    replies: PropTypes.array,
    nestingLevel: PropTypes.number,
    updateComments: PropTypes.func,
    userCommentVotes: PropTypes.array,
    upvote: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersUpvotes: PropTypes.func,
    trackUsersDownvotes: PropTypes.func
}

export default Comment

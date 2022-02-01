import { useState } from "react";
import PropTypes from "prop-types";
import CommentContent from "./CommentContent";
import CommentVotes from "./CommentVotes";
import DateOfComment from "./DateOfComment";
import User from "./User";
import ReplyToComment from "./ReplyToComment";

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
                <CommentVotes votes={votes} />
                <User username={props.username} />
                <DateOfComment dateCreated={props.dateCreated} />
                <CommentContent content={props.content} />
                <button type="button" onClick={toggleReplyForm}>Reply</button>
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
    updateComments: PropTypes.func
}

export default Comment

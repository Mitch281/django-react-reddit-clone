import PropTypes from "prop-types";
import CommentContent from "./CommentContent";
import CommentVotes from "./CommentVotes";
import DateOfComment from "./DateOfComment";
import User from "./User";

const Comment = (props) => {

    const votes = {numUpvotes: props.numUpvotes, numDownvotes: props.numDownvotes};

    function renderReplies() {
        if (props.replies) {

            // We indent nesting level when replies exist. If no replies exist, then the nesting level gets reset back to 
            // 0 and we render the next root level comment.

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
                />
                )
            );
        }
    }

    function getMarginLeft() {
        const marginLeft = `${props.nestingLevel * 50}px`;
        return {marginLeft:marginLeft};
    }

    return (
        <>
            <div className="comment" style={getMarginLeft()}>
                <CommentVotes votes={votes} />
                <User username={props.username} />
                <DateOfComment dateCreated={props.dateCreated} />
                <CommentContent content={props.content} />
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
    nestingLevel: PropTypes.number
}

export default Comment

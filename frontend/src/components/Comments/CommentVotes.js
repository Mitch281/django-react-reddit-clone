import { ImArrowUp, ImArrowDown } from "react-icons/im";
import PropTypes from "prop-types";

const CommentVotes = (props) => {

    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

    return (
    <div className="comment-votes">
        <ImArrowUp className="upvote-comment" />
        <span className="comment-vote-count">
            {numUpvotes - numDownvotes}
        </span>
        <ImArrowDown className="downvote-comment" />
    </div>
    );
}

CommentVotes.propTypes = {
    votes: PropTypes.object
}

export default CommentVotes;

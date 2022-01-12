import { ImArrowUp, ImArrowDown } from "react-icons/im";
import PropTypes from "prop-types";

const PostVotes = (props) => {
    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

    return (
        <div className="post-votes">
            <ImArrowUp className="upvote" />
            <span className="vote-count">{numUpvotes - numDownvotes}</span>
            <ImArrowDown className="downvote" />
        </div>
    )
}

PostVotes.propTypes = {
    votes: PropTypes.object
}

export default PostVotes

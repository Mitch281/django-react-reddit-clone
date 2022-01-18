import { ImArrowUp, ImArrowDown } from "react-icons/im";
import PropTypes from "prop-types";

const PostVotes = (props) => {
    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

    function handleUpvote() {
        props.upvote(props.postId, numUpvotes);
    }

    return (
        <div className="post-votes">
            <ImArrowUp className="upvote" onClick={handleUpvote}/>
            <span className="vote-count">{numUpvotes - numDownvotes}</span>
            <ImArrowDown className="downvote" />
        </div>
    )
}

PostVotes.propTypes = {
    votes: PropTypes.object,
    postId: PropTypes.string,
    upvote: PropTypes.func
}

export default PostVotes

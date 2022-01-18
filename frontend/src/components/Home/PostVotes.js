import { ImArrowUp, ImArrowDown } from "react-icons/im";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../../App";

const PostVotes = (props) => {
    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

    const { userIdLoggedIn } = useContext(UserContext);

    function checkUserVoteAlready() {
        const userVotes = props.userPostVotes.filter(userPostVote => userPostVote.user === userIdLoggedIn);
        const postsVotedOn = userVotes.map(userVote => userVote.post);
        if (postsVotedOn.includes(props.postId)) {
            return true;
        }
        return false;
    }

    function handleUpvote() {
        if (!checkUserVoteAlready()) {
            props.upvote(props.postId, numUpvotes);
        }
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
    upvote: PropTypes.func,
    userPostVotes: PropTypes.array
}

export default PostVotes

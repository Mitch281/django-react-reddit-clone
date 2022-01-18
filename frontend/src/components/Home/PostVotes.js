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
        const postVotedOn = userVotes.filter(userVote => userVote.post === props.postId);
        if (postVotedOn[0] === undefined) {
            return false;
        }
        else if (postVotedOn[0].upvote) {
            return "upvote";
        }
        else if (postVotedOn[0].downvote) {
            return "downvote";
        }
    }

    function handleUpvote() {

        // User has not voted yet.
        if (!checkUserVoteAlready()) {
            props.upvote(props.postId, numUpvotes, false)
            .then(props.userPostUpvote(userIdLoggedIn, props.postId, false));
        }

        // User is going from downvote to upvote.
        if (checkUserVoteAlready() === "downvote") {
            props.upvote(props.postId, numUpvotes, true);
        }

        else if (checkUserVoteAlready() === "upvote") {
            // undo upvote
        }
    }

    function determineUpArrowColour() {
        if (checkUserVoteAlready() === "upvote") {
            return {color: "orange"}
        }
    }

    function determineDownArrowColour() {
        if (checkUserVoteAlready() === "downvote") {
            return {color: "orange"}
        }
    }
    return (
        <div className="post-votes">
            <ImArrowUp className="upvote" onClick={handleUpvote} style={determineUpArrowColour()} />
            <span className="vote-count">{numUpvotes - numDownvotes}</span>
            <ImArrowDown className="downvote" style={determineDownArrowColour()} />
        </div>
    )
}

PostVotes.propTypes = {
    votes: PropTypes.object,
    postId: PropTypes.string,
    upvote: PropTypes.func,
    userPostUpvote: PropTypes.func,
    userPostVotes: PropTypes.array
}

export default PostVotes

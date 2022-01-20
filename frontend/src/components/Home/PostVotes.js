import { ImArrowUp, ImArrowDown } from "react-icons/im";
import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { UserContext } from "../../App";

const PostVotes = (props) => {
    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

    const [postVoteId, setPostVoteId] = useState();

    const { loggedIn, userIdLoggedIn } = useContext(UserContext);

    function checkUserVoteAlready() {
        if (!loggedIn) {
            return;
        }
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

    // This function gets the id (primary key) of the object which stores information about the user's votes on this post.
    function getPostVoteId() {
        const userVotes = props.userPostVotes.filter(userPostVote => userPostVote.user === userIdLoggedIn);
        const postVotedOn = userVotes.filter(userVote => userVote.post === props.postId);
        if (postVotedOn[0] === undefined) {
            return null
        };
        return postVotedOn[0].id;
    }


    function handleUpvote() {

        // User has not voted yet.
        if (!checkUserVoteAlready()) {
            props.upvote(props.postId, numUpvotes, numDownvotes, false)
            .then(props.userPostUpvote(userIdLoggedIn, props.postId, false, null))
            .catch(error => console.log(error));
        }

        // User is going from downvote to upvote.
        if (checkUserVoteAlready() === "downvote") {
            const postVoteId = getPostVoteId();
            props.upvote(props.postId, numUpvotes, numDownvotes, true)
            .then(props.userPostUpvote(userIdLoggedIn, props.postId, true, postVoteId))
            .catch(error => console.log(error));
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

import { ImArrowUp, ImArrowDown } from "react-icons/im";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../../App";

const PostVotes = (props) => {
    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

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


    function handleVote(voteType) {
        const postVoteId = getPostVoteId();

        // User has not voted yet.
        if (!checkUserVoteAlready()) {
            if (voteType === "upvote") {
                props.upvote(props.postId, numUpvotes, numDownvotes, "no vote")
                .then(props.userPostUpvote(userIdLoggedIn, props.postId, "no vote", postVoteId))
                .catch(error => console.log(error));
            }
            else {
                props.downvote(props.postId, numUpvotes, numDownvotes, "no vote")
                .then(props.userPostDownvote(userIdLoggedIn, props.postId, "no vote", postVoteId))
                .catch(error => console.log(error));
            }
        }

        // User is going from downvote to upvote.
        if (checkUserVoteAlready() === "downvote") {
            if (voteType === "upvote") {
                props.upvote(props.postId, numUpvotes, numDownvotes, "downvoted")
                .then(props.userPostUpvote(userIdLoggedIn, props.postId, "downvoted", postVoteId))
                .catch(error => console.log(error));
            }
            else {
                props.downvote(props.postId, numUpvotes, numDownvotes, "downvoted")
                .then(props.userPostDownvote(userIdLoggedIn, props.postId, "downvoted", postVoteId))
                .catch(error => console.log(error));
            }
        }

        else if (checkUserVoteAlready() === "upvote") {
            if (voteType === "upvote") {
                props.upvote(props.postId, numUpvotes, numDownvotes, "upvoted")
                .then(props.userPostUpvote(userIdLoggedIn, props.postId, "upvoted", postVoteId))
                .catch(error => console.log(error));
            }
            else {
                props.downvote(props.postId, numUpvotes, numDownvotes, "upvoted")
                .then(props.userPostDownvote(userIdLoggedIn, props.postId, "upvoted", postVoteId))
                .catch(error => console.log(error));
            }
        }
    }

    function determineUpArrowColour() {
        if (checkUserVoteAlready() === "upvote") {
            return {color: "orange"}
        }
    }

    function determineDownArrowColour() {
        if (checkUserVoteAlready() === "downvote") {
            return {color: "blue"}
        }
    }
    return (
        <div className="post-votes">
            <ImArrowUp className="upvote" onClick={() => handleVote("upvote")} style={determineUpArrowColour()} />
            <span className="vote-count">{numUpvotes - numDownvotes}</span>
            <ImArrowDown className="downvote" onClick={() => handleVote("downvote")} style={determineDownArrowColour()} />
        </div>
    )
}

PostVotes.propTypes = {
    votes: PropTypes.object,
    postId: PropTypes.string,
    upvote: PropTypes.func,
    userPostUpvote: PropTypes.func,
    userPostVotes: PropTypes.array,
    downvote: PropTypes.func,
    userPostDownvote: PropTypes.func
}

export default PostVotes
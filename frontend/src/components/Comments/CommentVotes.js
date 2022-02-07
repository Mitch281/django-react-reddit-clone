import { ImArrowUp, ImArrowDown } from "react-icons/im";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../../App";

const CommentVotes = (props) => {

    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

    const { loggedIn, userIdLoggedIn } = useContext(UserContext);

    // Checks if the user has already voted on a comment.
    function checkUserVoteAlready() {
        if (!loggedIn) {
            return;
        }

        // Gets all the votes on comments of the user currently logged in. Then further filters this to get the vote
        // of the user on the specific comment that is being rendered.
        const userVotes = props.userCommentVotes.filter(userCommentVote => userCommentVote.user === userIdLoggedIn);
        const commentVotedOn = userVotes.filter(userVote => userVote.comment === props.commentId);
        
        if (commentVotedOn[0] === undefined) {
            return false;
        }
        else if (commentVotedOn[0].upvote) {
            return "upvote";
        }
        else if (commentVotedOn[0].downvote) {
            return "downvote";
        }
    }

    // Gets the id of commentVote object is the user has voted on the comment already.
    function getCommentVoteId() {
        const userVotes = props.userCommentVotes.filter(userCommentVote => userCommentVote.user === userIdLoggedIn);
        const commentVotedOn = userVotes.filter(userVote => userVote.comment === props.commentId);

        if (commentVotedOn[0] === undefined) {
            return null;
        }
        return commentVotedOn[0].id;
    }

    function handleVote(voteType) {
        const commentVoteId = getCommentVoteId();
        const usersCurrentVote = checkUserVoteAlready();

        // User has not voted yet.
        if (!usersCurrentVote) {
            if (voteType === "upvote") {
                props.upvote(props.commentId, numUpvotes, numDownvotes, "no vote", "comment")
                .then(props.trackUsersUpvotes(userIdLoggedIn, props.commentId, "no vote", commentVoteId, "comment"))
                .catch(error => console.log(error));
            }
            else {
                props.downvote(props.commentId, numUpvotes, numDownvotes, "no vote", "comment")
                .then(props.trackUsersDownvotes(userIdLoggedIn, props.commentId, "no vote", commentVoteId, "comment"))
                .catch(error => console.log(error));
            }
        }

        // User has already downvoted the comment.
        if (usersCurrentVote === "downvote") {
            if (voteType === "upvote") {
                props.upvote(props.commentId, numUpvotes, numDownvotes, "downvoted", "comment")
                .then(props.trackUsersUpvotes(userIdLoggedIn, props.commentId, "downvoted", commentVoteId, "comment"))
                .catch(error => console.log(error));
            }
            else {
                props.downvote(props.commentId, numUpvotes, numDownvotes, "downvoted", "comment")
                .then(props.trackUsersDownvotes(userIdLoggedIn, props.commentId, "downvoted", commentVoteId, "comment"))
                .catch(error => console.log(error));
            }
        }

        // User has already upvoted the comment.
        if (usersCurrentVote === "upvote") {
            if (voteType === "upvote") {
                console.log("undo comment upvote");
                props.upvote(props.commentId, numUpvotes, numDownvotes, "upvoted", "comment")
                .then(props.trackUsersUpvotes(userIdLoggedIn, props.commentId, "upvoted", commentVoteId, "comment"))
                .catch(error => console.log(error));
            }
            else {
                props.downvote(props.commentId, numUpvotes, numDownvotes, "upvoted", "comment")
                .then(props.trackUsersDownvotes(userIdLoggedIn, props.commentId, "upvoted", commentVoteId, "comment"))
                .catch(error => console.log(error));
            }
        }
    }

    function determineUpArrowColour() {
        if (checkUserVoteAlready() === "upvote") {
            return {color: "orange"};
        }
    }

    function determineDownArrowColour() {
        if (checkUserVoteAlready() === "downvote") {
            return {color: "blue"};
        }
    }

    return (
    <div className="comment-votes">
        <ImArrowUp className="upvote-comment" style={determineUpArrowColour()} onClick={() => handleVote("upvote")} />
        <span className="comment-vote-count">
            {numUpvotes - numDownvotes}
        </span>
        <ImArrowDown className="downvote-comment" style={determineDownArrowColour()} onClick={() => handleVote("downvote")} />
    </div>
    );
}

CommentVotes.propTypes = {
    votes: PropTypes.object,
    userCommentVotes: PropTypes.array,
    commentId: PropTypes.string,
    upvote: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersUpvotes: PropTypes.func,
    trackUsersDownvotes: PropTypes.func
}

export default CommentVotes;

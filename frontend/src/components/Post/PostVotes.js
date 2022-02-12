import { useNavigate } from "react-router-dom";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserContext } from "../../App";
import { NoAccessTokenError } from "../../utils/auth";

const PostVotes = (props) => {

    let navigate = useNavigate();

    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

    const { loggedIn, userIdLoggedIn, logout } = useContext(UserContext);

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
        const currentUserVote = checkUserVoteAlready();

        // User has not voted yet.
        if (!currentUserVote) {
            if (voteType === "upvote") {
                props.upvote(props.postId, numUpvotes, numDownvotes, "no vote", "post")
                .then(() => props.trackUsersUpvotes(userIdLoggedIn, props.postId, "no vote", postVoteId, "post"))
                .catch(error => {
                    if (error instanceof NoAccessTokenError) {
                        navigate("/login/");
                    }

                    // User's session has expired.
                    else if (error.message === "401") {
                        logout();
                        navigate("/login/");
                    }
                }
                );
            }
            else {
                props.downvote(props.postId, numUpvotes, numDownvotes, "no vote", "post")
                .then(() => props.trackUsersDownvotes(userIdLoggedIn, props.postId, "no vote", postVoteId, "post"))
                .catch(error => {
                    if (error instanceof NoAccessTokenError) {
                        navigate("/login/");
                    }

                    // User's session has expired.
                    else if (error.message === "401") {
                        logout();
                        navigate("/login/");
                    }
                }
                );
            }
        }

        // User has already downvoted the post.
        if (currentUserVote === "downvote") {
            if (voteType === "upvote") {
                props.upvote(props.postId, numUpvotes, numDownvotes, "downvoted", "post")
                .then(() => props.trackUsersUpvotes(userIdLoggedIn, props.postId, "downvoted", postVoteId, "post"))
                .catch(error => console.log(error));
            }
            else {
                props.downvote(props.postId, numUpvotes, numDownvotes, "downvoted", "post")
                .then(() => props.trackUsersDownvotes(userIdLoggedIn, props.postId, "downvoted", postVoteId, "post"))
                .catch(error => {
                    if (error instanceof NoAccessTokenError) {
                        navigate("/login/");
                    }

                    // User's session has expired.
                    else if (error.message === "401") {
                        logout();
                        navigate("/login/");
                    }
                }
                );
            }
        }

        else if (currentUserVote === "upvote") {
            if (voteType === "upvote") {
                props.upvote(props.postId, numUpvotes, numDownvotes, "upvoted", "post")
                .then(() => props.trackUsersUpvotes(userIdLoggedIn, props.postId, "upvoted", postVoteId, "post"))
                .catch(error => console.log(error));
            }
            else {
                props.downvote(props.postId, numUpvotes, numDownvotes, "upvoted", "post")
                .then(() => props.trackUsersDownvotes(userIdLoggedIn, props.postId, "upvoted", postVoteId, "post"))
                .catch(error => {
                    if (error instanceof NoAccessTokenError) {
                        navigate("/login/");
                    }

                    // User's session has expired.
                    else if (error.message === "401") {
                        logout();
                        navigate("/login/");
                    }
                }
                );
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
    trackUsersUpvotes: PropTypes.func,
    userPostVotes: PropTypes.array,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func
}

export default PostVotes

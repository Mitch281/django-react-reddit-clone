import { useNavigate } from "react-router-dom";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { UserContext } from "../../../App";
import styles from "./comment-votes.module.css";
import { v4 as uuid_v4 } from "uuid";
import { CantGetNewAccessTokenError } from "../../../utils/auth";
import { constants } from "../../../constants";
import ErrorMessageModal from "../../ErrorMessage/ErrorMessageModal";

const CommentVotes = (props) => {
    let navigate = useNavigate();

    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

    const { loggedIn, userIdLoggedIn } = useContext(UserContext);

    const [error, setError] = useState();

    // Checks if the user has already voted on a comment.
    function checkUserVoteAlready() {
        if (!loggedIn) {
            return;
        }

        // Gets all the votes on comments of the user currently logged in. Then further filters this to get the vote
        // of the user on the specific comment that is being rendered.
        const userVotes = props.userCommentVotes.filter(
            (userCommentVote) => userCommentVote.user === userIdLoggedIn
        );
        const commentVotedOn = userVotes.filter(
            (userVote) => userVote.comment === props.commentId
        );

        if (commentVotedOn[0] === undefined) {
            return false;
        } else if (commentVotedOn[0].upvote) {
            return "upvote";
        } else if (commentVotedOn[0].downvote) {
            return "downvote";
        }
    }

    // Gets the id of commentVote object is the user has voted on the comment already.
    function getCommentVoteId() {
        const userVotes = props.userCommentVotes.filter(
            (userCommentVote) => userCommentVote.user === userIdLoggedIn
        );
        const commentVotedOn = userVotes.filter(
            (userVote) => userVote.comment === props.commentId
        );

        if (commentVotedOn[0] === undefined) {
            return null;
        }
        return commentVotedOn[0].id;
    }

    async function noVoteToUpvote(commentVoteId) {
        try {
            await props.trackUsersUpvotes(
                userIdLoggedIn,
                props.commentId,
                "no vote",
                commentVoteId,
                "comment"
            );
            await props.upvote(
                props.commentId,
                numUpvotes,
                numDownvotes,
                "no vote",
                "comment"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function noVoteToDownvote(commentVoteId) {
        try {
            await props.trackUsersDownvotes(
                userIdLoggedIn,
                props.commentId,
                "no vote",
                commentVoteId,
                "comment"
            );
            await props.downvote(
                props.commentId,
                numUpvotes,
                numDownvotes,
                "no vote",
                "comment"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function downvoteToUpvote(commentVoteId) {
        try {
            await props.trackUsersUpvotes(
                userIdLoggedIn,
                props.commentId,
                "downvoted",
                commentVoteId,
                "comment"
            );
            await props.upvote(
                props.commentId,
                numUpvotes,
                numDownvotes,
                "downvoted",
                "comment"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function downvoteToDownvote(commentVoteId) {
        try {
            await props.trackUsersDownvotes(
                userIdLoggedIn,
                props.commentId,
                "downvoted",
                commentVoteId,
                "comment"
            );
            await props.downvote(
                props.commentId,
                numUpvotes,
                numDownvotes,
                "downvoted",
                "comment"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function upvoteToUpvote(commentVoteId) {
        try {
            await props.trackUsersUpvotes(
                userIdLoggedIn,
                props.commentId,
                "upvoted",
                commentVoteId,
                "comment"
            );
            await props.upvote(
                props.commentId,
                numUpvotes,
                numDownvotes,
                "upvoted",
                "comment"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function upvoteToDownvote(commentVoteId) {
        try {
            await props.trackUsersDownvotes(
                userIdLoggedIn,
                props.commentId,
                "upvoted",
                commentVoteId,
                "comment"
            );
            await props.downvote(
                props.commentId,
                numUpvotes,
                numDownvotes,
                "upvoted",
                "comment"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function handleVote(voteType) {
        if (!loggedIn) {
            navigate("/login/");
            return;
        }

        const commentVoteId = getCommentVoteId();
        const usersCurrentVote = checkUserVoteAlready();

        // User has not voted yet.
        if (!usersCurrentVote) {
            if (voteType === "upvote") {
                await noVoteToUpvote(commentVoteId);
            } else {
                noVoteToDownvote(commentVoteId);
            }
        }

        // User has already downvoted the comment.
        if (usersCurrentVote === "downvote") {
            if (voteType === "upvote") {
                await downvoteToUpvote(commentVoteId);
            } else {
                await downvoteToDownvote(commentVoteId);
            }
        }

        // User has already upvoted the comment.
        if (usersCurrentVote === "upvote") {
            if (voteType === "upvote") {
                await upvoteToUpvote(commentVoteId);
            } else {
                await upvoteToDownvote(commentVoteId);
            }
        }
    }

    function determineUpArrowColour() {
        if (checkUserVoteAlready() === "upvote") {
            return { color: "orange" };
        }
    }

    function determineDownArrowColour() {
        if (checkUserVoteAlready() === "downvote") {
            return { color: "blue" };
        }
    }

    function getErrorMessage() {

        // This controls how long to render error for. In this case, we render the error for <ERROR_MODAL_RENDER_TIME> ms.
        setTimeout(() => {
            setError(null)
        }, constants.ERROR_MODAL_RENDER_TIME);

        if (error instanceof CantGetNewAccessTokenError) {
            setTimeout(() => {
                setError(null);
            }, [3000]);
            return <ErrorMessageModal key={uuid_v4()} errorMessage="Session expired. Please login again." />;
        }

        setTimeout(() => {
            setError(null);
        }, [3000]);
        return <ErrorMessageModal key={uuid_v4()} errorMessage="Couldn't vote on comment. Please try again later." />;
    }

    return (
        <>
            <div className={styles["comment-votes"]}>
                <HiArrowSmUp
                    size={20}
                    className={styles["upvote"]}
                    style={determineUpArrowColour()}
                    onClick={() => handleVote("upvote")}
                />
                <span className={styles["comment-vote-count"]}>
                    {numUpvotes - numDownvotes}
                </span>
                <HiArrowSmDown
                    size={20}
                    className={styles["downvote"]}
                    style={determineDownArrowColour()}
                    onClick={() => handleVote("downvote")}
                />
            </div>
            {error ? getErrorMessage() : ""}
        </>
    );
};

CommentVotes.propTypes = {
    votes: PropTypes.object,
    userCommentVotes: PropTypes.array,
    commentId: PropTypes.string,
    upvote: PropTypes.func,
    downvote: PropTypes.func,
    trackUsersUpvotes: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
};

export default CommentVotes;

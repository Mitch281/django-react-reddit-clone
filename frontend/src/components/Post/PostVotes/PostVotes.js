import { useNavigate } from "react-router-dom";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { UserContext } from "../../../App";
import styles from "./post-votes.module.css";
import ErrorMessageModal from "../../ErrorMessage/ErrorMessageModal";
import { v4 as uuid_v4 } from "uuid";
import { CantGetNewAccessTokenError } from "../../../utils/auth";
import { constants } from "../../../constants";

const PostVotes = (props) => {
    let navigate = useNavigate();

    const numUpvotes = props.votes.numUpvotes;
    const numDownvotes = props.votes.numDownvotes;

    const { loggedIn, userIdLoggedIn } = useContext(UserContext);

    const [error, setError] = useState();

    function checkUserVoteAlready() {
        if (!loggedIn) {
            return;
        }
        const userVotes = props.userPostVotes.filter(
            (userPostVote) => userPostVote.user === userIdLoggedIn
        );
        const postVotedOn = userVotes.filter(
            (userVote) => userVote.post === props.postId
        );

        if (postVotedOn[0] === undefined) {
            return false;
        } else if (postVotedOn[0].upvote) {
            return "upvote";
        } else if (postVotedOn[0].downvote) {
            return "downvote";
        }
    }

    // This function gets the id (primary key) of the object which stores information about the user's votes on this post.
    function getPostVoteId() {
        const userVotes = props.userPostVotes.filter(
            (userPostVote) => userPostVote.user === userIdLoggedIn
        );
        const postVotedOn = userVotes.filter(
            (userVote) => userVote.post === props.postId
        );
        if (postVotedOn[0] === undefined) {
            return null;
        }
        return postVotedOn[0].id;
    }

    async function noVoteToUpvote(postVoteId) {
        try {
            await props.trackUsersUpvotes(
                userIdLoggedIn,
                props.postId,
                "no vote",
                postVoteId,
                "post"
            );
            await props.upvote(
                props.postId,
                numUpvotes,
                numDownvotes,
                "no vote",
                "post"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function noVoteToDownvote(postVoteId) {
        try {
            await props.trackUsersDownvotes(
                userIdLoggedIn,
                props.postId,
                "no vote",
                postVoteId,
                "post"
            );
            await props.downvote(
                props.postId,
                numUpvotes,
                numDownvotes,
                "no vote",
                "post"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function downvoteToUpvote(postVoteId) {
        try {
            await props.trackUsersUpvotes(
                userIdLoggedIn,
                props.postId,
                "downvoted",
                postVoteId,
                "post"
            );
            await props.upvote(
                props.postId,
                numUpvotes,
                numDownvotes,
                "downvoted",
                "post"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function downvoteToDownvote(postVoteId) {
        try {
            await props.trackUsersDownvotes(
                userIdLoggedIn,
                props.postId,
                "downvoted",
                postVoteId,
                "post"
            );
            await props.downvote(
                props.postId,
                numUpvotes,
                numDownvotes,
                "downvoted",
                "post"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function upvoteToUpvote(postVoteId) {
        try {
            await props.trackUsersUpvotes(
                userIdLoggedIn,
                props.postId,
                "upvoted",
                postVoteId,
                "post"
            );
            await props.upvote(
                props.postId,
                numUpvotes,
                numDownvotes,
                "upvoted",
                "post"
            );
        } catch (error) {
            setError(error);
        }
    }

    async function upvoteToDownvote(postVoteId) {
        try {
            await props.trackUsersDownvotes(
                userIdLoggedIn,
                props.postId,
                "upvoted",
                postVoteId,
                "post"
            );
            await props.downvote(
                props.postId,
                numUpvotes,
                numDownvotes,
                "upvoted",
                "post"
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

        const postVoteId = getPostVoteId();
        const currentUserVote = checkUserVoteAlready();

        if (!currentUserVote) {
            if (voteType === "upvote") {
                await noVoteToUpvote(postVoteId);
            } else {
                await noVoteToDownvote(postVoteId);
            }
        } else if (currentUserVote === "downvote") {
            if (voteType === "upvote") {
                await downvoteToUpvote(postVoteId);
            } else {
                await downvoteToDownvote(postVoteId);
            }
        } else if (currentUserVote === "upvote") {
            if (voteType === "upvote") {
                await upvoteToUpvote(postVoteId);
            } else {
                await upvoteToDownvote(postVoteId);
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

        // Controls how long to render error message for (<ERROR_MODAL_RENDER_TIME> in this case).
        setTimeout(() => {
            setError(null)
        }, constants.ERROR_MODAL_RENDER_TIME);

        if (error instanceof CantGetNewAccessTokenError) {
            return <ErrorMessageModal key={uuid_v4()} errorMessage="Session expired. Please login again." />;
        }

        return <ErrorMessageModal key={uuid_v4()} errorMessage="Couldn't vote on post. Please try again later." />;
    }

    return (
        <>
            <div className={styles["post-votes"]}>
                <HiArrowSmUp
                    size={25}
                    className={styles["upvote"]}
                    onClick={() => handleVote("upvote")}
                    style={determineUpArrowColour()}
                />
                <span className={styles["vote-count"]}>
                    {numUpvotes - numDownvotes}
                </span>
                <HiArrowSmDown
                    size={25}
                    className={styles["downvote"]}
                    onClick={() => handleVote("downvote")}
                    style={determineDownArrowColour()}
                />
            </div>
            {error ? getErrorMessage() : ""}
        </>
    );
};

PostVotes.propTypes = {
    votes: PropTypes.object,
    postId: PropTypes.string,
    upvote: PropTypes.func,
    trackUsersUpvotes: PropTypes.func,
    userPostVotes: PropTypes.array,
    downvote: PropTypes.func,
    trackUsersDownvotes: PropTypes.func,
};

export default PostVotes;

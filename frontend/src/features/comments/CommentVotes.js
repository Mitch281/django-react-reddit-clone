import { useContext } from "react";
import { HiArrowSmDown, HiArrowSmUp } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../App";
import { VoteTypes } from "../../constants";
import {
    selectAllUsersVotesOnComments, trackUsersDownvote, trackUsersUpvote
} from "../users/usersVotesOnCommentsSlice";
import {
    downvoteComment,
    selectCommentById,
    upvoteComment
} from "./commentsSlice";
import styles from "./styles/comment-votes.module.css";

const CommentVotes = ({ commentId }) => {
    const dispatch = useDispatch();
    const comment = useSelector((state) => selectCommentById(state, commentId));

    const numUpvotes = comment.num_upvotes;
    const numDownvotes = comment.num_downvotes;

    const { loggedIn, userIdLoggedIn } = useContext(UserContext);

    const usersVotesOnComments = useSelector(selectAllUsersVotesOnComments);

    async function upvote() {
        const currentVote = getCurrentVote();
        const usersVoteOnCommentId = getUsersVoteOnCommentId();
        try {
            await dispatch(
                upvoteComment({ comment: comment, currentVote: currentVote })
            ).unwrap();
            await dispatch(
                trackUsersUpvote({
                    usersVoteOnCommentId: usersVoteOnCommentId,
                    currentVote: currentVote,
                    userId: userIdLoggedIn,
                    commentId: commentId,
                })
            ).unwrap();
        } catch (error) {
            toast.error(error.message, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    async function downvote() {
        const currentVote = getCurrentVote();
        const usersVoteOnCommentId = getUsersVoteOnCommentId();
        try {
            await dispatch(
                downvoteComment({ comment: comment, currentVote: currentVote })
            ).unwrap();
            await dispatch(
                trackUsersDownvote({
                    usersVoteOnCommentId: usersVoteOnCommentId,
                    currentVote: currentVote,
                    userId: userIdLoggedIn,
                    commentId: commentId,
                })
            ).unwrap();
        } catch (error) {
            toast.error(error.message, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    function getUsersVoteOnCommentId() {
        const usersVoteOnComment = usersVotesOnComments.find(
            (usersVoteOnComment) => usersVoteOnComment.comment === commentId
        );
        if (!usersVoteOnComment) {
            return;
        }
        return usersVoteOnComment.id;
    }

    function getCurrentVote() {
        const usersVoteOnComment = usersVotesOnComments.find(
            (usersVoteOnComment) => usersVoteOnComment.comment === commentId
        );
        if (!usersVoteOnComment) {
            return;
        }
        if (usersVoteOnComment.upvote) {
            return VoteTypes.Upvote;
        } else if (usersVoteOnComment.downvote) {
            return VoteTypes.Downvote;
        }

        return;
    }

    function getUpvoteArrowColour() {
        if (!loggedIn) {
            return;
        }
        const currentVote = getCurrentVote();
        if (currentVote === VoteTypes.Upvote) {
            return { color: "orange" };
        }
        return;
    }

    function getDownvoteArrowColour() {
        if (!loggedIn) {
            return;
        }
        const currentVote = getCurrentVote();
        if (currentVote === VoteTypes.Downvote) {
            return { color: "blue" };
        }
        return;
    }


    return (
        <div className={styles["comment-votes"]}>
            <HiArrowSmUp
                size={20}
                className={styles["upvote"]}
                onClick={upvote}
                style={getUpvoteArrowColour()}
            />
            <span className={styles["comment-vote-count"]}>
                {numUpvotes - numDownvotes}
            </span>
            <HiArrowSmDown
                size={20}
                className={styles["downvote"]}
                onClick={downvote}
                style={getDownvoteArrowColour()}
            />
            <ToastContainer />
        </div>
    );
};

export default CommentVotes;

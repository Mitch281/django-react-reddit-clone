import { useContext } from "react";
import { HiArrowSmDown, HiArrowSmUp } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import { UserContext } from "../../app/App";
import { AppDispatch, RootState } from "../../app/store";
import {
    Comment,
    CommentVoteData,
    DownvoteData,
    UpvoteData,
    UserCommentVoteOnDownvote,
    UserCommentVoteOnUpvote,
    UsersVoteOnComment,
    VoteOnCommentPayload,
} from "../../types/shared";
import { renderErrorOnRequest } from "../../utils/auth";
import { VoteTypes } from "../../utils/constants";
import {
    selectAllUsersVotesOnComments,
    trackUsersVote,
} from "../users/usersVotesOnCommentsSlice";
import { selectCommentById, voteOnComment } from "./commentsSlice";
import styles from "./styles/comment-votes.module.css";

type Props = {
    commentId: string;
};

const CommentVotes = ({ commentId }: Props) => {
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();
    const comment = useSelector((state: RootState) =>
        selectCommentById(state, commentId)
    ) as Comment;

    const numUpvotes = comment.num_upvotes;
    const numDownvotes = comment.num_downvotes;

    const { loggedIn, userIdLoggedIn, logout } = useContext(UserContext);

    const usersVotesOnComments = useSelector(
        selectAllUsersVotesOnComments
    ) as UsersVoteOnComment[];

    function getUpvoteCommentData(): UpvoteData {
        const currentVote = getCurrentVote();
        let data;
        if (currentVote === VoteTypes.Downvote) {
            data = {
                num_upvotes: numUpvotes + 1,
                num_downvotes: numDownvotes - 1,
            };
        } else if (currentVote === VoteTypes.Upvote) {
            data = { num_upvotes: numUpvotes - 1 };
        } else {
            data = { num_upvotes: numUpvotes + 1 };
        }

        return data;
    }

    function getDownvoteCommentData(): DownvoteData {
        const currentVote = getCurrentVote();
        let data;
        if (currentVote === VoteTypes.Downvote) {
            data = { num_downvotes: numDownvotes - 1 };
        } else if (currentVote === VoteTypes.Upvote) {
            data = {
                num_upvotes: numUpvotes - 1,
                num_downvotes: numDownvotes + 1,
            };
        } else {
            data = { num_downvotes: numDownvotes + 1 };
        }

        return data;
    }

    function getUserVoteOnUpvote(): UserCommentVoteOnUpvote {
        const usersVoteOnPostId = getUsersVoteOnCommentId();
        const currentVote = getCurrentVote();
        let data;
        // User has voted already
        if (usersVoteOnPostId) {
            if (currentVote === VoteTypes.Upvote) {
                data = { id: usersVoteOnPostId, upvote: false };
            } else if (currentVote === VoteTypes.Downvote) {
                data = {
                    id: usersVoteOnPostId,
                    upvote: true,
                    downvote: false,
                };
            } else {
                data = { id: usersVoteOnPostId, upvote: true };
            }
        } else {
            data = {
                id: uuid_v4(),
                upvote: true,
                downvote: false,
                user: userIdLoggedIn,
                comment: commentId,
            };
        }

        return data;
    }

    function getUserVoteOnDownvote(): UserCommentVoteOnDownvote {
        const usersVoteOnCommentId = getUsersVoteOnCommentId();
        const currentVote = getCurrentVote();
        let data;
        // User has voted already
        if (usersVoteOnCommentId) {
            if (currentVote === VoteTypes.Upvote) {
                data = {
                    id: usersVoteOnCommentId,
                    upvote: false,
                    downvote: true,
                };
            } else if (currentVote === VoteTypes.Downvote) {
                data = {
                    id: usersVoteOnCommentId,
                    downvote: false,
                };
            } else {
                data = { id: usersVoteOnCommentId, downvote: true };
            }
        } else {
            data = {
                id: uuid_v4(),
                upvote: false,
                downvote: true,
                user: userIdLoggedIn,
                comment: commentId,
            };
        }

        return data;
    }

    async function upvote() {
        const upvoteCommentData = getUpvoteCommentData();
        const usersVoteOnCommentData = getUserVoteOnUpvote();
        const data: CommentVoteData = {
            comment_data: upvoteCommentData,
            user_data: usersVoteOnCommentData,
        };
        const usersVoteOnCommentId = getUsersVoteOnCommentId();
        const upvoteInformation: VoteOnCommentPayload = {
            commentId: commentId,
            usersVoteOnCommentId: usersVoteOnCommentId,
            data: data,
        };
        try {
            await dispatch(voteOnComment(upvoteInformation)).unwrap();
            dispatch(trackUsersVote(data.user_data));
        } catch (error) {
            renderErrorOnRequest(error as Error, logout, navigate);
        }
    }

    async function downvote() {
        const downvoteCommentData = getDownvoteCommentData();
        const usersVoteOnCommentData = getUserVoteOnDownvote();
        const data: CommentVoteData = {
            comment_data: downvoteCommentData,
            user_data: usersVoteOnCommentData,
        };
        const usersVoteOnCommentId = getUsersVoteOnCommentId();
        const downvoteInformation: VoteOnCommentPayload = {
            commentId: commentId,
            usersVoteOnCommentId: usersVoteOnCommentId,
            data,
        };
        try {
            await dispatch(voteOnComment(downvoteInformation)).unwrap();
            dispatch(trackUsersVote(data.user_data));
        } catch (error) {
            renderErrorOnRequest(error as Error, logout, navigate);
        }
    }

    function getUsersVoteOnCommentId(): string | undefined {
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
        </div>
    );
};

export default CommentVotes;

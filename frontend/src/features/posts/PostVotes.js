import { useContext } from "react";
import { HiArrowSmDown, HiArrowSmUp } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuid_v4 } from "uuid";
import { UserContext } from "../../app/App";
import { renderErrorOnRequest } from "../../utils/auth";
import { VoteTypes } from "../../utils/constants";
import {
    selectAllUsersVotesOnPosts, trackUsersVote
} from "../users/usersVotesOnPostsSlice";
import { selectPostById, voteOnPost } from "./postsSlice";
import styles from "./styles/post-votes.module.css";

const PostVotes = ({ postId }) => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const post = useSelector((state) => selectPostById(state, postId));

    const numUpvotes = post.num_upvotes;
    const numDownvotes = post.num_downvotes;

    const { loggedIn, userIdLoggedIn, logout } = useContext(UserContext);

    const usersVotesOnPosts = useSelector(selectAllUsersVotesOnPosts);

    function getUpvotePostData() {
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

    function getDownvotePostData() {
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

    function getUserVoteOnUpvote() {
        const usersVoteOnPostId = getUsersVoteOnPostId();
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
                post: postId,
            };
        }

        return data;
    }

    function getUserVoteOnDownvote() {
        const usersVoteOnPostId = getUsersVoteOnPostId();
        const currentVote = getCurrentVote();
        let data;
        // User has voted already
        if (usersVoteOnPostId) {
            if (currentVote === VoteTypes.Upvote) {
                data = { id: usersVoteOnPostId, upvote: false, downvote: true };
            } else if (currentVote === VoteTypes.Downvote) {
                data = {
                    id: usersVoteOnPostId,
                    downvote: false,
                };
            } else {
                data = { id: usersVoteOnPostId, downvote: true };
            }
        } else {
            data = {
                id: uuid_v4(),
                upvote: true,
                downvote: false,
                user: userIdLoggedIn,
                post: postId,
            };
        }

        return data;
    }

    async function upvote() {
        const upvotePostData = getUpvotePostData();
        const usersVoteOnPostData = getUserVoteOnUpvote();
        const data = {
            post_data: upvotePostData,
            user_data: usersVoteOnPostData,
        };
        const usersVoteOnPostId = getUsersVoteOnPostId();
        const upvoteInformation = {
            postId: postId,
            usersVoteOnPostId: usersVoteOnPostId,
            data: data,
        };
        try {
            await dispatch(voteOnPost(upvoteInformation)).unwrap();
            dispatch(trackUsersVote(data.user_data));
        } catch (error) {
            renderErrorOnRequest(error, logout, navigate);
        }
    }

    async function downvote() {
        const downvotePostData = getDownvotePostData();
        const usersVoteOnPostData = getUserVoteOnDownvote();
        const data = {
            post_data: downvotePostData,
            user_data: usersVoteOnPostData,
        };
        const usersVoteOnPostId = getUsersVoteOnPostId();
        const downvoteInformation = {
            postId: postId,
            usersVoteOnPostId: usersVoteOnPostId,
            data: data,
        };
        try {
            await dispatch(voteOnPost(downvoteInformation)).unwrap();
            dispatch(trackUsersVote(data.user_data));
        } catch (error) {
            renderErrorOnRequest(error, logout, navigate);
        }
    }

    function getUsersVoteOnPostId() {
        const usersVoteOnPost = usersVotesOnPosts.find(
            (usersVoteOnPost) => usersVoteOnPost.post === postId
        );
        if (!usersVoteOnPost) {
            return;
        }
        return usersVoteOnPost.id;
    }

    function getCurrentVote() {
        const usersVoteOnPost = usersVotesOnPosts.find(
            (usersVoteOnPost) => usersVoteOnPost.post === postId
        );
        if (!usersVoteOnPost) {
            return;
        }
        if (usersVoteOnPost.upvote) {
            return VoteTypes.Upvote;
        } else if (usersVoteOnPost.downvote) {
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
        <>
            <div className={styles["post-votes"]}>
                <HiArrowSmUp
                    size={25}
                    className={styles["upvote"]}
                    onClick={upvote}
                    style={getUpvoteArrowColour()}
                />
                <span className={styles["vote-count"]}>
                    {numUpvotes - numDownvotes}
                </span>
                <HiArrowSmDown
                    size={25}
                    className={styles["downvote"]}
                    onClick={downvote}
                    style={getDownvoteArrowColour()}
                />
            </div>
        </>
    );
};

export default PostVotes;

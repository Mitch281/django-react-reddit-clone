import { useContext } from "react";
import { HiArrowSmDown, HiArrowSmUp } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../../App";
import { selectAllUsersVotesOnPosts } from "../users/usersVotesOnPostsSlice";
import { downvotePost, selectPostById, upvotePost } from "./postsSlice";
import styles from "./styles/post-votes.module.css";

const PostVotes = ({ postId }) => {
    const dispatch = useDispatch();
    const post = useSelector(state => selectPostById(state, postId));

    const numUpvotes = post.num_upvotes;
    const numDownvotes = post.num_downvotes;

    const { loggedIn } = useContext(UserContext);

    const usersVotesOnPosts = useSelector(selectAllUsersVotesOnPosts);

    async function upvote() {
        try {
            await dispatch(upvotePost({ post: post, currentVote: "upvote"})).unwrap();
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
        try {
            await dispatch(downvotePost({ post: post, currentVote: "upvote" })).unwrap();
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

    function getUpvoteArrowColour() {
        if (!loggedIn) {
            return;
        }
        const usersVoteOnPost = usersVotesOnPosts.find(usersVoteOnPost => usersVoteOnPost.post === postId);
        if (!usersVoteOnPost) {
            return;
        }
        if (usersVoteOnPost.upvote) {
            return { color: "orange" }
        }
        return;
    }

    function getDownvoteArrowColour() {
        if (!loggedIn) {
            return;
        }
        const usersVoteOnPost = usersVotesOnPosts.find(usersVoteOnPost => usersVoteOnPost.post === postId);
        if (!usersVoteOnPost) {
            return;
        }
        if (usersVoteOnPost.downvote) {
            return { color: "blue" }
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
            <ToastContainer />
        </>
    );
};

export default PostVotes;

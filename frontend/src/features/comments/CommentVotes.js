import { useSelector } from "react-redux";
import { selectCommentById } from "./commentsSlice";
import styles from "./styles/comment-votes.module.css";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";

const CommentVotes = ({ commentId }) => {
    const comment = useSelector((state) => selectCommentById(state, commentId));
    const numUpvotes = comment.num_upvotes;
    const numDownvotes = comment.num_downvotes;

    return (
        <div className={styles["comment-votes"]}>
            <HiArrowSmUp size={20} className={styles["upvote"]} />
            <span className={styles["comment-vote-count"]}>
                {numUpvotes - numDownvotes}
            </span>
            <HiArrowSmDown size={20} className={styles["downvote"]} />
        </div>
    );
};

export default CommentVotes;

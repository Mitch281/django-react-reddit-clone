import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./styles/num-comments.module.css";
import { selectPostById } from "./postsSlice";
import { BiCommentDetail } from "react-icons/bi";

const NumComments = ({ postId }) => {
    const post = useSelector((state) => selectPostById(state, postId));

    return (
        <Link
            className={styles["nav-to-comments"]}
            to={`/post=${postId}/comments/`}
        >
            <>
                <BiCommentDetail />
                <span>
                    {post.num_comments} {post.num_comments === 1 ? "Comment" : "Comments"}
                </span>
            </>
        </Link>
    );
};

export default NumComments;

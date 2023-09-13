import { BiCommentDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPostById } from "./postsSlice";
import styles from "./styles/num-comments.module.css";

type Props = {
    postId: string;
};

const NumComments = ({ postId }: Props) => {
    const post = useSelector((state) => selectPostById(state, postId));

    return (
        <Link
            className={styles["nav-to-comments"]}
            to={`/post=${postId}/comments/`}
        >
            <>
                <BiCommentDetail />
                <span>
                    {post.num_comments}{" "}
                    {post.num_comments === 1 ? "Comment" : "Comments"}
                </span>
            </>
        </Link>
    );
};

export default NumComments;

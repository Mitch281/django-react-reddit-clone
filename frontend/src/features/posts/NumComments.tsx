import { BiCommentDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import { Post } from "../../types/shared";
import { selectPostById } from "./postsSlice";
import styles from "./styles/num-comments.module.css";

type Props = {
    postId: string;
};

const NumComments = ({ postId }: Props) => {
    const post: Post = useSelector((state: RootState) =>
        selectPostById(state, postId)
    ) as Post;

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

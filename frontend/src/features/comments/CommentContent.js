import { selectCommentById } from "./commentsSlice";
import { useSelector } from "react-redux";
import styles from "./styles/comment-content.module.css"

const CommentContent = ({ commentId }) => {
    const comment = useSelector(state => selectCommentById(state, commentId));

    return (
        <p className={styles["comment-content"]}>{comment.content}</p>
    )
}

export default CommentContent;

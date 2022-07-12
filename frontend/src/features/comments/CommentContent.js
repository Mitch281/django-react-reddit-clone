import { selectCommentById } from "./commentsSlice";
import { useSelector } from "react-redux";
import styles from "./styles/comment-content.module.css";
import EditCommentContentForm from "./EditCommentContentForm";

const CommentContent = ({ commentId, isCurrentlyEditing, toggleEditForm }) => {
    const comment = useSelector((state) => selectCommentById(state, commentId));

    let content;
    if (isCurrentlyEditing) {
        content = <EditCommentContentForm commentId={commentId} toggleEditForm={toggleEditForm} />;
    } else {
        content = (
            <p className={styles["comment-content"]}>{comment.content}</p>
        );
    }

    return content;
};

export default CommentContent;

import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Comment } from "../../types/shared";
import EditCommentContentForm from "./EditCommentContentForm";
import { selectCommentById } from "./commentsSlice";
import styles from "./styles/comment-content.module.css";

type Props = {
    commentId: string;
    isCurrentlyEditing: boolean;
    toggleEditForm: () => void;
};

const CommentContent = ({
    commentId,
    isCurrentlyEditing,
    toggleEditForm,
}: Props) => {
    const comment = useSelector((state: RootState) =>
        selectCommentById(state, commentId)
    ) as Comment;

    let content;
    if (isCurrentlyEditing) {
        content = (
            <EditCommentContentForm
                commentId={commentId}
                toggleEditForm={toggleEditForm}
            />
        );
    } else {
        content = (
            <p className={styles["comment-content"]}>{comment.content}</p>
        );
    }

    return content;
};

export default CommentContent;

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { Comment } from "../../types/shared";
import { selectCommentById, toggleHidden } from "./commentsSlice";
import styles from "./styles/comment.module.css";

type Props = {
    commentId: string;
};

const ToggleHidden = ({ commentId }: Props) => {
    const comment = useSelector((state: RootState) =>
        selectCommentById(state, commentId)
    ) as Comment;
    const dispatch = useDispatch<AppDispatch>();

    let text;
    if (comment.is_hidden) {
        text = `Show ${comment.num_replies} Replies`;
    } else {
        text = `Hide ${comment.num_replies} Replies`;
    }

    if (comment.num_replies === 0) {
        return null;
    }

    return (
        <button
            type="button"
            className={styles["hide-replies-button"]}
            onClick={() => dispatch(toggleHidden(commentId, comment.is_hidden))}
        >
            {text}
        </button>
    );
};

export default ToggleHidden;

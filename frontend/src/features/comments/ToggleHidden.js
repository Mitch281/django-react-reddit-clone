import { useSelector, useDispatch } from "react-redux";
import { selectCommentById } from "./commentsSlice";
import { toggleHidden } from "./commentsSlice";
import styles from "./styles/comment.module.css";

const ToggleHidden = ({ commentId }) => {
    const comment = useSelector((state) => selectCommentById(state, commentId));
    const dispatch = useDispatch();

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
            onClick={() =>
                dispatch(toggleHidden(commentId, comment.is_hidden))
            }
        >
            {text}
        </button>
    );
};

export default ToggleHidden;

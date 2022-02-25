// Note that unlike posts, we do not actually perform a complete delete of comments. This is because this would ruin the
// structure of our comment chains. Instead, we will just set the user who made the comment to null and set the content
// of the comment to deleted.

import { useContext } from "react";
import { UserContext } from "../../../App";
import { BsFillTrashFill } from "react-icons/bs";
import PropTypes from "prop-types";
import styles from "./delete-comment.module.css";
import { fetchDeleteComment } from "../../../utils/fetch-data";

const DeleteComment = (props) => {

    const { userIdLoggedIn } = useContext(UserContext);

    async function handleDeleteComment() {
        try {
            await fetchDeleteComment(props.commentId, userIdLoggedIn);
            props.deleteComment(props.commentId);
        } catch(error) {
            throw error;
        }
    }

    function performDeleteComment() {
        handleDeleteComment()
        .catch(error => console.log(error));
    }

    return (
        <BsFillTrashFill className={styles["delete-comment"]} onClick={performDeleteComment} />
    );
}

DeleteComment.propTypes = {
    deleteComment: PropTypes.func,
    commentId: PropTypes.string,
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
}

export default DeleteComment
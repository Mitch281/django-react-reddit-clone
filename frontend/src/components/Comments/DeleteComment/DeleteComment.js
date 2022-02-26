// Note that unlike posts, we do not actually perform a complete delete of comments. This is because this would ruin the
// structure of our comment chains. Instead, we will just set the user who made the comment to null and set the content
// of the comment to deleted.

import { useContext, useState } from "react";
import { UserContext } from "../../../App";
import { BsFillTrashFill } from "react-icons/bs";
import PropTypes from "prop-types";
import styles from "./delete-comment.module.css";
import { fetchDeleteComment } from "../../../utils/fetch-data";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import { CantGetNewAccessTokenError } from "../../../utils/auth";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const DeleteComment = (props) => {
    const { userIdLoggedIn } = useContext(UserContext);

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    async function handleDeleteComment() {
        try {
            await fetchDeleteComment(props.commentId, userIdLoggedIn);
            props.deleteComment(props.commentId);
        } catch (error) {
            throw error;
        }
    }

    async function performDeleteComment() {
        const wantDelete = window.confirm(
            "Are you sure you want to delete this comment?"
        );
        if (!wantDelete) {
            return;
        }

        setLoading(true);
        try {
            await handleDeleteComment();
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    
    function getErrorMessage() {
        if (!error) {
            return;
        }
        
        if (error instanceof CantGetNewAccessTokenError) {
            return <ErrorMessage errorMessage="Session expired. Please login again." />
        }
        else if (error.message === "401") {
            return <ErrorMessage errorMessage="Cannot delete this comment as you did not create it!" />  
        }
        else {
            return <ErrorMessage errorMessage="Could not delete comment. Please try again later." />
        }
    }

    return (
        <>
            {loading ? (
                <ClipLoader
                    id={styles["loader"]}
                    color={constants.loaderColour}
                    loading={true}
                    size={20}
                    css={"float: right;"}
                />
            ) : (
                <BsFillTrashFill
                    className={styles["delete-comment"]}
                    onClick={performDeleteComment}
                />
            )}
            {getErrorMessage()}
        </>
    );
};

DeleteComment.propTypes = {
    deleteComment: PropTypes.func,
    commentId: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DeleteComment;

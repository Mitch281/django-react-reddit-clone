import { useState, useContext } from "react";
import { UserContext } from "../../../App";
import PropTypes from "prop-types";
import styles from "./comment-content.module.css";
import { editComment } from "../../../utils/fetch-data";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import { CantGetNewAccessTokenError } from "../../../utils/auth";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
const CommentContent = (props) => {
    const [commentContent, setCommentContent] = useState(props.content);

    const { userIdLoggedIn } = useContext(UserContext);

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    async function handleEditCommentContent() {
        try {
            await editComment(commentContent, props.commentId, userIdLoggedIn);
            props.editComment(props.commentId, commentContent);
            props.toggleEditForm();
        } catch (error) {
            throw error;
        }
    }

    async function performEditCommentContent(e) {
        setLoading(true);
        e.preventDefault();

        if (props.userId !== userIdLoggedIn) {
            alert("You do not have permission to edit this comment!");
            return;
        }

        try {
            await handleEditCommentContent();
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
            return <ErrorMessage errorMessage="Cannot edit this comment as you did not create it!" />  
        }
        else {
            return <ErrorMessage errorMessage="Could not edit comment. Please try again later." />
        }
    }

    return (
        <>
            {props.currentlyEditing ? (
                <form
                    className={styles["edit-comment-content-form"]}
                    onSubmit={performEditCommentContent}
                >
                    <div>
                        <span>Edit Comment</span>
                        <textarea
                            value={commentContent}
                            placeholder="Content"
                            onChange={(e) => setCommentContent(e.target.value)}
                        />
                        {loading ? (
                            <ClipLoader
                                color={constants.loaderColour}
                                loading={true}
                                size={20}
                                css={"margin-top: 10px"}
                            />
                        ) : (
                            <input type="submit" value="Edit" />
                        )}
                        {getErrorMessage()}
                    </div>
                </form>
            ) : (
                <p className={styles["comment-content"]}>{props.content}</p>
            )}
        </>
    );
};

CommentContent.propTypes = {
    content: PropTypes.string,
    commentId: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currentlyEditing: PropTypes.bool,
    editComment: PropTypes.func,
    toggleEditForm: PropTypes.func,
};

export default CommentContent;

import { useContext, useState } from "react";
import { UserContext } from "../../../App";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { v4 as uuid_v4 } from "uuid";
import styles from "./comment-input.module.css";
import { postComment } from "../../../utils/fetch-data";
import ClipLoader from "react-spinners/ClipLoader";
import { constants } from "../../../constants";
import { CantGetNewAccessTokenError } from "../../../utils/auth";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const CommentInput = (props) => {
    const [comment, setComment] = useState("");

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const { loggedIn, usernameLoggedIn, userIdLoggedIn } =
        useContext(UserContext);

    const params = useParams();
    const postId = params.postId;

    async function handleCommentSubmission() {
        const dateNow = new Date().toString();

        const commentId = uuid_v4();
        const data = {
            id: commentId,
            username: usernameLoggedIn,
            user: userIdLoggedIn,
            parent_post: postId,
            content: comment,
            num_upvotes: 0,
            num_downvotes: 0,
            date_created: dateNow,
            parent_comment: null,
            hidden: false,
            num_replies: 0,
        };

        try {
            await postComment(data);
            setComment(""); // Clear text box.
            props.updateComments(data);
        } catch (error) {
            throw error;
        }
    }

    async function performPostComment(e) {
        setLoading(true);
        e.preventDefault();

        try {
            await handleCommentSubmission();
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
            return (
                <ErrorMessage errorMessage="Session expired. Please login again." />
            );
        } else if (error.message === "401") {
            return (
                <ErrorMessage errorMessage="Please login to comment." />
            );
        } else {
            return (
                <ErrorMessage errorMessage="Could not comment. Please try again later." />
            );
        }
    }

    function determineOutput() {
        if (loggedIn) {
            return (
                <div id={styles["comment-input-flex-container"]}>
                    <div id={styles["comment-input"]}>
                        <span>Commenting as {usernameLoggedIn}</span>
                        <form onSubmit={performPostComment}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            {loading ? (
                                <ClipLoader
                                    color={constants.loaderColour}
                                    loading={true}
                                    size={20}
                                    css={"margin-top: 10px"}
                                />
                            ) : (
                                <input type="submit" value="Comment" />
                            )}
                            {getErrorMessage()}
                        </form>
                    </div>
                </div>
            );
        }
        return (
            <div
                id={styles["comment-not-logged-in-flex-container"]}
                className={styles["not-logged-in-message-flex-container"]}
            >
                <div
                    id={styles["comment-not-logged-in"]}
                    className={styles["not-logged-in-message"]}
                >
                    <span>Log in or signup to leave a comment &nbsp;</span>
                    <Link to="/login/">Login</Link>
                    &nbsp;
                    <Link to="/signup/">Signup</Link>
                </div>
            </div>
        );
    }

    return determineOutput();
};

CommentInput.propTypes = {
    updateComment: PropTypes.func,
};

export default CommentInput;

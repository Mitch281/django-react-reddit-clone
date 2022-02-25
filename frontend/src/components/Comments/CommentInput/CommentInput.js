import { useContext, useState} from "react";
import { UserContext } from "../../../App";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { v4 as uuid_v4 } from "uuid";
import styles from "./comment-input.module.css";
import { postComment } from "../../../utils/fetch-data";

const CommentInput = (props) => {

    const [comment, setComment] = useState("");
    
    const { loggedIn, usernameLoggedIn, userIdLoggedIn, } = useContext(UserContext);

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
            num_replies: 0
        }

        try {
            await postComment(data);
            setComment(""); // Clear text box.
            props.updateComments(data);
        } catch (error) {
            throw error;
        }
    }

    function performPostComment(e) {
        e.preventDefault();

        handleCommentSubmission()
        .catch(error => console.log(error));
    }

    function determineOutput() {
        if (loggedIn) {
            return (
            <div id={styles["comment-input-flex-container"]}>
                <div id={styles["comment-input"]}>
                    <span>Commenting as {usernameLoggedIn}</span>
                    <form onSubmit={performPostComment}>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)}/>
                        <input type="submit" value="Comment"></input>
                    </form>
              </div>
            </div>
            )
        }
        return (
        <div id={styles["comment-not-logged-in-flex-container"]} className={styles["not-logged-in-message-flex-container"]}>
            <div id={styles["comment-not-logged-in"]} className={styles["not-logged-in-message"]}>
                <span>Log in or signup to leave a comment &nbsp;</span>
                <Link to="/login/">Login</Link>
                &nbsp;
                <Link to="/signup/">Signup</Link>
            </div>
        </div>
        );
    }

    return (
        determineOutput()
    );
}

CommentInput.propTypes = {
    updateComment: PropTypes.func
}

export default CommentInput;

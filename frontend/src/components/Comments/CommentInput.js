import "../../style/comment-input.css";
import { useContext, useState} from "react";
import { UserContext } from "../../App";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { v4 as uuid_v4 } from "uuid";
import { getNewAccessTokenIfExpired } from "../../utils/auth";

const CommentInput = (props) => {

    const [comment, setComment] = useState("");
    
    const { loggedIn, usernameLoggedIn, userIdLoggedIn, } = useContext(UserContext);

    const params = useParams();
    const postId = params.postId;

    async function postComment() {

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
            parent_comment: null
        }

        const accessToken = localStorage.getItem("accessToken");
        try {
            getNewAccessTokenIfExpired(accessToken);
        } catch(error) {
            throw new Error(error);
        }

        const response = await fetch("http://localhost:8000/api/comments/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            // Clear text box
            setComment("");
            props.updateComments(data);
        } else {
            throw new Error(response.status);
        }   
    }

    function performPostComment(e) {
        e.preventDefault();

        postComment()
        .catch(error => console.log(error));
    }

    function determineOutput() {
        if (loggedIn) {
            return (
            <div id="comment-input-flex-container">
                <div id="comment-input">
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
        <div id="comment-not-logged-in-flex-container" className="not-logged-in-message-flex-container">
            <div id="comment-not-logged-in" className="not-logged-in-message">
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

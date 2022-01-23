import "../../style/comment-input.css";
import { useContext, useState} from "react";
import { UserContext } from "../../App";
import { Link, useParams } from "react-router-dom";
import { v4 as uuid_v4 } from "uuid";

const CommentInput = (props) => {

    const [comment, setComment] = useState("");
    
    const { loggedIn, usernameLoggedIn, userIdLoggedIn, } = useContext(UserContext);

    const params = useParams();
    const postId = params.postId;

    async function postComment(e) {
        e.preventDefault();

        const commentId = uuid_v4();
        const data = {
            id: commentId,
            username: usernameLoggedIn,
            user: userIdLoggedIn,
            parent_post: postId,
            content: comment,
            num_upvotes: 0,
            num_downvotes: 0
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
            throw new Error("Couldn't comment!");
        }
    }

    function determineOutput() {
        if (loggedIn) {
            return (
            <div id="comment-input-flex-container">
                <div id="comment-input">
                    <span>Commenting as {usernameLoggedIn}</span>
                    <form onSubmit={(e) => postComment(e)}>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)}/>
                        <input type="submit" value="Comment"></input>
                    </form>
              </div>
            </div>
            )
        }
        return (
        <div id="comment-not-logged-in-flex-container">
            <div id="comment-not-logged-in">
                <span>Log in or signup to leave a comment &nbsp;</span>
                <Link to="/login/" id="nav-to-login">Login</Link>
                &nbsp;
                <Link to="/signup/" id="nav-to-signup">Signup</Link>
            </div>
        </div>);
    }

    return (
        determineOutput()
    );
}

export default CommentInput;

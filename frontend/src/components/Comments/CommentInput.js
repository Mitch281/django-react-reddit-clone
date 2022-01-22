import "../../style/comments.css";
import { useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const CommentInput = () => {
    
    const { loggedIn, usernameLoggedIn } = useContext(UserContext);

    function determineOutput() {
        if (loggedIn) {
            return (
            <div id="comment-input-flex-container">
                <div id="comment-input">
                    <span>Commenting as {usernameLoggedIn}</span>
                    <form>
                        <textarea />
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

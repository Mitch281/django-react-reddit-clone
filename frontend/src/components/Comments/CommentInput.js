import "../../style/comments.css";
import { useContext } from "react";
import { UserContext } from "../../App";

const CommentInput = () => {
    
    const { loggedIn, usernameLoggedIn } = useContext(UserContext);

    return (
    <div id="comment-input-flex-container">
        <div id="comment-input">
            <p>Commenting as {usernameLoggedIn}</p>
            <form>
                <textarea />
                <input type="submit" value="Comment"></input>
            </form>
      </div>
    </div>
    );
}

export default CommentInput;

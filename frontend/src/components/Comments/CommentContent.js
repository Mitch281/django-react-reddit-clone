import { useState, useContext } from "react";
import { UserContext } from "../../App";
import PropTypes from "prop-types";
import { getNewAccessTokenIfExpired } from "../../utils/auth";

const CommentContent = (props) => {

    const [commentContent, setCommentContent] = useState(props.content);

    const { userIdLoggedIn } = useContext(UserContext);

    async function handleEditComment(e) {
        e.preventDefault();

        if (props.userId !== userIdLoggedIn) {
            alert("You do not have permission to edit this comment as you did not create it!");
        }

        const accessToken = localStorage.getItem("accessToken");
        const gotNewAccessToken = getNewAccessTokenIfExpired(accessToken);

        if (gotNewAccessToken) {
            const response = await fetch(`http://localhost:8000/api/comment/id=${props.commentId}/user-id=${props.userId}/`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({content: commentContent})
            });
            if (response.ok) {
                props.editCommentContent(props.commentId, commentContent);
            } else {
                throw new Error("Couldn't edit comment!");
            }
        }
        else {
            throw new Error("Couldn't fetch new access token!");
        }
    }

    return (
        <>  
            {props.currentlyEditing ? 
                <form className="edit-comment-content" onSubmit={handleEditComment}>
                    <textarea value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
                    <input type="submit" value="edit" />
                </form>
                :
                <p className="comment-content">{props.content}</p>
            }
        </>
    );
}

CommentContent.propTypes = {
    content: PropTypes.string,
    currentlyEditing: PropTypes.bool,
    editCommentContent: PropTypes.func,
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    commentId: PropTypes.string
}

export default CommentContent;

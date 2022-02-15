import { useState, useContext } from "react";
import { UserContext } from "../../App";
import PropTypes from "prop-types";
import { getNewAccessTokenIfExpired } from "../../utils/auth";

const CommentContent = (props) => {

    const [commentContent, setCommentContent] = useState(props.content);

    const { userIdLoggedIn } = useContext(UserContext);

    async function handleEditCommentContent() {
        
        const accessToken = localStorage.getItem("accessToken");
        try {
            await getNewAccessTokenIfExpired(accessToken);
        } catch(error) {
            throw error;
        }

        const response = await fetch(`http://localhost:8000/api/comment/id=${props.commentId}/user-id=${userIdLoggedIn}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({content: commentContent})
        });
        if (response.ok) {
            props.editComment(props.commentId, commentContent);
        } else {
            throw new Error(response.status);
        }
    }

    function performEditCommentContent(e) {
        e.preventDefault();

        if (props.userId !== userIdLoggedIn) {
            alert("You do not have permission to edit this comment!");
            return;
        }

        handleEditCommentContent()
        .catch(error => console.log(error));
    }

    return (
        <>
            {props.currentlyEditing ? 
            <form className="edit-comment-content-form" onSubmit={performEditCommentContent} >
                <textarea value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
                <input type="submit" value="Edit" />
            </form> : 
            <p className="comment-content">{props.content}</p>}
        </>
    );
}

CommentContent.propTypes = {
    content: PropTypes.string,
    commentId: PropTypes.string,
    userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    currentlyEditing: PropTypes.bool,
    editComment: PropTypes.func
}

export default CommentContent;

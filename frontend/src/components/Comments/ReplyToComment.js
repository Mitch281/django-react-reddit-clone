import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
import PropTypes from "prop-types";
import { v4 as uuid_v4 } from "uuid";

const ReplyToComment = (props) => {

    const [replyContent, setReplyContent] = useState("");
    const { usernameLoggedIn, userIdLoggedIn } = useContext(UserContext);

    const params = useParams();
    const postId = params.postId;

    function getDisplay() {
        if (!props.wantReplyForm) {
            return {display: "none"}
        }
    }

    // TODO: data validation.
    async function postReply(e) {
        e.preventDefault();

        const dateNow = new Date().toString();

        const commentId = uuid_v4();
        const reply = {
            id: commentId,
            username: usernameLoggedIn,
            user: userIdLoggedIn,
            parent_post: postId,
            content: replyContent,
            num_upvotes: 0,
            num_downvotes: 0,
            date_created: dateNow,
            parent_comment: props.parentCommentId
        }

        const response = await fetch("http://localhost:8000/api/comments/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify(reply)
        });
        if (response.ok) {
            // Clear reply text box.
            setReplyContent("");

            props.updateComments(reply);
        } else {
            throw new Error("Couldn't reply!");
        }
    }

    return (
        <div style={getDisplay()}>
            <form onSubmit={postReply}>
                <span>Reply to {props.parentUsername} as {usernameLoggedIn}</span>
                <textarea type="text" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="Content" />
                <input type="submit" value="Reply" />
            </form>        
        </div>
    );
}

ReplyToComment.propTypes = {
    wantReplyForm: PropTypes.bool,
    parentCommentId: PropTypes.string,
    parentUsername: PropTypes.string,
    updateComments: PropTypes.func
}

export default ReplyToComment;

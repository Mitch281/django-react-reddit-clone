import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../App";
import PropTypes from "prop-types";
import { v4 as uuid_v4 } from "uuid";
import { getNewAccessTokenIfExpired, CantGetNewAccessTokenError } from "../../../utils/auth";
import styles from "./reply-to-comment.module.css";

const ReplyToComment = (props) => {

    let navigate = useNavigate();

    const [replyContent, setReplyContent] = useState("");
    const { usernameLoggedIn, userIdLoggedIn, logout } = useContext(UserContext);

    const params = useParams();
    const postId = params.postId;

    function getDisplay() {
        if (!props.wantReplyForm) {
            return {display: "none"}
        }
    }

    // TODO: data validation.
    async function postReply() {

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

        const accessToken = localStorage.getItem("accessToken");
        try {
            await getNewAccessTokenIfExpired(accessToken); 
        } catch(error) {
            throw error;
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

            props.toggleReplyForm();
            props.updateComments(reply);
        } else {
            throw new Error(response.status);
        }
    }

    function performPostReply(e) {
        e.preventDefault();

        postReply()
        .catch(error => {
            
            // Session expired.
            if (error instanceof CantGetNewAccessTokenError) {
                logout();
                navigate("/login/");
            }
        });
    }

    return (
        <div style={getDisplay()}>
            <form className={styles["reply-to-comment-form"]} onSubmit={performPostReply}>
                <div>
                    <span>Reply to {props.parentUsername} as {usernameLoggedIn}</span>
                    <textarea type="text" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="Content" />
                    <input type="submit" value="Reply" />
                </div>
            </form>        
        </div>
    );
}

ReplyToComment.propTypes = {
    wantReplyForm: PropTypes.bool,
    parentCommentId: PropTypes.string,
    parentUsername: PropTypes.string,
    updateComments: PropTypes.func,
    togglyReplyForm: PropTypes.func
}

export default ReplyToComment;